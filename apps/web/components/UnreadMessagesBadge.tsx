'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

interface UnreadMessagesBadgeProps {
  className?: string;
}

export default function UnreadMessagesBadge({ className = '' }: UnreadMessagesBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('http://localhost:3001/messages/unread-count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  if (unreadCount === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <MessageCircle className="h-6 w-6 text-gray-600" />
      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </div>
    </div>
  );
}
