use anchor_lang::prelude::*;

use crate::constant::escrow_status::{EXCHANGE, CLOSE};
use crate::states::{Escrow, Validate, User};
use crate::constant::seeds::{VALIDATE, USER};

#[derive(Accounts)]
pub struct ValidateWithUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = user.key() == escrow_state.validator.unwrap().key(),
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

impl<'info> ValidateWithUser<'info> {
    pub fn vote_accept(
         &mut self
     ) -> Result<()> {
        self.escrow_state.amount_of_voters = self.escrow_state.amount_of_voters.checked_add(1).unwrap();
        self.escrow_state.status = EXCHANGE.to_string();
        self.user_state.points += 500;

        Ok(())
     }

     pub fn vote_decline(
        &mut self
    ) -> Result<()> {
          self.escrow_state.amount_of_voters = self.escrow_state.amount_of_voters.checked_add(1).unwrap();
          self.escrow_state.status = CLOSE.to_string();
          self.user_state.points += 500;

       Ok(())
    }
}