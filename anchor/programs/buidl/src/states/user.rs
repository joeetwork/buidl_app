use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub initializer_key: Pubkey,
    pub username: String,
    pub about: String,
    pub role: String
}

const STRING_LENGTH_PREFIX: usize = 4;
const MAX_CONTENT_LENGTH: usize = 250 * 4;
const MAX_LENGTH: usize = 50 * 4;

impl Space for User {
    const INIT_SPACE: usize = 8 + 
    32 + 
    STRING_LENGTH_PREFIX + 
    MAX_LENGTH + 
    STRING_LENGTH_PREFIX + 
    MAX_LENGTH +
    STRING_LENGTH_PREFIX + 
    MAX_CONTENT_LENGTH;
}