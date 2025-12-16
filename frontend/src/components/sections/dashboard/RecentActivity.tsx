// src/components/dashboard/RecentActivity.tsx
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { Activity } from '@/lib/types/dashboard';

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-lg p-6">
      <h2 className="text-lg font-bold text-text-primary mb-4">Recent Activity</h2>
      
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'deposit' ? 'bg-info/10' : 'bg-success/10'
              }`}>
                {activity.type === 'deposit' ? (
                  <ArrowUpRight size={14} className="text-info"/>
                ) : (
                  <TrendingUp size={14} className="text-success"/>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary capitalize">
                  {activity.type} • {activity.vault}
                </p>
                <p className="text-xs text-text-tertiary">{activity.time}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${
              activity.type === 'deposit' ? 'text-text-primary' : 'text-success'
            }`}>
              {activity.type === 'earn' ? '+' : ''}${activity.amount}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-accent hover:text-accent-hover font-medium transition-all duration-200 hover:translate-x-1 cursor-pointer">
        View all activity →
      </button>
    </div>
  );
}