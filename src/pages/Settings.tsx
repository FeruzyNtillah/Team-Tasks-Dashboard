import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
  });

  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'task_created',
        title: 'Settings Saved',
        message: 'Your preferences have been updated successfully',
      });
    } catch {
      addNotification({
        type: 'task_updated',
        title: 'Save Failed',
        message: 'Failed to save settings. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gradient-text-vibrant text-3xl font-bold">Settings</h2>
          <p className="text-slate-500 mt-1">Manage your account preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-linear-to-br from-white to-cyan-50 rounded-lg shadow-md border border-cyan-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <User className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Profile Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    defaultValue={user?.email || ''}
                    placeholder="Enter your email"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-linear-to-br from-white to-amber-50 rounded-lg shadow-md border border-amber-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Bell className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-amber-100 rounded-lg border border-amber-200">
                  <div>
                    <p className="font-medium text-slate-700">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-amber-600' : 'bg-slate-300'
                    }`}
                    aria-label="Toggle email notifications"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-100 rounded-lg border border-violet-200">
                  <div>
                    <p className="font-medium text-slate-700">Push Notifications</p>
                    <p className="text-sm text-slate-500">Browser push notifications</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.pushNotifications ? 'bg-violet-600' : 'bg-slate-300'
                    }`}
                    aria-label="Toggle push notifications"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-linear-to-br from-white to-slate-50 rounded-lg shadow-md border border-slate-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <SettingsIcon className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Appearance</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-700">Dark Mode</p>
                    <p className="text-sm text-slate-500">Use dark theme</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.darkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}
                    aria-label="Toggle dark mode"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-linear-to-br from-white to-emerald-50 rounded-lg shadow-md border border-emerald-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Account</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-slate-600">Status:</span>
                  <span className="ml-2 font-medium text-emerald-600">Active</span>
                </div>
                <div className="text-sm">
                  <span className="text-slate-600">Member since:</span>
                  <span className="ml-2 font-medium text-slate-800">2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            disabled={saving}
            className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-md hover:shadow-lg"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
