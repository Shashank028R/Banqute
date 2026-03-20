import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  return (
    <div 
      className={`
        group relative flex flex-col justify-between p-6
        bg-white rounded-2xl border border-gray-100 shadow-sm
        transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
        hover:shadow-2xl hover:-translate-y-1 
        cursor-default overflow-hidden
        w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-auto xl:flex-1
        xl:hover:flex-[1.7]
      `}
    >
      <div className="flex items-start justify-between w-full h-full">
        <div className="flex-1 min-w-0 pr-4 flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-medium truncate transition-all duration-700">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1 truncate transition-all duration-700" title={String(value)}>
            {value}
          </h3>
          
          {trend && (
            <p className={`text-xs mt-2 flex items-center transition-all duration-700 ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              <span className="mr-1">{trend.isUp ? '↑' : '↓'}</span>
              <span className="whitespace-nowrap flex items-center">
                {trend.value}% 
                <span className="max-w-0 opacity-0 overflow-hidden group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-1 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                  vs last month
                </span>
              </span>
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl ${color} shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
};