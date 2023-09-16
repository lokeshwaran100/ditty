const organiser = pg.wallet;


// Generate keypair for the new account
const participant_02 = web3.Keypair.generate();
const participant_03 = web3.Keypair.generate();
const chit_fund_account = web3.Keypair.generate();
//await pg.connection.trans
const transaction_01 = new web3.Transaction().add(web3.SystemProgram.transfer({fromPubkey: organiser.publicKey, toPubkey: participant_02.publicKey, lamports: web3.LAMPORTS_PER_SOL / 1000}));
await web3.sendAndConfirmTransaction(pg.connection, transaction_01, [organiser.keypair]);
const transaction_02 = new web3.Transaction().add(web3.SystemProgram.transfer({fromPubkey: organiser.publicKey, toPubkey: participant_03.publicKey, lamports: web3.LAMPORTS_PER_SOL / 1000}));
await web3.sendAndConfirmTransaction(pg.connection, transaction_02, [organiser.keypair]);
const transaction_03 = new web3.Transaction().add(web3.SystemProgram.transfer({fromPubkey: organiser.publicKey, toPubkey: chit_fund_account.publicKey, lamports: web3.LAMPORTS_PER_SOL / 1000}));
await web3.sendAndConfirmTransaction(pg.connection, transaction_03, [organiser.keypair]);
//await pg.connection.requestAirdrop(participant_02.publicKey, 10000);
//await pg.connection.requestAirdrop(participant_03.publicKey, 10000);

async function join(chit_fund_account, participant) {
  const txHash = await pg.program.methods
    .join()
    .accounts({
      chitFund: chit_fund_account.publicKey,
      participant: participant.publicKey,
    })
    .signers(participant)
    .rpc();
  // console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

  // Confirm transaction
  await pg.connection.confirmTransaction(txHash);

  // Fetch the created account
  const created_chit_fund_account = await pg.program.account.chitFund.fetch(
    chit_fund_account.publicKey
  );

  // console.log("Player 1:", created_chit_fund_account.players[0].toString());
  // console.log("Player 2:", created_chit_fund_account.players[1].toString());
  // console.log("Player 2 Moves:", created_chit_fund_account.participantMovePos.toString());
  //console.log("Winner:", created_chit_fund_account.winner.toString());
  display(created_chit_fund_account);
}

async function bid(chit_fund_account, participant, amount) {
  const txHash = await pg.program.methods
    .bid(amount)
    .accounts({
      chitFund: chit_fund_account.publicKey,
      participant: participant.publicKey,
    })
    .signers(participant)
    .rpc();
  // console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

  // Confirm transaction
  await pg.connection.confirmTransaction(txHash);

  // Fetch the created account
  const created_chit_fund_account = await pg.program.account.chitFund.fetch(
    chit_fund_account.publicKey
  );

  // console.log("Player 1:", created_chit_fund_account.players[0].toString());
  // console.log("Player 2:", created_chit_fund_account.players[1].toString());
  // console.log("Player 1 Moves:", created_chit_fund_account.organiserMovePos.toString());
  // console.log("Player 2 Moves:", created_chit_fund_account.participantMovePos.toString());
  display(created_chit_fund_account);
}

async function deposit(chit_fund_account, participant, bid_winner, amount) {
  const txHash = await pg.program.methods
    .deposit(amount)
    .accounts({
      chitFund: chit_fund_account.publicKey,
      participant: participant.publicKey,
      bidWinner: bid_winner.publicKey,
      cf: chit_fund_account.publicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers(participant)
    .rpc();
  console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

  // Confirm transaction
  await pg.connection.confirmTransaction(txHash);

  // Fetch the created account
  const created_chit_fund_account = await pg.program.account.chitFund.fetch(
    chit_fund_account.publicKey
  );

  // console.log("Player 1:", created_chit_fund_account.players[0].toString());
  // console.log("Player 2:", created_chit_fund_account.players[1].toString());
  // console.log("Player 1 Moves:", created_chit_fund_account.organiserMovePos.toString());
  // console.log("Player 2 Moves:", created_chit_fund_account.participantMovePos.toString());
  display(created_chit_fund_account);
}

async function displayBalance() {
  const balance_01 = await pg.connection.getBalance(organiser.publicKey);
  console.log("Organiser Balance     :", balance_01);
  const balance_02 = await pg.connection.getBalance(participant_02.publicKey);
  console.log("Participant 01 Balance:", balance_02);
  const balance_03 = await pg.connection.getBalance(participant_03.publicKey);
  console.log("Participant 02 Balance:", balance_03);
  const balance_04 = await pg.connection.getBalance(chit_fund_account.publicKey);
  console.log("Chit Fund Balance     :", balance_04);
}

function display(created_chit_fund_account) {
	console.log("================================================================");
	//console.log("name:", created_chit_fund_account.name.toString());
	//console.log("participant_count:", created_chit_fund_account.participantCount.toString());
	//console.log("commited_amount:", created_chit_fund_account.commitedAmount.toString());
	//console.log("organizer:", created_chit_fund_account.organizer.toString());
	console.log("status:", created_chit_fund_account.status);
	//console.log("create_time:", created_chit_fund_account.createTime.toString());
	//console.log("bidding_start_time:", created_chit_fund_account.biddingStartTime.toString());
	console.log("current_month:", created_chit_fund_account.currentMonth.toString());
	//console.log("days_left:", created_chit_fund_account.daysLeft.toString());
	console.log("bid_winner:", created_chit_fund_account.bidWinner.toString());
	console.log("lowest_bid_amount:", created_chit_fund_account.lowestBidAmount.toString());
}

// Send transaction
const txHash = await pg.program.methods
  .initializechitfund("Test", 1000)
  .accounts({
    chitFund: chit_fund_account.publicKey,
    organiser: organiser.publicKey,
    systemProgram: web3.SystemProgram.programId,
  })
  .signers([chit_fund_account])
  .rpc();
// console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

// Confirm transaction
await pg.connection.confirmTransaction(txHash);

// Fetch the created account
const created_chit_fund_account = await pg.program.account.chitFund.fetch(
  chit_fund_account.publicKey
);

display(created_chit_fund_account);
await displayBalance();

///////////////////
// Scenario //
///////////////////
await join(chit_fund_account, participant_02);
await displayBalance();
await join(chit_fund_account, participant_03);
await displayBalance();
await bid(chit_fund_account, participant_02, 3000);
await displayBalance();
await bid(chit_fund_account, participant_03, 3000);
await displayBalance();
await bid(chit_fund_account, organiser.keypair, 1500);
await displayBalance();
// 5EZKmFpo7vDxcjruzyM3q5PrQHaqx2VnSM9QasZUpVta
await deposit(chit_fund_account, participant_02, organiser.keypair, 500);
await displayBalance();
await deposit(chit_fund_account, participant_03, organiser.keypair, 500);
await displayBalance();
// await deposit(chit_fund_account, participant_03, 500);