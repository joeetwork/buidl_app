use anchor_lang::prelude::*;

use crate::states::{Escrow, Validate};
use crate::constant::seeds::VALIDATE;
use crate::constant::escrow_status::EXCHANGE;

#[derive(Accounts)]
pub struct ValidateWithEmployer<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = user.key() == escrow_state.initializer.key()
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

impl<'info> ValidateWithEmployer<'info> {
    pub fn validate(
         &mut self
     ) -> Result<()> {

        self.escrow_state.validator_count = self.escrow_state.validator_count.checked_add(1).unwrap();

        self.escrow_state.verified_collection = None;

        self.escrow_state.validator = None;

        self.escrow_state.status = EXCHANGE.to_string();

        Ok(())
     }
}