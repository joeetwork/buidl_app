use anchor_lang::prelude::*;

use crate::states::Escrow;
use crate::constant::escrow_status::VALIDATE;
use crate::constant::seeds::ESCROW;

#[derive(Accounts)]
pub struct UploadWork<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,
    #[account(mut)]
    pub initializer: SystemAccount<'info>,
    #[account(
        mut,
        seeds=[ESCROW, escrow_state.seed.to_le_bytes().as_ref()],
        constraint = escrow_state.taker == *taker.key,
        bump = escrow_state.bump,
    )]
    pub escrow_state: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

impl<'info> UploadWork<'info> {
    pub fn upload_work(&mut self, file: String) -> Result<()> {
        self.escrow_state.upload_work = file;
        self.escrow_state.status = VALIDATE.to_string();
        Ok(())
     }
}