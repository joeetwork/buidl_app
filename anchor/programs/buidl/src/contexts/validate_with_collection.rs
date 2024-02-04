use anchor_lang::prelude::*;
use anchor_spl::token::{ Mint, TokenAccount};
use anchor_spl::metadata::MetadataAccount;

use crate::states::{Escrow, Validate};
use crate::constant::seeds::{METADATA, VALIDATE};
use crate::constant::escrow_status::EXCHANGE;

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
        escrow_state.verified_collection.unwrap().key()
    )]
    pub escrow_state: Box<Account<'info, Escrow>>,

    #[account(
        init,
        seeds = [VALIDATE.as_ref(), user.key().as_ref(), escrow_state.key().as_ref()],
        bump,
        payer = user,
        space = 8,
    )]
    pub validate_state: Box<Account<'info, Validate>>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub system_program: Program<'info, System>,
}

impl<'info> ValidateWithCollection<'info> {
    pub fn validate(
         &mut self, accept:bool
     ) -> Result<()> {

        if accept {
        self.escrow_state.validator_count = self.escrow_state.validator_count.checked_add(1)
        .unwrap()
    } else {
        self.escrow_state.validator_count = self.escrow_state.validator_count.checked_sub(1)
       .unwrap()
    }

        if self.escrow_state.validator_count > 0 {
            self.escrow_state.status = EXCHANGE.to_string()
        };

        Ok(())
     }
}