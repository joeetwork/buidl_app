import { ChangeEvent } from 'react';

export type FilteredProps = 'twitter' | 'discord' | 'telegram';

export interface UserLinkProps {
  twitter: string | null;
  discord: string | null;
  telegram: string | null;
  github: string | null;
}

export interface LinksProps {
  userAccountLinks: UserLinkProps;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface RolesProps {
  roles: string[];
  role: string | undefined;
  userAccountRole: string | undefined;
  handleRole: (selectedRole: string) => void;
}

export interface ProfileModalProps {
  show: boolean;
  hideModal: () => void;
}
