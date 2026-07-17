import { useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { errorMessage } from '../../services/api';
import { Button, EmptyState, Spinner } from '../../components/common/UI';
import { Page } from './StudentPages';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markRead = async (notification) => {
    if (notification.read) return;
    try {
      await api.patch(`/notifications/${notification._id}/read`);
      setNotifications((current) => current.map((item) => item._id === notification._id ? { ...item, read: true } : item));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      toast.success('All notifications marked as read.');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const hasUnread = notifications.some((notification) => !notification.read);

  return (
    <Page
      title="Notifications"
      copy="Queue calls, appointment changes, and useful reminders."
      action={hasUnread && <Button variant="secondary" onClick={markAllRead}><CheckCheck size={16} /> Mark all read</Button>}
    >
      {loading ? <Spinner /> : notifications.length ? (
        <div className="panel">
          {notifications.map((notification) => {
            const content = (
              <>
                <span className="activity-icon"><Bell size={17} /></span>
                <span className="flex-1">
                  <span className="flex justify-between gap-3">
                    <b className="text-sm">{notification.title || 'CampusFlow update'}</b>
                    {!notification.read && <span className="status-dot" />}
                  </span>
                  <span className="block text-sm text-slate-600 mt-1">{notification.message}</span>
                  <small className="text-slate-400">{new Date(notification.createdAt).toLocaleString()}</small>
                </span>
              </>
            );

            return notification.read ? (
              <div className="activity-item opacity-60" key={notification._id}>{content}</div>
            ) : (
              <button className="activity-item w-full text-left" key={notification._id} onClick={() => markRead(notification)} aria-label={`Mark ${notification.title || 'notification'} as read`}>
                {content}
              </button>
            );
          })}
        </div>
      ) : (
        <EmptyState title="You’re all caught up" text="Queue updates and appointment confirmations will appear here." />
      )}
    </Page>
  );
}
