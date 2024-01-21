use anchor_lang::prelude::*;

use crate::states::User;
use crate::constants::USER;

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,

    #[account(
        init,
        seeds = [USER.as_ref(), initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = std::mem::size_of::<User>() + 8
    )]
    pub user_state: Box<Account<'info, User>>,
    pub system_program: Program<'info, System>,
}

impl <'info> InitializeUser<'info> {
 
    pub fn initialize_user(&mut self, username: String) -> Result<()> {
         self.user_state.initializer_key = *self.initializer.key;
         self.user_state.username = username;
         Ok(())
     }
    } 
