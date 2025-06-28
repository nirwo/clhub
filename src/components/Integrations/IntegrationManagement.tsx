import React, { useState, useEffect } from 'react';
import { Plus, Settings, TestTube, RefreshCw, AlertCircle, CheckCircle, XCircle, Database, Cloud, Trash2, Edit } from 'lucide-react';
import { VMwareConfig, AzureConfig, IntegrationHealth, SyncJob } from '../../types';
import { integrationManager } from '../../services/integrationManager';

export const IntegrationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vmware' | 'azure' | 'health' | 'sync'>('vmware');
  const [vmwareConfigs, setVMwareConfigs] = useState<VMwareConfig[]>([]);
  const [azureConfigs, setAzureConfigs] = useState<AzureConfig[]>([]);
  const [healthStatus, setHealthStatus] = useState<IntegrationHealth[]>([]);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [showVMwareModal, setShowVMwareModal] = useState(false);
  const [showAzureModal, setShowAzureModal] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadHealthData, 30000); // Check health every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    // Load configurations from localStorage or API
    const savedVMware = localStorage.getItem('vmware-configs');
    const savedAzure = localStorage.getItem('azure-configs');
    
    if (savedVMware) {
      setVMwareConfigs(JSON.parse(savedVMware));
    }
    if (savedAzure) {
      setAzureConfigs(JSON.parse(savedAzure));
    }
    
    await loadHealthData();
    loadSyncJobs();
  };

  const loadHealthData = async () => {
    try {
      const health = await integrationManager.checkAllHealth();
      setHealthStatus(health);
    } catch (error) {
      console.error('Failed to load health data:', error);
    }
  };

  const loadSyncJobs = () => {
    const jobs = integrationManager.getAllSyncJobs();
    setSyncJobs(jobs);
  };

  const handleTestVMwareConnection = async (config: VMwareConfig) => {
    setTestingConnection(config.id);
    try {
      const result = await integrationManager.testVMwareConnection(config);
      alert(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    } catch (error) {
      alert(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingConnection(null);
    }
  };

  const handleTestAzureConnection = async (config: AzureConfig) => {
    setTestingConnection(config.id);
    try {
      const result = await integrationManager.testAzureConnection(config);
      alert(result.success ? `✅ ${result.message}` : `❌ ${result.message}`);
    } catch (error) {
      alert(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingConnection(null);
    }
  };

  const handleSyncData = async (platform: 'vmware' | 'azure', configId: string) => {
    try {
      let job: SyncJob;
      if (platform === 'vmware') {
        job = await integrationManager.syncVMwareData(configId);
      } else {
        job = await integrationManager.syncAzureData(configId);
      }
      
      setSyncJobs(prev => [job, ...prev]);
      alert('Data synchronization started successfully!');
    } catch (error) {
      alert(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSyncAll = async () => {
    try {
      const jobs = await integrationManager.syncAllData();
      setSyncJobs(prev => [...jobs, ...prev]);
      alert(`Started ${jobs.length} synchronization jobs!`);
    } catch (error) {
      alert(`Sync all failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'error':
      case 'critical':
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'healthy':
        return 'bg-emerald-100 text-emerald-800';
      case 'warning':
        return 'bg-amber-100 text-amber-800';
      case 'error':
      case 'critical':
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Integration Management</h2>
          <p className="text-slate-600">Configure and manage connections to VMware vCenter and Microsoft Azure</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSyncAll}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sync All</span>
          </button>
          <button
            onClick={() => activeTab === 'vmware' ? setShowVMwareModal(true) : setShowAzureModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Integration</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'vmware', label: 'VMware vCenter', icon: Database },
              { id: 'azure', label: 'Microsoft Azure', icon: Cloud },
              { id: 'health', label: 'Health Status', icon: CheckCircle },
              { id: 'sync', label: 'Sync Jobs', icon: RefreshCw }
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
          {activeTab === 'vmware' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">VMware vCenter Configurations</h3>
                <button
                  onClick={() => setShowVMwareModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add vCenter
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vmwareConfigs.map((config) => (
                  <div key={config.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Database className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-slate-900">{config.name}</h4>
                          <p className="text-sm text-slate-600">{config.host}:{config.port}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(config.connectionStatus)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(config.connectionStatus)}`}>
                          {config.connectionStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Datacenter:</span>
                        <span className="text-slate-900">{config.datacenter || 'All'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">SSL:</span>
                        <span className="text-slate-900">{config.useSSL ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Last Sync:</span>
                        <span className="text-slate-900">{new Date(config.lastSync).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestVMwareConnection(config)}
                        disabled={testingConnection === config.id}
                        className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                      >
                        <TestTube className="h-3 w-3" />
                        <span>{testingConnection === config.id ? 'Testing...' : 'Test'}</span>
                      </button>
                      <button
                        onClick={() => handleSyncData('vmware', config.id)}
                        className="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Sync</span>
                      </button>
                      <button className="p-1 text-slate-600 hover:text-slate-700 transition-colors">
                        <Edit className="h-3 w-3" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'azure' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Microsoft Azure Configurations</h3>
                <button
                  onClick={() => setShowAzureModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Azure
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {azureConfigs.map((config) => (
                  <div key={config.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Cloud className="h-8 w-8 text-emerald-600" />
                        <div>
                          <h4 className="font-semibold text-slate-900">{config.name}</h4>
                          <p className="text-sm text-slate-600">{config.subscriptionName || config.subscriptionId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(config.connectionStatus)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(config.connectionStatus)}`}>
                          {config.connectionStatus}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tenant ID:</span>
                        <span className="text-slate-900 font-mono text-xs">{config.tenantId.substring(0, 8)}...</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Resource Groups:</span>
                        <span className="text-slate-900">{config.resourceGroups.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Last Sync:</span>
                        <span className="text-slate-900">{new Date(config.lastSync).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTestAzureConnection(config)}
                        disabled={testingConnection === config.id}
                        className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                      >
                        <TestTube className="h-3 w-3" />
                        <span>{testingConnection === config.id ? 'Testing...' : 'Test'}</span>
                      </button>
                      <button
                        onClick={() => handleSyncData('azure', config.id)}
                        className="flex items-center space-x-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1 rounded text-sm transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Sync</span>
                      </button>
                      <button className="p-1 text-slate-600 hover:text-slate-700 transition-colors">
                        <Edit className="h-3 w-3" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Integration Health Status</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {healthStatus.map((health) => (
                  <div key={health.configId} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {health.platform === 'vmware' ? 
                          <Database className="h-6 w-6 text-blue-600" /> : 
                          <Cloud className="h-6 w-6 text-emerald-600" />
                        }
                        <div>
                          <h4 className="font-semibold text-slate-900 capitalize">{health.platform} Integration</h4>
                          <p className="text-sm text-slate-600">Config ID: {health.configId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(health.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(health.status)}`}>
                          {health.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-900">Response Time</p>
                        <p className="text-lg font-bold text-slate-900">{health.responseTime}ms</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-900">Success Rate</p>
                        <p className="text-lg font-bold text-slate-900">{health.details.successRate.toFixed(1)}%</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-900">API Calls</p>
                        <p className="text-lg font-bold text-slate-900">{health.details.apiCalls}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-900">Error Count</p>
                        <p className="text-lg font-bold text-slate-900">{health.errorCount}</p>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      Last checked: {new Date(health.lastCheck).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-900">Synchronization Jobs</h3>
              
              <div className="space-y-4">
                {syncJobs.map((job) => (
                  <div key={job.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {job.platform === 'vmware' ? 
                          <Database className="h-5 w-5 text-blue-600" /> : 
                          <Cloud className="h-5 w-5 text-emerald-600" />
                        }
                        <div>
                          <h4 className="font-medium text-slate-900 capitalize">{job.platform} Sync</h4>
                          <p className="text-sm text-slate-600">{job.type} synchronization</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Started:</span>
                        <p className="font-medium">{new Date(job.startTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Duration:</span>
                        <p className="font-medium">{job.duration ? `${job.duration}ms` : 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Records:</span>
                        <p className="font-medium">{job.recordsProcessed}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Progress:</span>
                        <p className="font-medium">{job.progress}%</p>
                      </div>
                    </div>

                    {job.errors.length > 0 && (
                      <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-sm font-medium text-red-900">Errors:</p>
                        <ul className="text-sm text-red-700 mt-1">
                          {job.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VMware Configuration Modal */}
      {showVMwareModal && (
        <VMwareConfigModal
          onClose={() => setShowVMwareModal(false)}
          onSave={(config) => {
            setVMwareConfigs(prev => [...prev, config]);
            localStorage.setItem('vmware-configs', JSON.stringify([...vmwareConfigs, config]));
            setShowVMwareModal(false);
          }}
        />
      )}

      {/* Azure Configuration Modal */}
      {showAzureModal && (
        <AzureConfigModal
          onClose={() => setShowAzureModal(false)}
          onSave={(config) => {
            setAzureConfigs(prev => [...prev, config]);
            localStorage.setItem('azure-configs', JSON.stringify([...azureConfigs, config]));
            setShowAzureModal(false);
          }}
        />
      )}
    </div>
  );
};

// VMware Configuration Modal Component
const VMwareConfigModal: React.FC<{
  onClose: () => void;
  onSave: (config: VMwareConfig) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 443,
    username: '',
    password: '',
    useSSL: true,
    skipCertificateValidation: false,
    datacenter: '',
    cluster: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const config: VMwareConfig = {
      id: `vmware-${Date.now()}`,
      ...formData,
      connectionStatus: 'disconnected',
      lastSync: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(config);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Add VMware vCenter</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Configuration Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Production vCenter"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">vCenter Host</label>
            <input
              type="text"
              required
              value={formData.host}
              onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
              placeholder="vcenter.company.com"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Port</label>
            <input
              type="number"
              required
              value={formData.port}
              onChange={(e) => setFormData(prev => ({ ...prev, port: parseInt(e.target.value) }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="administrator@vsphere.local"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Datacenter (Optional)</label>
            <input
              type="text"
              value={formData.datacenter}
              onChange={(e) => setFormData(prev => ({ ...prev, datacenter: e.target.value }))}
              placeholder="DC-Primary"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.useSSL}
                onChange={(e) => setFormData(prev => ({ ...prev, useSSL: e.target.checked }))}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Use SSL/TLS</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.skipCertificateValidation}
                onChange={(e) => setFormData(prev => ({ ...prev, skipCertificateValidation: e.target.checked }))}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">Skip Certificate Validation</span>
            </label>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Add Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Azure Configuration Modal Component
const AzureConfigModal: React.FC<{
  onClose: () => void;
  onSave: (config: AzureConfig) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    subscriptionId: '',
    tenantId: '',
    clientId: '',
    clientSecret: '',
    resourceGroups: [''],
    regions: ['eastus']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const config: AzureConfig = {
      id: `azure-${Date.now()}`,
      ...formData,
      resourceGroups: formData.resourceGroups.filter(rg => rg.trim() !== ''),
      connectionStatus: 'disconnected',
      lastSync: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(config);
  };

  const addResourceGroup = () => {
    setFormData(prev => ({ ...prev, resourceGroups: [...prev.resourceGroups, ''] }));
  };

  const updateResourceGroup = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      resourceGroups: prev.resourceGroups.map((rg, i) => i === index ? value : rg)
    }));
  };

  const removeResourceGroup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resourceGroups: prev.resourceGroups.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">Add Microsoft Azure</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Configuration Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Production Azure"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subscription ID</label>
            <input
              type="text"
              required
              value={formData.subscriptionId}
              onChange={(e) => setFormData(prev => ({ ...prev, subscriptionId: e.target.value }))}
              placeholder="12345678-1234-1234-1234-123456789012"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tenant ID</label>
            <input
              type="text"
              required
              value={formData.tenantId}
              onChange={(e) => setFormData(prev => ({ ...prev, tenantId: e.target.value }))}
              placeholder="87654321-4321-4321-4321-210987654321"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Client ID</label>
            <input
              type="text"
              required
              value={formData.clientId}
              onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
              placeholder="11111111-1111-1111-1111-111111111111"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Client Secret</label>
            <input
              type="password"
              required
              value={formData.clientSecret}
              onChange={(e) => setFormData(prev => ({ ...prev, clientSecret: e.target.value }))}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Resource Groups</label>
            {formData.resourceGroups.map((rg, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={rg}
                  onChange={(e) => updateResourceGroup(index, e.target.value)}
                  placeholder="resource-group-name"
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.resourceGroups.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResourceGroup(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addResourceGroup}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Resource Group
            </button>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Add Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};