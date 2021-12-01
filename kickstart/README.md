# Kickstarter

## Motivation
The current kickstarter system design faces potential scams from defiant creators who pocket funds for personal use. To combat such behaviour, we use an Ethereum Contract to govern the fund transfer process to only legitimate vendors. Contributors not only contribute funds but also approve payment requests created by the creators to pay their vendors.

## Smart Contract Development Flow
1. Create Contracts on Remix and run manual tests
    ```
    https://remix.ethereum.org/
    ```
2. Copy Contracts to development machine for compilation, creating `Campaign.json` and `CampaignFactory.json` in the build directory
3. Write Mocha tests using the compiled Contracts
    ```
    npm test
    ```
4. Deploy Factory contract to Rinkeby Testnet network
    ```
    cd ethereum
    node deploy.js
    ```