const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const dotenv = require('dotenv');

const compiledFactory = require('./build/CampaignFactory.json');

dotenv.config();
const provider = new HDWalletProvider(process.env.METAMASK_SEED, process.env.INFURA_RINKEBY_ENDPOINT);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log(`Attempting to deploy from account ${accounts[0]}`);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.bytecode
    })
    .send({
      gas: '1000000',
      from: accounts[0]
    });

  console.log(`Contract deployed to ${result.options.address}`);

  provider.engine.stop();
};

deploy();