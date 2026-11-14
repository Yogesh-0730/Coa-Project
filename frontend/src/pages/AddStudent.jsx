import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Award, TrendingUp, TrendingDown, ArrowRight, RotateCcw } from 'lucide-react';
import { addStudent } from '../api/studentApi';
import StudentForm from '../components/StudentForm';
import { useToast } from '../components/Toast';

const gradeColorMap = {
  'DISTINCTION': { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400' },
  'FIRST CLASS': { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400' },
  'SECOND CLASS': { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-400' },
  'FAIL': { border: 'border-red-500/30', bg: 'bg-red-500/10', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400' },
};

export default function AddStudent() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await addStudent(data);
      setResult(res.student);
      toast(res.message, 'success');
    } catch (err) {
      const msg = err.errors ? err.errors.join(', ') : err.error || 'Failed to add student';
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const colors = result ? (gradeColorMap[result.grade] || gradeColorMap['FAIL']) : null;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-electric-400" /> Add New Student
        </h1>
        <p className="text-gray-500 text-sm mt-1">Register a student and calculate academic performance</p>
      </div>

      {/* Form */}
      <div className="glass p-6">
        <StudentForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* Result Card */}
      {result && (
        <div className={`glass p-6 border ${colors.border} animate-slide-up`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white">Evaluation Result</h2>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${colors.badge}`}>
              {result.grade}
            </span>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs text-gray-500">Student Name</p>
              <p className="text-white font-semibold">{result.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Roll Number</p>
              <p className="text-white font-mono">{result.roll_number}</p>
            </div>
          </div>

          {/* Marks Table */}
          <div className="bg-white/5 rounded-lg overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2.5 px-4 text-gray-500 text-xs uppercase">Subject</th>
                  <th className="text-center py-2.5 px-4 text-gray-500 text-xs uppercase">Max</th>
                  <th className="text-center py-2.5 px-4 text-gray-500 text-xs uppercase">Obtained</th>
                  <th className="text-center py-2.5 px-4 text-gray-500 text-xs uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Mathematics', marks: result.mathematics },
                  { name: 'Computer Organization', marks: result.coa },
                  { name: 'Programming', marks: result.programming },
                ].map(s => (
                  <tr key={s.name} className="border-b border-white/5">
                    <td className="py-2.5 px-4 text-gray-300">{s.name}</td>
                    <td className="py-2.5 px-4 text-center text-gray-400 font-mono">100</td>
                    <td className="py-2.5 px-4 text-center text-white font-mono font-semibold">{s.marks}</td>
                    <td className="py-2.5 px-4 text-center">
                      <span className={`text-xs font-semibold ${s.marks >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {s.marks >= 50 ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-white font-mono">{result.total}<span className="text-sm text-gray-500">/300</span></p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Average</p>
              <p className="text-xl font-bold text-white font-mono">{result.average}%</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Result</p>
              <p className={`text-xl font-bold ${result.result === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>{result.result}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Remarks</p>
              <p className={`text-sm font-semibold ${colors.text}`}>{result.remarks}</p>
            </div>
          </div>

          {/* Highest / Lowest */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs text-gray-500">Highest Subject</p>
                <p className="text-sm font-semibold text-emerald-400">{result.highest_subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-xs text-gray-500">Lowest Subject</p>
                <p className="text-sm font-semibold text-red-400">{result.lowest_subject}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={() => setResult(null)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition">
              <RotateCcw className="w-4 h-4" /> Add Another
            </button>
            <button onClick={() => navigate('/students')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-electric-500/20 text-electric-400 hover:bg-electric-500/30 border border-electric-500/20 transition">
              View All Records <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
