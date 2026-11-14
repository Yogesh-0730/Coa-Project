import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const gradeColors = {
  'DISTINCTION': 'bg-amber-500/20 text-amber-400 border-amber-500/20',
  'FIRST CLASS': 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  'SECOND CLASS': 'bg-purple-500/20 text-purple-400 border-purple-500/20',
  'FAIL': 'bg-red-500/20 text-red-400 border-red-500/20',
};

export default function StudentTable({ students, onEdit, onDelete, onView, compact = false }) {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No student records found</p>
        <p className="text-sm mt-1">Add students to see them here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Roll No</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Name</th>
            {!compact && (
              <>
                <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Math</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">COA</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Prog</th>
              </>
            )}
            <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Total</th>
            <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Avg %</th>
            <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Grade</th>
            <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Result</th>
            {(onEdit || onDelete || onView) && (
              <th className="text-center py-3 px-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
              <td className="py-3 px-4 font-mono text-gray-300 text-xs">{s.roll_number}</td>
              <td className="py-3 px-4 text-white font-medium">{s.name}</td>
              {!compact && (
                <>
                  <td className="py-3 px-4 text-center text-gray-300 font-mono">{s.mathematics}</td>
                  <td className="py-3 px-4 text-center text-gray-300 font-mono">{s.coa}</td>
                  <td className="py-3 px-4 text-center text-gray-300 font-mono">{s.programming}</td>
                </>
              )}
              <td className="py-3 px-4 text-center text-white font-mono font-semibold">{s.total}/300</td>
              <td className="py-3 px-4 text-center text-white font-mono font-semibold">{s.average}%</td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${gradeColors[s.grade] || 'bg-gray-500/20 text-gray-400'}`}>
                  {s.grade}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  s.result === 'PASS' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'
                }`}>
                  {s.result}
                </span>
              </td>
              {(onEdit || onDelete || onView) && (
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {onView && (
                      <button onClick={() => onView(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-electric-400 hover:bg-electric-500/10 transition" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
