export interface VMwareVM {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'suspended';
  cpu: number;
  memory: number;
  storage: number;
  host: string;
  datacenter: string;
  powerState: string;
  guestOS: string;
  ipAddress: string;
  lastBackup?: string;
  tags?: string[];
  createdDate: string;
  lastModified: string;
  owner: string;
}

export interface AzureVM {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'deallocated';
  size: string;
  location: string;
  resourceGroup: string;
  subscription: string;
  os: string;
  publicIP?: string;
  privateIP: string;
  cost: number;
  tags?: string[];
  createdDate: string;
  lastModified: string;
  owner: string;
}

export interface CostData {
  date: string;
  vmware: number;
  azure: number;
  total: number;
  breakdown: {
    compute: number;
    storage: number;
    network: number;
    other: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  lastLogin: string;
  permissions: string[];
  department: string;
  avatar?: string;
  isActive: boolean;
}

export interface AlertConfig {
  id: string;
  name: string;
  type: 'cost' | 'resource' | 'performance' | 'security';
  threshold: number;
  enabled: boolean;
  recipients: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  conditions: string[];
}

export interface ResourceRecommendation {
  id: string;
  type: 'resize' | 'migrate' | 'optimize' | 'terminate';
  resource: string;
  currentConfig: string;
  recommendedConfig: string;
  estimatedSavings: number;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  effort: 'low' | 'medium' | 'high';
}

export interface BackupJob {
  id: string;
  name: string;
  vmId: string;
  vmName: string;
  platform: 'vmware' | 'azure';
  schedule: string;
  lastRun: string;
  nextRun: string;
  status: 'success' | 'failed' | 'running' | 'pending';
  retentionDays: number;
  size: number;
}

export interface MigrationPlan {
  id: string;
  name: string;
  sourceVMs: string[];
  sourcePlatform: 'vmware' | 'azure';
  targetPlatform: 'vmware' | 'azure';
  estimatedCost: number;
  estimatedDuration: string;
  status: 'draft' | 'approved' | 'in-progress' | 'completed' | 'failed';
  createdBy: string;
  createdDate: string;
}

export interface PerformanceMetric {
  timestamp: string;
  vmId: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
}

export interface SecurityEvent {
  id: string;
  type: 'unauthorized_access' | 'configuration_change' | 'policy_violation' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  resource: string;
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
  assignedTo?: string;
}