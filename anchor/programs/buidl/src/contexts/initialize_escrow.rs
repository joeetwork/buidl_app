use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer_checked, Mint, Token, TokenAccount, TransferChecked},
};

use crate::states::Escrow;
use crate::constant::*;

#[derive(Accounts)]
#[instruction(seed: u64, initializer_amount: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = initializer_deposit_token_account.amount >= initializer_amount,
        associated_token::mint = mint,
        associated_token::authority = initializer
    )]
    pub initializer_deposit_token_account: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = initializer,
        space = Escrow::INIT_SPACE,
        seeds = [ESCROW.as_ref(), &seed.to_le_bytes()],
        bump
    )]
    pub escrow_state: Box<Account<'info, Escrow>>,
    #[account(
        init_if_needed,
        payer = initializer,
        associated_token::mint = mint,
        associated_token::authority = escrow_state
    )]
    pub vault: Box<Account<'info, TokenAccount>>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {

    pub fn initialize_escrow(
        &mut self,
        seed: u64,
        bumps: &InitializeBumps,
        initializer_amount: u64,
        taker: Pubkey,
        verified_collection: Pubkey,
        validator_total_count: u8,
        about: String
    ) -> Result<()> {
        self.escrow_state.set_inner(Escrow {
            seed,
            bump: bumps.escrow_state,
            initializer: self.initializer.key(),
            mint: self.mint.key(),
            initializer_amount,
            taker,
            verified_collection,
            validator_total_count,
            validator_count: 0,
            upload_work: "".to_string(),
            about,
            status: REQUEST.to_string()
        });
        Ok(())
    }

   pub fn into_deposit_context(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        let cpi_accounts = TransferChecked {
            from: self.initializer_deposit_token_account.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.initializer.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

   pub fn deposit(&mut self, initializer_amount: u64) -> Result<()> {
        transfer_checked(
            self.into_deposit_context(),
            initializer_amount,
            self.mint.decimals,
        )
    }
}