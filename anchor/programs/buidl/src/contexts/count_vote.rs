use std::str::FromStr;

use anchor_lang::prelude::*;

use crate::constant::CLOSE;
use crate::states::Escrow;
use crate::constant::escrow_status::EXCHANGE;

#[derive(Accounts)]
pub struct CountVote<'info> {

    #[account(mut)]
    pub escrow_state: Box<Account<'info, Escrow>>,

    pub system_program: Program<'info, System>,
}

impl<'info> CountVote<'info> {
    pub fn count_vote(
         &mut self
     ) -> Result<()> {

        let current_time = Clock::get()?.unix_timestamp;

        if self.escrow_state.amount_of_voters == 0 && self.escrow_state.vote_deadline.unwrap() < current_time {
            let seconds_in_7_days: i64 = 7 * 24 * 60 * 60;

            self.escrow_state.vote_deadline = Some(current_time + seconds_in_7_days);

            self.escrow_state.verified_collection = Pubkey::from_str("ffdf").ok();
        }

        if self.escrow_state.validator_count > 0 && self.escrow_state.vote_deadline.unwrap() < current_time {
            self.escrow_state.status = EXCHANGE.to_string()
        }

        if self.escrow_state.validator_count <= 0 && self.escrow_state.vote_deadline.unwrap() < current_time {
            self.escrow_state.status = CLOSE.to_string();
        }

        Ok(())
     }
}