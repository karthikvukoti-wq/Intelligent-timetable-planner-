/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Building2, Users, GraduationCap, Search } from 'lucide-react';
import { Course, Faculty, StudentGroup, getCourseColor } from '../utils/scheduler.ts';

interface CoursesViewProps {
  courses: Course[];
  faculty: Faculty[];
  groups: StudentGroup[];
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  faculty,
  groups,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}) => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  const filtered = courses.filter((c) => {
    if (filterDept !== 'all' && c.department !== filterDept) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.facultyName.toLowerCase().includes(q) ||
        c.groupName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div>
          <h2 className="text-base font-black text-[#172033]">Course Curriculum Directory</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage academic subjects, instructor assignments, student cohorts and facility needs
          </p>
        </div>
        <button
          onClick={onAddCourse}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-90 shadow-sm shadow-[#FC475C]/25 transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus size={15} />
          <span>Add Course</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by code, title, faculty, cohort..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-[#FAFAFA]"
          />
        </div>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
        >
          <option value="all">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="AI & Data Science">AI & Data Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Humanities & Management">Humanities & Management</option>
        </select>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => {
          const color = getCourseColor(course.code);
          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-[#edf0f5] shadow-2xs p-5 hover:border-gray-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    style={{ backgroundColor: color.badgeBg, color: color.badgeText }}
                    className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider"
                  >
                    {course.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                    {course.semester}
                  </span>
                </div>

                <h3 className="text-sm font-black text-[#172033] leading-snug">{course.name}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{course.department}</p>

                <div className="mt-4 space-y-2 pt-3 border-t border-gray-100 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Users size={13} />
                      Instructor:
                    </span>
                    <span className="font-semibold text-gray-800">{course.facultyName || 'Unassigned'}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <GraduationCap size={13} />
                      Cohort:
                    </span>
                    <span className="font-semibold text-gray-800">{course.groupName || 'Unassigned'}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Building2 size={13} />
                      Facility Type:
                    </span>
                    <span className="font-semibold text-[#13548E] px-2 py-0.5 rounded bg-[#F0F8FF] text-[10px]">
                      {course.roomType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="text-gray-400">Weekly Sessions:</span>
                    <span className="font-bold text-[#FC475C] font-mono">
                      {course.weeklySessions} × {course.duration}h
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => onEditCourse(course)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                  title="Edit Course"
                  aria-label={`Edit ${course.code}`}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => onDeleteCourse(course.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Delete Course"
                  aria-label={`Delete ${course.code}`}
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
