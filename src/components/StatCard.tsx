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
        <div className={`relative rounded-2xl p-6 transition-all duration-500 border border-white/10 shadow-xl hover:shadow-2xl hover:scale-[1.03] 
        bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg hover:backdrop-brightness-125`}>

          {/* Background Glow */}
          <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur transition-opacity duration-700`} />

          {/* Foreground Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {trend && (
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
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

            <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              {title}
            </h3>

            <p className="text-4xl font-extrabold text-white group-hover:scale-105 transition-transform duration-300">
              {value.toLocaleString()}
            </p>
          </div>

          {/* Ring Glow on Hover */}
          <div className={`absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-white/10 transition-all duration-700`} />
        </div>
      </div>
  );
};

export default StatCard;
