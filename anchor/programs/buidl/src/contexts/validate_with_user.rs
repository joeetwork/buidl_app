use anchor_lang::prelude::*;

use crate::states::{Escrow, Validate};
use crate::constant::seeds::VALIDATE;
use crate::constant::escrow_status::EXCHANGE;

#[derive(Accounts)]
pub struct ValidateWithUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        constraint = if user.key() == escrow_state.initializer.key() {true} else {user.key() ==
            escrow_state.validator.unwrap().key()}
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

impl<'info> ValidateWithUser<'info> {
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