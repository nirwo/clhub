import React, { useState } from 'react';
import { BarChart3, TrendingUp, Zap, Target, ArrowRight } from 'lucide-react';

export const ResourcePlanning: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'capacity' | 'forecasting' | 'rightsizing'>('capacity');

  const capacityData = [
    { resource: 'CPU', current: 65, recommended: 80, unit: '%' },
    { resource: 'Memory', current: 78, recommended: 85, unit: '%' },
    { resource: 'Storage', current: 45, recommended: 70, unit: '%' },
    { resource: 'Network', current: 32, recommended: 60, unit: '%' }
  ];

  const forecastData = [
    { month: 'Jan', vmware: 2800, azure: 3200 },
    { month: 'Feb', vmware: 2950, azure: 3350 },
    { month: 'Mar', vmware: 3100, azure: 3580 },
    { month: 'Apr', vmware: 3200, azure: 3720 },
    { month: 'May', vmware: 3350, azure: 3890 },
    { month: 'Jun', vmware: 3500, azure: 4050 }
  ];

  const rightsizingRecommendations = [
    {
      vm: 'prod-web-01',
      current: '4 vCPU, 16GB RAM',
      recommended: '2 vCPU, 8GB RAM',
      utilization: '25%',
      savings: '$95/mo'
    },
    {
      vm: 'analytics-01',
      current: 'Standard_E8s_v3',
      recommended: 'Standard_E4s_v3',
      utilization: '42%',
      savings: '$256/mo'
    },
    {
      vm: 'dev-test-01',
      current: '2 vCPU, 8GB RAM',
      recommended: '1 vCPU, 4GB RAM',
      utilization: '18%',
      savings: '$45/mo'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Resource Planning & Optimization</h2>
        <p className="text-slate-600">Plan capacity, forecast growth, and optimize resource allocation</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'capacity', label: 'Capacity Planning', icon: BarChart3 },
              { id: 'forecasting', label: 'Growth Forecasting', icon: TrendingUp },
              { id: 'rightsizing', label: 'Right-sizing', icon: Target }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    selectedTab === tab.id
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
          {selectedTab === 'capacity' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Current Capacity Utilization</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Generate Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {capacityData.map((item) => (
                  <div key={item.resource} className="bg-slate-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-900">{item.resource} Utilization</h4>
                      <span className="text-2xl font-bold text-slate-900">{item.current}{item.unit}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Current</span>
                        <span className="text-slate-600">Target: {item.recommended}{item.unit}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            item.current > item.recommended ? 'bg-red-500' : 
                            item.current > item.recommended * 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(item.current, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className={`text-sm font-medium ${
                        item.current > item.recommended ? 'text-red-600' : 
                        item.current > item.recommended * 0.8 ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {item.current > item.recommended ? 'Over capacity' : 
                         item.current > item.recommended * 0.8 ? 'Near capacity' : 'Healthy'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Capacity Recommendations</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Consider adding 2 more CPU cores to VMware cluster</li>
                      <li>• Memory utilization is approaching threshold - plan for upgrade</li>
                      <li>• Storage capacity is healthy with room for growth</li>
                      <li>• Network bandwidth has significant capacity for expansion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'forecasting' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">6-Month Growth Forecast</h3>
                <div className="flex items-center space-x-2">
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

              <div className="h-80 bg-slate-50 rounded-lg p-6 flex items-end space-x-4">
                {forecastData.map((data, index) => {
                  const maxValue = Math.max(...forecastData.map(d => d.vmware + d.azure));
                  const totalHeight = (data.vmware + data.azure) / maxValue * 100;
                  const vmwareHeight = (data.vmware / (data.vmware + data.azure)) * totalHeight;
                  const azureHeight = (data.azure / (data.vmware + data.azure)) * totalHeight;
                  
                  return (
                    <div key={data.month} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col justify-end" style={{ height: '240px' }}>
                        <div 
                          className="w-full bg-blue-500 rounded-t-sm"
                          style={{ height: `${vmwareHeight}%` }}
                        ></div>
                        <div 
                          className="w-full bg-emerald-500"
                          style={{ height: `${azureHeight}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{data.month}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-2">Projected Growth</h4>
                  <p className="text-2xl font-bold text-slate-900 mb-1">23%</p>
                  <p className="text-sm text-slate-600">Total infrastructure cost increase</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-2">Resource Demand</h4>
                  <p className="text-2xl font-bold text-slate-900 mb-1">+45 VMs</p>
                  <p className="text-sm text-slate-600">Additional capacity needed</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-medium text-slate-900 mb-2">Budget Impact</h4>
                  <p className="text-2xl font-bold text-slate-900 mb-1">$1,850</p>
                  <p className="text-sm text-slate-600">Additional monthly cost</p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'rightsizing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Right-sizing Recommendations</h3>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Apply All
                </button>
              </div>

              <div className="space-y-4">
                {rightsizingRecommendations.map((rec, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-900">{rec.vm}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                          {rec.utilization} avg usage
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full">
                          {rec.savings} savings
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 mb-1">Current Configuration</p>
                        <p className="font-medium text-slate-900">{rec.current}</p>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                      
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 mb-1">Recommended Configuration</p>
                        <p className="font-medium text-emerald-600">{rec.recommended}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-slate-600">
                        This change will reduce resource allocation while maintaining performance
                      </p>
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Apply Recommendation
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-emerald-900 mb-2">Right-sizing Impact</h4>
                    <p className="text-sm text-emerald-800 mb-3">
                      Implementing all recommendations could save <strong>$396/month</strong> while improving resource efficiency.
                    </p>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Schedule Implementation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};