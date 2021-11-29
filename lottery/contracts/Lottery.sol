// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract Lottery {
    address public manager;
    address payable[] public players;
    address payable public winner;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);

        players.push(payable(msg.sender));
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public managerOnly {
        uint256 index = random() % players.length;
        winner = players[index];
        winner.transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier managerOnly() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getWinner() public view returns (address payable) {
        return winner;
    }
}
