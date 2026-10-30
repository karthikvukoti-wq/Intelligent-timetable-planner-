/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Sparkles,
  Printer,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  GraduationCap,
  Play,
  Layers,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  Course,
  Faculty,
  Room,
  StudentGroup,
  TimetableSlot,
  ValidationResult,
  DAYS,
  TIME_SLOTS,
  SLOT_DURATIONS,
  getCourseColor,
  getWeekDates,
} from '../utils/scheduler.ts';

interface TimetableViewProps {
  slots: TimetableSlot[];
  courses: Course[];
  faculty: Faculty[];
  rooms: Room[];
  groups: StudentGroup[];
  validation: ValidationResult | null;
  onGenerate: () => void;
  isGenerating: boolean;
  onOpenValidation: () => void;
  onSelectSlot: (slot: TimetableSlot) => void;
  onSaveTimetable: () => void;
  onOpenSavedTimetables: () => void;
  notice: string | null;
}

export const TimetableView: React.FC<TimetableViewProps> = ({
  slots,
  courses,
  faculty,
  rooms,
  groups,
  validation,
  onGenerate,
  isGenerating,
  onOpenValidation,
  onSelectSlot,
  onSaveTimetable,
  onOpenSavedTimetables,
  notice,
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekInfo = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  // Filters
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered slots
  const filteredSlots = useMemo(() => {
    return slots.filter((s) => {
      if (selectedGroup !== 'all' && s.groupId !== selectedGroup) return false;
      if (selectedRoom !== 'all' && s.roomId !== selectedRoom) return false;
      if (selectedFaculty !== 'all' && s.facultyId !== selectedFaculty) return false;
      if (selectedSemester !== 'all' && s.semester !== selectedSemester) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchCode = s.courseCode.toLowerCase().includes(query);
        const matchName = s.courseName.toLowerCase().includes(query);
        const matchFac = s.facultyName.toLowerCase().includes(query);
        const matchRoom = s.roomName.toLowerCase().includes(query);
        if (!matchCode && !matchName && !matchFac && !matchRoom) return false;
      }
      return true;
    });
  }, [slots, selectedGroup, selectedRoom, selectedFaculty, selectedSemester, searchQuery]);

  const hasActiveFilters =
    selectedGroup !== 'all' ||
    selectedRoom !== 'all' ||
    selectedFaculty !== 'all' ||
    selectedSemester !== 'all' ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedGroup('all');
    setSelectedRoom('all');
    setSelectedFaculty('all');
    setSelectedSemester('all');
    setSearchQuery('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Notice alert banner */}
      {notice && (
        <div className="p-4 rounded-2xl bg-linear-to-r from-[#FFF0F2] to-[#FFF7EE] border border-[#FDC4CC] text-[#981B2B] text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Sparkles size={16} className="text-[#FC475C] shrink-0" />
            <span>{notice}</span>
          </div>
        </div>
      )}

      {/* Control Header: Week Navigator + Primary Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#edf0f5] shadow-2xs">
        {/* Week navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="p-1.5 hover:bg-white rounded-lg text-gray-600 transition"
              title="Previous week"
              aria-label="Previous week"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-white rounded-lg transition"
            >
              Today
            </button>
            <button
              onClick={() => setWeekOffset((prev) => prev + 1)}
              className="p-1.5 hover:bg-white rounded-lg text-gray-600 transition"
              title="Next week"
              aria-label="Next week"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#172033]">
                Week {weekInfo.weekNumber}, {weekInfo.year}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#F0F8FF] text-[#13548E] text-[10px] font-bold">
                {weekInfo.startDate} – {weekInfo.endDate}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">Academic Term • Autumn 2026</p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-90 shadow-sm shadow-[#FC475C]/25 transition flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isGenerating ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play size={14} />
            )}
            <span>{isGenerating ? 'Solving CSP...' : 'Generate Timetable'}</span>
          </button>

          <button
            onClick={onSaveTimetable}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition flex items-center gap-1.5 shadow-2xs"
          >
            <Bookmark size={14} className="text-[#6558e8]" />
            <span>Save & Publish</span>
          </button>

          <button
            onClick={onOpenSavedTimetables}
            className="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition flex items-center gap-1.5 shadow-2xs"
            title="Archived schedules"
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Saved</span>
          </button>

          <button
            onClick={onOpenValidation}
            className="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition flex items-center gap-1.5 shadow-2xs"
            title="Audit Schedule"
          >
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Audit</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition shadow-2xs"
            title="Print or Save PDF"
            aria-label="Print timetable"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-[#edf0f5] shadow-2xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search course, code, faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-[#FAFAFA]"
          />
        </div>

        {/* Group/Cohort Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FC475C] font-semibold text-gray-700"
          >
            <option value="all">All Cohorts</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                Cohort: {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FC475C] font-semibold text-gray-700"
          >
            <option value="all">All Rooms</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                Room: {r.name} ({r.type})
              </option>
            ))}
          </select>
        </div>

        {/* Faculty Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FC475C] font-semibold text-gray-700"
          >
            <option value="all">All Faculty</option>
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FC475C] font-semibold text-gray-700"
          >
            <option value="all">All Semesters</option>
            <option value="Semester 1">Semester 1</option>
            <option value="Semester 2">Semester 2</option>
            <option value="Semester 3">Semester 3</option>
            <option value="Semester 4">Semester 4</option>
          </select>
        </div>

        {/* Reset filter button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-2.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition"
          >
            <X size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Timetable Print & Matrix Container */}
      <div className="timetable-print-container bg-white rounded-3xl border border-[#edf0f5] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[840px]">
            {/* Header: Days of the week */}
            <thead>
              <tr className="border-b border-[#edf0f5] bg-[#FAFAFA]">
                <th className="py-4 px-4 text-left w-28 border-r border-[#edf0f5]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    Time Slot
                  </span>
                </th>
                {weekInfo.dates.map((dateObj) => {
                  const daySlotsCount = filteredSlots.filter((s) => s.day === dateObj.day).length;
                  return (
                    <th
                      key={dateObj.day}
                      className="py-4 px-4 text-left border-r border-[#edf0f5] last:border-r-0 min-w-[140px]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-[#172033] block">
                            {dateObj.day}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {dateObj.fullDate}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-gray-500 border border-gray-200">
                          {daySlotsCount}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Matrix Body: Slot rows */}
            <tbody className="divide-y divide-[#edf0f5]">
              {TIME_SLOTS.map((time) => {
                const endTime = SLOT_DURATIONS[time] || '10:00';
                return (
                  <tr key={time} className="hover:bg-gray-50/50 transition">
                    {/* Time Column */}
                    <td className="py-4 px-4 align-top border-r border-[#edf0f5] bg-[#FAFAFA]/70">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#172033] font-mono">
                          {time}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {endTime}
                        </span>
                      </div>
                    </td>

                    {/* Day Cells */}
                    {DAYS.map((day) => {
                      const matchedSlots = filteredSlots.filter(
                        (s) => s.day === day && s.start === time
                      );

                      return (
                        <td
                          key={day}
                          className="py-2.5 px-2.5 align-top border-r border-[#edf0f5] last:border-r-0 h-28"
                        >
                          {matchedSlots.length > 0 ? (
                            <div className="space-y-2">
                              {matchedSlots.map((slot) => {
                                const palette = getCourseColor(slot.courseCode);
                                return (
                                  <div
                                    key={slot.id}
                                    onClick={() => onSelectSlot(slot)}
                                    style={{
                                      backgroundColor: palette.bg,
                                      borderColor: palette.border,
                                    }}
                                    className="p-2.5 rounded-2xl border hover:shadow-md transition cursor-pointer text-left relative group select-none"
                                  >
                                    {/* Course Code & Conflict-free badge */}
                                    <div className="flex items-center justify-between gap-1 mb-1.5">
                                      <span
                                        style={{
                                          backgroundColor: palette.badgeBg,
                                          color: palette.badgeText,
                                        }}
                                        className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase tracking-wider"
                                      >
                                        {slot.courseCode}
                                      </span>
                                      <span className="text-[9px] font-bold text-gray-400">
                                        {slot.groupName}
                                      </span>
                                    </div>

                                    {/* Course Name */}
                                    <p
                                      style={{ color: palette.text }}
                                      className="text-xs font-bold line-clamp-1 leading-snug"
                                    >
                                      {slot.courseName}
                                    </p>

                                    {/* Room & Faculty details */}
                                    <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between text-[10px] text-gray-600">
                                      <span className="flex items-center gap-1 font-semibold truncate max-w-[90px]">
                                        <Building2 size={11} className="shrink-0 text-gray-400" />
                                        {slot.roomName}
                                      </span>
                                      <span className="truncate max-w-[80px] text-right font-medium text-gray-500">
                                        {slot.facultyName.split(' ')[0]} {slot.facultyName.split(' ')[1] || ''}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="h-full w-full rounded-xl border border-dashed border-gray-100 flex items-center justify-center opacity-40 hover:opacity-100 transition">
                              <span className="text-[10px] text-gray-300 font-mono">—</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer of the grid */}
        <div className="p-4 bg-gray-50 border-t border-[#edf0f5] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Showing {filteredSlots.length} of {slots.length} scheduled sessions</span>
          </div>
          <span className="text-[11px] text-gray-400">
            Click any lecture card to view constraint details & Ask Gemini AI
          </span>
        </div>
      </div>
    </div>
  );
};
