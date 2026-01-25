import React from 'react';

const Tasks: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Tasks</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-600 rounded" 
                  id="task-1"
                  aria-label="Mark task as complete"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Design homepage mockup</h4>
                  <p className="text-sm text-gray-600">Create initial design concepts for the new homepage</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">High Priority</span>
                <span className="text-sm text-gray-500">Due: Jan 28</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-blue-600 rounded" 
                  id="task-2"
                  aria-label="Mark task as complete"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Review pull requests</h4>
                  <p className="text-sm text-gray-600">Code review for feature branch updates</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Medium Priority</span>
                <span className="text-sm text-gray-500">Due: Jan 26</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked 
                  className="w-5 h-5 text-blue-600 rounded" 
                  readOnly 
                  id="task-3"
                  aria-label="Task completed"
                />
                <div>
                  <h4 className="font-semibold text-gray-400 line-through">Update documentation</h4>
                  <p className="text-sm text-gray-400">Add new API endpoints to docs</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
                <span className="text-sm text-gray-500">Completed: Jan 24</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
