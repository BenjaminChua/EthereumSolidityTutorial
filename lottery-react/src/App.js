import { useState, useEffect } from 'react';

import './App.css';
import lottery from './lottery';
import web3 from './web3';

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [amount, setAmount] = useState('0.015');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const calledManager = await lottery.methods.manager().call();
      const calledPlayers = await lottery.methods.getPlayers().call();
      const calledBalance = await web3.eth.getBalance(lottery.options.address);

      setManager(calledManager);
      setPlayers(calledPlayers);
      setBalance(calledBalance);
    };

    fetchData();
  }, []);

  const enterCompetition = async e => {
    e.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setStatus('Entering the competition...');

    // takes 15s to process
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(amount, 'ether')
    });

    setStatus('You have been entered into the competition!');
    setAmount(0);
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setStatus('Selecting a winner...');

    // takes 15s to process
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    const winner = await lottery.methods.getWinner().call();

    setStatus(`${winner} is the winner!`);
    setAmount(0);
  };

  return (
    <div>
      <h2> Lottery Contract </h2>
      <p>
        This contract is managed by {manager}.
        There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>

      <hr />

      <form onSubmit={enterCompetition}>
        <h4> Want to try your luck? </h4>
        <div>
          <label>Amount of ether to enter</label>
          <input onChange={e => setAmount(e.target.value)} value={amount} />
        </div>
        <button> Enter </button>
      </form>

      <hr />

      <h4> Ready to pick a winner? </h4>
      <button onClick={pickWinner}> Pick a winner! </button>

      <hr />

      <h1> {status} </h1>

    </div>
  );
}

export default App;
