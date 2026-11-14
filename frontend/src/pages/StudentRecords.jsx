import React, { useEffect, useState, useCallback } from 'react';
import { Users, Search, Filter, ArrowUpDown, X } from 'lucide-react';
import { getAllStudents, updateStudent, deleteStudent, getStudent } from '../api/studentApi';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function StudentRecords() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [sortDir, setSortDir] = useState('');
  const [editStudent, setEditStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const toast = useToast();

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (gradeFilter !== 'All') params.grade = gradeFilter;
      if (sortDir) params.sort = sortDir;
      const res = await getAllStudents(params);
      setStudents(res.students);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, gradeFilter, sortDir]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleEdit = async (data) => {
    setEditLoading(true);
    try {
      const res = await updateStudent(editStudent.id, data);
      toast(res.message, 'success');
      setEditStudent(null);
      fetchStudents();
    } catch (err) {
      toast(err.errors ? err.errors.join(', ') : 'Update failed', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteStudent(deleteTarget.id);
      toast(res.message, 'success');
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      toast(err.error || 'Delete failed', 'error');
    }
  };

  const handleView = async (s) => {
    try {
      const res = await getStudent(s.id);
      setViewStudent(res.student);
    } catch (e) {
      toast('Failed to load student details', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-electric-400" /> Student Records
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage and view all student data</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search by name or roll number..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-500/50" />
        </div>
        <div className="flex gap-3">
          <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-electric-500/50 appearance-none cursor-pointer">
            <option value="All">All Grades</option>
            <option value="DISTINCTION">Distinction</option>
            <option value="FIRST CLASS">First Class</option>
            <option value="SECOND CLASS">Second Class</option>
            <option value="FAIL">Fail</option>
          </select>
          <button onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? '' : 'asc')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition ${
              sortDir ? 'bg-electric-500/10 border-electric-500/20 text-electric-400' : 'bg-white/5 border-white/10 text-gray-400'
            }`}>
            <ArrowUpDown className="w-4 h-4" />
            {sortDir === 'asc' ? 'Avg ↑' : sortDir === 'desc' ? 'Avg ↓' : 'Sort'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500">{students.length} record(s) found</p>

      {/* Table */}
      <div className="glass p-4 overflow-hidden">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded" />)}
          </div>
        ) : (
          <StudentTable students={students} onEdit={s => setEditStudent(s)} onDelete={s => setDeleteTarget(s)} onView={handleView} />
        )}
      </div>

      {/* Edit Modal */}
      {editStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditStudent(null)} />
          <div className="relative glass-strong p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Edit Student</h3>
              <button onClick={() => setEditStudent(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <StudentForm initialData={editStudent} onSubmit={handleEdit} isEditing loading={editLoading} />
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewStudent(null)} />
          <div className="relative glass-strong p-6 max-w-lg w-full mx-4 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">{viewStudent.name}</h3>
              <button onClick={() => setViewStudent(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Roll No:</span> <span className="text-white font-mono ml-1">{viewStudent.roll_number}</span></div>
                <div><span className="text-gray-500">Grade:</span> <span className="text-white font-semibold ml-1">{viewStudent.grade}</span></div>
                <div><span className="text-gray-500">Total:</span> <span className="text-white font-mono ml-1">{viewStudent.total}/300</span></div>
                <div><span className="text-gray-500">Average:</span> <span className="text-white font-mono ml-1">{viewStudent.average}%</span></div>
                <div><span className="text-gray-500">Result:</span> <span className={`ml-1 font-semibold ${viewStudent.result === 'PASS' ? 'text-emerald-400' : 'text-red-400'}`}>{viewStudent.result}</span></div>
                <div><span className="text-gray-500">Remarks:</span> <span className="text-gray-300 ml-1">{viewStudent.remarks}</span></div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={[
                  { subject: 'Math', marks: viewStudent.mathematics, full: 100 },
                  { subject: 'COA', marks: viewStudent.coa, full: 100 },
                  { subject: 'Prog', marks: viewStudent.programming, full: 100 },
                ]}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="marks" stroke="#0080ff" fill="#0080ff" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Student" message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`} />
    </div>
  );
}
