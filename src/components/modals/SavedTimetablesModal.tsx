/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Layers, Calendar, Trash2, ArrowRight, Bookmark } from 'lucide-react';
import { SavedTimetable } from '../../utils/storage.ts';
import { TimetableSlot } from '../../utils/scheduler.ts';

interface SavedTimetablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTimetables: SavedTimetable[];
  onLoadTimetable: (slots: TimetableSlot[], name: string) => void;
  onDeleteTimetable: (id: string) => void;
}

export const SavedTimetablesModal: React.FC<SavedTimetablesModalProps> = ({
  isOpen,
  onClose,
  savedTimetables,
  onLoadTimetable,
  onDeleteTimetable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs">
      <div className="bg-[#FCFCFC] rounded-3xl shadow-2xl w-full max-w-xl max-h-[600px] flex flex-col overflow-hidden border border-[#edf0f5]">
        {/* Header */}
        <div className="p-6 border-b border-[#f1f3f9] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#FDC4CC] text-[#FC475C] flex items-center justify-center shadow-xs">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#172033] tracking-tight">Previously Saved Timetables</h2>
              <p className="text-xs text-gray-500">
                Browse, restore, and manage published schedules stored in Supabase PostgreSQL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* List of archives */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5">
          {savedTimetables.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-300 mx-auto flex items-center justify-center">
                <Bookmark size={24} />
              </div>
              <h3 className="text-sm font-bold text-gray-700">No Saved Timetables Yet</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Generate a timetable using the CSP engine and click "Save & Publish" to archive it here.
              </p>
            </div>
          ) : (
            savedTimetables.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-[#edf0f5] hover:border-gray-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#172033]">{item.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-gray-600">{item.sessions_count} sessions</span>
                    <span>•</span>
                    <span className="text-[#2C3E96] font-bold">Score {item.score}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadTimetable(item.slots || [], item.name);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-95 transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>Load Timetable</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteTimetable(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    title="Delete saved timetable"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-[#edf0f5] flex items-center justify-between text-xs text-gray-500">
          <span>Total Archives: {savedTimetables.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
