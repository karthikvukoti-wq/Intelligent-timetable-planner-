/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationCap, Plus, Edit2, Trash2, Users, BookOpen, Clock, Search, ShieldCheck } from 'lucide-react';
import { StudentGroup, Course, TimetableSlot } from '../utils/scheduler.ts';

interface GroupsViewProps {
  groups: StudentGroup[];
  courses: Course[];
  slots: TimetableSlot[];
  onAddGroup: () => void;
  onEditGroup: (group: StudentGroup) => void;
  onDeleteGroup: (id: string) => void;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  courses,
  slots,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
}) => {
  const [search, setSearch] = useState('');

  const filtered = groups.filter((g) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return g.name.toLowerCase().includes(q) || g.department.toLowerCase().includes(q) || g.semester.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div>
          <h2 className="text-base font-black text-[#172033]">Student Groups & Cohorts</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage academic batches, student headcounts, and soft scheduling preferences
          </p>
        </div>
        <button
          onClick={onAddGroup}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-90 shadow-sm shadow-[#FC475C]/25 transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus size={15} />
          <span>Add Cohort</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cohort name, department, semester..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-[#FAFAFA]"
          />
        </div>
      </div>

      {/* Groups Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#edf0f5] p-12 text-center shadow-2xs">
          <GraduationCap size={36} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-sm font-bold text-gray-700">No student cohorts found</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            {groups.length === 0
              ? 'No student groups registered. Add batches or sync from Supabase.'
              : 'No cohorts match the active search filter.'}
          </p>
          {groups.length === 0 && (
            <button
              onClick={onAddGroup}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#FC475C] rounded-xl hover:opacity-90 transition"
            >
              Add Student Cohort
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((grp) => {
          const groupCourses = courses.filter((c) => c.groupId === grp.id);
          const groupSlots = slots.filter((s) => s.groupId === grp.id);

          return (
            <div
              key={grp.id}
              className="bg-white rounded-3xl border border-[#edf0f5] shadow-2xs p-5 hover:border-gray-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F3F5FE] text-[#2C3E96] border border-[#C8D2F8] flex items-center justify-center font-bold text-sm shrink-0">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#172033]">{grp.name}</h3>
                      <p className="text-[11px] text-gray-400">{grp.department}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold">
                    {grp.semester}
                  </span>
                </div>

                {/* Enrolled Headcount & Sessions */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#edf0f5]">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Enrolled Size</span>
                    <span className="font-black text-[#172033] font-mono text-sm mt-0.5 block">
                      {grp.studentCount} students
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAFAFA] border border-[#edf0f5]">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Weekly Classes</span>
                    <span className="font-black text-[#FC475C] font-mono text-sm mt-0.5 block">
                      {groupSlots.length} sessions
                    </span>
                  </div>
                </div>

                {/* Scheduling Soft Preferences */}
                <div className="mt-3.5 space-y-1.5 text-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                    CSP Preferences
                  </span>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Avoid Late Slots (&gt;= 15:15):</span>
                    <span className={`font-bold ${grp.avoidLateSlots ? 'text-emerald-700' : 'text-gray-400'}`}>
                      {grp.avoidLateSlots ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Max Sessions / Day:</span>
                    <span className="font-bold text-gray-800 font-mono">
                      {grp.maxSessionsPerDay || 5} max
                    </span>
                  </div>
                </div>

                {/* Enrolled courses tags */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                    Assigned Courses ({groupCourses.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {groupCourses.map((c) => (
                      <span
                        key={c.id}
                        className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-mono font-bold"
                      >
                        {c.code}
                      </span>
                    ))}
                    {groupCourses.length === 0 && (
                      <span className="text-[11px] text-gray-400 italic">No courses linked yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => onEditGroup(grp)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                  title="Edit Cohort"
                  aria-label={`Edit ${grp.name}`}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => onDeleteGroup(grp.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Delete Cohort"
                  aria-label={`Delete ${grp.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
