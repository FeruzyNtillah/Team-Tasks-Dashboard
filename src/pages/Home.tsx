import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500 mt-1">Active projects</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold text-green-600">47</p>
          <p className="text-sm text-gray-500 mt-1">All tasks</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-purple-600">28</p>
          <p className="text-sm text-gray-500 mt-1">Done this week</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending</h3>
          <p className="text-3xl font-bold text-orange-600">19</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting action</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Overview</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-3"></div>
              <p className="text-gray-500">Chart Placeholder</p>
              <p className="text-sm text-gray-400">Task completion trends</p>
            </div>
          </div>
        </div>
        
        {/* Recent Tasks Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Design homepage mockup</p>
                  <p className="text-sm text-gray-500">Due in 2 days</p>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">In Progress</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Review pull requests</p>
                  <p className="text-sm text-gray-500">Due tomorrow</p>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">High Priority</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Update documentation</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Completed</span>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">Team meeting preparation</p>
                  <p className="text-sm text-gray-500">Due in 3 days</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Medium Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
