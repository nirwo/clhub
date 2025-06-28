import React, { useState } from 'react';
import { ArrowRight, Cloud, Database, Clock, DollarSign, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { migrationPlans, vmwareVMs, azureVMs } from '../../data/mockData';
import { User } from '../../types';

interface MigrationPlanningProps {
  currentUser: User;
}

export const MigrationPlanning: React.FC<MigrationPlanningProps> = ({ currentUser }) => {
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const canApproveMigrations = currentUser.permissions.includes('approve_migrations');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-amber-100 text-amber-800';
      case 'draft': return 'bg-slate-100 text-slate-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'vmware' ? <Database className="h-4 w-4" /> : <Cloud className="h-4 w-4" />;
  };

  const totalMigrations = migrationPlans.length;
  const completedMigrations = migrationPlans.filter(p => p.status === 'completed').length;
  const inProgressMigrations = migrationPlans.filter(p => p.status === 'in-progress').length;
  const totalCost = migrationPlans.reduce((sum, plan) => sum + plan.estimatedCost, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Migration Planning</h2>
          <p className="text-slate-600">Plan and execute workload migrations between platforms</p>
        </div>
        <button
          onClick={() => setShowCreatePlan(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Create Migration Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Total Migrations</p>
          <p className="text-2xl font-bold text-slate-900">{totalMigrations}</p>
          <p className="text-sm text-slate-600 mt-1">All time</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-slate-900">{completedMigrations}</p>
          <p className="text-sm text-emerald-600 mt-1">Successfully migrated</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-slate-900">{inProgressMigrations}</p>
          <p className="text-sm text-amber-600 mt-1">Currently migrating</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Total Cost</p>
          <p className="text-2xl font-bold text-slate-900">${totalCost.toLocaleString()}</p>
          <p className="text-sm text-slate-600 mt-1">Estimated</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">Migration Plans</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {migrationPlans.map((plan) => (
            <div key={plan.id} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{plan.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Created: {new Date(plan.createdDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>By: {plan.createdBy}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                  {plan.status.replace('-', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    plan.sourcePlatform === 'vmware' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {getPlatformIcon(plan.sourcePlatform)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Source</p>
                    <p className="text-sm text-slate-600 capitalize">{plan.sourcePlatform}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-slate-400" />
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    plan.targetPlatform === 'vmware' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {getPlatformIcon(plan.targetPlatform)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Target</p>
                    <p className="text-sm text-slate-600 capitalize">{plan.targetPlatform}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-900">VMs to Migrate</p>
                  <p className="text-lg font-bold text-slate-900">{plan.sourceVMs.length}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-900">Estimated Duration</p>
                  <p className="text-lg font-bold text-slate-900">{plan.estimatedDuration}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-900">Estimated Cost</p>
                  <p className="text-lg font-bold text-slate-900">${plan.estimatedCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
                </div>
                
                {canApproveMigrations && plan.status === 'draft' && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => alert(`Migration plan "${plan.name}" approved!`)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Reject
                    </button>
                  </div>
                )}
                
                {plan.status === 'approved' && (
                  <button
                    onClick={() => alert(`Starting migration: ${plan.name}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Start Migration
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Migration Readiness Assessment</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">Network Connectivity</p>
                  <p className="text-sm text-emerald-700">All prerequisites met</p>
                </div>
              </div>
              <span className="text-emerald-600 font-medium">Ready</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">Security Compliance</p>
                  <p className="text-sm text-emerald-700">Policies validated</p>
                </div>
              </div>
              <span className="text-emerald-600 font-medium">Ready</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-900">Backup Verification</p>
                  <p className="text-sm text-amber-700">Some backups need validation</p>
                </div>
              </div>
              <span className="text-amber-600 font-medium">Review</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Migration Best Practices</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-slate-900">Pre-Migration</h4>
              <ul className="text-sm text-slate-600 mt-1 space-y-1">
                <li>• Complete backup verification</li>
                <li>• Test network connectivity</li>
                <li>• Validate security policies</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-emerald-500 pl-4">
              <h4 className="font-medium text-slate-900">During Migration</h4>
              <ul className="text-sm text-slate-600 mt-1 space-y-1">
                <li>• Monitor progress continuously</li>
                <li>• Maintain communication channels</li>
                <li>• Document any issues</li>
              </ul>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-slate-900">Post-Migration</h4>
              <ul className="text-sm text-slate-600 mt-1 space-y-1">
                <li>• Verify application functionality</li>
                <li>• Update monitoring systems</li>
                <li>• Conduct performance testing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Create Migration Plan Modal */}
      {showCreatePlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Create Migration Plan</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  placeholder="Enter migration plan name"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source Platform</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="vmware">VMware vCenter</option>
                    <option value="azure">Microsoft Azure</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Platform</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="azure">Microsoft Azure</option>
                    <option value="vmware">VMware vCenter</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Virtual Machines to Migrate</label>
                <div className="border border-slate-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                  {[...vmwareVMs, ...azureVMs].map((vm) => (
                    <label key={vm.id} className="flex items-center space-x-2 py-1">
                      <input type="checkbox" className="rounded border-slate-300" />
                      <span className="text-sm text-slate-900">{vm.name}</span>
                      <span className="text-xs text-slate-500">
                        ({'vmware' in vm ? 'VMware' : 'Azure'})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 2-3 days"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Cost ($)</label>
                  <input
                    type="number"
                    placeholder="Enter estimated cost"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Migration Notes</label>
                <textarea
                  rows={3}
                  placeholder="Add any special considerations or requirements"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreatePlan(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreatePlan(false);
                  alert('Migration plan created successfully!');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};