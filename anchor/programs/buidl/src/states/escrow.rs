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
    pub upload_work: String,
    pub about: String,
    pub status: String
}

const STRING_LENGTH_PREFIX: usize = 4;
const MAX_UPLOAD_LENGTH: usize = 100 * 4; 
const MAX_CONTENT_LENGTH: usize = 250 * 4;
const MAX_STATUS_LENGTH: usize = 50 * 4;

impl Space for Escrow {
    const INIT_SPACE: usize = 8 + 8 + 1 + 32 + 32 + 32 + 8 + 32 + 8 + 8 + 
    STRING_LENGTH_PREFIX + 
    MAX_UPLOAD_LENGTH + 
    STRING_LENGTH_PREFIX + 
    MAX_CONTENT_LENGTH + 
    STRING_LENGTH_PREFIX + 
    MAX_STATUS_LENGTH;
}