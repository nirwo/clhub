import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator, AlertTriangle } from 'lucide-react';
import { costData, recommendations } from '../../data/mockData';

export const CostManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [showCalculator, setShowCalculator] = useState(false);

  const totalCost = costData.reduce((sum, data) => sum + data.total, 0);
  const vmwareCost = costData.reduce((sum, data) => sum + data.vmware, 0);
  const azureCost = costData.reduce((sum, data) => sum + data.azure, 0);

  const potentialSavings = recommendations.reduce((sum, rec) => sum + rec.estimatedSavings, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Cost Management & Optimization</h2>
          <p className="text-slate-600">Monitor costs and optimize spending across your hybrid cloud infrastructure</p>
        </div>
        <button
          onClick={() => setShowCalculator(true)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Calculator className="h-5 w-5" />
          <span>Cost Calculator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Total Cost (7 days)</p>
          <p className="text-2xl font-bold text-slate-900">${totalCost.toLocaleString()}</p>
          <p className="text-sm text-emerald-600 mt-1">+2.3% from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">VMware Costs</p>
          <p className="text-2xl font-bold text-slate-900">${vmwareCost.toLocaleString()}</p>
          <p className="text-sm text-red-600 mt-1">-1.2% from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Azure Costs</p>
          <p className="text-2xl font-bold text-slate-900">${azureCost.toLocaleString()}</p>
          <p className="text-sm text-emerald-600 mt-1">+5.8% from last week</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Potential Savings</p>
          <p className="text-2xl font-bold text-slate-900">${potentialSavings.toFixed(0)}</p>
          <p className="text-sm text-amber-600 mt-1">Monthly optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Cost Breakdown</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d')}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-medium text-slate-900">VMware vCenter</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">${vmwareCost.toLocaleString()}</p>
                <p className="text-sm text-slate-600">{((vmwareCost / totalCost) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span className="font-medium text-slate-900">Microsoft Azure</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">${azureCost.toLocaleString()}</p>
                <p className="text-sm text-slate-600">{((azureCost / totalCost) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex h-4 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${(vmwareCost / totalCost) * 100}%` }}
                ></div>
                <div 
                  className="bg-emerald-500" 
                  style={{ width: `${(azureCost / totalCost) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Cost Optimization Recommendations</h3>
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-500' : 
                      rec.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      rec.type === 'resize' ? 'bg-blue-100 text-blue-800' :
                      rec.type === 'migrate' ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {rec.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-600">${rec.estimatedSavings.toFixed(0)}/mo</span>
                </div>
                <p className="font-medium text-slate-900 mb-1">{rec.resource}</p>
                <p className="text-sm text-slate-600 mb-2">{rec.recommendedConfig}</p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  Apply Recommendation →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCalculator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Cloud Cost Calculator</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-4">VMware Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPU Cores</label>
                    <input type="number" defaultValue="4" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Memory (GB)</label>
                    <input type="number" defaultValue="16" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Storage (GB)</label>
                    <input type="number" defaultValue="100" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Estimated Monthly Cost</p>
                  <p className="text-xl font-bold text-blue-900">$185.50</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-4">Azure Configuration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">VM Size</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                      <option>Standard_D4s_v3</option>
                      <option>Standard_D8s_v3</option>
                      <option>Standard_E4s_v3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                      <option>East US</option>
                      <option>West US 2</option>
                      <option>Central US</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Operating System</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2">
                      <option>Linux</option>
                      <option>Windows</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-medium text-emerald-900">Estimated Monthly Cost</p>
                  <p className="text-xl font-bold text-emerald-900">$245.60</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-amber-900 mb-2">Cost Comparison</p>
              <p className="text-lg font-bold text-amber-900">VMware is $60.10 cheaper per month</p>
              <p className="text-sm text-amber-700">Consider workload requirements and migration costs</p>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCalculator(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                Save Calculation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};