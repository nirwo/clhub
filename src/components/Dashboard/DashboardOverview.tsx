import React from 'react';
import { MetricCard } from './MetricCard';
import { Server, DollarSign, AlertTriangle, TrendingUp, Cloud, Database } from 'lucide-react';
import { vmwareVMs, azureVMs, costData } from '../../data/mockData';

export const DashboardOverview: React.FC = () => {
  const totalVMs = vmwareVMs.length + azureVMs.length;
  const runningVMs = vmwareVMs.filter(vm => vm.status === 'running').length + 
                    azureVMs.filter(vm => vm.status === 'running').length;
  const totalCost = costData[costData.length - 1]?.total || 0;
  const previousCost = costData[costData.length - 2]?.total || 0;
  const costChange = totalCost - previousCost;
  const costChangePercent = previousCost ? ((costChange / previousCost) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h2>
        <p className="text-slate-600">Monitor your hybrid cloud infrastructure across VMware and Azure platforms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Virtual Machines"
          value={totalVMs}
          change={`${runningVMs} running`}
          changeType="positive"
          icon={Server}
          color="blue"
        />
        <MetricCard
          title="Monthly Cost"
          value={`$${totalCost.toLocaleString()}`}
          change={`${costChange >= 0 ? '+' : ''}${costChangePercent}% from yesterday`}
          changeType={costChange >= 0 ? 'negative' : 'positive'}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Active Alerts"
          value={3}
          change="2 high priority"
          changeType="negative"
          icon={AlertTriangle}
          color="amber"
        />
        <MetricCard
          title="Cost Optimization"
          value={`$${464.45}`}
          change="Potential monthly savings"
          changeType="positive"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Platform Distribution</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-600">VMware</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Azure</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-900">VMware vCenter</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{vmwareVMs.length} VMs</p>
                <p className="text-sm text-slate-600">
                  {vmwareVMs.filter(vm => vm.status === 'running').length} running
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Cloud className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-900">Microsoft Azure</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{azureVMs.length} VMs</p>
                <p className="text-sm text-slate-600">
                  {azureVMs.filter(vm => vm.status === 'running').length} running
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Cost Trend (Last 7 Days)</h3>
          <div className="h-48 flex items-end space-x-2">
            {costData.map((data, index) => {
              const maxCost = Math.max(...costData.map(d => d.total));
              const height = (data.total / maxCost) * 100;
              
              return (
                <div key={data.date} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-slate-200 rounded-t-md overflow-hidden" style={{ height: '160px' }}>
                    <div className="w-full flex flex-col justify-end h-full">
                      <div 
                        className="w-full bg-blue-500 rounded-t-md"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">VM provisioned successfully</p>
              <p className="text-sm text-slate-600">prod-api-01 created in Azure East US region</p>
            </div>
            <span className="text-sm text-slate-500">2 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-lg">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Cost threshold exceeded</p>
              <p className="text-sm text-slate-600">Monthly budget limit reached 85% for Azure resources</p>
            </div>
            <span className="text-sm text-slate-500">4 hours ago</span>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">Backup completed</p>
              <p className="text-sm text-slate-600">Automated backup for prod-db-01 finished successfully</p>
            </div>
            <span className="text-sm text-slate-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};