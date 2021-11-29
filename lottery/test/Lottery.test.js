const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of accounts to deploy the contract
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object
    })
    .send({
      from: accounts[0],
      gas: '1000000'
    });
});

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[1]
    });

    assert.equal(accounts[1], players[0]);
    assert.equal(1, players.length);
  });

  it('allows 3 account to enter', async () => {
    const numAccounts = 3;
    for (let accountIdx = 1; accountIdx < numAccounts + 1; accountIdx++) {
      await lottery.methods.enter().send({
        from: accounts[accountIdx],
        value: web3.utils.toWei('0.02', 'ether')
      });
    }

    const players = await lottery.methods.getPlayers().call({
      from: accounts[1]
    });

    for (let accountIdx = 1; accountIdx < numAccounts + 1; accountIdx++) {
      assert.equal(accounts[accountIdx], players[accountIdx - 1]);
    }

    assert.equal(numAccounts, players.length);
  });

  it('requires a minimum amount of ether to enter', async () => {
    let error;
    try {
      await lottery.methods.enter().send({
        from: accounts[1],
        value: 100
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
  });

  it('only manager can call pickWinner', async () => {
    let error;
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
  });

  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei('1', 'ether')
    });

    const initialBalance = await web3.eth.getBalance(accounts[1]);

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const winner = await lottery.methods.getWinner().call();

    assert(winner == accounts[1]);

    const finalBalance = await web3.eth.getBalance(accounts[1]);

    const diff = finalBalance - initialBalance;

    assert(diff > web3.utils.toWei('0.999', 'ether'));

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert(players.length == 0);
  });
});
