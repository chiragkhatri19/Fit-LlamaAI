import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Trash2, 
  LogOut, 
  User, 
  Mail,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/aceternity';

const SettingsPage: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
  });

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
      navigate('/');
    }
  };

  const handleDeleteAccount = () => {
    const confirm = window.prompt(
      'This action cannot be undone. Type "DELETE" to confirm:'
    );
    if (confirm === 'DELETE') {
      alert('Please contact support to delete your account.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600 mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
        </div>

        {/* Notification Settings */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Email Notifications</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive updates via email
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Push Notifications</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Receive push notifications
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Meal Reminders</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get reminded to log your meals
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, reminders: !notifications.reminders })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.reminders ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.reminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
            <User className="w-5 h-5" />
            Account
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Email Address</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {user?.primaryEmailAddress?.emailAddress || 'No email'}
              </p>
            </div>

            {/* Password change removed - managed by Clerk */}
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-800/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <p className="font-medium text-slate-900 dark:text-slate-100 mb-2">Data Storage</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your data is stored locally in your browser. No data is sent to external servers.
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 dark:border-red-800/50 p-6 mb-6">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">
            Danger Zone
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Sign Out</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Sign out of your account
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Permanently delete your account and all data
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

