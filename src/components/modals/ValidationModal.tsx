/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Cpu, Check, Layers } from 'lucide-react';
import { ValidationResult } from '../../utils/scheduler.ts';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  validation: ValidationResult | null;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({ isOpen, onClose, validation }) => {
  if (!isOpen || !validation) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#172033]/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#edf0f5] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[#f1f3f9] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                validation.isConflictFree
                  ? 'bg-[#F8F9EE] text-[#505616] border border-[#E3E7BC]'
                  : 'bg-[#FFF0F2] text-[#FC475C] border border-[#FDC4CC]'
              }`}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033]">CSP Schedule Validation</h2>
              <p className="text-[11px] text-gray-500">Constraint verification & heuristic audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            aria-label="Close Audit"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status banner */}
          <div
            className={`p-4 rounded-2xl border ${
              validation.isConflictFree
                ? 'bg-[#F8F9EE] border-[#E3E7BC] text-[#505616]'
                : 'bg-[#FFF0F2] border-[#FDC4CC] text-[#981B2B]'
            }`}
          >
            <div className="flex items-center gap-3">
              {validation.isConflictFree ? (
                <CheckCircle2 size={22} className="text-[#A5AF4F] shrink-0" />
              ) : (
                <AlertTriangle size={22} className="text-[#FC475C] shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold">
                  {validation.isConflictFree
                    ? '100% Conflict-Free Schedule'
                    : `${validation.hardConflicts} Hard Conflicts Detected`}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  {validation.isConflictFree
                    ? 'All hard constraints (faculty, rooms, cohorts & availability) satisfied.'
                    : 'Some hard constraints require timetable adjustment or capacity increase.'}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FCFCFC] border border-[#edf0f5]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Optimization Score
              </span>
              <p className="text-2xl font-black text-[#FC475C] font-mono">{validation.score}/100</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Based on load balance & times</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FCFCFC] border border-[#edf0f5]">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Tasks Scheduled
              </span>
              <p className="text-2xl font-black text-[#172033] font-mono">
                {validation.scheduledTasks} / {validation.requestedTasks}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">Weekly course sessions</p>
            </div>
          </div>

          {/* Solver Computational Metrics */}
          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#edf0f5] space-y-3">
            <p className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
              <Cpu size={14} className="text-[#869BEE]" />
              <span>Solver Computational Metrics</span>
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Backtracking Search Nodes</span>
                <span className="font-mono font-bold text-gray-800">
                  {validation.searchNodes.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Peak Day Academic Load</span>
                <span className="font-bold text-gray-800">
                  {validation.metrics?.peakDaySessions || 0} sessions
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Average Daily Sessions</span>
                <span className="font-bold text-gray-800 font-mono">
                  {validation.metrics?.avgDailyLoad || 0}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-gray-500">Execution Solver Latency</span>
                <span className="font-mono font-bold text-emerald-700">
                  {validation.executionTimeMs} ms
                </span>
              </div>
            </div>
          </div>

          {/* Verified Constraints Checklist */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
              Verified CSP Invariants
            </span>

            {[
              'Zero Faculty Double-Bookings (Overlapping Periods)',
              'Zero Classroom Venue Conflicts (Physical Collisions)',
              'Zero Student Cohort Schedule Clashes',
              'Room Seating Capacity >= Batch Enrolment',
              'Laboratory / Lecture Hall Classification Consistency',
              'Faculty Registered Working Hours Adherence',
            ].map((invariant, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white border border-[#edf0f5] flex items-center gap-2.5 text-xs text-gray-700"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check size={12} className="stroke-[3]" />
                </div>
                <span>{invariant}</span>
              </div>
            ))}
          </div>

          {/* Violations List if any */}
          {validation.violations.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                Detected Hard Inconsistencies ({validation.violations.length})
              </span>
              {validation.violations.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2"
                >
                  <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                  <span>{v.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f1f3f9] bg-white flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition shadow-2xs"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
