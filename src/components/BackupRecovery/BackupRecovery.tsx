import React, { useState } from 'react';
import { Shield, Clock, HardDrive, CheckCircle, XCircle, Play, RotateCcw, Plus } from 'lucide-react';
import { backupJobs } from '../../data/mockData';
import { User } from '../../types';

interface BackupRecoveryProps {
  currentUser: User;
}

export const BackupRecovery: React.FC<BackupRecoveryProps> = ({ currentUser }) => {
  const [showCreateBackup, setShowCreateBackup] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const canManageBackups = currentUser.permissions.includes('manage_backups');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running': return <Play className="h-5 w-5 text-blue-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-amber-600" />;
      default: return <Clock className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-emerald-100 text-emerald-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const successfulBackups = backupJobs.filter(job => job.status === 'success').length;
  const failedBackups = backupJobs.filter(job => job.status === 'failed').length;
  const totalSize = backupJobs.reduce((sum, job) => sum + job.size, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Backup & Recovery</h2>
          <p className="text-slate-600">Manage automated backups and disaster recovery for your infrastructure</p>
        </div>
        {canManageBackups && (
          <button
            onClick={() => setShowCreateBackup(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Backup Job</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Successful Backups</p>
          <p className="text-2xl font-bold text-slate-900">{successfulBackups}</p>
          <p className="text-sm text-emerald-600 mt-1">Last 24 hours</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Failed Backups</p>
          <p className="text-2xl font-bold text-slate-900">{failedBackups}</p>
          <p className="text-sm text-red-600 mt-1">Requires attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <HardDrive className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Total Backup Size</p>
          <p className="text-2xl font-bold text-slate-900">{totalSize.toFixed(1)} GB</p>
          <p className="text-sm text-slate-600 mt-1">Across all jobs</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Recovery Point</p>
          <p className="text-2xl font-bold text-slate-900">4h</p>
          <p className="text-sm text-slate-600 mt-1">Average RPO</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">Backup Jobs</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Job Name</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Virtual Machine</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Platform</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Schedule</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Last Run</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Size</th>
                {canManageBackups && (
                  <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {backupJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-slate-500" />
                      <span className="font-medium text-slate-900">{job.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-900">{job.vmName}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.platform === 'vmware' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {job.platform === 'vmware' ? 'VMware' : 'Azure'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-900">{job.schedule}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-900">
                        {new Date(job.lastRun).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-slate-900">{job.size.toFixed(1)} GB</span>
                  </td>
                  {canManageBackups && (
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => alert(`Running backup job: ${job.name}`)}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Run Now"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert(`Restoring from backup: ${job.name}`)}
                          className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recovery Point Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Recovery Metrics</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Recovery Point Objective (RPO)</p>
                <p className="text-sm text-slate-600">Maximum acceptable data loss</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">4h</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Recovery Time Objective (RTO)</p>
                <p className="text-sm text-slate-600">Maximum acceptable downtime</p>
              </div>
              <span className="text-2xl font-bold text-emerald-600">2h</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Backup Success Rate</p>
                <p className="text-sm text-slate-600">Last 30 days</p>
              </div>
              <span className="text-2xl font-bold text-emerald-600">98.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Disaster Recovery Plan</h3>
          
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">Critical Systems</h4>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  Priority 1
                </span>
              </div>
              <p className="text-sm text-slate-600">Production database and web servers</p>
              <p className="text-xs text-slate-500 mt-1">RTO: 1 hour | RPO: 15 minutes</p>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">Business Applications</h4>
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                  Priority 2
                </span>
              </div>
              <p className="text-sm text-slate-600">API services and analytics platforms</p>
              <p className="text-xs text-slate-500 mt-1">RTO: 4 hours | RPO: 1 hour</p>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-slate-900">Development Environment</h4>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  Priority 3
                </span>
              </div>
              <p className="text-sm text-slate-600">Testing and development systems</p>
              <p className="text-xs text-slate-500 mt-1">RTO: 24 hours | RPO: 4 hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Backup Job Modal */}
      {showCreateBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Create Backup Job</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Name</label>
                <input
                  type="text"
                  placeholder="Enter backup job name"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Virtual Machine</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>prod-web-01 (VMware)</option>
                  <option>prod-db-01 (VMware)</option>
                  <option>prod-api-01 (Azure)</option>
                  <option>analytics-01 (Azure)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Daily at 2:00 AM</option>
                  <option>Daily at 1:00 AM</option>
                  <option>Daily at 3:00 AM</option>
                  <option>Weekly on Sunday</option>
                  <option>Custom schedule</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Retention Period</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateBackup(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateBackup(false);
                  alert('Backup job created successfully!');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};