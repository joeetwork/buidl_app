use anchor_lang::prelude::*;

use crate::states::{Escrow, Validate};
use crate::constant::seeds::VALIDATE;

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
    pub fn validate(
         &mut self, accept:bool
     ) -> Result<()> {

        let current_time = Clock::get()?.unix_timestamp;

        if self.escrow_state.vote_deadline.unwrap() > current_time {
            if accept {
                self.escrow_state.validator_count = self.escrow_state.validator_count.checked_add(1).unwrap();
            } else {
                self.escrow_state.validator_count = self.escrow_state.validator_count.checked_sub(1).unwrap();
            }
        }

        Ok(())
     }
}