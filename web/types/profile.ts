import { ChangeEvent } from 'react';

export type FilteredProps = 'twitter' | 'discord' | 'telegram';

export interface UserLinkProps {
  twitter: 'twitter' | null;
  discord: 'discord' | null;
  telegram: 'telegram' | null;
  github: 'github' | null;
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
