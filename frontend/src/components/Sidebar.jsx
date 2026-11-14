import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, UserPlus, Users, BarChart3, FileText,
  Cpu, Info, Settings, Menu, X, GraduationCap
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/add-student', label: 'Add Student', icon: UserPlus },
  { path: '/students', label: 'Student Records', icon: Users },
  { path: '/analysis', label: 'Grade Analysis', icon: BarChart3 },
  { path: '/reports', label: 'Result Reports', icon: FileText },
  { path: '/simulator', label: '8086 Simulator', icon: Cpu },
  { path: '/about', label: 'About Project', icon: Info },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 border-r border-white/5 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-electric-500 to-electric-700 flex items-center justify-center shadow-lg shadow-electric-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">8086 SSPES</h1>
              <p className="text-[10px] text-gray-500 leading-tight">Smart Student Performance<br/>Evaluation System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-electric-500/15 text-electric-400 border-l-2 border-electric-400 shadow-sm shadow-electric-500/5'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-gray-600 text-xs">
            <GraduationCap className="w-4 h-4" />
            <span>COA Project • B.Tech CSE</span>
          </div>
        </div>
      </aside>
    </>
  );
}
