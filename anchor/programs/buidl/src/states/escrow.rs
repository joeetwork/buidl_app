use anchor_lang::prelude::*;

use super::user::UserLinks;

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
    pub validator_count: i8,
    pub upload_work: String,
    pub vote_deadline: Option<i64>,
    pub about: String,
    pub status: String,
    pub amount_of_voters: u8,
    pub links: UserLinks,
}

const STRING_LENGTH_PREFIX: usize = 4;
const MAX_UPLOAD_LENGTH: usize = STRING_LENGTH_PREFIX + 100 * 4;
const MAX_CONTENT_LENGTH: usize = STRING_LENGTH_PREFIX + 250 * 4;
const MAX_STATUS_LENGTH: usize = STRING_LENGTH_PREFIX + 50 * 4;

const STRING: usize = 4 + (50 * 4);
const LINKS: usize = (1 + STRING) * 4;

impl Space for Escrow {
    const INIT_SPACE: usize = 8
        + 8
        + 1
        + 32
        + 32
        + 32
        + 8
        + (1 + 32)
        + (1 + 32)
        + 1
        + MAX_UPLOAD_LENGTH
        + (1 + 8)
        + MAX_CONTENT_LENGTH
        + MAX_STATUS_LENGTH
        + 1
        + LINKS;
}
