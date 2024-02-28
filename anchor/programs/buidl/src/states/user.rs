use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub initializer: Pubkey,
    pub username: String,
    pub about: String,
    pub role: String,
    pub pfp: Option<String>,
    pub links: UserLinks,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UserLinks {
    pub twitter: Option<String>,
    pub discord: Option<String>,
    pub telegram: Option<String>,
    pub github: Option<String>,
}

const STRING: usize = 4 + (50 * 4);
const ROLE: usize = 1 + 11;
const PFP: usize = 1 + STRING;
const LINKS: usize = (1 + STRING) * 4;

impl Space for User {
    const INIT_SPACE: usize = 8 + 32 + STRING + STRING + ROLE + PFP + LINKS;
}
