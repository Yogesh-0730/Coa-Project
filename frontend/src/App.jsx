import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import StudentRecords from './pages/StudentRecords';
import GradeAnalysis from './pages/GradeAnalysis';
import ResultReports from './pages/ResultReports';
import Simulator from './pages/Simulator';
import AboutProject from './pages/AboutProject';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/students" element={<StudentRecords />} />
        <Route path="/analysis" element={<GradeAnalysis />} />
        <Route path="/reports" element={<ResultReports />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/about" element={<AboutProject />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
