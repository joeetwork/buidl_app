use anchor_lang::prelude::*;

mod contexts;
use contexts::*;
mod states;
mod constant;

declare_id!("6FJ5uuAfaAVEr8hY7JD2BjFoAC8n6FMRgziif9VFN2v7");

#[program]
pub mod anchor_escrow {

    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        seed: u64,
        initializer_amount: u64,
        validator: Option<Pubkey>,
        taker: Pubkey,
        verified_collection: Option<Pubkey>,
        about: String
    ) -> Result<()> {

        ctx.accounts
        .initialize_escrow(
            seed, 
            &ctx.bumps, 
            initializer_amount, 
            taker,
            verified_collection,
            validator,
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

    pub fn accept_with_collection(ctx: Context<ValidateWithCollection>) -> Result<()> {
        ctx.accounts.vote_accept()
    }

    pub fn decline_with_collection(ctx: Context<ValidateWithCollection>) -> Result<()> {
        ctx.accounts.vote_decline()
    }

    pub fn count_vote(ctx: Context<CountVote>) -> Result<()> {
        ctx.accounts.count_vote()
    }

    pub fn accept_with_user(ctx: Context<ValidateWithUser>) -> Result<()> {
        ctx.accounts.vote_accept()
    }

    pub fn decline_with_user(ctx: Context<ValidateWithUser>) -> Result<()> {
        ctx.accounts.vote_decline()
    }

    pub fn validate_with_employer(ctx: Context<ValidateWithEmployer>) -> Result<()> {
        ctx.accounts.validate()
    }

    pub fn exchange(ctx: Context<Exchange>) -> Result<()> {
        ctx.accounts.withdraw_and_close_vault()
    }
}