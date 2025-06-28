import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Navigation/Sidebar';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { InfrastructureManagement } from './components/Infrastructure/InfrastructureManagement';
import { CostManagement } from './components/CostManagement/CostManagement';
import { ResourcePlanning } from './components/ResourcePlanning/ResourcePlanning';
import { AlertsMonitoring } from './components/AlertsMonitoring/AlertsMonitoring';
import { UserManagement } from './components/UserManagement/UserManagement';
import { BackupRecovery } from './components/BackupRecovery/BackupRecovery';
import { MigrationPlanning } from './components/Migration/MigrationPlanning';
import { Settings } from './components/Settings/Settings';
import { IntegrationManagement } from './components/Integrations/IntegrationManagement';
import { InitialSetup } from './components/Setup/InitialSetup';
import { users } from './data/mockData';
import { cleanUsers, resetToCleanData, populateDemoData } from './data/cleanMockData';
import { User } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = () => {
    const setupCompleted = localStorage.getItem('setup-completed');
    const savedUsers = localStorage.getItem('users');
    
    if (setupCompleted === 'true' && savedUsers) {
      const userList: User[] = JSON.parse(savedUsers);
      const adminUser = userList.find(user => user.role === 'admin');
      
      if (adminUser) {
        setCurrentUser(adminUser);
        setIsSetupComplete(true);
      } else {
        // Setup was marked complete but no admin user found, reset
        resetSetup();
      }
    } else {
      // No setup completed, start fresh
      resetToCleanData();
      setIsSetupComplete(false);
    }
    
    setIsLoading(false);
  };

  const resetSetup = () => {
    localStorage.removeItem('setup-completed');
    localStorage.removeItem('users');
    localStorage.removeItem('organization-settings');
    resetToCleanData();
    setIsSetupComplete(false);
    setCurrentUser(null);
  };

  const handleSetupComplete = (adminUser: User) => {
    // Save the admin user
    const userList = [adminUser];
    localStorage.setItem('users', JSON.stringify(userList));
    
    // Set current user and mark setup as complete
    setCurrentUser(adminUser);
    setIsSetupComplete(true);
    
    // Ask if user wants demo data
    const wantsDemoData = window.confirm(
      'Setup complete! Would you like to populate the system with demo data for testing? ' +
      'This will add sample VMs, cost data, and other resources to help you explore the features.'
    );
    
    if (wantsDemoData) {
      populateDemoData();
      window.location.reload(); // Refresh to load demo data
    }
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'infrastructure':
        return <InfrastructureManagement />;
      case 'cost-management':
        return <CostManagement />;
      case 'resource-planning':
        return <ResourcePlanning />;
      case 'alerts':
        return <AlertsMonitoring currentUser={currentUser} />;
      case 'users':
        return <UserManagement currentUser={currentUser} />;
      case 'backup-recovery':
        return <BackupRecovery currentUser={currentUser} />;
      case 'migration':
        return <MigrationPlanning currentUser={currentUser} />;
      case 'integrations':
        return <IntegrationManagement />;
      case 'settings':
        return <Settings currentUser={currentUser} />;
      default:
        return <DashboardOverview />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading CloudHub...</p>
        </div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return <InitialSetup onSetupComplete={handleSetupComplete} />;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        currentUser={currentUser!}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;