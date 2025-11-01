'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface Message {
  id: string;
  claimId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  isRead: boolean;
  readAt?: string;
  isAdminMessage: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface MessageThreadProps {
  claimId: string;
  currentUserId: string;
  currentUserRole: string;
}

export default function MessageThreadWebSocket({
  claimId,
  currentUserId,
  currentUserRole,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial message fetch
  useEffect(() => {
    fetchMessages();
  }, [claimId]);

  // WebSocket connection
  const { isConnected, markAsRead, startTyping, stopTyping } = useWebSocket({
    claimId,
    onNewMessage: (message: Message) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      // Mark as read if it's for us
      if (message.receiverId === currentUserId && !message.isRead) {
        markAsRead(message.id);
      }
    },
    onMessageRead: (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, isRead: true, readAt: data.readAt }
            : msg
        )
      );
    },
    onTypingUpdate: (data) => {
      // Filter out current user from typing list
      const otherTypingUsers = data.typingUsers.filter((uid: string) => uid !== currentUserId);
      setTypingUsers(otherTypingUsers);
    },
    onConnected: () => {
      console.log('Connected to real-time messaging');
    },
    onDisconnected: () => {
      console.log('Disconnected from real-time messaging');
    },
  });

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `https://indem.webpro200.com/api/messages/claim/${claimId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);

        // Mark unread messages as read
        const unreadMessages = data.filter(
          (msg: Message) => !msg.isRead && msg.receiverId === currentUserId
        );
        for (const msg of unreadMessages) {
          markAsRead(msg.id);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    stopTyping(); // Stop typing indicator
    setSending(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://indem.webpro200.com/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          claimId,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage('');
        // Message will be added via WebSocket event
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
          <p className="text-sm text-gray-500 mt-1">
            Communiquez avec {currentUserRole === 'ADMIN' ? "le client" : "notre équipe"}
          </p>
        </div>
        {/* Connection status indicator */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600">En ligne</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-600">Hors ligne</span>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun message pour le moment</p>
            <p className="text-sm text-gray-400 mt-2">
              Envoyez un message pour démarrer la conversation
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUserId;
            const isAdmin = message.sender.role === 'ADMIN';

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-3 ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : isAdmin
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {/* Sender name (only for other's messages) */}
                  {!isOwnMessage && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${
                        isAdmin ? 'text-purple-700' : 'text-gray-700'
                      }`}>
                        {message.sender.firstName} {message.sender.lastName}
                      </span>
                      {isAdmin && (
                        <span className="bg-purple-200 text-purple-800 text-xs px-2 py-0.5 rounded">
                          Admin
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message content */}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>

                  {/* Timestamp */}
                  <div
                    className={`text-xs mt-2 ${
                      isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {formatDate(message.createdAt)}
                    {isOwnMessage && message.isRead && (
                      <span className="ml-2">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-sm">
              <span className="italic">En train d'écrire...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="Tapez votre message..."
            className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            rows={2}
            disabled={sending || !isConnected}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || !isConnected}
            className="self-end px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Envoyer
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2">
          Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
        </p>
      </div>
    </div>
  );
}
