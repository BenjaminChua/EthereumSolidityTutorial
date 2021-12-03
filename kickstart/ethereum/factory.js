import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factoryInstance = new web3.eth.Contract(CampaignFactory.abi, '0x7e195Eb8f27072964657A0756f5212703e665E69');

export default factoryInstance;