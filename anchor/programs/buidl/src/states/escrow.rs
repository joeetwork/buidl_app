use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub seed: u64,
    pub bump: u8,
    pub initializer: Pubkey,
    pub taker: Pubkey,
    pub mint: Pubkey,
    pub initializer_amount: u64,
    pub verified_collection: Pubkey,
    pub validator_total_count: u64,
    pub validator_count: u64,
    pub upload_work: String
}