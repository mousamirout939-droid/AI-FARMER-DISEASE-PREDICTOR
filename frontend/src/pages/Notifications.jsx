import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, BellRing } from 'lucide-react';
import axiosClient from '../api/axiosClient.js';

const notificationApi = {
  list: () => axiosClient.get('/notifications'),
  markRead: (id) => axiosClient.patch(`/notifications/${id}/read`),
};

export default function Notifications() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: notificationApi.list });
  const notifications = data?.data?.data || [];

  const markRead = useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-forest dark:text-sage-50">Notifications</h1>
      {isLoading && <p className="mt-4 text-sm text-forest/50">Loading…</p>}
      <div className="mt-6 space-y-2">
        {notifications.map((n) => (
          <button
            key={n._id}
            onClick={() => !n.isRead && markRead.mutate(n._id)}
            className="card flex w-full items-start gap-3 text-left"
          >
            {n.isRead ? <Bell className="mt-0.5 h-5 w-5 text-forest/40" /> : <BellRing className="mt-0.5 h-5 w-5 text-wheat-dark" />}
            <div>
              <div className="text-sm font-medium text-forest dark:text-sage-50">{n.title}</div>
              <div className="text-xs text-forest/60 dark:text-sage-100/60">{n.message}</div>
            </div>
          </button>
        ))}
        {!isLoading && notifications.length === 0 && (
          <p className="text-sm text-forest/50 dark:text-sage-100/50">You're all caught up.</p>
        )}
      </div>
    </div>
  );
}
