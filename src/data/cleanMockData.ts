import { 
  VMwareVM, 
  AzureVM, 
  CostData, 
  User, 
  AlertConfig, 
  ResourceRecommendation,
  BackupJob,
  MigrationPlan,
  PerformanceMetric,
  SecurityEvent
} from '../types';

// Clean initial data - minimal examples for demonstration
export const cleanVMwareVMs: VMwareVM[] = [];

export const cleanAzureVMs: AzureVM[] = [];

export const cleanCostData: CostData[] = [
  { 
    date: new Date().toISOString().split('T')[0], 
    vmware: 0, 
    azure: 0, 
    total: 0,
    breakdown: { compute: 0, storage: 0, network: 0, other: 0 }
  }
];

export const cleanUsers: User[] = [
  // Admin user will be added during setup
];

export const cleanAlertConfigs: AlertConfig[] = [
  {
    id: 'alert-default-001',
    name: 'Monthly Budget Alert',
    type: 'cost',
    threshold: 5000,
    enabled: true,
    recipients: [],
    severity: 'high',
    conditions: ['monthly_spend > threshold']
  }
];

export const cleanRecommendations: ResourceRecommendation[] = [];

export const cleanBackupJobs: BackupJob[] = [];

export const cleanMigrationPlans: MigrationPlan[] = [];

export const cleanPerformanceMetrics: PerformanceMetric[] = [];

export const cleanSecurityEvents: SecurityEvent[] = [];

// Function to reset all data to clean state
export const resetToCleanData = () => {
  // Clear all stored configurations
  localStorage.removeItem('vmware-configs');
  localStorage.removeItem('azure-configs');
  localStorage.removeItem('users');
  localStorage.removeItem('alert-configs');
  localStorage.removeItem('backup-jobs');
  localStorage.removeItem('migration-plans');
  
  // Set clean initial data
  localStorage.setItem('cost-data', JSON.stringify(cleanCostData));
  localStorage.setItem('recommendations', JSON.stringify(cleanRecommendations));
  localStorage.setItem('performance-metrics', JSON.stringify(cleanPerformanceMetrics));
  localStorage.setItem('security-events', JSON.stringify(cleanSecurityEvents));
};

// Function to populate with demo data (for testing/demo purposes)
export const populateDemoData = () => {
  const demoVMwareVMs: VMwareVM[] = [
    {
      id: 'demo-vm-001',
      name: 'demo-web-01',
      status: 'running',
      cpu: 2,
      memory: 8,
      storage: 50,
      host: 'demo-esxi-host.local',
      datacenter: 'Demo-DC',
      powerState: 'poweredOn',
      guestOS: 'Ubuntu 22.04 LTS',
      ipAddress: '192.168.1.100',
      tags: ['demo', 'web-server'],
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      owner: 'demo@company.com'
    }
  ];

  const demoAzureVMs: AzureVM[] = [
    {
      id: 'demo-azure-001',
      name: 'demo-api-01',
      status: 'running',
      size: 'Standard_B2s',
      location: 'East US',
      resourceGroup: 'demo-rg',
      subscription: 'Demo Subscription',
      os: 'Ubuntu 22.04',
      privateIP: '10.0.1.4',
      cost: 45.60,
      tags: ['demo', 'api'],
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      owner: 'demo@company.com'
    }
  ];

  const demoCostData: CostData[] = [
    { 
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      vmware: 120, 
      azure: 180, 
      total: 300,
      breakdown: { compute: 200, storage: 50, network: 30, other: 20 }
    },
    { 
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      vmware: 125, 
      azure: 175, 
      total: 300,
      breakdown: { compute: 205, storage: 45, network: 30, other: 20 }
    },
    { 
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      vmware: 115, 
      azure: 190, 
      total: 305,
      breakdown: { compute: 210, storage: 50, network: 25, other: 20 }
    },
    { 
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      vmware: 130, 
      azure: 170, 
      total: 300,
      breakdown: { compute: 195, storage: 55, network: 30, other: 20 }
    },
    { 
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      vmware: 120, 
      azure: 185, 
      total: 305,
      breakdown: { compute: 200, storage: 50, network: 35, other: 20 }
    },
    { 
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      vmware: 125, 
      azure: 180, 
      total: 305,
      breakdown: { compute: 205, storage: 50, network: 30, other: 20 }
    },
    { 
      date: new Date().toISOString().split('T')[0], 
      vmware: 135, 
      azure: 175, 
      total: 310,
      breakdown: { compute: 210, storage: 50, network: 30, other: 20 }
    }
  ];

  // Store demo data
  localStorage.setItem('vmware-vms', JSON.stringify(demoVMwareVMs));
  localStorage.setItem('azure-vms', JSON.stringify(demoAzureVMs));
  localStorage.setItem('cost-data', JSON.stringify(demoCostData));
};