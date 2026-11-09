/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, Sparkles, CheckCircle2, AlertTriangle, Database, Settings, LogOut } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onOpenMobile: () => void;
  onOpenAssistant: () => void;
  onOpenSettings: () => void;
  isSupabaseConfigured: boolean;
  validationScore: number;
  user: any;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobile,
  onOpenAssistant,
  onOpenSettings,
  isSupabaseConfigured,
  validationScore,
  user,
  onLogout,
}) => {
  const getPageInfo = () => {
    switch (currentPage) {
      case 'Overview':
        return {
          title: 'Institutional Overview',
          subtitle: 'University Timetable Matrix & Constraint Dashboard',
        };
      case 'Timetable':
        return {
          title: 'Master Timetable Grid',
          subtitle: 'Weekly schedule matrix, venue filtering & conflict auditing',
        };
      case 'Courses':
        return {
          title: 'Course Directory',
          subtitle: 'Academic modules, teaching assignments & required room types',
        };
      case 'Faculty':
        return {
          title: 'Faculty & Instructors',
          subtitle: 'Teaching capacity, working hours & availability windows',
        };
      case 'Rooms':
        return {
          title: 'Rooms & Venues',
          subtitle: 'Lecture halls, computing laboratories & seminar facilities',
        };
      case 'Student Groups':
        return {
          title: 'Student Cohorts',
          subtitle: 'Enrolled batches, study sections & scheduling preferences',
        };
      case 'Analytics':
        return {
          title: 'Schedule Analytics',
          subtitle: 'Space utilization, faculty load balance & heuristics',
        };
      case 'Settings':
        return {
          title: 'System & Database Integration',
          subtitle: 'Supabase PostgreSQL connection, DDL schema & Gemini model specs',
        };
      default:
        return {
          title: 'Timetable Planner',
          subtitle: 'Constraint-Satisfaction Scheduling & Gemini AI Assistant',
        };
    }
  };

  const info = getPageInfo();
  const isHealthy = validationScore >= 80;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#edf0f5] px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-black text-[#172033] tracking-tight leading-none">
            {info.title}
          </h1>
          <p className="text-[11px] text-gray-500 mt-1 hidden sm:block font-medium">
            {info.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status Score Pill */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isHealthy
              ? 'bg-[#F8F9EE] text-[#505616] border-[#E3E7BC]'
              : 'bg-[#FFF0F2] text-[#FC475C] border-[#FDC4CC]'
          }`}
        >
          {isHealthy ? (
            <CheckCircle2 size={13} className="text-[#A5AF4F]" />
          ) : (
            <AlertTriangle size={13} className="text-[#FC475C]" />
          )}
          <span>Score: {validationScore}%</span>
        </div>

        {/* Supabase Pill */}
        <button
          onClick={onOpenSettings}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer hover:opacity-80 ${
            isSupabaseConfigured
              ? 'bg-[#F0F8FF] text-[#13548E] border-[#CCE5FC]'
              : 'bg-[#FFF9EB] text-[#8A5B00] border-[#FDE6B4]'
          }`}
          title={isSupabaseConfigured ? 'Supabase Active • Click to view settings' : 'Local Storage Mode • Click to configure Supabase'}
        >
          <Database size={12} className={isSupabaseConfigured ? 'text-[#479FEA]' : 'text-[#D98A0D]'} />
          <span className="text-[11px]">
            {isSupabaseConfigured ? 'Supabase Active' : 'Local Storage'}
          </span>
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-95 shadow-sm shadow-[#FC475C]/25 transition active:scale-95"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Tempo AI</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition"
          title="Settings"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="p-2 text-gray-400 hover:text-[#FC475C] rounded-xl hover:bg-gray-100 transition hidden sm:inline-flex"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
