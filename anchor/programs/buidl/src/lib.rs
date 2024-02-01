use anchor_lang::prelude::*;

mod contexts;
use contexts::*;
mod states;
mod constant;

declare_id!("7aiyyKdHw5YTZYJVnQdTskTyQk659fsEqRKu611uBiG5");

#[program]
pub mod anchor_escrow {

    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        seed: u64,
        initializer_amount: u64,
        validator_total_count: u8,
        taker: Pubkey,
        verified_collection: Pubkey,
        about: String
    ) -> Result<()> {

        ctx.accounts
        .initialize_escrow(
            seed, 
            &ctx.bumps, 
            initializer_amount, 
            taker,
            verified_collection,
            validator_total_count,
            about
        )?;

        ctx.accounts.deposit(initializer_amount)
    }

    pub fn initialize_user(ctx: Context<InitializeUser>, username: String, about: String, role: String) -> Result<()> {
        ctx.accounts.initialize_user(username, about, role)
    }

    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        ctx.accounts.refund_and_close_vault()
    }

    pub fn upload_work(ctx: Context<UploadWork>, file: String) -> Result<()> {
        ctx.accounts.upload_work(file)
    }

    pub fn accept_request(ctx: Context<AcceptRequest>) -> Result<()> {
        ctx.accounts.accept_request()
    }

    pub fn decline_request(ctx: Context<DeclineRequest>) -> Result<()> {
        ctx.accounts.refund_and_close_vault()
    }

    pub fn validate_accept(ctx: Context<ValidateWork>) -> Result<()> {
        ctx.accounts.validate_accept()
    }

    pub fn validate_decline(ctx: Context<ValidateWork>) -> Result<()> {
        ctx.accounts.validate_decline()
    }

    pub fn exchange(ctx: Context<Exchange>) -> Result<()> {
        ctx.accounts.withdraw_and_close_vault()
    }
}