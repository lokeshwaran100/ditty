use anchor_lang::prelude::*;
use std::string::String;
use std::vec;

pub const PARTICIPANT_COUNT: usize = 3;

declare_id!("4bXxZicaQg3atfVBkUJzvDw9ryRdxj2KzVrRRYYjzVVq");

#[program]
mod ditty {
    use super::*;

    // Define the InitializeChitFund instruction for the organizer to initialize the contract
    pub fn initializechitfund(
        ctx: Context<InitializeChitFund>,
        name: String,
        commitedamount: u32,
    ) -> Result<()> {
        ctx.accounts.chit_fund.new(
            ctx.accounts.organiser.key(),
            name,
            PARTICIPANT_COUNT as u32,
            commitedamount as u64,
            *ctx.bumps.get("chit_fund").unwrap(),
        )?;

        Ok(())
    }

    // Define the JoinChitFund instruction for participants to join the chit fund
    pub fn join(ctx: Context<JoinChitFund>, _name: String) -> Result<()> {
        ctx.accounts
            .chit_fund
            .join(ctx.accounts.participant.key())?;

        Ok(())
    }

    // Define the Bid instruction for participants to place bids
    pub fn bid(ctx: Context<BidChitFund>, _name: String, amount: u32) -> Result<()> {
        ctx.accounts
            .chit_fund
            .bid(ctx.accounts.participant.key(), amount as u64)?;

        Ok(())
    }

    // Define the Deposit instruction for participants to deposit funds
    pub fn deposit(ctx: Context<DepositChitFund>, _name: String, amount: u32) -> Result<()> {
        ctx.accounts
            .chit_fund
            .deposit(ctx.accounts.participant.key(), amount as u64)?;

        if **ctx.accounts.participant.try_borrow_lamports()? < amount as u64 {
            return Err(CErrorCode::InsufficientFundsForTransaction.into());
        }

        let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.participant.key(),
            &ctx.accounts.chit_fund.key(),
            amount as u64,
        );
        anchor_lang::solana_program::program::invoke(
            &sol_transfer,
            &[
                ctx.accounts.participant.to_account_info().clone(),
                ctx.accounts.cf.to_account_info().clone(),
                ctx.accounts.system_program.to_account_info().clone(),
            ],
        )?;

        if ctx.accounts.chit_fund.send_to_bidwinner() {
            let lamports: u64 = ctx.accounts.chit_fund.lowest_bid_amount
                - (ctx.accounts.chit_fund.lowest_bid_amount / PARTICIPANT_COUNT as u64);

            **ctx
                .accounts
                .chit_fund
                .to_account_info()
                .try_borrow_mut_lamports()? -= lamports;
            **ctx.accounts.bid_winner.try_borrow_mut_lamports()? += lamports;

            ctx.accounts.chit_fund.clean_biddings()?;
        }

        Ok(())
    }

    //// Define the CloseChitFund instruction to distribute funds and prepare for the next month
    //pub fn close_chit_fund(ctx: Context<CloseChitFund>) -> Result<()> {
    //    // ... (close the chit fund and distribute funds)
    //}
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializeChitFund<'info> {
    #[account(mut)]
    pub organiser: Signer<'info>,
    #[account(init_if_needed, payer = organiser, space = 64 +  ChitFund::MAXIMUM_SIZE, seeds = [name.as_bytes().as_ref(), organiser.key().as_ref()], bump)]
    pub chit_fund: Account<'info, ChitFund>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct JoinChitFund<'info> {
    pub organiser: AccountInfo<'info>,
    #[account(mut, seeds = [name.as_bytes().as_ref(), organiser.key().as_ref()], bump = chit_fund.bump)]
    pub chit_fund: Account<'info, ChitFund>,
    pub participant: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct BidChitFund<'info> {
    pub organiser: AccountInfo<'info>,
    #[account(mut, seeds = [name.as_bytes().as_ref(), organiser.key().as_ref()], bump = chit_fund.bump)]
    pub chit_fund: Account<'info, ChitFund>,
    pub participant: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct DepositChitFund<'info> {
    pub organiser: AccountInfo<'info>,
    #[account(mut, seeds = [name.as_bytes().as_ref(), organiser.key().as_ref()], bump = chit_fund.bump)]
    pub chit_fund: Account<'info, ChitFund>,
    #[account(mut)]
    pub bid_winner: AccountInfo<'info>,
    #[account(mut)]
    pub participant: Signer<'info>,
    #[account(mut)]
    pub cf: AccountInfo<'info>,
    pub system_program: AccountInfo<'info>,
}

// Account
////////////////////////////////////////////////////////////////

#[account]
pub struct ChitFund {
    pub bump: u8,
    pub name: String,
    pub participant_count: u32,
    pub commited_amount: u64,
    pub organizer: Pubkey,
    pub status: ChitFundStatus,
    pub create_time: i64,
    pub bids: Vec<Bid>,
    pub participants: Vec<Participant>,
    pub current_month: u32,
    pub bid_winner: Pubkey,
    pub lowest_bid_amount: u64,
    pub depositors: Vec<Pubkey>,
}

// Define the Participant struct to store participant details
#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub struct Participant {
    pub pubkey: Pubkey,
    pub won_bid: bool,
}
#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub struct Bid {
    pub bidder: Pubkey,
    pub amount: u64,
}

// Define chit fund status enum
#[derive(Debug, AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ChitFundStatus {
    Open,
    Closed,
    BiddingOpen,
    BiddingClosed,
    Completed,
}

impl ChitFundStatus {
    pub fn is_open(&self) -> bool {
        matches!(self, ChitFundStatus::Open)
    }
}

impl ChitFund {
    // Based on account varfiable sizes
    pub const MAXIMUM_SIZE: usize = (32 * 3)
        + (64 * 4)
        + (32 * 2)
        + 32
        + 2
        + (32 + 2) * PARTICIPANT_COUNT
        + (32 + 64) * PARTICIPANT_COUNT;

    // Organiser initializes the ChitFund account
    fn new(
        &mut self,
        organizer: Pubkey,
        name: String,
        participant_count: u32,
        commited_amount: u64,
        bump: u8,
    ) -> Result<()> {
        self.name = name;
        self.participant_count = participant_count;
        self.commited_amount = commited_amount;
        self.organizer = organizer;
        self.status = ChitFundStatus::Open;
        self.create_time = 0;
        self.current_month = 1;
        self.bump = bump;

        // Add organiser as participant to the chit fund
        self.participants.push(Participant {
            pubkey: self.organizer,
            won_bid: false,
        });

        Ok(())
    }

    pub fn join(&mut self, participant: Pubkey) -> Result<()> {
        if (self.participant_count as usize) < self.participants.len() + 1 {
            return Err(CErrorCode::ParticipantsFull.into());
        }

        // Add the participant to the chit fund
        self.participants.push(Participant {
            pubkey: participant,
            won_bid: false,
        });

        if self.participant_count as usize == self.participants.len() {
            self.status = ChitFundStatus::BiddingOpen;
            self.create_time = Clock::get()?.unix_timestamp;
        }

        Ok(())
    }

    fn evaluate_bid_winner(&mut self) -> Result<()> {
        if self.bids.len() > 0 {
            for bid in self.bids.iter() {
                self.lowest_bid_amount = self.commited_amount * (PARTICIPANT_COUNT as u64);
                if bid.amount < self.lowest_bid_amount {
                    self.lowest_bid_amount = bid.amount;
                    self.bid_winner = bid.bidder;
                }
            }
        } else {
            for participant in self.participants.iter() {
                if !participant.won_bid {
                    self.lowest_bid_amount = self.commited_amount;
                    self.bid_winner = participant.pubkey;
                    break;
                }
            }
        }

        while self.bids.len() > 0 {
            self.bids.pop();
        }
        Ok(())
    }

    pub fn bid(&mut self, bidder: Pubkey, amount: u64) -> Result<()> {
        // Check if the chit fund is open
        if self.status != ChitFundStatus::BiddingOpen {
            return Err(CErrorCode::NoBids.into());
        }
        //msg!("moves[{:?}]:{:?}, element:{:?}", i, moves[i as usize] as u8, *elem as u8);
        let days_passed: f32 = ((Clock::get()?.unix_timestamp - self.create_time) / 86400) as f32;
        let bid_month = self.current_month - 1;
        if (days_passed / 30.0) as u32 != bid_month {
            return Err(CErrorCode::BiddingMonthNotStarted.into());
        }

        // Check if bidding window is over
        let days = days_passed % 30.0;
        if days >= 1.0 {
            if self.status == ChitFundStatus::BiddingOpen {
                if days <= 2.0 {
                    self.status = ChitFundStatus::BiddingClosed;
                    self.evaluate_bid_winner()?;
                } else {
                    self.status = ChitFundStatus::Closed;
                    return Err(CErrorCode::ChitFundClosed.into());
                }
            }
            return Err(CErrorCode::BiddingClosed.into());
        }

        // Check if the bidder has already won the bid
        if self
            .participants
            .iter()
            .any(|participant| participant.pubkey == bidder && participant.won_bid)
        {
            return Err(CErrorCode::AlreadyWonCannotBid.into());
        }

        // Check if the bidder has already placed a bid
        if self.bids.iter().any(|bid| bid.bidder == bidder) {
            return Err(CErrorCode::DuplicateBid.into());
        }

        // Check if the bid amount is less than or equal to pooled amount and greater than commited amount
        if amount > self.commited_amount * (self.participant_count as u64)
            && amount <= self.commited_amount
        {
            return Err(CErrorCode::InvalidBidAmount.into());
        }

        // Add the bid to the chit fund
        self.bids.push(Bid {
            bidder: bidder,
            amount: amount,
        });

        let mut count = 0 as usize;
        for participant in self.participants.iter() {
            if !participant.won_bid {
                count += 1;
            }
        }

        if self.bids.len() == count {
            self.status = ChitFundStatus::BiddingClosed;
            self.evaluate_bid_winner()?;
        }

        Ok(())
    }

    pub fn deposit(&mut self, participant: Pubkey, amount: u64) -> Result<()> {
        // Check if the chit fund bidding window closed
        if self.status != ChitFundStatus::BiddingClosed {
            return Err(CErrorCode::DepositFailed.into());
        }

        //msg!("moves[{:?}]:{:?}, element:{:?}", i, moves[i as usize] as u8, *elem as u8);
        let days_passed: f32 = ((Clock::get()?.unix_timestamp - self.create_time) / 86400) as f32;
        let bid_month = self.current_month - 1;
        if (days_passed / 30.0) as u32 != bid_month {
            return Err(CErrorCode::BiddingMonthNotStarted.into());
        }

        // Check if deposit window is over
        let days = days_passed % 30.0;
        if days >= 29.0 {
            self.status = ChitFundStatus::Closed;
            return Err(CErrorCode::ChitFundClosed.into());
        }

        let deposit_share = (self.lowest_bid_amount/self.participant_count as u64) as f32;
        if amount < deposit_share as u64{
            return Err(CErrorCode::InsufficientFundsForTransaction.into());
        }

        if self
            .depositors
            .iter()
            .any(|depositor| *depositor == participant)
        {
            return Err(CErrorCode::DuplicateDeposit.into());
        }

        if self.bid_winner == participant {
            return Err(CErrorCode::BidWinnerCannotDeposit.into());
        }

        self.depositors.push(participant);

        Ok(())
    }

    pub fn send_to_bidwinner(&mut self) -> bool {
        if self.depositors.len() == (self.participant_count as usize - 1) {
            return true;
        }

        false
    }

    pub fn clean_biddings(&mut self) -> Result<()> {
        while self.depositors.len() > 0 {
            self.depositors.pop();
        }

        for i in 0..self.participants.len() {
            if self.participants[i].pubkey == self.bid_winner {
                self.participants[i].won_bid = true;
                break;
            }
        }

        self.current_month += 1;

        self.status = ChitFundStatus::BiddingOpen;
        if self.current_month == self.participant_count {
            self.status = ChitFundStatus::Completed;
        }

        Ok(())
    }
}

// Errors
////////////////////////////////////////////////////////////////
#[error_code]
pub enum CErrorCode {
    #[msg("Chit fund is closed")]
    ChitFundClosed,

    #[msg("Duplicate bid from the same participant")]
    DuplicateBid,

    #[msg("Duplicate deposit from the same participant")]
    DuplicateDeposit,

    #[msg("Participant already won the bid")]
    AlreadyWonCannotBid,

    #[msg("Bidding window is closed")]
    BiddingClosed,

    #[msg("Invalid bid amount")]
    InvalidBidAmount,

    #[msg("Chit fund has already been initialized")]
    InitError,

    #[msg("Insufficient participation")]
    InsufficientParticipation,

    #[msg("Participants is full")]
    ParticipantsFull,

    #[msg("Bidding is not possible")]
    NoBids,

    #[msg("Cannot deposit funds")]
    DepositFailed,

    #[msg("Duplicate deposit")]
    DepositDeposit,

    #[msg("Bid winner cannot deposit")]
    BidWinnerCannotDeposit,

    #[msg("Bid month not started")]
    BiddingMonthNotStarted,

    #[msg("Insufficient funds")]
    InsufficientFundsForTransaction,
}
