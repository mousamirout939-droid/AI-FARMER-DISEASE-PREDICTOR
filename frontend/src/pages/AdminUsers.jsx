import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/endpoints.js';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['admin-users'], queryFn: () => adminApi.users() });
  const users = data?.data?.data || [];

  const toggleStatus = useMutation({
    mutationFn: ({ id, isActive }) => adminApi.updateUserStatus(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Manage Users</h1>
      {isLoading && <p className="mt-4 text-sm text-forest/50">Loading…</p>}
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage-200 text-left text-forest/50 dark:border-white/10 dark:text-sage-100/50">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-sage-100 last:border-0 dark:border-white/5">
                <td className="py-2 font-medium text-forest dark:text-sage-50">{u.name}</td>
                <td className="py-2 text-forest/70 dark:text-sage-100/70">{u.email}</td>
                <td className="py-2 capitalize text-forest/70 dark:text-sage-100/70">{u.role}</td>
                <td className="py-2">{u.isActive ? 'Active' : 'Inactive'}</td>
                <td className="py-2">
                  <button className="btn-ghost text-xs" onClick={() => toggleStatus.mutate({ id: u._id, isActive: !u.isActive })}>
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
