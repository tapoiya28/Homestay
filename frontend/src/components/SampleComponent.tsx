import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

// ============================================================================
// MASSIVE DUMMY DATA GENERATOR
// ============================================================================

const generateHugeDataset = (count: number) => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Design'];
  const locations = ['New York', 'London', 'Tokyo', 'San Francisco', 'Berlin', 'Singapore'];
  const statuses = ['Active', 'Inactive', 'On Leave', 'Terminated', 'Pending'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `EMP-${10000 + i}`,
    firstName: `First${i}`,
    lastName: `Last${i}`,
    email: `employee${i}@corporate.dummy.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    salary: Math.floor(Math.random() * 100000) + 50000,
    performanceScore: (Math.random() * 5).toFixed(1),
    joinDate: new Date(Date.now() - Math.random() * 100000000000).toISOString(),
    isManager: Math.random() > 0.8,
  }));
};

const DATA = generateHugeDataset(150);

// ============================================================================
// COMPLEX SUB-COMPONENTS
// ============================================================================

const ChartPlaceholder = ({ title, type, height = 'h-64' }: { title: string, type: 'bar' | 'line' | 'pie' | 'doughnut', height?: string }) => {
  // Generates randomized SVG paths to simulate complex charts
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <div className="flex items-end justify-between h-full w-full gap-2 pt-8 pb-2 px-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-full bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${Math.max(10, Math.random() * 100)}%` }}></div>
            ))}
          </div>
        );
      case 'line':
        return (
          <svg viewBox="0 0 100 50" className="w-full h-full text-indigo-500 stroke-current preserve-aspect-ratio-none">
            <polyline fill="none" strokeWidth="2" points="0,40 10,20 20,25 30,10 40,30 50,5 60,15 70,35 80,10 90,20 100,0" />
            <polygon fill="currentColor" fillOpacity="0.1" points="0,50 0,40 10,20 20,25 30,10 40,30 50,5 60,15 70,35 80,10 90,20 100,0 100,50" />
          </svg>
        );
      case 'pie':
      case 'doughnut':
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className={`w-32 h-32 rounded-full border-[16px] ${type === 'doughnut' ? 'border-transparent' : ''} bg-conic-gradient`}></div>
            {type === 'doughnut' && <div className="absolute w-20 h-20 bg-white rounded-full"></div>}
          </div>
        );
    }
  };

  return (
    <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
        </button>
      </div>
      <div className={`${height} w-full bg-gray-50/50 rounded-xl flex items-center justify-center overflow-hidden`}>
        {renderChart()}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtext, icon, trend }: { title: string, value: string, subtext: string, icon: React.ReactNode, trend: 'up' | 'down' | 'neutral' }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <h4 className="mt-2 text-3xl font-extrabold text-gray-900">{value}</h4>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`font-bold flex items-center ${trendColor}`}>
          <span className="mr-1">{trendIcon}</span> {Math.floor(Math.random() * 20) + 1}.{Math.floor(Math.random() * 9)}%
        </span>
        <span className="ml-2 text-gray-500">{subtext}</span>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN MEGA COMPONENT
// ============================================================================

const MegaDashboardComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const itemsPerPage = 10;

  // Complex memoized filtering logic
  const filteredData = useMemo(() => {
    return DATA.filter(emp => {
      const matchesSearch = emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            emp.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = filterDept === 'All' || emp.department === filterDept;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, filterDept]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredData, currentPage]);

  const departments = ['All', ...Array.from(new Set(DATA.map(d => d.department)))];

  // Complex effects
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [searchTerm, filterDept]);

  // Event handlers
  const handleExport = useCallback(() => {
    console.log("Exporting", filteredData.length, "rows to CSV...");
    alert(`Exporting ${filteredData.length} rows to CSV... (Dummy Action)`);
  }, [filteredData]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* ------------------------------------------------------------------
          SIDEBAR SECTION
      ------------------------------------------------------------------ */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          {isSidebarOpen && <span className="text-xl font-black tracking-tighter">NEXUS<span className="text-blue-500">PRO</span></span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {['Dashboard', 'Analytics', 'Employees', 'Finances', 'Reports', 'Settings'].map((item, idx) => (
              <li key={item}>
                <a href="#" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${idx === 0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                  <div className="w-6 h-6 bg-white/20 rounded-md shrink-0"></div>
                  {isSidebarOpen && <span className="font-medium">{item}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 border-2 border-slate-800 shrink-0"></div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">Admin User</p>
                <p className="text-xs text-slate-400 truncate">admin@nexuspro.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------
          MAIN CONTENT SECTION
      ------------------------------------------------------------------ */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOPBAR */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <h1 className="text-2xl font-bold text-gray-800">Global Executive Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* SCROLLABLE DASHBOARD CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700">Filters:</span>
              <select 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={filterDept}
                onChange={e => setFilterDept(e.target.value)}
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={handleExport} className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-200">
                Export to CSV
              </button>
              <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 shadow-md shadow-blue-500/30">
                + New Employee
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard title="Total Employees" value={filteredData.length.toString()} subtext="vs last month" icon={<div className="w-6 h-6 bg-current rounded-sm"></div>} trend="up" />
            <StatCard title="Avg Salary" value={`$${(filteredData.reduce((acc, curr) => acc + curr.salary, 0) / (filteredData.length || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}`} subtext="vs last year" icon={<div className="w-6 h-6 bg-current rounded-full"></div>} trend="up" />
            <StatCard title="Attrition Rate" value="4.2%" subtext="vs last quarter" icon={<div className="w-6 h-6 border-2 border-current rounded-full"></div>} trend="down" />
            <StatCard title="Open Positions" value="24" subtext="across 6 departments" icon={<div className="w-6 h-6 bg-current clip-triangle"></div>} trend="neutral" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartPlaceholder title="Revenue vs Operational Costs (2023)" type="line" height="h-80" />
            </div>
            <div className="lg:col-span-1">
              <ChartPlaceholder title="Department Distribution" type="doughnut" height="h-80" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Monthly Hiring Trends" type="bar" height="h-64" />
            <ChartPlaceholder title="Performance Score Distribution" type="bar" height="h-64" />
          </div>

          {/* Massive Data Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Employee Directory</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                {filteredData.length} records found
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-4">Employee ID</th>
                    <th scope="col" className="px-6 py-4">Name</th>
                    <th scope="col" className="px-6 py-4">Department</th>
                    <th scope="col" className="px-6 py-4">Location</th>
                    <th scope="col" className="px-6 py-4">Salary</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                        No employees found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((emp) => (
                      <tr key={emp.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-gray-900">{emp.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                              {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{emp.firstName} {emp.lastName}</p>
                              <p className="text-xs text-gray-500">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{emp.department}</td>
                        <td className="px-6 py-4">{emp.location}</td>
                        <td className="px-6 py-4 font-mono text-gray-900">${emp.salary.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            emp.status === 'Active' ? 'bg-green-100 text-green-800' :
                            emp.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                            emp.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-600 hover:text-blue-900 font-semibold mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <span className="text-sm text-gray-700">
                Showing <span className="font-semibold text-gray-900">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-semibold text-gray-900">{filteredData.length}</span> Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0 rounded-md shadow-sm">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {/* Page numbers dummy generation */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum = currentPage;
                  if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 text-sm font-medium border-y border-gray-300 ${currentPage === pageNum ? 'bg-blue-50 text-blue-600 border-x border-blue-300 z-10 relative' : 'bg-white text-gray-900 hover:bg-gray-100 border-l border-r-0'}`}
                      >
                        {pageNum}
                      </button>
                    )
                  }
                  return null;
                })}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-l"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer inside content area */}
          <footer className="pt-8 pb-4 text-center text-sm text-gray-500">
            <p>&copy; 2026 NexusPro Enterprise Solutions. All dummy rights reserved.</p>
            <p className="mt-1">Generated by an AI assistant for demonstration purposes.</p>
          </footer>

        </div>
      </main>
    </div>
  );
};

export default MegaDashboardComponent;
