import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  DollarSign, 
  BarChart3, 
  Users, 
  Settings,
  Cloud,
  AlertTriangle,
  Shield,
  ArrowRightLeft,
  Plug
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentUser: User;
}

const getNavigationItems = (userPermissions: string[]) => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiredPermission: null }
  ];

  const conditionalItems = [
    { id: 'infrastructure', label: 'Infrastructure', icon: Server, requiredPermission: 'view_infrastructure' },
    { id: 'cost-management', label: 'Cost Management', icon: DollarSign, requiredPermission: 'view_costs' },
    { id: 'resource-planning', label: 'Resource Planning', icon: BarChart3, requiredPermission: 'view_costs' },
    { id: 'alerts', label: 'Alerts & Monitoring', icon: AlertTriangle, requiredPermission: 'view_infrastructure' },
    { id: 'backup-recovery', label: 'Backup & Recovery', icon: Shield, requiredPermission: 'view_infrastructure' },
    { id: 'migration', label: 'Migration Planning', icon: ArrowRightLeft, requiredPermission: 'view_infrastructure' },
    { id: 'integrations', label: 'Integrations', icon: Plug, requiredPermission: 'manage_users' },
    { id: 'users', label: 'User Management', icon: Users, requiredPermission: 'view_infrastructure' },
    { id: 'settings', label: 'Settings', icon: Settings, requiredPermission: null }
  ];

  return [
    ...baseItems,
    ...conditionalItems.filter(item => 
      !item.requiredPermission || userPermissions.includes(item.requiredPermission) || userPermissions.includes('manage_users')
    )
  ];
};

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, currentUser }) => {
  const navigationItems = getNavigationItems(currentUser.permissions);

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Cloud className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">CloudHub</h1>
            <p className="text-sm text-slate-400">Infrastructure Manager</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-slate-400 capitalize">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};