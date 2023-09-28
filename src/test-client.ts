const chit_fund_name = "4"
const organiser = pg.wallet;

// Generate keypair for the new account
const participant_02 = web3.Keypair.generate();
const participant_03 = web3.Keypair.generate();
const [chit_fund_account, _] = await web3.PublicKey.findProgramAddress(
  [anchor.utils.bytes.utf8.encode(chit_fund_name), organiser.publicKey.toBuffer()],
  pg.program.programId
);
console.log("Trace 1")
const transaction_01 = new web3.Transaction().add(web3.SystemProgram.transfer({fromPubkey: organiser.publicKey, toPubkey: participant_02.publicKey, lamports: web3.LAMPORTS_PER_SOL / 1000}));
await web3.sendAndConfirmTransaction(pg.connection, transaction_01, [organiser.keypair]);
const transaction_02 = new web3.Transaction().add(web3.SystemProgram.transfer({fromPubkey: organiser.publicKey, toPubkey: participant_03.publicKey, lamports: web3.LAMPORTS_PER_SOL / 1000}));
await web3.sendAndConfirmTransaction(pg.connection, transaction_02, [organiser.keypair]);
// const transaction_03 = new web3.Transaction().add(web3.SystemProgram.transfer({fromPubkey: organiser.publicKey, toPubkey: chit_fund_account.publicKey, lamports: web3.LAMPORTS_PER_SOL / 1000}));
// await web3.sendAndConfirmTransaction(pg.connection, transaction_03, [organiser.keypair]);

console.log("Trace 2")
async function join(chit_fund_account, participant) {
  const txHash = await pg.program.methods
    .join(chit_fund_name)
    .accounts({
      organiser: organiser.publicKey,
      chitFund: chit_fund_account,
      participant: participant.publicKey,
    })
    .signers(participant)
    .rpc();

  // Confirm transaction
  await pg.connection.confirmTransaction(txHash);
   
   await display();
}

async function bid(chit_fund_account, participant, amount) {
   const txHash = await pg.program.methods
    .bid(chit_fund_name, amount)
    .accounts({
      organiser: organiser.publicKey,
      chitFund: chit_fund_account,
      participant: participant.publicKey,
    })
    .signers(participant)
    .rpc();

   // Confirm transaction
   await pg.connection.confirmTransaction(txHash);
   
   await display();
}

async function deposit(chit_fund_account, participant, bid_winner, amount) {
  const txHash = await pg.program.methods
    .deposit(chit_fund_name, amount)
    .accounts({
      organiser: organiser.publicKey,
      chitFund: chit_fund_account,
      participant: participant.publicKey,
      bidWinner: bid_winner.publicKey,
      cf: chit_fund_account,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers(participant)
    .rpc();
   console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
   
   // Confirm transaction
   await pg.connection.confirmTransaction(txHash);
   
   await display();
}

async function display() {
	const created_chit_fund_account = await pg.program.account.chitFund.fetch(
	chit_fund_account
	);
	//console.log("name:", created_chit_fund_account.name.toString());
	//console.log("participant_count:", created_chit_fund_account.participantCount.toString());
	//console.log("commited_amount:", created_chit_fund_account.commitedAmount.toString());
	//console.log("organizer:", created_chit_fund_account.organizer.toString());
  
  // const status = created_chit_fund_account.status;
  const cm = created_chit_fund_account.currentMonth;
  const bid_winner = created_chit_fund_account.bidWinner;
  const bid_amount = created_chit_fund_account.lowestBidAmount;
	console.log("Chit Fund Status:", created_chit_fund_account.status);
	console.log(`Cur Month: ${cm}, Bid Winner: ${bid_winner}, Lowest Bid Amount: ${bid_amount}`);
	//console.log("create_time:", created_chit_fund_account.createTime.toString());
	//console.log("bidding_start_time:", created_chit_fund_account.biddingStartTime.toString());
	//console.log("current_month:", created_chit_fund_account.currentMonth.toString());
	//console.log("days_left:", created_chit_fund_account.daysLeft.toString());
	// console.log("bid_winner:", created_chit_fund_account.bidWinner.toString());
	// console.log("lowest_bid_amount:", created_chit_fund_account.lowestBidAmount.toString());
	
	const balance_01 = await pg.connection.getBalance(organiser.publicKey);
	console.log("Organiser Balance     :", balance_01);
	const balance_02 = await pg.connection.getBalance(participant_02.publicKey);
	console.log("Participant 01 Balance:", balance_02);
	const balance_03 = await pg.connection.getBalance(participant_03.publicKey);
	console.log("Participant 02 Balance:", balance_03);
	//const balance_04 = await pg.connection.getBalance(chit_fund_account.publicKey);
	//console.log("Chit Fund Balance     :", balance_04);
}

async function create()
{
   // Send transaction
   const txHash = await pg.program.methods
     .initializechitfund(chit_fund_name, 1000)
     .accounts({
       chitFund: chit_fund_account,
       organiser: organiser.publicKey,
       systemProgram: web3.SystemProgram.programId,
     })
     .signers([organiser.keypair])
     .rpc();
   
   // Confirm transaction
   await pg.connection.confirmTransaction(txHash);
   
   await display();
}

function action(message){
	console.log("\n");
	console.log("================================================================");
  console.log(message)
	console.log("================================================================");
}

///////////////////
// Scenario //
///////////////////
action("Organiser/Participant 1 creating chit fund")
await create();
action("Participant 2 Joins")
await join(chit_fund_account, participant_02);
action("Participant 3 Joins")
await join(chit_fund_account, participant_03);
action("Participant 2 Bids")
await bid(chit_fund_account, participant_02, 3000);
action("Participant 3 Bids")
await bid(chit_fund_account, participant_03, 3000);
action("Participant 1 Bids")
await bid(chit_fund_account, organiser.keypair, 1500);
// 5EZKmFpo7vDxcjruzyM3q5PrQHaqx2VnSM9QasZUpVta
action("Participant 2 Deposits")
await deposit(chit_fund_account, participant_02, organiser.keypair, 500);
action("Participant 3 Deposits")
await deposit(chit_fund_account, participant_03, organiser.keypair, 500);