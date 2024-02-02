use anchor_lang::prelude::*;

#[account]
pub struct Upload {
    pub user: Pubkey,
    pub escrow: Pubkey,
    pub upload_work: String,
    pub amount: u64,
    pub about: String
}

const STRING_LENGTH_PREFIX: usize = 4;
const MAX_UPLOAD_LENGTH: usize = STRING_LENGTH_PREFIX + 100 * 4; 
const MAX_CONTENT_LENGTH: usize = STRING_LENGTH_PREFIX + 250 * 4;

impl Space for Upload {
    const INIT_SPACE: usize = 8 + 32 + 32 +
    MAX_UPLOAD_LENGTH + 8 + MAX_CONTENT_LENGTH;
}