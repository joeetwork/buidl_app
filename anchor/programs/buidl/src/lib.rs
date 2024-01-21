use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, CloseAccount, Mint, Token, TokenAccount, TransferChecked, transfer_checked, close_account};
use anchor_spl::metadata::MetadataAccount;

declare_id!("AmaFf9hFpemKXPaAPqxu14vGaZWcGu1ADN1vpy1gtJtw");

#[program]
pub mod anchor_escrow {

    use super::*;

    const AUTHORITY_SEED: &[u8] = b"authority";

    pub fn initialize(
        ctx: Context<Initialize>,
        seed: u64,
        initializer_amount: u64,
        validator_total_count: u64,
        taker: Pubkey,
        verified_collection: Pubkey
    ) -> Result<()> {

        ctx.accounts
        .initialize_escrow(
            seed, 
            &ctx.bumps, 
            initializer_amount, 
            taker,
            verified_collection,
            validator_total_count
        )?;

        ctx.accounts.deposit(initializer_amount)
    }

    pub fn initialize_user(
        ctx: Context<InitializeUser>,
        username: String
    ) -> Result<()> {
        ctx.accounts.user_state.initializer_key = *ctx.accounts.initializer.key;
        ctx.accounts.user_state.username = username;
        Ok(())
    }

    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        ctx.accounts.refund_and_close_vault()
    }

    pub fn decline_request(ctx: Context<DeclineRequest>) -> Result<()> {
        ctx.accounts.refund_and_close_vault()
    }

    pub fn validate_work(ctx: Context<ValidateWork>) -> Result<()> {
        ctx.accounts.escrow_state.validator_count = ctx.accounts.escrow_state.validator_count.checked_add(1)
        .unwrap();

        Ok(())
    }

    pub fn exchange(ctx: Context<Exchange>) -> Result<()> {
        ctx.accounts.withdraw_and_close_vault()
    }
}

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
        space = std::mem::size_of::<EscrowState>() + 8,
        seeds = [b"escrow".as_ref(), &seed.to_le_bytes()],
        bump
    )]
    pub escrow_state: Box<Account<'info, EscrowState>>,
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

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeUser<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub initializer: Signer<'info>,

    #[account(
        init,
        seeds = [b"user".as_ref(), initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = std::mem::size_of::<UserState>() + 8
    )]
    pub user_state: Box<Account<'info, UserState>>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Cancel<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub initializer: Signer<'info>,
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
        close = initializer,
        seeds=[b"escrow", escrow_state.seed.to_le_bytes().as_ref()],
        bump = escrow_state.bump,
    )]
    pub escrow_state: Box<Account<'info, EscrowState>>,
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

#[derive(Accounts)]
pub struct ValidateWork<'info> {

    pub user: Signer<'info>,

    pub nft_mint: Account<'info, Mint>,

    pub nft_token_account: Account<'info, TokenAccount>, 

    #[account(
        seeds = [
            b"metadata", 
            mpl_token_metadata::ID.as_ref(), 
            nft_mint.key().as_ref()
        ],
        seeds::program = mpl_token_metadata::ID,
        bump,
        constraint = metadata_account.collection.as_ref().unwrap().verified,
        constraint = metadata_account.collection.as_ref().unwrap().key ==
        escrow_state.verified_collection.key(),
        constraint = nft_token_account.owner == user.key(),
        constraint = nft_token_account.mint == nft_mint.key(),
        constraint = nft_token_account.amount == 1
    )]
    pub metadata_account: Account<'info, MetadataAccount>,

    #[account(
        mut,
        constraint = metadata_account.collection.as_ref().unwrap().key ==
        escrow_state.verified_collection.key()
    )]
    pub escrow_state: Box<Account<'info, EscrowState>>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub system_program: Program<'info, System>,
}

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
        seeds=[b"escrow", escrow_state.seed.to_le_bytes().as_ref()],
        constraint = escrow_state.validator_total_count == escrow_state.validator_count,
        constraint = escrow_state.taker == *taker.key,
        bump = escrow_state.bump,
    )]
    pub escrow_state: Account<'info, EscrowState>,
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

#[derive(Accounts)]
pub struct DeclineRequest<'info> {
    /// CHECK: This is not dangerous because we don't read or write from this account
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
        close = initializer,
        seeds=[b"escrow", escrow_state.seed.to_le_bytes().as_ref()],
        constraint = escrow_state.taker == *taker.key,
        bump = escrow_state.bump,
    )]
    pub escrow_state: Box<Account<'info, EscrowState>>,
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

#[account]
pub struct UserState {
    pub initializer_key: Pubkey,
    pub username: String,
}

#[account]
pub struct EscrowState {
    pub seed: u64,
    pub bump: u8,
    pub initializer: Pubkey,
    pub taker: Pubkey,
    pub mint: Pubkey,
    pub initializer_amount: u64,
    pub verified_collection: Pubkey,
    pub validator_total_count: u64,
    pub validator_count: u64,
}

impl EscrowState {
    pub fn space() -> usize {
        8 + 121
    }
}

impl<'info> Initialize<'info> {
    fn into_deposit_context(
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

    fn deposit(&mut self, initializer_amount: u64) -> Result<()> {
        transfer_checked(
            self.into_deposit_context(),
            initializer_amount,
            self.mint.decimals,
        )
    }

    fn initialize_escrow(
        &mut self,
        seed: u64,
        bumps: &InitializeBumps,
        initializer_amount: u64,
        taker: Pubkey,
        verified_collection: Pubkey,
        validator_total_count: u64
    ) -> Result<()> {
        self.escrow_state.set_inner(EscrowState {
            seed,
            bump: bumps.escrow_state,
            initializer: self.initializer.key(),
            mint: self.mint.key(),
            initializer_amount,
            taker,
            verified_collection,
            validator_total_count,
            validator_count: 0
        });
        Ok(())
    }
}

impl<'info> Cancel<'info> {
    pub fn refund_and_close_vault(&mut self) -> Result<()> {
        let signer_seeds: [&[&[u8]]; 1] = [&[
            b"escrow",
            &self.escrow_state.seed.to_le_bytes()[..],
            &[self.escrow_state.bump],
        ]];

        transfer_checked(
            self.into_refund_context().with_signer(&signer_seeds),
            self.escrow_state.initializer_amount,
            self.mint.decimals,
        )?;

        close_account(self.into_close_context().with_signer(&signer_seeds))
    }

    fn into_refund_context(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        let cpi_accounts = TransferChecked {
            from: self.vault.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.initializer_deposit_token_account.to_account_info(),
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

impl<'info> DeclineRequest<'info> {
    pub fn refund_and_close_vault(&mut self) -> Result<()> {
        let signer_seeds: [&[&[u8]]; 1] = [&[
            b"escrow",
            &self.escrow_state.seed.to_le_bytes()[..],
            &[self.escrow_state.bump],
        ]];

        transfer_checked(
            self.into_refund_context().with_signer(&signer_seeds),
            self.escrow_state.initializer_amount,
            self.mint.decimals,
        )?;

        close_account(self.into_close_context().with_signer(&signer_seeds))
    }

    fn into_refund_context(&self) -> CpiContext<'_, '_, '_, 'info, TransferChecked<'info>> {
        let cpi_accounts = TransferChecked {
            from: self.vault.to_account_info(),
            mint: self.mint.to_account_info(),
            to: self.initializer_deposit_token_account.to_account_info(),
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

impl<'info> Exchange<'info> {
    pub fn withdraw_and_close_vault(&mut self) -> Result<()> {
        let signer_seeds: [&[&[u8]]; 1] = [&[
            b"escrow",
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
