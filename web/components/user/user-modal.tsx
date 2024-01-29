import React, { useState } from 'react';
import Input from '../shared/input';
import Dropdown from '../shared/dropdown';
import { useInitialiseUser } from '@/hooks/initialize-user';
import { AppModal } from '../shared/app-modal';

const dropDownItems = ['Item 1', 'Item 2'];

interface UserModalProps {
    hideModal: () => void;
    show: boolean;
  }

export default function UserModal({
  hideModal,
  show,
}: UserModalProps) {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [role, setRole] = useState(dropDownItems[0]);

  const { initializeUser } = useInitialiseUser();

  const handleSubmit = () => {
    initializeUser.mutateAsync({ name, about, role });
  };

  return (
    <AppModal
      title="Create User"
      show={show}
      hide={hideModal}
      submit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Name:"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="About:"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />

        <Dropdown
          label="Role:"
          items={dropDownItems}
          value={role}
          onClick={(v) => setRole(v)}
        />
      </div>
    </AppModal>
  );
}
