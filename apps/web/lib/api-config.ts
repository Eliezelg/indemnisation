/**
 * API Configuration
 * Centralized API URL configuration
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://indem.webpro200.com/api';

export const getApiUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Remove trailing slash from API_URL if present
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  return `${baseUrl}/${cleanPath}`;
};
