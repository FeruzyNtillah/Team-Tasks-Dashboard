import React from 'react';
import { useTasksRealtime } from '../hooks/useTasksRealtime';
import { useProjectsData } from '../hooks/useProjectsData';
import { useUserProfile } from '../hooks/useUserProfile';
import { BarChart3, TrendingUp, Users, CheckCircle } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

const Home: React.FC = () => {
  const { tasks } = useTasksRealtime();
  const { projects } = useProjectsData();
  const { profile, loading } = useUserProfile();
  
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {loading ? 'Loading...' : `Hey ${firstName}, welcome back!`}
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Here's your team's dashboard overview</p>
        </div>
      </div>
      
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Projects Card */}
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Projects</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalProjects}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Active projects</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Total Tasks Card */}
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{totalTasks}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">All tasks</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* In Progress Card */}
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">In Progress</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{inProgressTasks}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Currently working</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        {/* Pending Card */}
        <div className="stat-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{pendingTasks}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Awaiting action</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts & Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Overview - Spans 1 column on lg */}
        <div className="lg:col-span-1 card-section">
          <div className="card-header">
            <h3 className="text-lg font-bold text-slate-900">Task Breakdown</h3>
          </div>
          <div className="card-body space-y-5">
            {/* Completed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Completed</span>
                <span className="text-sm font-bold text-green-600">{completedTasks}</span>
              </div>
              <ProgressBar 
                percentage={totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}
                gradientClass="bg-linear-to-r from-green-500 to-green-600"
              />
            </div>
            
            {/* In Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">In Progress</span>
                <span className="text-sm font-bold text-blue-600">{inProgressTasks}</span>
              </div>
              <ProgressBar 
                percentage={totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}
                gradientClass="bg-linear-to-r from-blue-500 to-blue-600"
              />
            </div>
            
            {/* Pending */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Pending</span>
                <span className="text-sm font-bold text-slate-600">{pendingTasks}</span>
              </div>
              <ProgressBar 
                percentage={totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}
                gradientClass="bg-linear-to-r from-slate-400 to-slate-500"
              />
            </div>
          </div>
        </div>
        
        {/* Recent Tasks - Spans 2 columns on lg */}
        <div className="lg:col-span-2 card-section">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Tasks</h3>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{recentTasks.length}</span>
          </div>
          <div className="card-body">
            {recentTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No tasks yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Tasks will appear here once they are created
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="p-4 bg-linear-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200/50 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">{task.title}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          📅 {task.due_date 
                            ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : 'No due date'
                          }
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                        task.status === 'completed' ? 'badge-success' :
                        task.status === 'in_progress' ? 'badge-info' :
                        task.priority === 'urgent' ? 'badge-danger' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'badge-neutral'
                      }`}>
                        {task.status === 'completed' ? '✓ Done' :
                         task.status === 'in_progress' ? '⟳ Progress' :
                         task.priority === 'urgent' ? '⚡ Urgent' :
                         task.priority === 'high' ? '⬆ High' :
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
    </div>
  );
};

export default Home;
