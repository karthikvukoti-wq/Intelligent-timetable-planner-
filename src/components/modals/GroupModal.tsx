/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, GraduationCap, AlertTriangle } from 'lucide-react';
import { StudentGroup } from '../../utils/scheduler.ts';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Partial<StudentGroup>) => void;
  groupToEdit: StudentGroup | null;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  groupToEdit,
}) => {
  const [name, setName] = useState('');
  const [studentCount, setStudentCount] = useState(58);
  const [semester, setSemester] = useState('Semester 3');
  const [department, setDepartment] = useState('Computer Science');
  const [avoidLateSlots, setAvoidLateSlots] = useState(true);
  const [maxSessionsPerDay, setMaxSessionsPerDay] = useState(5);
  const [error, setError] = useState('');

  useEffect(() => {
    if (groupToEdit) {
      setName(groupToEdit.name);
      setStudentCount(groupToEdit.studentCount || 58);
      setSemester(groupToEdit.semester || 'Semester 3');
      setDepartment(groupToEdit.department || 'Computer Science');
      setAvoidLateSlots(groupToEdit.avoidLateSlots ?? true);
      setMaxSessionsPerDay(groupToEdit.maxSessionsPerDay || 5);
    } else {
      setName('');
      setStudentCount(58);
      setSemester('Semester 3');
      setDepartment('Computer Science');
      setAvoidLateSlots(true);
      setMaxSessionsPerDay(5);
    }
    setError('');
  }, [groupToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Group or section name is required.');
      return;
    }

    onSave({
      id: groupToEdit ? groupToEdit.id : undefined,
      name: name.trim().toUpperCase(),
      studentCount: Number(studentCount) || 50,
      semester,
      department,
      avoidLateSlots,
      maxSessionsPerDay: Number(maxSessionsPerDay) || 5,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#edf0f5]">
        {/* Header */}
        <div className="p-6 border-b border-[#f1f3f9] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F3F5FE] text-[#2C3E96] flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033]">
                {groupToEdit ? 'Edit Student Cohort' : 'Register New Student Batch'}
              </h2>
              <p className="text-[11px] text-gray-500">Configure class size and schedule preferences</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Group / Section Name
              </label>
              <input
                type="text"
                placeholder="e.g. CSE-2A or AI&DS-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8] font-mono uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Student Enrolled Count
              </label>
              <input
                type="number"
                min="10"
                max="250"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8] bg-white font-medium"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8] bg-white"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Information Tech">Information Tech</option>
              </select>
            </div>
          </div>

          {/* Soft Preferences */}
          <div className="pt-2 border-t border-[#f1f3f9] space-y-3">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
              Scheduling Soft Preferences
            </span>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={avoidLateSlots}
                onChange={(e) => setAvoidLateSlots(e.target.checked)}
                className="w-4 h-4 rounded text-[#FC475C] focus:ring-[#FC475C] border-gray-300"
              />
              <span className="text-xs text-gray-700 font-medium">
                Avoid evening slots (&gt;= 15:15)
              </span>
            </label>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Max sessions per day
              </label>
              <div className="flex gap-2">
                {[4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMaxSessionsPerDay(num)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                      maxSessionsPerDay === num
                        ? 'bg-[#172033] text-white border-[#172033]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {num} sessions
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#f1f3f9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#6558e8] hover:bg-[#5346d8] rounded-xl shadow-sm shadow-[#6558e8]/30 transition"
            >
              {groupToEdit ? 'Save Changes' : 'Create Cohort'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
