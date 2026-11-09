/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, Clock, Building2, User, GraduationCap } from 'lucide-react';
import { TimetableSlot, getCourseColor } from '../../utils/scheduler.ts';

interface SlotDetailModalProps {
  slot: TimetableSlot | null;
  onClose: () => void;
}

export const SlotDetailModal: React.FC<SlotDetailModalProps> = ({ slot, onClose }) => {
  if (!slot) return null;

  const color = getCourseColor(slot.courseCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-[#edf0f5]">
        {/* Header with palette styling */}
        <div
          className="p-6 border-b flex items-start justify-between"
          style={{ backgroundColor: color.bg, borderColor: color.border }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-black tracking-wider uppercase"
                style={{ backgroundColor: color.badgeBg, color: color.badgeText }}
              >
                {slot.courseCode}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-emerald-800 text-[10px] font-bold flex items-center gap-1 border border-emerald-200 shadow-2xs">
                <CheckCircle2 size={11} className="text-emerald-600" />
                <span>Conflict-Free</span>
              </span>
            </div>
            <h2 className="text-base font-black tracking-tight" style={{ color: color.text }}>
              {slot.courseName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-white/80 transition"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FCFCFC] border border-[#edf0f5]">
              <span className="text-[10px] uppercase font-extrabold text-gray-400 flex items-center gap-1.5 mb-1">
                <Clock size={12} className="text-[#FC475C]" />
                <span>Day & Period</span>
              </span>
              <p className="text-xs font-black text-[#172033]">{slot.day}</p>
              <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                {slot.start} – {slot.end}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCFCFC] border border-[#edf0f5]">
              <span className="text-[10px] uppercase font-extrabold text-gray-400 flex items-center gap-1.5 mb-1">
                <Building2 size={12} className="text-[#96CCF6]" />
                <span>Classroom Venue</span>
              </span>
              <p className="text-xs font-black text-[#172033]">{slot.roomName}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{slot.roomType} Facility</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FCFCFC] border border-[#edf0f5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7EE] text-[#FDB365] border border-[#FED9B2] flex items-center justify-center font-bold text-xs shrink-0">
              <User size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-gray-400">Assigned Instructor</span>
              <p className="text-xs font-black text-[#172033]">{slot.facultyName}</p>
              <p className="text-[10px] text-gray-400">{slot.department}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FCFCFC] border border-[#edf0f5] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9EE] text-[#CAD187] border border-[#E3E7BC] flex items-center justify-center font-bold text-xs shrink-0">
              <GraduationCap size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold text-gray-400">Enrolled Cohort</span>
              <p className="text-xs font-black text-[#172033]">{slot.groupName}</p>
              <p className="text-[10px] text-gray-400">{slot.semester}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
