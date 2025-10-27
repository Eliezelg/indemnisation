'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Users,
  FolderOpen,
  Settings,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  locale: string;
}

export default function AdminSidebar({ locale }: SidebarProps) {
  const pathname = usePathname();

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
      {/* Mobile sidebar backdrop */}
      <div className="lg:hidden fixed inset-0 bg-gray-900/80 z-40" aria-hidden="true" />

      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:block">
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
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@flightclaim.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
