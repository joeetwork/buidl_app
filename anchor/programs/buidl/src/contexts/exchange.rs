use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{
        close_account, transfer_checked, CloseAccount, Mint, Token, TokenAccount, TransferChecked,
    },
};

use crate::states::Escrow;
use crate::constant::ESCROW;
use crate::constant::escrow_status::EXCHANGE;

#[derive(Accounts)]
pub struct Exchange<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,
    #[account(mut)]
    pub initializer: SystemAccount<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = mint,
        associated_token::authority = taker
    )]
    pub taker_receive_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        close = initializer,
        seeds=[ESCROW, escrow_state.seed.to_le_bytes().as_ref()],
        constraint = escrow_state.taker == *taker.key,
        constraint = escrow_state.status == EXCHANGE.to_string(),
        bump = escrow_state.bump,
    )]
    pub escrow_state: Account<'info, Escrow>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = escrow_state
    )]
    pub vault: Account<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> Exchange<'info> {
    pub fn withdraw_and_close_vault(&mut self) -> Result<()> {
        let signer_seeds: [&[&[u8]]; 1] = [&[
            ESCROW,
            &self.escrow_state.seed.to_le_bytes()[..],
            &[self.escrow_state.bump],
        ]];

        transfer_checked(
            self.into_withdraw_context().with_signer(&signer_seeds),
            self.escrow_state.initializer_amount,
            self.mint.decimals,
        )?;

        close_account(self.into_close_context().with_signer(&signer_seeds))
    }

    fn into_withdraw_context(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        let cpi_accounts = TransferChecked {
            from: self.vault.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.taker_receive_token_account.to_account_info(),
            authority: self.escrow_state.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

    fn into_close_context(&self) -> CpiContext<'_, '_, '_, 'info, CloseAccount<'info>> {
        let cpi_accounts = CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.initializer.to_account_info(),
            authority: self.escrow_state.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}