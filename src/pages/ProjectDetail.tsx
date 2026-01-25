import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, CheckSquare } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Static project data
  const project = {
    id: parseInt(id || '1'),
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design principles and improved user experience.',
    created_at: '2024-01-15',
    status: 'In Progress',
    team_lead: 'John Doe',
    progress: 65
  };

  // Static tasks data
  const tasks = [
    {
      id: 1,
      title: 'Design homepage mockup',
      description: 'Create initial design concepts for the new homepage layout',
      status: 'In Progress',
      priority: 'High',
      assignee: 'Alice Johnson',
      due_date: '2024-02-01'
    },
    {
      id: 2,
      title: 'Implement responsive design',
      description: 'Ensure the website works perfectly on all device sizes',
      status: 'Pending',
      priority: 'Medium',
      assignee: 'Bob Smith',
      due_date: '2024-02-05'
    },
    {
      id: 3,
      title: 'Optimize page load speed',
      description: 'Improve website performance and loading times',
      status: 'Completed',
      priority: 'High',
      assignee: 'Carol White',
      due_date: '2024-01-20'
    },
    {
      id: 4,
      title: 'Set up analytics tracking',
      description: 'Implement Google Analytics and other tracking tools',
      status: 'Pending',
      priority: 'Low',
      assignee: 'David Brown',
      due_date: '2024-02-10'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-blue-100 text-blue-700';
      case 'Low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/projects"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      {/* Project Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
            <p className="text-gray-600 max-w-3xl">{project.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium text-gray-800">{project.created_at}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Team Lead</p>
              <p className="font-medium text-gray-800">{project.team_lead}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckSquare className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Progress</p>
              <p className="font-medium text-gray-800">{project.progress}%</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">Progress Bar</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out w-[${project.progress}%]`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Project Tasks</h2>
          <p className="text-sm text-gray-500 mt-1">Tasks belonging to this project</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{task.assignee}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{task.due_date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
