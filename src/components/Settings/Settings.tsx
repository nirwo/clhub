import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Cloud, Mail, Key, Globe, RotateCcw } from 'lucide-react';
import { User } from '../../types';
import { resetToCleanData } from '../../data/cleanMockData';

interface SettingsProps {
  currentUser: User;
}

export const Settings: React.FC<SettingsProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'integrations' | 'system'>('general');
  const [organizationSettings, setOrganizationSettings] = useState(() => {
    const saved = localStorage.getItem('organization-settings');
    return saved ? JSON.parse(saved) : {
      name: 'Your Organization',
      timezone: 'UTC-8',
      currency: 'USD'
    };
  });

  const isAdmin = currentUser.role === 'admin';

  const handleResetSystem = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset the system? This will:\n\n' +
      '• Remove all configurations and integrations\n' +
      '• Clear all data except the admin user\n' +
      '• Reset to initial clean state\n\n' +
      'This action cannot be undone!'
    );

    if (confirmed) {
      const doubleConfirm = window.confirm(
        'This is your final warning. All data will be permanently deleted. Continue?'
      );

      if (doubleConfirm) {
        // Keep only the current admin user
        const adminUser = [currentUser];
        localStorage.setItem('users', JSON.stringify(adminUser));
        
        // Reset all other data
        resetToCleanData();
        
        alert('System has been reset to clean state. The page will reload.');
        window.location.reload();
      }
    }
  };

  const saveOrganizationSettings = () => {
    localStorage.setItem('organization-settings', JSON.stringify(organizationSettings));
    alert('Organization settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Settings</h2>
        <p className="text-slate-600">Configure system settings and integrations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'General', icon: SettingsIcon },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              ...(isAdmin ? [
                { id: 'integrations', label: 'Integrations', icon: Cloud },
                { id: 'system', label: 'System', icon: Database }
              ] : [])
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Organization Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      value={organizationSettings.name}
                      onChange={(e) => setOrganizationSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time Zone</label>
                    <select 
                      value={organizationSettings.timezone}
                      onChange={(e) => setOrganizationSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC-8">UTC-8 (Pacific Time)</option>
                      <option value="UTC-5">UTC-5 (Eastern Time)</option>
                      <option value="UTC+0">UTC+0 (GMT)</option>
                      <option value="UTC+1">UTC+1 (Central European Time)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
                    <select 
                      value={organizationSettings.currency}
                      onChange={(e) => setOrganizationSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>

                  <button
                    onClick={saveOrganizationSettings}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Save Organization Settings
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-md font-semibold text-slate-900 mb-4">Data Retention</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Performance Metrics</p>
                      <p className="text-sm text-slate-600">How long to keep performance data</p>
                    </div>
                    <select className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>1 year</option>
                      <option>2 years</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">Audit Logs</p>
                      <p className="text-sm text-slate-600">How long to keep audit trail data</p>
                    </div>
                    <select className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>5 years</option>
                      <option>7 years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Email Notifications</p>
                        <p className="text-sm text-slate-600">Receive alerts via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Push Notifications</p>
                        <p className="text-sm text-slate-600">Browser push notifications</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-md font-semibold text-slate-900 mb-4">Alert Categories</h4>
                
                <div className="space-y-3">
                  {[
                    { name: 'Cost Alerts', description: 'Budget thresholds and spending alerts' },
                    { name: 'Performance Alerts', description: 'CPU, memory, and disk usage alerts' },
                    { name: 'Security Alerts', description: 'Security events and policy violations' },
                    { name: 'Backup Alerts', description: 'Backup job status and failures' },
                    { name: 'Migration Alerts', description: 'Migration progress and completion' }
                  ].map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{category.name}</p>
                        <p className="text-sm text-slate-600">{category.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-900">Session Timeout</p>
                        <p className="text-sm text-slate-600">Automatic logout after inactivity</p>
                      </div>
                    </div>
                    <select className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-md font-semibold text-slate-900 mb-4">Password Policy</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900">Minimum password length</span>
                    <select className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>8 characters</option>
                      <option>12 characters</option>
                      <option>16 characters</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900">Require special characters</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900">Password expiration</span>
                    <select className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Never</option>
                      <option>90 days</option>
                      <option>180 days</option>
                      <option>365 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && isAdmin && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Integrations</h3>
                <p className="text-slate-600 mb-6">
                  Configure integrations in the dedicated <strong>Integrations</strong> section for full management capabilities.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Database className="h-6 w-6 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">VMware vCenter</h4>
                          <p className="text-sm text-slate-600">Manage VMware infrastructure</p>
                        </div>
                      </div>
                      <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-1 rounded-full">
                        Not Configured
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Connect to VMware vCenter to manage virtual machines, monitor performance, and automate operations.
                    </p>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Cloud className="h-6 w-6 text-emerald-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">Microsoft Azure</h4>
                          <p className="text-sm text-slate-600">Manage Azure resources</p>
                        </div>
                      </div>
                      <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-1 rounded-full">
                        Not Configured
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Connect to Microsoft Azure to manage virtual machines, monitor costs, and optimize resource usage.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h4 className="text-md font-semibold text-slate-900 mb-4">Third-Party Services</h4>
                
                <div className="space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-6 w-6 text-slate-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">SMTP Server</h4>
                          <p className="text-sm text-slate-600">Email notifications</p>
                        </div>
                      </div>
                      <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-1 rounded-full">
                        Not Configured
                      </span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Configure SMTP
                    </button>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-6 w-6 text-slate-600" />
                        <div>
                          <h4 className="font-medium text-slate-900">Single Sign-On (SSO)</h4>
                          <p className="text-sm text-slate-600">SAML/OIDC integration</p>
                        </div>
                      </div>
                      <span className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-1 rounded-full">
                        Not Configured
                      </span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Configure SSO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && isAdmin && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">System Management</h3>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="font-medium text-slate-900 mb-2">System Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Version:</span>
                        <p className="font-medium">CloudHub v1.0.0</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Setup Date:</span>
                        <p className="font-medium">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Admin User:</span>
                        <p className="font-medium">{currentUser.name}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Organization:</span>
                        <p className="font-medium">{organizationSettings.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <RotateCcw className="h-6 w-6 text-red-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900 mb-2">Reset System</h4>
                        <p className="text-sm text-red-800 mb-4">
                          This will remove all configurations, integrations, and data except the admin user account. 
                          The system will be reset to its initial clean state.
                        </p>
                        <button
                          onClick={handleResetSystem}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Reset System
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
};