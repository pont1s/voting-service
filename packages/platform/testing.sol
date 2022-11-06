function pushBallotPrivateKey(uint256 index, bytes memory _privateKey)
    public
    ballotOwnerCheck(index)
    ballotPrivateKeyNotSet(index)
    ballotPrivateKeyPushTimeNotEnd
    returns (Ballot memory)
{
    ballots[index].privateKey = _privateKey;
    return ballots[index];
}
