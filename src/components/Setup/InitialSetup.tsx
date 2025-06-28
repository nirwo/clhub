import React, { useState } from 'react';
import { Shield, User, Database, Cloud, CheckCircle, ArrowRight } from 'lucide-react';
import { User as UserType } from '../../types';

interface InitialSetupProps {
  onSetupComplete: (adminUser: UserType) => void;
}

export const InitialSetup: React.FC<InitialSetupProps> = ({ onSetupComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'IT Operations'
  });
  const [organizationData, setOrganizationData] = useState({
    name: '',
    timezone: 'UTC-8',
    currency: 'USD'
  });

  const steps = [
    { id: 1, title: 'Welcome', icon: Shield },
    { id: 2, title: 'Admin User', icon: User },
    { id: 3, title: 'Organization', icon: Database },
    { id: 4, title: 'Complete', icon: CheckCircle }
  ];

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminData.password !== adminData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (adminData.password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    setCurrentStep(3);
  };

  const handleOrganizationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(4);
  };

  const handleComplete = () => {
    const adminUser: UserType = {
      id: 'admin-001',
      name: adminData.name,
      email: adminData.email,
      role: 'admin',
      lastLogin: new Date().toISOString(),
      permissions: [
        'manage_infrastructure',
        'view_costs',
        'manage_users',
        'configure_alerts',
        'manage_backups',
        'approve_migrations',
        'view_infrastructure'
      ],
      department: adminData.department,
      isActive: true
    };

    // Save organization settings
    localStorage.setItem('organization-settings', JSON.stringify(organizationData));
    localStorage.setItem('setup-completed', 'true');
    
    onSetupComplete(adminUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 bg-slate-900 text-white p-8">
            <div className="flex items-center space-x-3 mb-8">
              <Cloud className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold">CloudHub</h1>
                <p className="text-sm text-slate-400">Infrastructure Manager</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive || isCompleted ? 'bg-white bg-opacity-20' : 'bg-slate-700'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Welcome to CloudHub</h2>
                  <p className="text-lg text-slate-600 mb-6">
                    Let's set up your comprehensive cloud infrastructure management platform.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">What you'll get:</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Unified management for VMware vCenter and Microsoft Azure</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Real-time cost tracking and optimization recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Automated backup and disaster recovery management</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>Role-based access control and user management</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Admin Account</h2>
                  <p className="text-slate-600">Set up the primary administrator account for your CloudHub installation.</p>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={adminData.name}
                      onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={adminData.email}
                      onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@company.com"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                    <select
                      value={adminData.department}
                      onChange={(e) => setAdminData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="IT Operations">IT Operations</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Cloud Engineering">Cloud Engineering</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={adminData.password}
                      onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Minimum 8 characters"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={adminData.confirmPassword}
                      onChange={(e) => setAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> This account will have full administrative privileges including user management, 
                      system configuration, and access to all infrastructure resources.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Create Admin Account
                  </button>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Organization Settings</h2>
                  <p className="text-slate-600">Configure basic settings for your organization.</p>
                </div>

                <form onSubmit={handleOrganizationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                    <input
                      type="text"
                      required
                      value={organizationData.name}
                      onChange={(e) => setOrganizationData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your Company Name"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Time Zone</label>
                    <select
                      value={organizationData.timezone}
                      onChange={(e) => setOrganizationData(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC-8">UTC-8 (Pacific Time)</option>
                      <option value="UTC-5">UTC-5 (Eastern Time)</option>
                      <option value="UTC+0">UTC+0 (GMT)</option>
                      <option value="UTC+1">UTC+1 (Central European Time)</option>
                      <option value="UTC+9">UTC+9 (Japan Standard Time)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
                    <select
                      value={organizationData.currency}
                      onChange={(e) => setOrganizationData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      These settings can be changed later in the system settings. You'll be able to configure 
                      integrations with VMware vCenter and Microsoft Azure after completing the initial setup.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Continue to Completion
                  </button>
                </form>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Setup Complete!</h2>
                  <p className="text-lg text-slate-600 mb-6">
                    Your CloudHub installation is ready. You can now start managing your cloud infrastructure.
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-lg p-6 text-left">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-3">Next Steps:</h3>
                  <ul className="space-y-2 text-emerald-800">
                    <li className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-emerald-600" />
                      <span>Configure VMware vCenter integration in the Integrations section</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Cloud className="h-5 w-5 text-emerald-600" />
                      <span>Set up Microsoft Azure connection for hybrid cloud management</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-emerald-600" />
                      <span>Add additional users and configure role-based access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <span>Configure alerts and monitoring for your infrastructure</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">
                    <strong>Admin Account Created:</strong> {adminData.name} ({adminData.email})<br />
                    <strong>Organization:</strong> {organizationData.name}<br />
                    <strong>Time Zone:</strong> {organizationData.timezone} | <strong>Currency:</strong> {organizationData.currency}
                  </p>
                </div>

                <button
                  onClick={handleComplete}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Enter CloudHub Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};