import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle, delay = 0 }) {
  const colorMap = {
    blue: 'from-electric-500/20 to-electric-600/10 text-electric-400 shadow-electric-500/10',
    green: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 shadow-emerald-500/10',
    red: 'from-red-500/20 to-red-600/10 text-red-400 shadow-red-500/10',
    amber: 'from-amber-500/20 to-amber-600/10 text-amber-400 shadow-amber-500/10',
    purple: 'from-purple-500/20 to-purple-600/10 text-purple-400 shadow-purple-500/10',
    cyan: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 shadow-cyan-500/10',
  };
  const iconBg = {
    blue: 'bg-electric-500/20 text-electric-400',
    green: 'bg-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/20 text-red-400',
    amber: 'bg-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/20 text-purple-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
  };

  return (
    <div
      className={`glass p-5 hover:scale-[1.02] transition-all duration-300 cursor-default animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-white mt-1 font-mono">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
