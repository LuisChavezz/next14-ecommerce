export const revalidate = 0; // Revalidate the page every 0 seconds (on every request)

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';

import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

export default async function UsersPage() {

  const { ok, users = [] } = await getPaginatedUsers();

  // Check if the user is logged in
  if (!ok) {
    redirect('/auth/login');
  }

  return (
    <>
      <Title title="Users management" />

      <div className="mb-10">
        <UsersTable users={ users } />
        <Pagination totalPages={ 3 } />
      </div>
    </>
  );
}