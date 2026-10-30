/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Mail, Clock, Calendar, Search } from 'lucide-react';
import { Faculty, TimetableSlot, DAYS } from '../utils/scheduler.ts';

interface FacultyViewProps {
  faculty: Faculty[];
  slots: TimetableSlot[];
  onAddFaculty: () => void;
  onEditFaculty: (fac: Faculty) => void;
  onDeleteFaculty: (id: string) => void;
}

export const FacultyView: React.FC<FacultyViewProps> = ({
  faculty,
  slots,
  onAddFaculty,
  onEditFaculty,
  onDeleteFaculty,
}) => {
  const [search, setSearch] = useState('');

  const filtered = faculty.filter((f) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.email.toLowerCase().includes(q) || f.department.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div>
          <h2 className="text-base font-black text-[#172033]">Faculty & Academic Staff</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage instructors, weekly teaching capacity and availability time windows
          </p>
        </div>
        <button
          onClick={onAddFaculty}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-90 shadow-sm shadow-[#FC475C]/25 transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus size={15} />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search faculty by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-[#FAFAFA]"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fac) => {
          const assignedSlots = slots.filter((s) => s.facultyId === fac.id);
          const assignedHours = assignedSlots.length; // 1 hour per session
          const loadPercent = Math.min(100, Math.round((assignedHours / Math.max(1, fac.maxWeeklyHours)) * 100));

          return (
            <div
              key={fac.id}
              className="bg-white rounded-3xl border border-[#edf0f5] shadow-2xs p-5 hover:border-gray-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF7EE] text-[#8E4702] border border-[#FED9B2] flex items-center justify-center font-bold text-sm shrink-0">
                      {fac.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#172033]">{fac.name}</h3>
                      <p className="text-[11px] text-gray-400">{fac.department}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#F0F8FF] text-[#13548E] text-[10px] font-bold">
                    Active
                  </span>
                </div>

                {/* Email */}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                  <Mail size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{fac.email}</span>
                </div>

                {/* Teaching Load Progress */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#edf0f5] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Teaching Load:</span>
                    <span className="font-bold text-[#172033] font-mono">
                      {assignedHours} / {fac.maxWeeklyHours} hrs ({loadPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        loadPercent > 90
                          ? 'bg-rose-500'
                          : loadPercent > 60
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(5, loadPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Availability Days */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    Available Days
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {DAYS.map((day) => {
                      const ranges = fac.availability ? fac.availability[day] : null;
                      const isAvail = !ranges || ranges.length > 0;
                      return (
                        <span
                          key={day}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            isAvail
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-gray-100 text-gray-400 opacity-60'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => onEditFaculty(fac)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                  title="Edit Faculty"
                  aria-label={`Edit ${fac.name}`}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => onDeleteFaculty(fac.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Delete Faculty"
                  aria-label={`Delete ${fac.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
