use anchor_lang::prelude::*;

use crate::states::{Escrow, Upload};
use crate::constant::escrow_status::VALIDATE;
use crate::constant::seeds::{ESCROW, UPLOAD};

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
    #[account(
        init,
        seeds=[UPLOAD, escrow_state.initializer.as_ref(), escrow_state.key().as_ref()],
        bump,
        payer = taker,
        space = Upload::INIT_SPACE
    )]
    pub upload_work: Account<'info, Upload>,

    pub system_program: Program<'info, System>,
}

impl<'info> UploadWork<'info> {
    pub fn upload_work(&mut self, file: String) -> Result<()> {
        let seconds_in_7_days: i64 = 7 * 24 * 60 * 60;

        self.escrow_state.upload_work = file.clone();
        self.escrow_state.status = VALIDATE.to_string();
        self.escrow_state.vote_deadline = Some(Clock::get()?.unix_timestamp + seconds_in_7_days);

        self.upload_work.upload_work = file;
        self.upload_work.escrow = self.escrow_state.key();
        self.upload_work.user = self.escrow_state.initializer;
        self.upload_work.amount = self.escrow_state.initializer_amount;
        self.upload_work.about = self.escrow_state.about.clone();

        Ok(())
     }
}