use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub initializer: Pubkey,
    pub username: String,
    pub about: String,
    pub freelancer: bool,
    pub pfp: Option<String>,
    pub twitter: Option<String>,
    pub discord: Option<String>,
    pub telegram: Option<String>,
    pub github: Option<String>
}

const STRING_LENGTH_PREFIX: usize = 4;
const MAX_CONTENT_LENGTH: usize = 250 * 4;
const MAX_LENGTH: usize = 50 * 4;

impl Space for User {
    const INIT_SPACE: usize = 8 + 
    32 + 
    STRING_LENGTH_PREFIX + MAX_LENGTH + 
    STRING_LENGTH_PREFIX + MAX_LENGTH +
    STRING_LENGTH_PREFIX +  MAX_CONTENT_LENGTH + 
    1 + STRING_LENGTH_PREFIX + MAX_LENGTH + 
    1 + STRING_LENGTH_PREFIX + MAX_LENGTH + 
    1 + STRING_LENGTH_PREFIX + MAX_LENGTH + 
    1 + STRING_LENGTH_PREFIX + MAX_LENGTH +
    1 + STRING_LENGTH_PREFIX + MAX_LENGTH;
}