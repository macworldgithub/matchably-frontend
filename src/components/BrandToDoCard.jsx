import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

export default function BrandToDoCard() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('BRAND_TOKEN');
      const res = await fetch(`${config.BACKEND_URL}/api/brand/todos/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && data.recentTasks) {
          // Transform task data to todo format
          const transformedTodos = data.recentTasks.map(task => ({
            id: task.id,
            type: task.type,
            title: task.description,
            description: `Campaign: ${task.campaignTitle}`,
            priority: 'high', // All recent tasks are high priority
            action: getTaskAction(task.type),
            link: getTaskLink(task)
          }));
          setTodos(transformedTodos.slice(0, 4)); // Show max 4 items
        }
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      // Fallback to mock data
      const mockTodos = [
        {
          id: 1,
          type: 'tracking',
          title: 'Enter tracking number for Jessica Lee',
          description: 'Campaign: Glow Serum Ampoule',
          priority: 'high',
          action: 'Input Tracking',
          link: '/brand/campaigns/1?tab=creators&filter=trackingPending'
        },
        {
          id: 2,
          type: 'content',
          title: 'Review submitted content from Sarah Kim',
          description: 'Campaign: Glow Serum Ampoule',
          priority: 'medium',
          action: 'Review Content',
          link: '/brand/campaigns/1/content'
        },
        {
          id: 3,
          type: 'extension',
          title: 'Review extension request (+2 days) from Emma Chen',
          description: 'Campaign: Glow Serum Ampoule',
          priority: 'medium',
          action: 'Review Request',
          link: '/brand/campaigns/1?tab=creators&filter=extensionPending'
        },
        {
          id: 4,
          type: 'application',
          title: 'Review application from Alex Johnson',
          description: 'Campaign: Vitamin C Essence',
          priority: 'low',
          action: 'Review Creators',
          link: '/brand/campaigns/4?tab=creators&filter=applied'
        }
      ];
      setTodos(mockTodos.slice(0, 4)); // Show max 4 items
    } finally {
      setLoading(false);
    }
  };

  const getTaskAction = (type) => {
    switch (type) {
      case 'tracking': return 'Input Tracking';
      case 'content': return 'Review Content';
      case 'extension': return 'Review Request';
      case 'application': return 'Review Creators';
      case 'recruitment': return 'View Campaign';
      default: return 'View Details';
    }
  };

  const getTaskLink = (task) => {
    const { type, campaignId } = task;
    switch (type) {
      case 'tracking':
        return `/brand/campaigns/${campaignId}?tab=creators&filter=trackingPending`;
      case 'content':
        return `/brand/campaigns/${campaignId}/content`;
      case 'extension':
        return `/brand/campaigns/${campaignId}?tab=creators&filter=extensionPending`;
      case 'application':
        return `/brand/campaigns/${campaignId}?tab=creators&filter=applied`;
      case 'recruitment':
        return `/brand/campaigns/${campaignId}?tab=creators`;
      default:
        return `/brand/campaigns/${campaignId}`;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟠';
      default: return '🔵';
    }
  };

  const handleTodoClick = (todo) => {
    if (todo.link.startsWith('http')) {
      window.open(todo.link, '_blank');
    } else {
      navigate(todo.link);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-white/5 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">📋</span>
        <h2 className="text-lg FontNoto font-bold text-[#E0FFFA]">
          Brand To-Do
        </h2>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-gray-400 FontNoto text-sm">
            All caught up! No pending tasks.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {todos.map((todo, index) => (
            <div
              key={todo.id}
              className="group"
            >
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 
                transition-all duration-200 cursor-pointer border border-transparent hover:border-lime-400/30"
                onClick={() => handleTodoClick(todo)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getPriorityIcon(todo.priority)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm FontNoto text-gray-200 leading-tight">
                      {todo.title}
                    </p>
                    <button className="flex-shrink-0 text-xs FontNoto text-lime-400 hover:text-lime-300 
                      transition-colors duration-200 bg-lime-400/10 hover:bg-lime-400/20 
                      px-2 py-1 rounded border border-lime-400/30 hover:border-lime-400/50">
                      {todo.action}
                    </button>
                  </div>
                  
                  {todo.description && (
                    <p className="text-xs text-gray-400 FontNoto mt-1 leading-tight">
                      {todo.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Separator line (except for last item) */}
              {index < todos.length - 1 && (
                <div className="h-px bg-white/5 mx-3 mt-4"></div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          onClick={() => navigate('/brand/tasks')}
          className="w-full text-center text-xs FontNoto text-gray-400 hover:text-lime-400 
            transition-colors duration-200"
        >
          See All Tasks →
        </button>
      </div>
    </div>
  );
}
