use anchor_lang::prelude::*;

pub mod constants;
mod contexts;
use contexts::*;
mod states;

declare_id!("AmaFf9hFpemKXPaAPqxu14vGaZWcGu1ADN1vpy1gtJtw");

#[program]
pub mod anchor_escrow {

    use super::*;

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

    pub fn initialize_user(ctx: Context<InitializeUser>, username: String) -> Result<()> {
        ctx.accounts.initialize_user(username)
    }

    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        ctx.accounts.refund_and_close_vault()
    }

    pub fn upload_work(ctx: Context<UploadWork>, file: String) -> Result<()> {
        ctx.accounts.upload_work(file)
    }

    pub fn decline_request(ctx: Context<DeclineRequest>) -> Result<()> {
        ctx.accounts.refund_and_close_vault()
    }

    pub fn validate_work(ctx: Context<ValidateWork>) -> Result<()> {
        ctx.accounts.validate_work()
    }

    pub fn exchange(ctx: Context<Exchange>) -> Result<()> {
        ctx.accounts.withdraw_and_close_vault()
    }
}