use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use crate::states::Escrow;
use crate::constant::*;

#[derive(Accounts)]
pub struct AcceptRequest<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,
    #[account(mut)]
    pub initializer: SystemAccount<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = initializer
    )]
    pub initializer_deposit_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        has_one = initializer,
        has_one = mint,
        seeds=[ESCROW, escrow_state.seed.to_le_bytes().as_ref()],
        constraint = escrow_state.taker == *taker.key,
        bump = escrow_state.bump,
    )]
    pub escrow_state: Box<Account<'info, Escrow>>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = escrow_state
    )]
    pub vault: Account<'info, TokenAccount>,
    associated_token_program: Program<'info, AssociatedToken>,
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
}

impl<'info> AcceptRequest<'info> {
    pub fn accept_request(&mut self) -> Result<()> {
        self.escrow_state.status = UPLOAD.to_string();
        Ok(())
    }
}