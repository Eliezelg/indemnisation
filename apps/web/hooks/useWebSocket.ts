'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  claimId?: string;
  onNewMessage?: (message: any) => void;
  onMessageRead?: (data: { messageId: string; readAt: string }) => void;
  onTypingUpdate?: (data: { claimId: string; typingUsers: string[] }) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (content: string) => void;
  markAsRead: (messageId: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    claimId,
    onNewMessage,
    onMessageRead,
    onTypingUpdate,
    onConnected,
    onDisconnected,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Connect to WebSocket server
    const wsUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, 'ws') || 'ws://localhost:3001';
    const socket = io(`${wsUrl}/messages`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      onConnected?.();

      // Join claim room if claimId is provided
      if (claimId) {
        socket.emit('join_claim', { claimId });
      }
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      onDisconnected?.();
    });

    socket.on('connected', (data) => {
      console.log('WebSocket authenticated:', data);
    });

    // Message event handlers
    socket.on('new_message', (message) => {
      console.log('New message received:', message);
      onNewMessage?.(message);
    });

    socket.on('message_read_receipt', (data) => {
      console.log('Message read receipt:', data);
      onMessageRead?.(data);
    });

    socket.on('typing_update', (data) => {
      console.log('Typing update:', data);
      onTypingUpdate?.(data);
    });

    // Error handling
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (claimId) {
        socket.emit('leave_claim', { claimId });
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [claimId, onNewMessage, onMessageRead, onTypingUpdate, onConnected, onDisconnected]);

  const sendMessage = useCallback((content: string) => {
    // Note: Actual sending is done via REST API, WebSocket is just for real-time delivery
    console.log('Send message via REST API:', content);
  }, []);

  const markAsRead = useCallback((messageId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('message_read', { messageId });
    }
  }, []);

  const startTyping = useCallback(() => {
    if (!socketRef.current?.connected || !claimId) return;

    socketRef.current.emit('typing_start', { claimId });

    // Auto-stop typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [claimId]);

  const stopTyping = useCallback(() => {
    if (!socketRef.current?.connected || !claimId) return;

    socketRef.current.emit('typing_stop', { claimId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [claimId]);

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    markAsRead,
    startTyping,
    stopTyping,
  };
}
