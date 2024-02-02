use anchor_lang::prelude::*;

#[account]
pub struct Upload {
    pub user: Pubkey,
    pub escrow: Pubkey,
    pub upload_work: String,
}

const STRING_LENGTH_PREFIX: usize = 4;
const MAX_UPLOAD_LENGTH: usize = STRING_LENGTH_PREFIX + 100 * 4; 

impl Space for Upload {
    const INIT_SPACE: usize = 8 + 32 + 32 +
    MAX_UPLOAD_LENGTH;
}