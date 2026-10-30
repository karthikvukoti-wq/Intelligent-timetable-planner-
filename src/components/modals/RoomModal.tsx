/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Building2, AlertTriangle } from 'lucide-react';
import { Room } from '../../utils/scheduler.ts';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (room: Partial<Room>) => void;
  roomToEdit: Room | null;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  roomToEdit,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'Lecture' | 'Lab' | 'Seminar'>('Lecture');
  const [capacity, setCapacity] = useState(70);
  const [building, setBuilding] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (roomToEdit) {
      setName(roomToEdit.name);
      setType(roomToEdit.type);
      setCapacity(roomToEdit.capacity);
      setBuilding(roomToEdit.building);
    } else {
      setName('');
      setType('Lecture');
      setCapacity(70);
      setBuilding('Main Academic Block (2nd Floor)');
    }
    setError('');
  }, [roomToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Room identifier or name is required.');
      return;
    }

    onSave({
      id: roomToEdit ? roomToEdit.id : undefined,
      name: name.trim().toUpperCase(),
      type,
      capacity: Number(capacity) || 50,
      building: building.trim() || 'Main Campus',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#edf0f5]">
        {/* Header */}
        <div className="p-6 border-b border-[#f1f3f9] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F0F8FF] text-[#13548E] flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033]">
                {roomToEdit ? 'Edit Room Venue' : 'Register New Campus Room'}
              </h2>
              <p className="text-[11px] text-gray-500">Configure space capacity and room type</p>
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
              Room Identifier / Name
            </label>
            <input
              type="text"
              placeholder="e.g. A-204 or Lab-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8] font-mono uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Room Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8] bg-white font-semibold"
              >
                <option value="Lecture">Lecture Hall</option>
                <option value="Lab">Lab Facility</option>
                <option value="Seminar">Seminar Room</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Seating Capacity
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Building & Location
            </label>
            <input
              type="text"
              placeholder="e.g. Main Academic Block (2nd Floor)"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8]"
            />
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
              {roomToEdit ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
