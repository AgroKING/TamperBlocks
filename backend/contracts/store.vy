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

# The owner of the smart contract (deployer / relayer allowed to submit transactions)
owner: public(address)

# The University/Issuer address whose signature authorizes certificate content.
# This is the address recovered from issuer_signature, checked against ISSUER_PRIVATE_KEY's
# corresponding account off-chain.
issuer: public(address)

# Event emitted when a certificate is registered/anchored
event CertificateAnchored:
    target_hash: indexed(bytes32)
    ipfs_cid: String[100]
    issuer_signature: Bytes[65]
    block_index: uint256
    timestamp: uint256

# CID mapped to Hash
cid_to_hash: public(HashMap[String[100], bytes32])

# Event emitted when a certificate is revoked
event CertificateRevoked:
    target_hash: indexed(bytes32)
    timestamp: uint256


@deploy
def __init__(_issuer: address):
    self.owner = msg.sender
    self.issuer = _issuer
    self.certificate_count = 0


@internal
@pure
def _recover_signer(target_hash: bytes32, issuer_signature: Bytes[65]) -> address:
    """
    Reconstructs the Ethereum signed-message hash (matching eth_account's
    encode_defunct + Account.sign_message off-chain) and recovers the signer
    address from issuer_signature via ecrecover.
    """
    prefix: Bytes[28] = b"\x19Ethereum Signed Message:\n32"
    eth_signed_hash: bytes32 = keccak256(concat(prefix, target_hash))

    r: uint256 = convert(slice(issuer_signature, 0, 32), uint256)
    s: uint256 = convert(slice(issuer_signature, 32, 32), uint256)
    v: uint256 = convert(slice(issuer_signature, 64, 1), uint256)

    return ecrecover(eth_signed_hash, v, r, s)


@external
def anchor_certificate(target_hash: bytes32, ipfs_cid: String[100], issuer_signature: Bytes[65]):
    assert msg.sender == self.owner, "Only the owner can anchor certificates"
    assert not self.certificates[target_hash].exists, "Certificate already exists"

    recovered: address = self._recover_signer(target_hash, issuer_signature)
    assert recovered == self.issuer, "Invalid issuer signature"

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
    self.cid_to_hash[ipfs_cid] = target_hash

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


@external
@view
def get_certificate_by_cid(ipfs_cid: String[100]) -> CertificateRecord:
    target_hash: bytes32 = self.cid_to_hash[ipfs_cid]
    assert target_hash != empty(bytes32), "No certificate found for this CID"
    return self.certificates[target_hash]
