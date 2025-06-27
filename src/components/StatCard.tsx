import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  trend, 
  trendUp = true,
  delay = 0 
}) => {
  return (
    <div 
      className="group animate-slide-up opacity-0"
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/15">
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trendUp ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {trendUp ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {trend}
              </div>
            )}
          </div>
          
          <h3 className="text-gray-300 text-sm font-medium mb-2 group-hover:text-white transition-colors">
            {title}
          </h3>
          
          <p className="text-3xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">
            {value.toLocaleString()}
          </p>
        </div>

        {/* Glow effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
      </div>
    </div>
  );
};

export default StatCard;