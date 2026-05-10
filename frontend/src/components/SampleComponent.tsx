import React, { useState, useEffect } from 'react';

// ============================================================================
// DUMMY DATA CONSTANTS
// ============================================================================
const DUMMY_USERS = [
  { id: 1, name: 'Alice Smith', role: 'Admin', status: 'Active', lastLogin: '2023-10-14T08:30:00Z' },
  { id: 2, name: 'Bob Johnson', role: 'Editor', status: 'Inactive', lastLogin: '2023-10-12T14:15:00Z' },
  { id: 3, name: 'Charlie Davis', role: 'Viewer', status: 'Active', lastLogin: '2023-10-15T09:45:00Z' },
  { id: 4, name: 'Diana Prince', role: 'Editor', status: 'Pending', lastLogin: '2023-10-10T11:20:00Z' },
  { id: 5, name: 'Evan Wright', role: 'Admin', status: 'Active', lastLogin: '2023-10-16T16:05:00Z' },
];

const METRICS = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', positive: true },
  { label: 'Active Subscriptions', value: '2,350', change: '+15.2%', positive: true },
  { label: 'Churn Rate', value: '4.2%', change: '-0.5%', positive: false },
  { label: 'Customer Satisfaction', value: '98%', change: '+2.1%', positive: true },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================
const MetricCard = ({ metric }: { metric: typeof METRICS[0] }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
    <span className="text-sm font-medium text-gray-500">{metric.label}</span>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
      <span className={`text-sm font-semibold ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
        {metric.change}
      </span>
    </div>
  </div>
);

const UserTableRow = ({ user }: { user: typeof DUMMY_USERS[0] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{user.name}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{user.role}</td>
      <td className="px-4 py-3 text-sm">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {new Date(user.lastLogin).toLocaleDateString()}
      </td>
      <td className="px-4 py-3 text-sm text-right">
        <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
      </td>
    </tr>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const SampleComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate initial data loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm">
            Create Campaign
          </button>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="flex space-x-1 border-b border-gray-200">
        {['overview', 'analytics', 'users', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="space-y-8">
        {isLoading ? (
          // Skeleton Loader
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {METRICS.map((metric, index) => (
                <MetricCard key={index} metric={metric} />
              ))}
            </section>

            {/* Data Table Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUMMY_USERS.map((user) => (
                      <UserTableRow key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">Showing 1 to 5 of 24 results</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Next</button>
                </div>
              </div>
            </section>
            
            {/* Additional Info Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Upgrade to Pro!</h2>
              <p className="text-blue-100 max-w-2xl mb-6">
                Unlock advanced analytics, custom reporting, and unlimited API access. 
                This dummy section exists solely to demonstrate component complexity and styling variety.
              </p>
              <button className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg shadow hover:bg-blue-50 transition-colors">
                View Pricing Plans
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default SampleComponent;
