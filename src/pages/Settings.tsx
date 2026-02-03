import React, { useState, useEffect } from 'react';
import { Bell, Wifi, WifiOff, Users, Settings as SettingsIcon, Activity, Monitor, Mail, MessageSquare, Globe, Shield, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase.client';

interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  realTimeUpdates: boolean;
  showPresenceIndicators: boolean;
  dashboardRefreshRate: number;
  activityLogging: boolean;
  dataSynchronization: boolean;
  offlineMode: boolean;
  notificationSound: boolean;
  desktopNotifications: boolean;
  mobileNotifications: boolean;
  collaborationAlerts: boolean;
  taskUpdates: boolean;
  projectUpdates: boolean;
  teamActivity: boolean;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [isConnected, setIsConnected] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    pushNotifications: true,
    realTimeUpdates: true,
    showPresenceIndicators: true,
    dashboardRefreshRate: 30,
    activityLogging: true,
    dataSynchronization: true,
    offlineMode: false,
    notificationSound: true,
    desktopNotifications: true,
    mobileNotifications: false,
    collaborationAlerts: true,
    taskUpdates: true,
    projectUpdates: true,
    teamActivity: true,
  });

  // Monitor real-time connection status
  useEffect(() => {
    const channel = supabase
      .channel('connection_status')
      .on('system', {}, (payload) => {
        setIsConnected(payload.status === 'SUBSCRIBED');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Simulate active users count (in real app, this would come from presence system)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 10) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSettingChange = (key: keyof UserSettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSync(new Date());
      
      addNotification({
        type: 'task_created',
        title: 'Settings Saved',
        message: 'Your preferences have been updated successfully',
      });
    } catch (error) {
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
      {/* Header with Real-time Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-gray-100">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          
          {/* Active Users */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-blue-100">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{activeUsers} online</span>
          </div>
          
          {/* Last Sync */}
          <div className="text-sm text-gray-500">
            Last sync: {lastSync.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">Real-time Features</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Real-time Updates</p>
                    <p className="text-sm text-gray-500">Receive live updates for tasks and projects</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('realTimeUpdates', !settings.realTimeUpdates)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.realTimeUpdates ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    aria-label="Toggle real-time updates"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.realTimeUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Presence Indicators</p>
                    <p className="text-sm text-gray-500">Show when team members are online</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('showPresenceIndicators', !settings.showPresenceIndicators)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.showPresenceIndicators ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                    aria-label="Toggle presence indicators"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.showPresenceIndicators ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Dashboard Refresh Rate</p>
                    <p className="text-sm text-gray-500">How often to refresh dashboard data</p>
                  </div>
                  <select
                    value={settings.dashboardRefreshRate}
                    onChange={(e) => handleSettingChange('dashboardRefreshRate', parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={10}>10 seconds</option>
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={300}>5 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-700">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.emailNotifications ? 'bg-yellow-600' : 'bg-gray-200'
                    }`}
                    aria-label="Toggle email notifications"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-700">Desktop Notifications</p>
                      <p className="text-sm text-gray-500">Browser push notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('desktopNotifications', !settings.desktopNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.desktopNotifications ? 'bg-orange-600' : 'bg-gray-200'
                    }`}
                    aria-label="Toggle desktop notifications"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.desktopNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-pink-600" />
                    <div>
                      <p className="font-medium text-gray-700">Notification Sound</p>
                      <p className="text-sm text-gray-500">Play sound for new notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notificationSound', !settings.notificationSound)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notificationSound ? 'bg-pink-600' : 'bg-gray-200'
                    }`}
                    aria-label="Toggle notification sound"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notificationSound ? 'translate-x-6' : 'translate-x-1'
                    }`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-800">Account Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={user?.email || 'john.doe@techsavy.com'}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    id="username"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="johndoe"
                    placeholder="Enter your username"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with Activity and Status */}
        <div className="space-y-6">
          {/* Real-time Activity Monitor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Live Activity</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tasks Updated</span>
                  <span className="font-medium text-green-600">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">New Messages</span>
                  <span className="font-medium text-blue-600">3</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Activity</span>
                  <span className="font-medium text-purple-600">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sync Status</span>
                  <span className="font-medium text-green-600">Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <SettingsIcon className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Quick Settings</h3>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <SettingsIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Privacy</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Database className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Data & Storage</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Language</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            disabled={saving}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
