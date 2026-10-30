/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BarChart3,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { Course, Faculty, Room, StudentGroup, TimetableSlot, ValidationResult, DAYS, TIME_SLOTS } from '../utils/scheduler.ts';

interface AnalyticsViewProps {
  slots: TimetableSlot[];
  courses: Course[];
  faculty: Faculty[];
  rooms: Room[];
  groups: StudentGroup[];
  validation: ValidationResult | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  slots,
  courses,
  faculty,
  rooms,
  groups,
  validation,
}) => {
  const isHealthy = !validation || validation.isConflictFree;
  const score = validation ? validation.score : 100;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-[#172033]">Timetable Analytics & Heuristics</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isHealthy
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              Score: {score}/100
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Constraint Satisfaction Performance, Room Capacity Optimization & Faculty Fatigue Audit
          </p>
        </div>
      </div>

      {/* Heuristic Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#edf0f5] shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Search Nodes Visited</span>
            <Cpu size={16} className="text-[#869BEE]" />
          </div>
          <p className="text-2xl font-black text-[#172033] font-mono">
            {validation ? validation.searchNodes.toLocaleString() : slots.length}
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">Backtracking decision steps</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#edf0f5] shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Average Daily Load</span>
            <TrendingUp size={16} className="text-[#FC475C]" />
          </div>
          <p className="text-2xl font-black text-[#172033] font-mono">
            {(slots.length / 5).toFixed(1)} <span className="text-xs font-normal text-gray-400">sessions/day</span>
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">Target: 3.0 – 6.0 sessions</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#edf0f5] shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Campus Room Utilization</span>
            <Building2 size={16} className="text-[#13548E]" />
          </div>
          <p className="text-2xl font-black text-[#172033] font-mono">
            {Math.min(100, Math.round((slots.length / Math.max(1, rooms.length * 30)) * 100))}%
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">Across {rooms.length} venues</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#edf0f5] shadow-2xs">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Faculty Capacity Usage</span>
            <Users size={16} className="text-[#8E4702]" />
          </div>
          <p className="text-2xl font-black text-[#172033] font-mono">
            {Math.min(100, Math.round((slots.length / Math.max(1, faculty.length * 16)) * 100))}%
          </p>
          <span className="text-[11px] text-gray-400 mt-1 block">Statutory cap compliance</span>
        </div>
      </div>

      {/* Grid: Room Utilization Breakdown + Faculty Load Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Utilization Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#edf0f5] shadow-2xs">
          <h3 className="text-sm font-bold text-[#172033] mb-1">Room Capacity Utilization</h3>
          <p className="text-xs text-gray-400 mb-5">Weekly booked hours vs theoretical capacity (30 slots/week)</p>

          <div className="space-y-4">
            {rooms.map((room) => {
              const booked = slots.filter((s) => s.roomId === room.id).length;
              const pct = Math.min(100, Math.round((booked / 30) * 100));

              return (
                <div key={room.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#172033] font-mono">
                      {room.name} <span className="text-gray-400 font-sans font-normal">({room.type})</span>
                    </span>
                    <span className="font-mono text-gray-600 font-semibold">
                      {booked} / 30 slots ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-linear-to-r from-[#13548E] to-[#96CCF6] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Faculty Teaching Load Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#edf0f5] shadow-2xs">
          <h3 className="text-sm font-bold text-[#172033] mb-1">Faculty Workload & Fatigue Assessment</h3>
          <p className="text-xs text-gray-400 mb-5">Allocated lecture/lab hours against registered max limits</p>

          <div className="space-y-4">
            {faculty.map((fac) => {
              const teachingHrs = slots.filter((s) => s.facultyId === fac.id).length;
              const pct = Math.min(100, Math.round((teachingHrs / Math.max(1, fac.maxWeeklyHours)) * 100));

              return (
                <div key={fac.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#172033]">
                      {fac.name} <span className="text-gray-400 font-normal">({fac.department})</span>
                    </span>
                    <span className="font-mono text-gray-600 font-semibold">
                      {teachingHrs} / {fac.maxWeeklyHours} hrs ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 90 ? 'bg-rose-500' : pct > 60 ? 'bg-amber-500' : 'bg-[#FC475C]'
                      }`}
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
