/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertTriangle } from 'lucide-react';
import { Course, Faculty, StudentGroup } from '../../utils/scheduler.ts';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Partial<Course>) => void;
  courseToEdit: Course | null;
  facultyList: Faculty[];
  groupsList: StudentGroup[];
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courseToEdit,
  facultyList,
  groupsList,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [roomType, setRoomType] = useState<'Lecture' | 'Lab' | 'Seminar'>('Lecture');
  const [duration, setDuration] = useState(1);
  const [weeklySessions, setWeeklySessions] = useState(3);
  const [studentCount, setStudentCount] = useState(58);
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('Semester 3');
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseToEdit) {
      setCode(courseToEdit.code);
      setName(courseToEdit.name);
      setFacultyId(courseToEdit.facultyId);
      setGroupId(courseToEdit.groupId);
      setRoomType(courseToEdit.roomType || 'Lecture');
      setDuration(courseToEdit.duration || 1);
      setWeeklySessions(courseToEdit.weeklySessions || 3);
      setStudentCount(courseToEdit.studentCount || 58);
      setDepartment(courseToEdit.department || 'Computer Science');
      setSemester(courseToEdit.semester || 'Semester 3');
    } else {
      setCode('');
      setName('');
      setFacultyId(facultyList[0]?.id || '');
      setGroupId(groupsList[0]?.id || '');
      setRoomType('Lecture');
      setDuration(1);
      setWeeklySessions(3);
      setStudentCount(58);
      setDepartment('Computer Science');
      setSemester('Semester 3');
    }
    setError('');
  }, [courseToEdit, isOpen, facultyList, groupsList]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      setError('Course code and course title are required.');
      return;
    }

    const fac = facultyList.find((f) => f.id === facultyId);
    const grp = groupsList.find((g) => g.id === groupId);

    onSave({
      id: courseToEdit ? courseToEdit.id : undefined,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      facultyId,
      facultyName: fac?.name || '',
      groupId,
      groupName: grp?.name || '',
      roomType,
      duration: Number(duration) || 1,
      weeklySessions: Number(weeklySessions) || 3,
      studentCount: Number(studentCount) || 50,
      department,
      semester,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#edf0f5]">
        {/* Header */}
        <div className="p-6 border-b border-[#f1f3f9] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#F0F8FF] text-[#13548E] flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033]">
                {courseToEdit ? 'Edit Course Subject' : 'Add New Academic Course'}
              </h2>
              <p className="text-[11px] text-gray-500">Configure sessions, faculty and room constraints</p>
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Course Code
              </label>
              <input
                type="text"
                placeholder="e.g. CS301"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] font-mono uppercase"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Course Title
              </label>
              <input
                type="text"
                placeholder="e.g. Artificial Intelligence"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Assigned Instructor
              </label>
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-white font-medium"
              >
                {facultyList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Student Cohort (Section)
              </label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-white font-medium"
              >
                {groupsList.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.studentCount} students)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                <option value="Mathematics">Mathematics</option>
                <option value="Humanities & Management">Humanities & Management</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Semester Term
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-white"
              >
                <option value="Semester 1">Semester 1</option>
                <option value="Semester 2">Semester 2</option>
                <option value="Semester 3">Semester 3</option>
                <option value="Semester 4">Semester 4</option>
                <option value="Semester 5">Semester 5</option>
                <option value="Semester 6">Semester 6</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Facility Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-white font-semibold"
              >
                <option value="Lecture">Lecture Hall</option>
                <option value="Lab">Laboratory</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Duration (Hrs)
              </label>
              <input
                type="number"
                min="1"
                max="3"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Weekly Sessions
              </label>
              <input
                type="number"
                min="1"
                max="6"
                value={weeklySessions}
                onChange={(e) => setWeeklySessions(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
              />
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
              {courseToEdit ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
