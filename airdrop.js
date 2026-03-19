// airdrop.js
const fs = require('fs');
const csv = require('csv-parser');
const {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  SystemProgram,
} = require('@solana/web3.js');
const {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
} = require('@solana/spl-token');

// CONFIG
const RPC_URL = 'https://api.mainnet-beta.solana.com'; // Change to devnet if needed
const KEYPAIR_PATH = ''; // Replace /path/to/your/airdrop_wallet.json with the path to your Solana filesystem wallet that holds the token you wish to distribute
const TOKEN_MINT = ''; // Put your SPL token Address here
const DECIMALS = 9; // Token decimals (usually 9 for SPL tokens)
const DROPLIST_CSV = 'wallet.csv'; // CSV file with columns: address,amount

// Load payer wallet from keypair JSON
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(KEYPAIR_PATH, 'utf8')));
const payer = Keypair.fromSecretKey(secretKey);

// Solana connection
const connection = new Connection(RPC_URL, 'confirmed');

// Read recipients CSV
const recipients = [];
fs.createReadStream(DROPLIST_CSV)
  .pipe(csv())
  .on('data', (row) => {
    if (!row.address || !row.amount) return; // skip invalid rows
    recipients.push({
      address: row.address.trim(),
      amount: parseFloat(row.amount),
    });
  })
  .on('end', async () => {
    console.log(`Loaded ${recipients.length} recipients. Starting batch transfer...`);
    for (const recipient of recipients) {
      try {
        await sendSplToken(recipient.address, recipient.amount);
      } catch (error) {
        console.error(`❌ Failed to send to ${recipient.address}:`, error.message);
      }
    }
    console.log('✅ Batch transfer completed!');
  });

// Function to send SPL token
async function sendSplToken(destination, amount) {
  const recipientPubkey = new PublicKey(destination);
  const mintPubkey = new PublicKey(TOKEN_MINT);

  // Get or create associated token account for recipient
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintPubkey,
    recipientPubkey
  );

  // Get sender's associated token account
  const senderTokenAccount = await getAssociatedTokenAddress(
    mintPubkey,
    payer.publicKey
  );

  // Convert amount to smallest unit
  const amountRaw = BigInt(Math.floor(amount * 10 ** DECIMALS));

  // Create transfer instruction
  const tx = new Transaction().add(
    createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount.address,
      payer.publicKey,
      amountRaw
    )
  );

  // Send transaction
  const txSignature = await sendAndConfirmTransaction(connection, tx, [payer]);
  console.log(`✅ Sent ${amount} tokens to ${destination} | Tx: ${txSignature}`);
}