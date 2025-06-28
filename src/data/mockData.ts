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
import { VMwareConfig, AzureConfig } from '../types/integrations';

// Function to get data from localStorage or return defaults
const getStoredData = <T>(key: string, defaultData: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultData;
};

// Default data (used as fallback)
const defaultVMwareVMs: VMwareVM[] = [
  {
    id: 'vm-001',
    name: 'prod-web-01',
    status: 'running',
    cpu: 4,
    memory: 16,
    storage: 100,
    host: 'esxi-host-01.company.com',
    datacenter: 'DC-Primary',
    powerState: 'poweredOn',
    guestOS: 'Ubuntu 22.04 LTS',
    ipAddress: '192.168.1.101',
    lastBackup: '2025-01-17T02:00:00Z',
    tags: ['production', 'web-server', 'critical'],
    createdDate: '2024-12-01T10:00:00Z',
    lastModified: '2025-01-15T14:30:00Z',
    owner: 'sarah.johnson@company.com'
  },
  {
    id: 'vm-002',
    name: 'prod-db-01',
    status: 'running',
    cpu: 8,
    memory: 32,
    storage: 500,
    host: 'esxi-host-02.company.com',
    datacenter: 'DC-Primary',
    powerState: 'poweredOn',
    guestOS: 'Windows Server 2022',
    ipAddress: '192.168.1.102',
    lastBackup: '2025-01-17T02:00:00Z',
    tags: ['production', 'database', 'critical'],
    createdDate: '2024-11-15T09:00:00Z',
    lastModified: '2025-01-16T11:20:00Z',
    owner: 'mike.chen@company.com'
  }
];

const defaultAzureVMs: AzureVM[] = [
  {
    id: 'azure-vm-001',
    name: 'prod-api-01',
    status: 'running',
    size: 'Standard_D4s_v3',
    location: 'East US',
    resourceGroup: 'prod-rg',
    subscription: 'Production',
    os: 'Ubuntu 22.04',
    publicIP: '40.121.45.123',
    privateIP: '10.0.1.4',
    cost: 245.60,
    tags: ['production', 'api', 'critical'],
    createdDate: '2024-11-20T14:00:00Z',
    lastModified: '2025-01-14T16:30:00Z',
    owner: 'sarah.johnson@company.com'
  }
];

const defaultCostData: CostData[] = [
  { 
    date: '2025-01-01', 
    vmware: 2800, 
    azure: 3200, 
    total: 6000,
    breakdown: { compute: 4200, storage: 800, network: 600, other: 400 }
  },
  { 
    date: '2025-01-02', 
    vmware: 2750, 
    azure: 3350, 
    total: 6100,
    breakdown: { compute: 4300, storage: 820, network: 580, other: 400 }
  },
  { 
    date: '2025-01-03', 
    vmware: 2900, 
    azure: 3100, 
    total: 6000,
    breakdown: { compute: 4150, storage: 850, network: 600, other: 400 }
  },
  { 
    date: '2025-01-04', 
    vmware: 2650, 
    azure: 3450, 
    total: 6100,
    breakdown: { compute: 4350, storage: 800, network: 550, other: 400 }
  },
  { 
    date: '2025-01-05', 
    vmware: 2800, 
    azure: 3300, 
    total: 6100,
    breakdown: { compute: 4250, storage: 830, network: 620, other: 400 }
  },
  { 
    date: '2025-01-06', 
    vmware: 2700, 
    azure: 3400, 
    total: 6100,
    breakdown: { compute: 4300, storage: 810, network: 590, other: 400 }
  },
  { 
    date: '2025-01-07', 
    vmware: 2850, 
    azure: 3250, 
    total: 6100,
    breakdown: { compute: 4200, storage: 840, network: 660, other: 400 }
  }
];

// Export data with localStorage fallback
export const vmwareVMs: VMwareVM[] = getStoredData('vmware-vms', defaultVMwareVMs);
export const azureVMs: AzureVM[] = getStoredData('azure-vms', defaultAzureVMs);
export const costData: CostData[] = getStoredData('cost-data', defaultCostData);

// Users are now managed through the setup process
export const users: User[] = getStoredData('users', []);

export const alertConfigs: AlertConfig[] = getStoredData('alert-configs', [
  {
    id: 'alert-001',
    name: 'Monthly Budget Threshold',
    type: 'cost',
    threshold: 8000,
    enabled: true,
    recipients: ['admin@company.com', 'finance@company.com'],
    severity: 'high',
    conditions: ['monthly_spend > threshold', 'trend_increasing']
  },
  {
    id: 'alert-002',
    name: 'High CPU Utilization',
    type: 'performance',
    threshold: 85,
    enabled: true,
    recipients: ['ops@company.com'],
    severity: 'medium',
    conditions: ['cpu_usage > threshold', 'duration > 15min']
  }
]);

export const recommendations: ResourceRecommendation[] = getStoredData('recommendations', [
  {
    id: 'rec-001',
    type: 'resize',
    resource: 'prod-api-01 (Azure)',
    currentConfig: 'Standard_D4s_v3 (4 vCPU, 16GB RAM)',
    recommendedConfig: 'Standard_D2s_v3 (2 vCPU, 8GB RAM)',
    estimatedSavings: 122.80,
    priority: 'high',
    impact: 'Low performance impact, 25% avg CPU utilization',
    effort: 'low'
  },
  {
    id: 'rec-002',
    type: 'migrate',
    resource: 'dev-test-01 (VMware)',
    currentConfig: 'VMware vSphere (2 vCPU, 8GB RAM)',
    recommendedConfig: 'Azure Standard_B2s (2 vCPU, 4GB RAM)',
    estimatedSavings: 85.50,
    priority: 'medium',
    impact: 'Development environment, minimal business impact',
    effort: 'medium'
  }
]);

export const backupJobs: BackupJob[] = getStoredData('backup-jobs', []);

export const migrationPlans: MigrationPlan[] = getStoredData('migration-plans', []);

export const performanceMetrics: PerformanceMetric[] = getStoredData('performance-metrics', []);

export const securityEvents: SecurityEvent[] = getStoredData('security-events', []);

// Sample integration configurations
export const sampleVMwareConfigs: VMwareConfig[] = [
  {
    id: 'vmware-001',
    name: 'Production vCenter',
    host: 'vcenter.company.com',
    port: 443,
    username: 'administrator@vsphere.local',
    useSSL: true,
    skipCertificateValidation: false,
    datacenter: 'DC-Primary',
    cluster: 'Production-Cluster',
    connectionStatus: 'connected',
    lastSync: '2025-01-17T10:00:00Z',
    version: '7.0.3',
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2025-01-17T10:00:00Z'
  }
];

export const sampleAzureConfigs: AzureConfig[] = [
  {
    id: 'azure-001',
    name: 'Production Azure',
    subscriptionId: '12345678-1234-1234-1234-123456789012',
    tenantId: '87654321-4321-4321-4321-210987654321',
    clientId: '11111111-1111-1111-1111-111111111111',
    resourceGroups: ['prod-rg', 'analytics-rg', 'monitoring-rg'],
    regions: ['eastus', 'westus2', 'centralus'],
    connectionStatus: 'connected',
    lastSync: '2025-01-17T10:00:00Z',
    subscriptionName: 'Production Subscription',
    isActive: true,
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2025-01-17T10:00:00Z'
  }
];