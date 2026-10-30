/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Users, AlertTriangle } from 'lucide-react';
import { Faculty, DAYS } from '../../utils/scheduler.ts';

interface FacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faculty: Partial<Faculty>) => void;
  facultyToEdit: Faculty | null;
}

export const FacultyModal: React.FC<FacultyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  facultyToEdit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [maxWeeklyHours, setMaxWeeklyHours] = useState(16);
  const [availableDays, setAvailableDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [error, setError] = useState('');

  useEffect(() => {
    if (facultyToEdit) {
      setName(facultyToEdit.name);
      setEmail(facultyToEdit.email);
      setDepartment(facultyToEdit.department);
      setMaxWeeklyHours(facultyToEdit.maxWeeklyHours || 16);
      if (facultyToEdit.availability) {
        const days = Object.keys(facultyToEdit.availability).filter(
          (d) => facultyToEdit.availability[d]?.length > 0
        );
        setAvailableDays(days.length > 0 ? days : [...DAYS]);
      } else {
        setAvailableDays([...DAYS]);
      }
    } else {
      setName('');
      setEmail('');
      setDepartment('Computer Science');
      setMaxWeeklyHours(16);
      setAvailableDays([...DAYS]);
    }
    setError('');
  }, [facultyToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length === 1) {
        setError('Faculty must be available on at least one day.');
        return;
      }
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Faculty name is required.');
      return;
    }

    const availability: Record<string, string[]> = {};
    for (const d of availableDays) {
      availability[d] = ['09:00-16:30'];
    }

    onSave({
      id: facultyToEdit ? facultyToEdit.id : undefined,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z]/g, '')}@vignan.edu`,
      department,
      maxWeeklyHours: Number(maxWeeklyHours) || 16,
      availability,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#edf0f5]">
        {/* Header */}
        <div className="p-6 border-b border-[#f1f3f9] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFF7EE] text-[#8E4702] flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033]">
                {facultyToEdit ? 'Edit Instructor Profile' : 'Add New Faculty Member'}
              </h2>
              <p className="text-[11px] text-gray-500">Manage teaching load and weekly availability</p>
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

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Full Name & Title
            </label>
            <input
              type="text"
              placeholder="e.g. Dr. Meera Rao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Official Email
              </label>
              <input
                type="email"
                placeholder="meera.rao@vignan.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-white"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Systems & Networks">Systems & Networks</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Max Weekly Teaching Hours
            </label>
            <input
              type="number"
              min="4"
              max="35"
              value={maxWeeklyHours}
              onChange={(e) => setMaxWeeklyHours(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
              Weekly Available Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const checked = availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                      checked
                        ? 'bg-[#FC475C] text-white border-[#FC475C] shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
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
              className="px-5 py-2 text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-90 rounded-xl shadow-sm shadow-[#FC475C]/30 transition"
            >
              {facultyToEdit ? 'Save Changes' : 'Create Faculty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
