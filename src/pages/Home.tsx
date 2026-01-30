import React from 'react';
import { useTasksRealtime } from '../hooks/useTasksRealtime';
import { useProjectsData } from '../hooks/useProjectsData';
import { useUserProfile } from '../hooks/useUserProfile';
import { BarChart3, TrendingUp, Users, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const { tasks } = useTasksRealtime();
  const { projects } = useProjectsData();
  const { profile, loading } = useUserProfile();
  
  // Helper function to generate Tailwind width class
  const getWidthClass = (percentage: number) => {
    if (percentage === 0) return 'w-0';
    if (percentage <= 10) return 'w-[10%]';
    if (percentage <= 20) return 'w-[20%]';
    if (percentage <= 30) return 'w-[30%]';
    if (percentage <= 40) return 'w-[40%]';
    if (percentage <= 50) return 'w-[50%]';
    if (percentage <= 60) return 'w-[60%]';
    if (percentage <= 70) return 'w-[70%]';
    if (percentage <= 80) return 'w-[80%]';
    if (percentage <= 90) return 'w-[90%]';
    return 'w-full';
  };
  
  // Extract first name from full name
  const getFirstName = (fullName: string | null | undefined): string => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };
  
  const firstName = getFirstName(profile?.full_name);
  
  // Calculate stats from real data
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  
  // Get recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {loading ? 'Loading...' : `Hey ${firstName}, welcome to our dashboard`}
        </h2>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalProjects}</p>
          <p className="text-sm text-gray-500 mt-1">Active projects</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{totalTasks}</p>
          <p className="text-sm text-gray-500 mt-1">All tasks</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{inProgressTasks}</p>
          <p className="text-sm text-gray-500 mt-1">Currently working</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{pendingTasks}</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting action</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Overview Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Task Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-green-600">{completedTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-green-600 h-2 rounded-full transition-all duration-300 ${getWidthClass(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0)}`}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-sm font-medium text-yellow-600">{inProgressTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-yellow-600 h-2 rounded-full transition-all duration-300 ${getWidthClass(totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0)}`}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-gray-600">{pendingTasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gray-600 h-2 rounded-full transition-all duration-300 ${getWidthClass(totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0)}`}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Recent Tasks */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Tasks</h3>
          {recentTasks.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tasks found</p>
              <p className="text-sm text-gray-500 mt-1">
                Tasks will appear here once they are created
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        {task.due_date 
                          ? `Due ${new Date(task.due_date).toLocaleDateString()}`
                          : 'No due date'
                        }
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status === 'completed' ? 'Completed' :
                       task.status === 'in_progress' ? 'In Progress' :
                       task.priority === 'urgent' ? 'Urgent' :
                       task.priority === 'high' ? 'High Priority' :
                       task.status.replace('_', ' ')
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
