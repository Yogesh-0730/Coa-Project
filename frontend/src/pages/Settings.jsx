import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Database, Cpu, RotateCcw, Download, Moon, Sun, Trash2 } from 'lucide-react';
import { resetData, exportData, getDashboard } from '../api/studentApi';
import { useToast } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

export default function Settings() {
  const [emulatorPath, setEmulatorPath] = useState('');
  const [dosboxPath, setDosboxPath] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [resetModal, setResetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setEmulatorPath(localStorage.getItem('emu8086_path') || '');
    setDosboxPath(localStorage.getItem('dosbox_path') || '');
    getDashboard().then(d => setStudentCount(d.total_students)).catch(() => {});
  }, []);

  const savePaths = () => {
    localStorage.setItem('emu8086_path', emulatorPath);
    localStorage.setItem('dosbox_path', dosboxPath);
    toast('Emulator paths saved', 'success');
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await resetData();
      toast(res.message, 'success');
      setResetModal(false);
      const d = await getDashboard();
      setStudentCount(d.total_students);
    } catch (e) {
      toast('Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast('Data exported successfully', 'success');
    } catch (e) {
      toast('Export failed', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-electric-400" /> Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Configure application preferences</p>
      </div>

      {/* Theme */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-electric-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-300">Dark Mode</p>
            <p className="text-xs text-gray-500">Use dark navy theme (recommended)</p>
          </div>
          <button onClick={() => { setDarkMode(!darkMode); toast('Theme preference saved (dark mode is default)', 'success'); }}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-electric-500' : 'bg-gray-600'}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'left-6' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Emulator Config */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-electric-400" /> Emulator Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">EMU8086 Path</label>
            <input type="text" value={emulatorPath} onChange={e => setEmulatorPath(e.target.value)}
              placeholder="C:\emu8086\emu8086.exe"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric-500/50" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">DOSBox Path</label>
            <input type="text" value={dosboxPath} onChange={e => setDosboxPath(e.target.value)}
              placeholder="C:\DOSBox\dosbox.exe"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-electric-500/50" />
          </div>
          <button onClick={savePaths}
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-electric-500/20 text-electric-400 hover:bg-electric-500/30 border border-electric-500/20 transition">
            Save Configuration
          </button>
        </div>
      </div>

      {/* Database Info */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-electric-400" /> Database
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-500">Total Records</p>
            <p className="text-xl font-bold text-white font-mono">{studentCount}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-xs text-gray-500">Engine</p>
            <p className="text-xl font-bold text-white">SQLite</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20 transition">
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <button onClick={() => setResetModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 transition">
            <RotateCcw className="w-4 h-4" /> Reset Data
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="glass p-5">
        <h2 className="text-sm font-semibold text-white mb-3">About Application</h2>
        <div className="space-y-1.5 text-sm text-gray-400">
          <p><span className="text-gray-500">Version:</span> 1.0.0</p>
          <p><span className="text-gray-500">Project:</span> 8086 Smart Student Performance Evaluation System</p>
          <p><span className="text-gray-500">Course:</span> Computer Organization & Architecture (COA)</p>
          <p><span className="text-gray-500">Stack:</span> React + Flask + SQLite + 8086 Assembly</p>
        </div>
      </div>

      <ConfirmModal isOpen={resetModal} onClose={() => setResetModal(false)} onConfirm={handleReset}
        title="Reset All Data" message="This will delete all student records and restore sample data. This action cannot be undone." />
    </div>
  );
}
