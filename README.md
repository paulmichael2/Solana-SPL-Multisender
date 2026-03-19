# Solana-SPL-Multisender
A simple script to batch send SPL tokens on Solana to multiple recipients using a CSV file. Perfect for airdrops, token distributions, or rewards.

## Features
- Send SPL tokens to multiple wallets in one go
- Supports CSV input with address,amount columns
- Automatically creates recipient token accounts if missing
- Works on Mainnet or Devnet

## Requirements
- Node.js ≥ 18
- `@solana/web3.js` and `@solana/spl-token` packages
- A funded Solana wallet with the SPL tokens you want to distribute


## Installation
```bash
git clone https://github.com/paulmichael2/Solana-SPL-Multisender
cd solana-spl-multisender
npm install 
```
## Usage 

## 1.Prepare a CSV file named wallet.csv with the following columns:
```bash
address,amount
<recipient1-wallet>,10
<recipient2-wallet>,5
```

## 2.Set up the config in airdrop.js:
```bash
RPC_URL – Solana cluster (e.g., https://api.mainnet-beta.solana.com or devnet)
KEYPAIR_PATH – path to your wallet JSON file
TOKEN_MINT – your SPL token mint address
DECIMALS – token decimals (usually 9 for SPL tokens)
```

## 3. Run the script
```bash
node airdrop.js
```

MIT License
