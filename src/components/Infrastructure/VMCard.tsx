import React from 'react';
import { Server, HardDrive, Cpu, MemoryStick, Power, Square } from 'lucide-react';
import { VMwareVM, AzureVM } from '../../types';

interface VMCardProps {
  vm: VMwareVM | AzureVM;
  platform: 'vmware' | 'azure';
  onAction: (action: string, vmId: string) => void;
}

export const VMCard: React.FC<VMCardProps> = ({ vm, platform, onAction }) => {
  const isVMware = platform === 'vmware';
  const vmwareVM = vm as VMwareVM;
  const azureVM = vm as AzureVM;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-emerald-100 text-emerald-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-amber-100 text-amber-800';
      case 'deallocated': return 'bg-slate-100 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getActionButtons = () => {
    const isRunning = vm.status === 'running';
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => onAction(isRunning ? 'stop' : 'start', vm.id)}
          className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            isRunning 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
          }`}
        >
          {isRunning ? <Square className="h-3 w-3" /> : <Power className="h-3 w-3" />}
          <span>{isRunning ? 'Stop' : 'Start'}</span>
        </button>
        <button
          onClick={() => onAction('restart', vm.id)}
          className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium transition-colors"
        >
          Restart
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isVMware ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
          }`}>
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{vm.name}</h3>
            <p className="text-sm text-slate-600">
              {isVMware ? vmwareVM.datacenter : azureVM.resourceGroup}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vm.status)}`}>
          {vm.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600">CPU</span>
          </div>
          <span className="font-medium text-slate-900">
            {isVMware ? `${vmwareVM.cpu} vCPU` : azureVM.size}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <MemoryStick className="h-4 w-4 text-slate-500" />
            <span className="text-slate-600">Memory</span>
          </div>
          <span className="font-medium text-slate-900">
            {isVMware ? `${vmwareVM.memory} GB` : azureVM.size}
          </span>
        </div>

        {isVMware && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">Storage</span>
            </div>
            <span className="font-medium text-slate-900">{vmwareVM.storage} GB</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">IP Address</span>
          <span className="font-medium text-slate-900">
            {isVMware ? vmwareVM.ipAddress : (azureVM.publicIP || azureVM.privateIP)}
          </span>
        </div>

        {!isVMware && azureVM.cost > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Monthly Cost</span>
            <span className="font-medium text-emerald-600">${azureVM.cost.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {getActionButtons()}
        <button
          onClick={() => onAction('details', vm.id)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};