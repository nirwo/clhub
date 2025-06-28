import { AzureConfig, AzureVM, SyncJob } from '../types';

export class AzureService {
  private config: AzureConfig | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config?: AzureConfig) {
    if (config) {
      this.config = config;
    }
  }

  async testConnection(config: AzureConfig): Promise<{ success: boolean; message: string; subscriptionName?: string }> {
    try {
      // Simulate Azure authentication and subscription check
      const response = await this.makeRequest(`/subscriptions/${config.subscriptionId}`, 'GET', null, config);

      if (response.success) {
        return {
          success: true,
          message: 'Successfully connected to Azure',
          subscriptionName: response.data?.displayName || 'Production Subscription'
        };
      } else {
        return {
          success: false,
          message: response.error || 'Failed to connect to Azure'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async authenticate(config: AzureConfig): Promise<boolean> {
    try {
      const response = await this.makeRequest('/oauth2/token', 'POST', {
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: 'https://management.azure.com/.default'
      }, config);

      if (response.success && response.data?.access_token) {
        this.accessToken = response.data.access_token;
        this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000));
        this.config = config;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Azure authentication failed:', error);
      return false;
    }
  }

  async getVirtualMachines(): Promise<AzureVM[]> {
    if (!this.accessToken || !this.config) {
      throw new Error('Not authenticated with Azure');
    }

    try {
      const vms: AzureVM[] = [];
      
      for (const resourceGroup of this.config.resourceGroups) {
        const response = await this.makeRequest(
          `/subscriptions/${this.config.subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Compute/virtualMachines`,
          'GET'
        );
        
        if (response.success && response.data?.value) {
          const groupVMs = response.data.value.map((vm: any) => this.mapAzureVM(vm, resourceGroup));
          vms.push(...groupVMs);
        }
      }
      
      return vms;
    } catch (error) {
      console.error('Failed to fetch Azure VMs:', error);
      throw error;
    }
  }

  async getVMDetails(vmId: string, resourceGroup: string): Promise<AzureVM | null> {
    if (!this.accessToken || !this.config) {
      throw new Error('Not authenticated with Azure');
    }

    try {
      const response = await this.makeRequest(
        `/subscriptions/${this.config.subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Compute/virtualMachines/${vmId}`,
        'GET'
      );
      
      if (response.success && response.data) {
        return this.mapAzureVM(response.data, resourceGroup);
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch Azure VM details:', error);
      throw error;
    }
  }

  async startVM(vmId: string, resourceGroup: string): Promise<boolean> {
    return this.performVMAction(vmId, resourceGroup, 'start');
  }

  async stopVM(vmId: string, resourceGroup: string): Promise<boolean> {
    return this.performVMAction(vmId, resourceGroup, 'powerOff');
  }

  async restartVM(vmId: string, resourceGroup: string): Promise<boolean> {
    return this.performVMAction(vmId, resourceGroup, 'restart');
  }

  async deallocateVM(vmId: string, resourceGroup: string): Promise<boolean> {
    return this.performVMAction(vmId, resourceGroup, 'deallocate');
  }

  async createVM(vmSpec: any): Promise<{ success: boolean; vmId?: string; message: string }> {
    if (!this.accessToken || !this.config) {
      throw new Error('Not authenticated with Azure');
    }

    try {
      const response = await this.makeRequest(
        `/subscriptions/${this.config.subscriptionId}/resourceGroups/${vmSpec.resourceGroup}/providers/Microsoft.Compute/virtualMachines/${vmSpec.name}`,
        'PUT',
        vmSpec
      );

      if (response.success) {
        return {
          success: true,
          vmId: vmSpec.name,
          message: 'VM creation initiated successfully'
        };
      }
      return {
        success: false,
        message: response.error || 'Failed to create VM'
      };
    } catch (error) {
      return {
        success: false,
        message: `VM creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getCostData(timeframe: string = '30d'): Promise<any> {
    if (!this.accessToken || !this.config) {
      throw new Error('Not authenticated with Azure');
    }

    try {
      const response = await this.makeRequest(
        `/subscriptions/${this.config.subscriptionId}/providers/Microsoft.CostManagement/query`,
        'POST',
        {
          type: 'Usage',
          timeframe: timeframe,
          dataset: {
            granularity: 'Daily',
            aggregation: {
              totalCost: {
                name: 'PreTaxCost',
                function: 'Sum'
              }
            }
          }
        }
      );

      return response.data || {};
    } catch (error) {
      console.error('Failed to fetch Azure cost data:', error);
      throw error;
    }
  }

  async syncData(): Promise<SyncJob> {
    const syncJob: SyncJob = {
      id: `sync-${Date.now()}`,
      platform: 'azure',
      configId: this.config?.id || '',
      type: 'manual',
      status: 'running',
      startTime: new Date().toISOString(),
      recordsProcessed: 0,
      errors: [],
      progress: 0
    };

    try {
      // Simulate data synchronization
      const vms = await this.getVirtualMachines();
      syncJob.recordsProcessed = vms.length;
      syncJob.status = 'completed';
      syncJob.endTime = new Date().toISOString();
      syncJob.progress = 100;
      
      return syncJob;
    } catch (error) {
      syncJob.status = 'failed';
      syncJob.errors.push(error instanceof Error ? error.message : 'Unknown error');
      syncJob.endTime = new Date().toISOString();
      
      return syncJob;
    }
  }

  private async performVMAction(vmId: string, resourceGroup: string, action: string): Promise<boolean> {
    if (!this.accessToken || !this.config) {
      throw new Error('Not authenticated with Azure');
    }

    try {
      const response = await this.makeRequest(
        `/subscriptions/${this.config.subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Compute/virtualMachines/${vmId}/${action}`,
        'POST'
      );
      return response.success;
    } catch (error) {
      console.error(`Failed to ${action} Azure VM:`, error);
      return false;
    }
  }

  private async makeRequest(endpoint: string, method: string, data?: any, config?: AzureConfig): Promise<any> {
    // Simulate API calls to Azure
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    // Simulate different responses based on endpoint
    if (endpoint.includes('/oauth2/token')) {
      return {
        success: Math.random() > 0.05, // 95% success rate
        data: {
          access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...',
          expires_in: 3600,
          token_type: 'Bearer'
        },
        error: Math.random() > 0.95 ? 'Invalid client credentials' : null
      };
    }
    
    if (endpoint.includes('/subscriptions/') && !endpoint.includes('/virtualMachines')) {
      return {
        success: true,
        data: {
          id: '/subscriptions/12345678-1234-1234-1234-123456789012',
          displayName: 'Production Subscription',
          state: 'Enabled'
        }
      };
    }
    
    if (endpoint.includes('/virtualMachines') && method === 'GET') {
      return {
        success: true,
        data: {
          value: [
            {
              id: '/subscriptions/12345/resourceGroups/prod-rg/providers/Microsoft.Compute/virtualMachines/prod-api-01',
              name: 'prod-api-01',
              location: 'eastus',
              properties: {
                vmId: 'azure-vm-001',
                hardwareProfile: { vmSize: 'Standard_D4s_v3' },
                storageProfile: {
                  osDisk: { osType: 'Linux' }
                },
                osProfile: {
                  computerName: 'prod-api-01'
                },
                provisioningState: 'Succeeded'
              }
            }
          ]
        }
      };
    }

    return {
      success: Math.random() > 0.15, // 85% success rate
      data: { status: 'operation-completed' },
      error: Math.random() > 0.85 ? 'Operation failed' : null
    };
  }

  private mapAzureVM(vmData: any, resourceGroup: string): AzureVM {
    const properties = vmData.properties || {};
    
    return {
      id: vmData.name || vmData.id?.split('/').pop(),
      name: vmData.name,
      status: this.mapPowerState(properties.provisioningState),
      size: properties.hardwareProfile?.vmSize || 'Standard_D2s_v3',
      location: vmData.location || 'eastus',
      resourceGroup: resourceGroup,
      subscription: this.config?.name || 'Production',
      os: properties.storageProfile?.osDisk?.osType || 'Linux',
      privateIP: properties.networkProfile?.networkInterfaces?.[0]?.privateIPAddress || '10.0.1.4',
      publicIP: properties.networkProfile?.networkInterfaces?.[0]?.publicIPAddress,
      cost: Math.random() * 500 + 100, // Simulated cost
      tags: vmData.tags ? Object.keys(vmData.tags) : [],
      createdDate: properties.timeCreated || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      owner: vmData.tags?.owner || 'system@company.com'
    };
  }

  private mapPowerState(provisioningState: string): 'running' | 'stopped' | 'deallocated' {
    switch (provisioningState?.toLowerCase()) {
      case 'succeeded':
      case 'running':
        return 'running';
      case 'stopped':
        return 'stopped';
      case 'deallocated':
        return 'deallocated';
      default:
        return 'stopped';
    }
  }

  private isTokenExpired(): boolean {
    return !this.tokenExpiry || new Date() >= this.tokenExpiry;
  }

  disconnect(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.config = null;
  }
}