import React, { useState } from 'react';
import { AlertTriangle, Bell, Settings, Plus, Eye, EyeOff, Edit, Trash2, Mail, Clock } from 'lucide-react';
import { alertConfigs, securityEvents } from '../../data/mockData';
import { User } from '../../types';

interface AlertsMonitoringProps {
  currentUser: User;
}

export const AlertsMonitoring: React.FC<AlertsMonitoringProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'events' | 'config'>('alerts');
  const [showCreateAlert, setShowCreateAlert] = useState(false);

  const canConfigureAlerts = currentUser.permissions.includes('configure_alerts');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-amber-100 text-amber-800';
      case 'resolved': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Alerts & Monitoring</h2>
          <p className="text-slate-600">Monitor system performance and configure alert notifications</p>
        </div>
        {canConfigureAlerts && (
          <button
            onClick={() => setShowCreateAlert(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Alert</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Active Alerts</p>
          <p className="text-2xl font-bold text-slate-900">3</p>
          <p className="text-sm text-red-600 mt-1">2 high priority</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Configured Alerts</p>
          <p className="text-2xl font-bold text-slate-900">{alertConfigs.length}</p>
          <p className="text-sm text-emerald-600 mt-1">{alertConfigs.filter(a => a.enabled).length} enabled</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Security Events</p>
          <p className="text-2xl font-bold text-slate-900">{securityEvents.length}</p>
          <p className="text-sm text-amber-600 mt-1">{securityEvents.filter(e => e.status === 'open').length} open</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Response Time</p>
          <p className="text-2xl font-bold text-slate-900">4.2m</p>
          <p className="text-sm text-emerald-600 mt-1">Average resolution</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle },
              { id: 'events', label: 'Security Events', icon: Bell },
              ...(canConfigureAlerts ? [{ id: 'config', label: 'Configuration', icon: Settings }] : [])
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
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-red-900">High CPU Utilization</h4>
                      <p className="text-sm text-red-700 mt-1">prod-web-01 CPU usage has exceeded 85% for 20 minutes</p>
                      <p className="text-xs text-red-600 mt-2">Triggered 15 minutes ago</p>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    High
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-amber-900">Budget Threshold Approaching</h4>
                      <p className="text-sm text-amber-700 mt-1">Monthly spend has reached 85% of allocated budget</p>
                      <p className="text-xs text-amber-600 mt-2">Triggered 2 hours ago</p>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                    Medium
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900">Backup Job Failed</h4>
                      <p className="text-sm text-blue-700 mt-1">Automated backup for prod-api-01 failed to complete</p>
                      <p className="text-xs text-blue-600 mt-2">Triggered 6 hours ago</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    Low
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.severity === 'critical' ? 'bg-red-500' :
                        event.severity === 'high' ? 'bg-orange-500' :
                        event.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium text-slate-900">{event.description}</h4>
                        <p className="text-sm text-slate-600 mt-1">Resource: {event.resource}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  {event.assignedTo && (
                    <p className="text-sm text-slate-600">Assigned to: {event.assignedTo}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'config' && canConfigureAlerts && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Alert Configuration</h3>
                <button
                  onClick={() => setShowCreateAlert(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Alert Rule
                </button>
              </div>

              <div className="space-y-4">
                {alertConfigs.map((alert) => (
                  <div key={alert.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <button className={`p-1 rounded ${alert.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {alert.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <div>
                          <h4 className="font-medium text-slate-900">{alert.name}</h4>
                          <p className="text-sm text-slate-600">
                            {alert.type} alert • Threshold: {alert.threshold}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{alert.recipients.length} recipients</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Settings className="h-4 w-4" />
                        <span>{alert.conditions.length} conditions</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Create Alert Rule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alert Name</label>
                <input
                  type="text"
                  placeholder="Enter alert name"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alert Type</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="cost">Cost</option>
                  <option value="performance">Performance</option>
                  <option value="resource">Resource</option>
                  <option value="security">Security</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Threshold</label>
                <input
                  type="number"
                  placeholder="Enter threshold value"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recipients</label>
                <input
                  type="text"
                  placeholder="Enter email addresses (comma separated)"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateAlert(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateAlert(false);
                  alert('Alert rule created successfully!');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};