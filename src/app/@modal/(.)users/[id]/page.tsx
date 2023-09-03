import { Dialog } from '@headlessui/react';
import React, { useState } from 'react'

import { UserHeader, fetchProfile } from '@/app/users/[id]/page';
import UserModal from './user-modal';

const UserModalPage = async ({ params }) => {
  const { id } = params;
  const { user, flipnoteCount } = await fetchProfile(id);

  return <UserModal userName={user?.name} {...{id, flipnoteCount}} />
}

export default UserModalPage;
