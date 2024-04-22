use std::str::FromStr;
use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount};
use anchor_spl::metadata::MetadataAccount;

use crate::states::{Escrow, Validate, User};
use crate::constant::seeds::{METADATA, VALIDATE, USER};
use crate::constant::gigd_dao::COLLECTION_ID;

#[derive(Accounts)]
pub struct ValidateWithCollection<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub nft_mint: Account<'info, Mint>,

    pub nft_token_account: Account<'info, TokenAccount>, 

    #[account(
        seeds = [
            METADATA, 
            mpl_token_metadata::ID.as_ref(), 
            nft_mint.key().as_ref()
        ],
        seeds::program = mpl_token_metadata::ID,
        bump,
        constraint = metadata_account.collection.as_ref().unwrap().verified,
        constraint = metadata_account.collection.as_ref().unwrap().key ==
        escrow_state.verified_collection.unwrap().key(),
        constraint = nft_token_account.owner == user.key(),
        constraint = nft_token_account.mint == nft_mint.key(),
        constraint = nft_token_account.amount == 1
    )]
    pub metadata_account: Account<'info, MetadataAccount>,

    #[account(
        mut,
        constraint = metadata_account.collection.as_ref().unwrap().key ==
        escrow_state.verified_collection.unwrap().key(),
        constraint = escrow_state.vote_deadline.unwrap() > Clock::get()?.unix_timestamp
    )]
    pub escrow_state: Box<Account<'info, Escrow>>,

    #[account(
        mut,
        seeds = [USER.as_ref(), user.key().as_ref()],
        bump,
    )]
    pub user_state: Box<Account<'info, User>>,

    #[account(
        init,
        seeds = [VALIDATE.as_ref(), user.key().as_ref(), escrow_state.key().as_ref()],
        bump,
        payer = user,
        space = 8,
    )]
    pub validate_state: Box<Account<'info, Validate>>,
    
    pub system_program: Program<'info, System>,
}

impl<'info> ValidateWithCollection<'info> {
    pub fn vote_accept(
         &mut self
     ) -> Result<()> {
       if self.escrow_state.verified_collection == Pubkey::from_str(COLLECTION_ID).ok() && self.user_state.points >= 5000 {
           self.escrow_state.amount_of_voters = self.escrow_state.amount_of_voters.checked_add(1).unwrap();
           self.escrow_state.validator_count = self.escrow_state.validator_count.checked_add(1).unwrap();
           self.user_state.points += 250;
        }   

        if self.escrow_state.verified_collection != Pubkey::from_str(COLLECTION_ID).ok() {
            self.escrow_state.amount_of_voters = self.escrow_state.amount_of_voters.checked_add(1).unwrap();
            self.escrow_state.validator_count = self.escrow_state.validator_count.checked_add(1).unwrap();
            self.user_state.points += 250;
        }
        Ok(())
     }

     pub fn vote_decline(
        &mut self
    ) -> Result<()> {
        if self.escrow_state.verified_collection == Pubkey::from_str(COLLECTION_ID).ok() && self.user_state.points >= 5000 {
           self.escrow_state.amount_of_voters = self.escrow_state.amount_of_voters.checked_add(1).unwrap();
           self.escrow_state.validator_count = self.escrow_state.validator_count.checked_sub(1).unwrap();
           self.user_state.points += 250;
        }

        if self.escrow_state.verified_collection != Pubkey::from_str(COLLECTION_ID).ok() {
            self.escrow_state.amount_of_voters = self.escrow_state.amount_of_voters.checked_add(1).unwrap();
            self.escrow_state.validator_count = self.escrow_state.validator_count.checked_sub(1).unwrap();
            self.user_state.points += 250;
        }

       Ok(())
    }
}