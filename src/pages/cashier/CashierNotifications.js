import React, { useState, useEffect } from 'react';
import { Bell, Check, AlertTriangle, Package, Info } from 'lucide-react';
import { notificationsAPI, stockAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CashierNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Fetch notifications and low stock alerts with caching
      const [data, lowStock] = await Promise.all([
        notificationsAPI.getAll(user?.storeId),
        stockAPI.getLowStockAlerts(user?.storeId),
      ]);

      const lowStockNotifications = lowStock.map((item) => ({
        id: `low-stock-${item.id}`,
        type: 'low_stock',
        message: `${item.name} stock is low (${item.stock} left).`,
        is_read: false,
        created_at: item.updated_at || item.created_at || new Date().toISOString(),
      }));

      const merged = [...data, ...lowStockNotifications];
      setNotifications(merged);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    await notificationsAPI.markAsRead(id);
    fetchNotifications();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'low_stock':
        return <Package size={20} />;
      case 'order':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'low_stock':
        return 'orange';
      case 'order':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Notifications & Alerts</h1>
        <p>Stay updated with important notifications.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread ({notifications.filter(n => !n.is_read).length})
            </button>
            <button
              className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read ({notifications.filter(n => n.is_read).length})
            </button>
          </div>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={48} />
              <h3>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              >
                <div className={`notification-icon ${getTypeColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-date">
                    {new Date(notification.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {!notification.is_read && (
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <Check size={14} />
                    Mark Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }
        .loading-spinner.large {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .filter-tabs {
          display: flex;
          gap: 8px;
        }
        .filter-tab {
          padding: 8px 16px;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-tab:hover {
          background: #e5e7eb;
        }
        .filter-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .notifications-list {
          display: flex;
          flex-direction: column;
        }
        .notification-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          transition: background 0.2s;
        }
        .notification-item:last-child {
          border-bottom: none;
        }
        .notification-item:hover {
          background: #f9fafb;
        }
        .notification-item.unread {
          background: #f0f9ff;
        }
        .notification-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notification-icon.orange {
          background: #fef3c7;
          color: #d97706;
        }
        .notification-icon.blue {
          background: #dbeafe;
          color: #2563eb;
        }
        .notification-icon.gray {
          background: #f3f4f6;
          color: #6b7280;
        }
        .notification-content {
          flex: 1;
        }
        .notification-message {
          margin: 0 0 4px;
          color: #1f2937;
          font-size: 14px;
        }
        .notification-date {
          font-size: 12px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default CashierNotifications;
