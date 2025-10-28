'use client';

import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Mail,
  Globe,
  Shield,
  Database,
  Zap,
  Save,
  AlertCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    // Email Notifications
    emailNotifications: {
      newClaim: true,
      claimApproved: true,
      claimRejected: true,
      documentUploaded: true,
      weeklyReport: false,
    },
    // System Settings
    system: {
      maintenanceMode: false,
      autoApproval: false,
      maxFileSize: 5,
      sessionTimeout: 60,
    },
    // Localization
    localization: {
      defaultLocale: 'fr',
      supportedLocales: ['fr', 'en', 'he'],
      timezone: 'Europe/Paris',
    },
    // Compensation Limits
    compensation: {
      minAmount: 250,
      maxAmount: 600,
      autoCalculation: true,
    },
  });

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <Save className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-900">Settings Saved Successfully</p>
            <p className="text-sm text-green-700">Your changes have been applied.</p>
          </div>
        </div>
      )}

      {/* Email Notifications */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          <ToggleSetting
            label="New Claim Submitted"
            description="Get notified when a new claim is submitted by a client"
            value={settings.emailNotifications.newClaim}
            onChange={(value) => updateSetting('emailNotifications', 'newClaim', value)}
          />
          <ToggleSetting
            label="Claim Approved"
            description="Receive notification when a claim is approved"
            value={settings.emailNotifications.claimApproved}
            onChange={(value) => updateSetting('emailNotifications', 'claimApproved', value)}
          />
          <ToggleSetting
            label="Claim Rejected"
            description="Get notified when a claim is rejected"
            value={settings.emailNotifications.claimRejected}
            onChange={(value) => updateSetting('emailNotifications', 'claimRejected', value)}
          />
          <ToggleSetting
            label="Document Uploaded"
            description="Receive notification when a client uploads a document"
            value={settings.emailNotifications.documentUploaded}
            onChange={(value) => updateSetting('emailNotifications', 'documentUploaded', value)}
          />
          <ToggleSetting
            label="Weekly Report"
            description="Receive a weekly summary report of all activities"
            value={settings.emailNotifications.weeklyReport}
            onChange={(value) => updateSetting('emailNotifications', 'weeklyReport', value)}
          />
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Zap className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">System Configuration</h2>
        </div>
        <div className="p-6 space-y-6">
          <ToggleSetting
            label="Maintenance Mode"
            description="Enable maintenance mode to prevent users from accessing the system"
            value={settings.system.maintenanceMode}
            onChange={(value) => updateSetting('system', 'maintenanceMode', value)}
            warning
          />
          <ToggleSetting
            label="Auto-Approval"
            description="Automatically approve claims that meet all criteria"
            value={settings.system.autoApproval}
            onChange={(value) => updateSetting('system', 'autoApproval', value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              value={settings.system.maxFileSize}
              onChange={(e) => updateSetting('system', 'maxFileSize', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="50"
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum file size for document uploads
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.system.sessionTimeout}
              onChange={(e) => updateSetting('system', 'sessionTimeout', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="5"
              max="1440"
            />
            <p className="mt-1 text-sm text-gray-500">
              Time before a user session expires due to inactivity
            </p>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Globe className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Localization & Region</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Locale
            </label>
            <select
              value={settings.localization.defaultLocale}
              onChange={(e) => updateSetting('localization', 'defaultLocale', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fr">Français (FR)</option>
              <option value="en">English (EN)</option>
              <option value="he">עברית (HE)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Default language for new users and system emails
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={settings.localization.timezone}
              onChange={(e) => updateSetting('localization', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="Asia/Jerusalem">Asia/Jerusalem (UTC+2)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              System timezone for timestamps and reports
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supported Languages
            </label>
            <div className="flex flex-wrap gap-2">
              {['fr', 'en', 'he'].map((locale) => (
                <span
                  key={locale}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    settings.localization.supportedLocales.includes(locale)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {locale.toUpperCase()}
                </span>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Languages available to users
            </p>
          </div>
        </div>
      </div>

      {/* Compensation Settings */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Compensation Limits</h2>
        </div>
        <div className="p-6 space-y-6">
          <ToggleSetting
            label="Auto Calculation"
            description="Automatically calculate compensation amounts based on EU/IL regulations"
            value={settings.compensation.autoCalculation}
            onChange={(value) => updateSetting('compensation', 'autoCalculation', value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Amount (€)
              </label>
              <input
                type="number"
                value={settings.compensation.minAmount}
                onChange={(e) => updateSetting('compensation', 'minAmount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Minimum compensation amount
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Amount (€)
              </label>
              <input
                type="number"
                value={settings.compensation.maxAmount}
                onChange={(e) => updateSetting('compensation', 'maxAmount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <p className="mt-1 text-sm text-gray-500">
                Maximum compensation amount
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Database & Backup */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <Database className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Database & Backup</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Automatic Backups Enabled</p>
              <p className="text-sm text-blue-700 mt-1">
                Daily backups are performed at 2:00 AM. Last backup: Today at 2:05 AM
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Download Backup
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Restore from Backup
            </button>
          </div>
        </div>
      </div>

      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          <Save className="h-5 w-5" />
          Save All Changes
        </button>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  value,
  onChange,
  warning,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  warning?: boolean;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900">{label}</h3>
          {warning && (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
              Caution
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          value ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
