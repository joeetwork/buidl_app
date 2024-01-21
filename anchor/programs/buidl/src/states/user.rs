use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub initializer_key: Pubkey,
    pub username: String,
    pub about: String,
    pub role: String
}