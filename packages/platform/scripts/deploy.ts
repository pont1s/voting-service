// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import * as path from 'path';
import * as fs from 'fs';
import { artifacts, ethers, network } from 'hardhat';
import { Contract } from 'ethers';

function saveFrontendFiles(token: Contract) {
  const contractsDir = path.join(__dirname, '..', '..', 'web-app', 'public');

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, 'contract-address.json'),
    JSON.stringify({ VotingPlatform: token.address }, undefined, 2),
  );

  const TokenArtifact = artifacts.readArtifactSync('VotingPlatform');

  fs.writeFileSync(
    path.join(contractsDir, 'VotingPlatform.json'),
    JSON.stringify(TokenArtifact, null, 2),
  );
}

async function main() {
  if (network.name === 'hardhat') {
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which'
        + 'gets automatically created and destroyed every time. Use the Hardhat'
        + " option '--network localhost'",
    );
  }
  const [deployer] = await ethers.getSigners();
  console.log(
    'Deploying the contracts with the account:',
    await deployer.getAddress(),
  );
  console.log('Account balance:', (await deployer.getBalance()).toString());
  const VotePlatform = await ethers.getContractFactory('VotingPlatform');
  const contract = await VotePlatform.deploy();
  await contract.deployed();
  console.log('Greeter deployed to:', contract.address);

  saveFrontendFiles(contract);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
