'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  locale: string;
}

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export default function AdminSidebar({ locale }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get user info from localStorage (stored during login)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserInfo(user);
      } catch (e) {
        console.error('Failed to parse user info:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: `/${locale}/admin`,
      icon: LayoutDashboard,
      current: pathname === `/${locale}/admin`,
    },
    {
      name: 'Claims',
      href: `/${locale}/admin/claims`,
      icon: FileText,
      current: pathname?.startsWith(`/${locale}/admin/claims`),
    },
    {
      name: 'Documents',
      href: `/${locale}/admin/documents`,
      icon: FolderOpen,
      current: pathname?.startsWith(`/${locale}/admin/documents`),
    },
    {
      name: 'Users',
      href: `/${locale}/admin/users`,
      icon: Users,
      current: pathname?.startsWith(`/${locale}/admin/users`),
    },
    {
      name: 'Statistics',
      href: `/${locale}/admin/statistics`,
      icon: BarChart3,
      current: pathname?.startsWith(`/${locale}/admin/statistics`),
    },
    {
      name: 'Settings',
      href: `/${locale}/admin/settings`,
      icon: Settings,
      current: pathname?.startsWith(`/${locale}/admin/settings`),
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-gray-200 shadow-sm"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900/80 z-40"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-6">
          <h2 className="text-xl font-bold text-blue-600">
            FlightClaim Admin
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${
                    item.current
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {userInfo ? userInfo.firstName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userInfo?.email || 'Loading...'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
