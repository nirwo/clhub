export interface VMwareConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  certificateThumbprint?: string;
  useSSL: boolean;
  skipCertificateValidation: boolean;
  datacenter?: string;
  cluster?: string;
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'testing';
  lastSync: string;
  version?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AzureConfig {
  id: string;
  name: string;
  subscriptionId: string;
  tenantId: string;
  clientId: string;
  clientSecret?: string;
  resourceGroups: string[];
  regions: string[];
  connectionStatus: 'connected' | 'disconnected' | 'error' | 'testing';
  lastSync: string;
  subscriptionName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationHealth {
  platform: 'vmware' | 'azure';
  configId: string;
  status: 'healthy' | 'warning' | 'critical';
  lastCheck: string;
  responseTime: number;
  errorCount: number;
  uptime: number;
  details: {
    apiCalls: number;
    successRate: number;
    avgResponseTime: number;
    lastError?: string;
  };
}

export interface SyncJob {
  id: string;
  platform: 'vmware' | 'azure';
  configId: string;
  type: 'full' | 'incremental' | 'manual';
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  startTime: string;
  endTime?: string;
  duration?: number;
  recordsProcessed: number;
  errors: string[];
  progress: number;
}

export interface APIEndpoint {
  id: string;
  platform: 'vmware' | 'azure';
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  isEnabled: boolean;
  rateLimit: number;
  timeout: number;
  retryCount: number;
}