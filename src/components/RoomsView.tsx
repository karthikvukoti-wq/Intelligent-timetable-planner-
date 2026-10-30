/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, Users, MapPin, Search } from 'lucide-react';
import { Room, TimetableSlot } from '../utils/scheduler.ts';

interface RoomsViewProps {
  rooms: Room[];
  slots: TimetableSlot[];
  onAddRoom: () => void;
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (id: string) => void;
}

export const RoomsView: React.FC<RoomsViewProps> = ({
  rooms,
  slots,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = rooms.filter((r) => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.building.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div>
          <h2 className="text-base font-black text-[#172033]">Rooms & Campus Venues</h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure lecture halls, laboratories and seminar rooms with capacity thresholds
          </p>
        </div>
        <button
          onClick={onAddRoom}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-90 shadow-sm shadow-[#FC475C]/25 transition flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus size={15} />
          <span>Add Room</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search venue name, block, building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-[#FAFAFA]"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
        >
          <option value="all">All Room Types</option>
          <option value="Lecture">Lecture Hall</option>
          <option value="Lab">Lab Facility</option>
          <option value="Seminar">Seminar Room</option>
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((room) => {
          const roomSlots = slots.filter((s) => s.roomId === room.id);
          // Total weekly slot slots = 30 (6 per day * 5 days)
          const utilPercent = Math.min(100, Math.round((roomSlots.length / 30) * 100));

          return (
            <div
              key={room.id}
              className="bg-white rounded-3xl border border-[#edf0f5] shadow-2xs p-5 hover:border-gray-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F0F8FF] text-[#13548E] border border-[#CCE5FC] flex items-center justify-center font-bold text-sm shrink-0">
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#172033] font-mono">{room.name}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {room.type} Room
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#F8F9EE] text-[#505616] text-[10px] font-bold border border-[#E3E7BC]">
                    {room.capacity} seats
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{room.building}</span>
                </div>

                {/* Utilization Progress Bar */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#edf0f5] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-medium">Room Utilization:</span>
                    <span className="font-bold text-[#172033] font-mono">
                      {roomSlots.length} / 30 slots ({utilPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        utilPercent > 80
                          ? 'bg-rose-500'
                          : utilPercent > 40
                          ? 'bg-blue-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(5, utilPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => onEditRoom(room)}
                  className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                  title="Edit Room"
                  aria-label={`Edit ${room.name}`}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => onDeleteRoom(room.id)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Delete Room"
                  aria-label={`Delete ${room.name}`}
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
