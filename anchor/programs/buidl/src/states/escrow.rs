use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub seed: u64,
    pub bump: u8,
    pub initializer: Pubkey,
    pub taker: Pubkey,
    pub mint: Pubkey,
    pub initializer_amount: u64,
    pub verified_collection: Option<Pubkey>,
    pub validator: Option<Pubkey>,
    pub validator_count: u8,
    pub upload_work: String,
    pub about: String,
    pub status: String
}

const STRING_LENGTH_PREFIX: usize = 4;
const MAX_UPLOAD_LENGTH: usize = STRING_LENGTH_PREFIX + 100 * 4; 
const MAX_CONTENT_LENGTH: usize = STRING_LENGTH_PREFIX + 250 * 4;
const MAX_STATUS_LENGTH: usize = STRING_LENGTH_PREFIX + 50 * 4;

impl Space for Escrow {
    const INIT_SPACE: usize = 8 + 8 + 1 + 32 + 32 + 32 + 8 + (1 + 32) + (1 + 32) + 1 + 
    MAX_UPLOAD_LENGTH + 
    MAX_CONTENT_LENGTH + 
    MAX_STATUS_LENGTH;
}