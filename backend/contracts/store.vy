# pragma version ^0.3.10

event Stored:
    credID: int128
    IssuerID: bytes32
    credHash: bytes32
    blockNo: uint256
    prevBlock: bytes32

@external
def inject(_ID: int128, _sign: bytes32, _hash: bytes32) -> bool:
    log Stored(_ID, _sign, _hash, block.number, block.prevhash)
    return True
