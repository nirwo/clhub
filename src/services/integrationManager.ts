import { VMwareService } from './vmwareService';
import { AzureService } from './azureService';
import { VMwareConfig, AzureConfig, IntegrationHealth, SyncJob } from '../types';

export class IntegrationManager {
  private vmwareServices: Map<string, VMwareService> = new Map();
  private azureServices: Map<string, AzureService> = new Map();
  private healthChecks: Map<string, IntegrationHealth> = new Map();
  private syncJobs: SyncJob[] = [];

  // VMware Integration Management
  async addVMwareConfig(config: VMwareConfig): Promise<{ success: boolean; message: string }> {
    try {
      const service = new VMwareService(config);
      const testResult = await service.testConnection(config);
      
      if (testResult.success) {
        this.vmwareServices.set(config.id, service);
        await this.initializeHealthCheck(config.id, 'vmware');
        return { success: true, message: 'VMware configuration added successfully' };
      } else {
        return { success: false, message: testResult.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to add VMware config: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async addAzureConfig(config: AzureConfig): Promise<{ success: boolean; message: string }> {
    try {
      const service = new AzureService(config);
      const testResult = await service.testConnection(config);
      
      if (testResult.success) {
        this.azureServices.set(config.id, service);
        await this.initializeHealthCheck(config.id, 'azure');
        return { success: true, message: 'Azure configuration added successfully' };
      } else {
        return { success: false, message: testResult.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to add Azure config: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  async testVMwareConnection(config: VMwareConfig): Promise<{ success: boolean; message: string; version?: string }> {
    const service = new VMwareService();
    return await service.testConnection(config);
  }

  async testAzureConnection(config: AzureConfig): Promise<{ success: boolean; message: string; subscriptionName?: string }> {
    const service = new AzureService();
    return await service.testConnection(config);
  }

  // Data Synchronization
  async syncVMwareData(configId: string): Promise<SyncJob> {
    const service = this.vmwareServices.get(configId);
    if (!service) {
      throw new Error('VMware service not found');
    }

    const syncJob = await service.syncData();
    this.syncJobs.push(syncJob);
    return syncJob;
  }

  async syncAzureData(configId: string): Promise<SyncJob> {
    const service = this.azureServices.get(configId);
    if (!service) {
      throw new Error('Azure service not found');
    }

    const syncJob = await service.syncData();
    this.syncJobs.push(syncJob);
    return syncJob;
  }

  async syncAllData(): Promise<SyncJob[]> {
    const jobs: SyncJob[] = [];
    
    // Sync all VMware configurations
    for (const [configId] of this.vmwareServices) {
      try {
        const job = await this.syncVMwareData(configId);
        jobs.push(job);
      } catch (error) {
        console.error(`Failed to sync VMware config ${configId}:`, error);
      }
    }
    
    // Sync all Azure configurations
    for (const [configId] of this.azureServices) {
      try {
        const job = await this.syncAzureData(configId);
        jobs.push(job);
      } catch (error) {
        console.error(`Failed to sync Azure config ${configId}:`, error);
      }
    }
    
    return jobs;
  }

  // Health Monitoring
  async checkHealth(configId: string): Promise<IntegrationHealth | null> {
    const health = this.healthChecks.get(configId);
    if (!health) return null;

    const startTime = Date.now();
    let success = false;
    let errorMessage = '';

    try {
      if (health.platform === 'vmware') {
        const service = this.vmwareServices.get(configId);
        if (service) {
          // Perform a lightweight health check
          const result = await service.getVirtualMachines();
          success = Array.isArray(result);
        }
      } else if (health.platform === 'azure') {
        const service = this.azureServices.get(configId);
        if (service) {
          // Perform a lightweight health check
          const result = await service.getVirtualMachines();
          success = Array.isArray(result);
        }
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
    }

    const responseTime = Date.now() - startTime;
    
    // Update health metrics
    health.lastCheck = new Date().toISOString();
    health.responseTime = responseTime;
    health.details.apiCalls++;
    health.details.avgResponseTime = (health.details.avgResponseTime + responseTime) / 2;
    
    if (success) {
      health.status = responseTime > 5000 ? 'warning' : 'healthy';
      health.details.successRate = Math.min(health.details.successRate + 0.1, 100);
    } else {
      health.errorCount++;
      health.status = 'critical';
      health.details.successRate = Math.max(health.details.successRate - 1, 0);
      health.details.lastError = errorMessage;
    }

    this.healthChecks.set(configId, health);
    return health;
  }

  async checkAllHealth(): Promise<IntegrationHealth[]> {
    const healthChecks: IntegrationHealth[] = [];
    
    for (const configId of this.healthChecks.keys()) {
      try {
        const health = await this.checkHealth(configId);
        if (health) {
          healthChecks.push(health);
        }
      } catch (error) {
        console.error(`Health check failed for ${configId}:`, error);
      }
    }
    
    return healthChecks;
  }

  // Service Access
  getVMwareService(configId: string): VMwareService | undefined {
    return this.vmwareServices.get(configId);
  }

  getAzureService(configId: string): AzureService | undefined {
    return this.azureServices.get(configId);
  }

  getAllSyncJobs(): SyncJob[] {
    return [...this.syncJobs].sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
  }

  getHealthStatus(): IntegrationHealth[] {
    return Array.from(this.healthChecks.values());
  }

  // Configuration Management
  removeVMwareConfig(configId: string): void {
    const service = this.vmwareServices.get(configId);
    if (service) {
      service.disconnect();
      this.vmwareServices.delete(configId);
      this.healthChecks.delete(configId);
    }
  }

  removeAzureConfig(configId: string): void {
    const service = this.azureServices.get(configId);
    if (service) {
      service.disconnect();
      this.azureServices.delete(configId);
      this.healthChecks.delete(configId);
    }
  }

  private async initializeHealthCheck(configId: string, platform: 'vmware' | 'azure'): Promise<void> {
    const health: IntegrationHealth = {
      platform,
      configId,
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      responseTime: 0,
      errorCount: 0,
      uptime: 100,
      details: {
        apiCalls: 0,
        successRate: 100,
        avgResponseTime: 0
      }
    };

    this.healthChecks.set(configId, health);
    
    // Perform initial health check
    await this.checkHealth(configId);
  }

  // Cleanup
  disconnect(): void {
    for (const service of this.vmwareServices.values()) {
      service.disconnect();
    }
    for (const service of this.azureServices.values()) {
      service.disconnect();
    }
    
    this.vmwareServices.clear();
    this.azureServices.clear();
    this.healthChecks.clear();
    this.syncJobs = [];
  }
}

// Singleton instance
export const integrationManager = new IntegrationManager();