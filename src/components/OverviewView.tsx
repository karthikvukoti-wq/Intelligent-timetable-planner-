/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Play,
  Layers,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import { Course, Faculty, Room, StudentGroup, TimetableSlot, ValidationResult, DAYS } from '../utils/scheduler.ts';

interface OverviewViewProps {
  slots: TimetableSlot[];
  courses: Course[];
  faculty: Faculty[];
  rooms: Room[];
  groups: StudentGroup[];
  validation: ValidationResult | null;
  savedTimetablesCount: number;
  onNavigate: (page: string) => void;
  onOpenGenerate: () => void;
  onOpenAssistant: () => void;
  onAddCourse: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  slots,
  courses,
  faculty,
  rooms,
  groups,
  validation,
  savedTimetablesCount,
  onNavigate,
  onOpenGenerate,
  onOpenAssistant,
  onAddCourse,
}) => {
  const isConflictFree = !validation || validation.isConflictFree;
  const hardConflicts = validation ? validation.hardConflicts : 0;
  const score = validation ? validation.score : 100;

  // Daily distribution data
  const dailyStats = DAYS.map((day) => ({
    day: day.slice(0, 3),
    fullDay: day,
    count: slots.filter((s) => s.day === day).length,
  }));
  const maxDayCount = Math.max(...dailyStats.map((d) => d.count), 4);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#172033] via-[#1E293B] to-[#172033] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-[#FDB365] mb-4 border border-white/10">
            <Sparkles size={13} />
            <span>AI-Driven Academic Operations Research</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Tempo Intelligent Timetable Planner
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
            Automate university timetable generation with Constraint Satisfaction Backtracking (CSP),
            manage room capacities, balance faculty workloads, and consult Google Gemini AI for pedagogical explanations.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenGenerate}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-90 shadow-md shadow-[#FC475C]/30 transition flex items-center gap-2 active:scale-95"
            >
              <Play size={15} />
              <span>Generate Timetable</span>
            </button>
            <button
              onClick={onOpenAssistant}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition flex items-center gap-2"
            >
              <Sparkles size={14} className="text-[#FDB365]" />
              <span>Consult Copilot</span>
            </button>
            <button
              onClick={onAddCourse}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Add Course</span>
            </button>
          </div>
        </div>

        {/* Decorative corner visual */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Scheduled Sessions */}
        <div
          onClick={() => onNavigate('Timetable')}
          className="p-4 rounded-2xl bg-white border border-[#edf0f5] shadow-2xs hover:border-gray-300 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FFF0F2] text-[#FC475C] flex items-center justify-center mb-3">
            <Calendar size={16} />
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
            Scheduled Sessions
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#172033] mt-1">{slots.length}</p>
          <span className="text-[10px] text-gray-500">Across 5 days</span>
        </div>

        {/* Courses */}
        <div
          onClick={() => onNavigate('Courses')}
          className="p-4 rounded-2xl bg-white border border-[#edf0f5] shadow-2xs hover:border-gray-300 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F0F8FF] text-[#13548E] flex items-center justify-center mb-3">
            <BookOpen size={16} />
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
            Courses & Modules
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#172033] mt-1">{courses.length}</p>
          <span className="text-[10px] text-gray-500">Active curriculum</span>
        </div>

        {/* Faculty */}
        <div
          onClick={() => onNavigate('Faculty')}
          className="p-4 rounded-2xl bg-white border border-[#edf0f5] shadow-2xs hover:border-gray-300 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#FFF7EE] text-[#8E4702] flex items-center justify-center mb-3">
            <Users size={16} />
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
            Faculty Members
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#172033] mt-1">{faculty.length}</p>
          <span className="text-[10px] text-gray-500">Teaching instructors</span>
        </div>

        {/* Rooms */}
        <div
          onClick={() => onNavigate('Rooms')}
          className="p-4 rounded-2xl bg-white border border-[#edf0f5] shadow-2xs hover:border-gray-300 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F8F9EE] text-[#505616] flex items-center justify-center mb-3">
            <Building2 size={16} />
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
            Rooms & Labs
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#172033] mt-1">{rooms.length}</p>
          <span className="text-[10px] text-gray-500">Lecture & Lab spaces</span>
        </div>

        {/* Student Cohorts */}
        <div
          onClick={() => onNavigate('Student Groups')}
          className="p-4 rounded-2xl bg-white border border-[#edf0f5] shadow-2xs hover:border-gray-300 transition cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F3F5FE] text-[#2C3E96] flex items-center justify-center mb-3">
            <GraduationCap size={16} />
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
            Student Cohorts
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#172033] mt-1">{groups.length}</p>
          <span className="text-[10px] text-gray-500">Enrolled batches</span>
        </div>

        {/* Conflict Health */}
        <div
          onClick={() => onNavigate('Analytics')}
          className="p-4 rounded-2xl bg-white border border-[#edf0f5] shadow-2xs hover:border-gray-300 transition cursor-pointer"
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${
              isConflictFree
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isConflictFree ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
            Schedule Health
          </span>
          <p
            className={`text-xl sm:text-2xl font-black mt-1 ${
              isConflictFree ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {isConflictFree ? '100%' : `${score}%`}
          </p>
          <span className="text-[10px] text-gray-500">
            {isConflictFree ? '0 conflicts' : `${hardConflicts} hard conflicts`}
          </span>
        </div>
      </div>

      {/* Two Columns: Daily Distribution + Copilot Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Distribution Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#edf0f5] shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-[#172033]">Weekly Session Density</h3>
              <p className="text-xs text-gray-500">
                Balanced distribution of lectures and lab hours (Monday – Friday)
              </p>
            </div>
            <button
              onClick={() => onNavigate('Timetable')}
              className="text-xs font-bold text-[#FC475C] hover:underline flex items-center gap-1"
            >
              <span>View Grid</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-4">
            {dailyStats.map((item) => {
              const percentage = Math.round((item.count / Math.max(1, maxDayCount)) * 100);
              return (
                <div key={item.day} className="flex items-center gap-4">
                  <div className="w-10 text-xs font-bold text-gray-600 shrink-0">
                    {item.day}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-[#FC475C] to-[#FDB365] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(6, percentage)}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs font-mono font-bold text-[#172033] shrink-0">
                    {item.count} {item.count === 1 ? 'session' : 'sessions'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Optimal balance target: 4–6 sessions per day</span>
            <span className="font-semibold text-gray-700">
              Avg: {(slots.length / 5).toFixed(1)} sessions/day
            </span>
          </div>
        </div>

        {/* Backtracking & AI Explanation Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#FFF0F2] via-[#FFF8F9] to-[#F8F9FE] rounded-3xl p-6 border border-[#FDC4CC]/70 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#FC475C] text-white flex items-center justify-center shadow-xs">
                <Sparkles size={16} />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#981B2B]">
                Gemini Copilot Insights
              </span>
            </div>
            <h3 className="text-base font-bold text-[#172033] leading-snug">
              Backtracking CSP algorithm verified {slots.length} sessions.
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mt-2.5">
              All faculty availability constraints, room capacities, and student cohort overlaps are strictly enforced.
              Review schedule details or consult Gemini Copilot for pedagogical analysis.
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-white/90 border border-[#FDC4CC]/50 text-xs text-gray-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">CSP Optimization Score:</span>
                <span className="font-bold text-[#FC475C] font-mono">{score}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Database Archives:</span>
                <span className="font-semibold">{savedTimetablesCount} published</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-[#FDC4CC]/60 flex items-center justify-between mt-4">
            <span className="text-[11px] text-gray-500 font-mono">Gemini 3.8 Flash</span>
            <button
              onClick={onOpenAssistant}
              className="text-xs font-bold text-[#FC475C] hover:opacity-80 flex items-center gap-1"
            >
              <span>Consult Copilot</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
