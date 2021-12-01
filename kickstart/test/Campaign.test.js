const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

const gas = '1000000';
let sampleRequest = {
  description: 'Buy Batteries',
  value: web3.utils.toWei('0.5', 'ether'),
  recipient: ''
};
let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas });

  await factory.methods
    .createCampaign(100)
    .send({ from: accounts[1], gas });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);

  sampleRequest['recipient'] = accounts[9];
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(accounts[1], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      from: accounts[2],
      value: 200
    });

    const isContributor = await campaign.methods.contributors(accounts[2]).call();

    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    let error;
    try {
      await campaign.methods.contribute().send({
        from: accounts[2],
        value: 10
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
  });

  it('allows manager to make a payment request', async () => {
    await campaign.methods.createRequest(
      sampleRequest['description'],
      sampleRequest['value'],
      sampleRequest['recipient']
    ).send({
      from: accounts[1],
      gas
    });

    const request = await campaign.methods.requests(0).call();

    assert.equal(sampleRequest['description'], request.description);
  });

  it('processes requests', async () => {

    let prevBalance = await web3.eth.getBalance(sampleRequest['recipient']);
    prevBalance = parseInt(prevBalance);

    await campaign.methods.contribute().send({
      from: accounts[2],
      value: web3.utils.toWei('1', 'ether')
    });

    await campaign.methods.createRequest(
      sampleRequest['description'],
      sampleRequest['value'],
      sampleRequest['recipient']
    ).send({
      from: accounts[1],
      gas
    });

    await campaign.methods.approveRequest(0).send({
      from: accounts[2],
      gas
    });

    await campaign.methods.issuePayment(0).send({
      from: accounts[1],
      gas
    });

    let currBalance = await web3.eth.getBalance(sampleRequest['recipient']);
    currBalance = parseInt(currBalance);

    assert.equal(sampleRequest['value'], currBalance - prevBalance);
  });
});