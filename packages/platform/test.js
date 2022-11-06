it('should push ballot private key and decrypted data', async () => {
    const contract = await oracle.createTestVoting(owner);

    contract.on('BallotAdded', async (eIndex: BigNumber) => {
        const privateKeyHex = Buffer.from(userKeys.privateKey, 'utf8').toString('hex');

        await contract.pushBallotPrivateKey(eIndex.toNumber(), `0x${privateKeyHex}`);

        const ballotResult = await contract.ballots(0);
        const encryptedValueBallot: string = ballotResult.encryptedValue;
        const privateKeyBallot: string = ballotResult.privateKey;

        const decryptedData = crypto.privateDecrypt(
            {
                key: Buffer.from(privateKeyBallot.slice(2, privateKeyBallot.length), 'hex').toString('utf8'),
                passphrase: userSecret,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            },
            Buffer.from(encryptedValueBallot.slice(2, encryptedValueBallot.length), 'hex'),
        );

        expect(Array.from < number > (decryptedData)).deep.equal(ballot);
    });

    await contract.pushBallot(
        `0x${encryptedBallotHex}`,
        messageToHashInt(encryptedBallot).toString(),
        unBlindedSignature.toString(),
    );
});