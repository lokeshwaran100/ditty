const organiser = pg.wallet;


// Generate keypair for the new account
const participant_02 = web3.Keypair.generate();
const participant_03 = web3.Keypair.generate();
const chit_fund_account = web3.Keypair.generate();

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

function display(created_chit_fund_account) {
	//console.log("name:", created_chit_fund_account.name.toString());
	//console.log("participant_count:", created_chit_fund_account.participantCount.toString());
	//console.log("commited_amount:", created_chit_fund_account.commitedAmount.toString());
	//console.log("organizer:", created_chit_fund_account.organizer.toString());
	console.log("status:", created_chit_fund_account.status);
	console.log("create_time:", created_chit_fund_account.createTime.toString());
	console.log("bidding_start_time:", created_chit_fund_account.biddingStartTime.toString());
	console.log("current_month:", created_chit_fund_account.currentMonth.toString());
	console.log("days_left:", created_chit_fund_account.daysLeft.toString());
	console.log("bid_winner:", created_chit_fund_account.bidWinner.toString());
	console.log("lowest_bid_amount:", created_chit_fund_account.lowestBidAmount.toString());
	console.log("================================================================");
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

///////////////////
// Player 2 Wins //
///////////////////
await join(chit_fund_account, participant_02);
await join(chit_fund_account, participant_03);
await bid(chit_fund_account, participant_02, 1000);
await bid(chit_fund_account, participant_03, 1000);
await bid(chit_fund_account, organiser.keypair, 9500);