import React, { useState } from 'react';
import { VMCard } from './VMCard';
import { Plus, Filter, Search, RefreshCw } from 'lucide-react';
import { vmwareVMs, azureVMs } from '../../data/mockData';

export const InfrastructureManagement: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'vmware' | 'azure'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  const handleVMAction = (action: string, vmId: string) => {
    // In a real application, this would make API calls
    console.log(`Action ${action} triggered for VM ${vmId}`);
    alert(`${action.charAt(0).toUpperCase() + action.slice(1)} action triggered for VM ${vmId}`);
  };

  const filteredVMware = vmwareVMs.filter(vm => 
    vm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAzure = azureVMs.filter(vm => 
    vm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showVMware = filter === 'all' || filter === 'vmware';
  const showAzure = filter === 'all' || filter === 'azure';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Infrastructure Management</h2>
          <p className="text-slate-600">Manage virtual machines across VMware vCenter and Microsoft Azure</p>
        </div>
        <button
          onClick={() => setShowProvisionModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Provision VM</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search virtual machines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'vmware' | 'azure')}
              className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Platforms</option>
              <option value="vmware">VMware Only</option>
              <option value="azure">Azure Only</option>
            </select>
          </div>
          
          <button className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {showVMware && (
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
            <span>VMware vCenter</span>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
              {filteredVMware.length} VMs
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVMware.map((vm) => (
              <VMCard
                key={vm.id}
                vm={vm}
                platform="vmware"
                onAction={handleVMAction}
              />
            ))}
          </div>
        </div>
      )}

      {showAzure && (
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center space-x-2">
            <span>Microsoft Azure</span>
            <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-2 py-1 rounded-full">
              {filteredAzure.length} VMs
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAzure.map((vm) => (
              <VMCard
                key={vm.id}
                vm={vm}
                platform="azure"
                onAction={handleVMAction}
              />
            ))}
          </div>
        </div>
      )}

      {showProvisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Provision New VM</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>VMware vCenter</option>
                  <option>Microsoft Azure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">VM Name</label>
                <input
                  type="text"
                  placeholder="Enter VM name"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Ubuntu 22.04 LTS</option>
                  <option>Windows Server 2022</option>
                  <option>CentOS Stream 9</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowProvisionModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowProvisionModal(false);
                  alert('VM provisioning started! Check the dashboard for progress.');
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
              >
                Provision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};