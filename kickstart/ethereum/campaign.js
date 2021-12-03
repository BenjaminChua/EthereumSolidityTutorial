import web3 from './web3';
import Campaign from './build/Campaign.json';

const createCampaignInstance = campaignAdd => new web3.eth.Contract(Campaign.abi, campaignAdd);

export default createCampaignInstance;