use anchor_lang::prelude::*;

use crate::constant::USER;
use crate::states::User;

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeUser<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,

    #[account(
        init_if_needed,
        seeds = [USER.as_ref(), initializer.key().as_ref()],
        bump,
        payer = initializer,
        space = User::INIT_SPACE,
    )]
    pub user_state: Box<Account<'info, User>>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeUser<'info> {
    pub fn initialize_user(
        &mut self,
        username: String,
        about: String,
        freelancer: bool,
        pfp: Option<String>,
        twitter: Option<String>,
        discord: Option<String>,
        telegram: Option<String>,
        github: Option<String>,
    ) -> Result<()> {
        self.user_state.set_inner(User {
            initializer: self.initializer.key(),
            username,
            about,
            freelancer,
            pfp,
            twitter,
            discord,
            telegram,
            github,
        });

        Ok(())
    }
}
