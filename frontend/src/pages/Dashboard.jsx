import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, Award, TrendingUp, Target, UserPlus, ClipboardList, FileText, Cpu } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDashboard } from '../api/studentApi';
import StatCard from '../components/StatCard';
import StudentTable from '../components/StudentTable';

const PIE_COLORS = ['#fbbf24', '#3b82f6', '#a855f7', '#ef4444'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-800/95 backdrop-blur-xl border border-white/10 rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white text-sm font-semibold">{payload[0].name || payload[0].payload?.name || payload[0].payload?.subject}</p>
        <p className="text-gray-400 text-xs">{payload[0].value}{typeof payload[0].value === 'number' && payload[0].value < 10 ? ' students' : ''}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboard().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-gray-400">Failed to load dashboard.</p>;

  const quickActions = [
    { label: 'Add New Student', desc: 'Register a student and calculate results', icon: UserPlus, path: '/add-student', color: 'from-electric-500 to-blue-600' },
    { label: 'View All Records', desc: 'Search, filter & manage student data', icon: ClipboardList, path: '/students', color: 'from-emerald-500 to-teal-600' },
    { label: 'Generate Reports', desc: 'Create printable report cards', icon: FileText, path: '/reports', color: 'from-purple-500 to-indigo-600' },
    { label: 'Run 8086 Simulator', desc: 'Execute assembly language program', icon: Cpu, path: '/simulator', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of student performance and analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Students" value={data.total_students} icon={Users} color="blue" delay={0} />
        <StatCard title="Passed" value={data.passed} icon={UserCheck} color="green" delay={50} />
        <StatCard title="Failed" value={data.failed} icon={UserX} color="red" delay={100} />
        <StatCard title="Distinction" value={data.distinction_count} icon={Award} color="amber" delay={150} />
        <StatCard title="Class Average" value={`${data.class_average}%`} icon={TrendingUp} color="purple" delay={200} />
        <StatCard title="Pass Rate" value={`${data.pass_percentage}%`} icon={Target} color="cyan" delay={250} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Grade Distribution Pie */}
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Grade Distribution</h2>
          {data.grade_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data.grade_distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={4} dataKey="value" nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {data.grade_distribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-500 text-center py-20">No data available</p>}
        </div>

        {/* Subject Performance Bar */}
        <div className="glass p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Subject-wise Average</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.subject_averages} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="average" fill="#0080ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Results */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Recent Student Results</h2>
        <StudentTable students={data.recent_students} compact />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(a => (
            <button key={a.path} onClick={() => navigate(a.path)}
              className="glass p-5 text-left hover:scale-[1.02] transition-all duration-300 group">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold text-sm">{a.label}</h3>
              <p className="text-gray-500 text-xs mt-1">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
