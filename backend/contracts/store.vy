#pragma version 0.4.3
# @license MIT

struct CertificateRecord:
    ipfs_cid: String[100]
    issuer_signature: Bytes[65]
    block_index: uint256
    revoked: bool
    timestamp: uint256
    exists: bool

# Mapping from certificate SHA-256 hash (bytes32) to the CertificateRecord struct
certificates: public(HashMap[bytes32, CertificateRecord])

# Keep track of the total certificates registered (acting as block index)
certificate_count: public(uint256)

# The owner of the smart contract (the University/Issuer)
owner: public(address)

# Event emitted when a certificate is registered/anchored
event CertificateAnchored:
    target_hash: indexed(bytes32)
    ipfs_cid: String[100]
    issuer_signature: Bytes[65]
    block_index: uint256
    timestamp: uint256

# Event emitted when a certificate is revoked
event CertificateRevoked:
    target_hash: indexed(bytes32)
    timestamp: uint256

@deploy
def __init__():
    self.owner = msg.sender
    self.certificate_count = 0

@external
def anchor_certificate(target_hash: bytes32, ipfs_cid: String[100], issuer_signature: Bytes[65]):
    assert msg.sender == self.owner, "Only the owner can anchor certificates"
    assert not self.certificates[target_hash].exists, "Certificate already exists"
    
    current_index: uint256 = self.certificate_count + 1
    self.certificate_count = current_index
    
    self.certificates[target_hash] = CertificateRecord(
        ipfs_cid=ipfs_cid,
        issuer_signature=issuer_signature,
        block_index=current_index,
        revoked=False,
        timestamp=block.timestamp,
        exists=True
    )
    
    log CertificateAnchored(target_hash, ipfs_cid, issuer_signature, current_index, block.timestamp)

@external
def revoke_certificate(target_hash: bytes32):
    assert msg.sender == self.owner, "Only the owner can revoke certificates"
    assert self.certificates[target_hash].exists, "Certificate does not exist"
    assert not self.certificates[target_hash].revoked, "Certificate is already revoked"
    
    self.certificates[target_hash].revoked = True
    
    log CertificateRevoked(target_hash, block.timestamp)

@external
@view
def is_revoked(target_hash: bytes32) -> bool:
    assert self.certificates[target_hash].exists, "Certificate does not exist"
    return self.certificates[target_hash].revoked
