import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getAnalytics } from '../api/studentApi';
import StatCard from '../components/StatCard';

const PIE_COLORS = ['#fbbf24', '#3b82f6', '#a855f7', '#ef4444'];
const BAR_COLORS = ['#0080ff', '#10b981', '#a855f7'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-800/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white text-sm font-semibold">{payload[0].payload?.name || payload[0].payload?.subject}</p>
        <p className="text-gray-400 text-xs">{payload[0].dataKey}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function GradeAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-gray-400">Failed to load analytics.</p>;

  const barData = data.subject_averages.map((s, i) => ({
    subject: s.subject,
    average: s.average,
    highest: s.highest,
    lowest: s.lowest,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-electric-400" /> Grade Analysis
        </h1>
        <p className="text-gray-500 text-sm mt-1">Detailed analytics and performance insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Class Average" value={`${data.class_average}%`} icon={TrendingUp} color="blue" />
        <StatCard title="Pass Percentage" value={`${data.pass_percentage}%`} icon={Award} color="green" />
        <StatCard title="Fail Percentage" value={`${data.fail_percentage}%`} icon={TrendingDown} color="red" />
        <StatCard title="Total Students" value={data.total_students} icon={Users} color="purple" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Grade Distribution</h2>
          {data.grade_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.grade_distribution} cx="50%" cy="50%" innerRadius={65} outerRadius={110}
                  paddingAngle={4} dataKey="value" nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}>
                  {data.grade_distribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-500 text-center py-20">No data</p>}
        </div>

        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Subject-wise Average Marks</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="average" fill="#0080ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top / Bottom Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.highest_avg_student && (
          <div className="glass p-5 border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-emerald-400">Highest Average Student</h3>
            </div>
            <p className="text-white font-semibold text-lg">{data.highest_avg_student.name}</p>
            <p className="text-gray-500 text-sm font-mono">{data.highest_avg_student.roll_number}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-2xl font-bold text-white font-mono">{data.highest_avg_student.average}%</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">{data.highest_avg_student.grade}</span>
            </div>
          </div>
        )}
        {data.lowest_avg_student && (
          <div className="glass p-5 border border-red-500/10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-semibold text-red-400">Lowest Average Student</h3>
            </div>
            <p className="text-white font-semibold text-lg">{data.lowest_avg_student.name}</p>
            <p className="text-gray-500 text-sm font-mono">{data.lowest_avg_student.roll_number}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-2xl font-bold text-white font-mono">{data.lowest_avg_student.average}%</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">{data.lowest_avg_student.grade}</span>
            </div>
          </div>
        )}
      </div>

      {/* Subject Performance Details */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Subject Performance Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-500 text-xs uppercase">Subject</th>
                <th className="text-center py-3 px-4 text-gray-500 text-xs uppercase">Average</th>
                <th className="text-center py-3 px-4 text-gray-500 text-xs uppercase">Highest</th>
                <th className="text-center py-3 px-4 text-gray-500 text-xs uppercase">Lowest</th>
              </tr>
            </thead>
            <tbody>
              {data.subject_averages.map((s, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-gray-300 font-medium">{s.subject}</td>
                  <td className="py-3 px-4 text-center text-white font-mono font-semibold">{s.average}</td>
                  <td className="py-3 px-4 text-center text-emerald-400 font-mono">{s.highest}</td>
                  <td className="py-3 px-4 text-center text-red-400 font-mono">{s.lowest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
