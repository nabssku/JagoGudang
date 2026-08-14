import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'amber' | 'emerald' | 'blue' | 'rose' | 'indigo' | 'slate';
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'amber',
  trend,
}) => {
  const colorStyles = {
    amber: 'bg-amber-500/10 text-amber-600 border-amber-200',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
    rose: 'bg-rose-500/10 text-rose-600 border-rose-200',
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    slate: 'bg-slate-500/10 text-slate-600 border-slate-200',
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl border ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && <span className="font-bold text-emerald-600">{trend}</span>}
        </div>
      )}
    </div>
  );
};
