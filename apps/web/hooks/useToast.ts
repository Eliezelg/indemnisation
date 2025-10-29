'use client';

import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastOptions {
  duration?: number;
}

export function useToast() {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      icon: '✓',
      style: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: options?.duration || 5000,
      icon: '✕',
      style: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 4000,
      icon: 'ℹ',
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: options?.duration || 4000,
      icon: '⚠',
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      style: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        success: {
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            fontWeight: '500',
          },
        },
        error: {
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            fontWeight: '500',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
            color: '#fff',
            fontWeight: '500',
          },
        },
      }
    );
  };

  const dismiss = (toastId?: string) => {
    return toast.dismiss(toastId);
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    promise,
    dismiss,
  };
}
