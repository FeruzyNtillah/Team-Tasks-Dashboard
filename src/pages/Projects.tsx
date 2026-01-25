import React from 'react';

const Projects: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Website Redesign</h3>
          <p className="text-gray-600 mb-4">Complete overhaul of the company website with modern design principles.</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">In Progress</span>
            <span className="text-sm text-gray-500">Due: Feb 15</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Mobile App Development</h3>
          <p className="text-gray-600 mb-4">Native mobile application for iOS and Android platforms.</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Planning</span>
            <span className="text-sm text-gray-500">Due: Mar 30</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">API Integration</h3>
          <p className="text-gray-600 mb-4">Third-party API integration for enhanced functionality.</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
            <span className="text-sm text-gray-500">Completed: Jan 10</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
