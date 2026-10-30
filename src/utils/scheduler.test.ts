/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseMinutes,
  isTimeOverlapping,
  isFacultyAvailable,
  validateSchedule,
  generateCspTimetable,
  getCourseColor,
  Course,
  Room,
  Faculty,
  StudentGroup,
  TimetableSlot,
} from './scheduler';

test('parseMinutes converts HH:MM to total day minutes correctly', () => {
  assert.equal(parseMinutes('00:00'), 0);
  assert.equal(parseMinutes('09:00'), 540);
  assert.equal(parseMinutes('10:15'), 615);
  assert.equal(parseMinutes('16:30'), 990);
});

test('isTimeOverlapping detects interval collisions on the same day', () => {
  // Same day overlapping
  assert.equal(isTimeOverlapping('Monday', '09:00', '10:00', 'Monday', '09:30', '10:30'), true);
  // Same day non-overlapping adjacent
  assert.equal(isTimeOverlapping('Monday', '09:00', '10:00', 'Monday', '10:00', '11:00'), false);
  // Different days
  assert.equal(isTimeOverlapping('Monday', '09:00', '10:00', 'Tuesday', '09:00', '10:00'), false);
});

test('isFacultyAvailable checks weekly availability time ranges', () => {
  const faculty: Faculty = {
    id: 'fac_1',
    name: 'Dr. Rao',
    email: 'rao@univ.edu',
    department: 'CS',
    maxWeeklyHours: 18,
    availability: {
      Monday: ['09:00-14:00'],
      Friday: ['09:00-12:00'],
    },
  };

  assert.equal(isFacultyAvailable(faculty, 'Monday', '09:00', '10:00'), true);
  assert.equal(isFacultyAvailable(faculty, 'Monday', '14:00', '15:00'), false);
  assert.equal(isFacultyAvailable(faculty, 'Friday', '12:00', '13:00'), false);
  // Day not listed in availability defaults to open
  assert.equal(isFacultyAvailable(faculty, 'Wednesday', '09:00', '10:00'), true);
});

test('validateSchedule identifies capacity and overlap violations', () => {
  const rooms: Room[] = [{ id: 'rm_1', name: 'A-101', type: 'Lecture', capacity: 40, building: 'Block 1' }];
  const faculty: Faculty[] = [{ id: 'fac_1', name: 'Dr. Rao', email: 'rao@u.edu', department: 'CS', maxWeeklyHours: 20, availability: {} }];
  const groups: StudentGroup[] = [{ id: 'grp_1', name: 'CSE-A', studentCount: 50, semester: 'Sem 3', department: 'CS' }];
  const courses: Course[] = [
    {
      id: 'c1',
      code: 'CS101',
      name: 'Algorithms',
      facultyId: 'fac_1',
      facultyName: 'Dr. Rao',
      groupId: 'grp_1',
      groupName: 'CSE-A',
      roomType: 'Lecture',
      duration: 1,
      weeklySessions: 1,
      studentCount: 50,
      department: 'CS',
      semester: 'Sem 3',
    },
  ];

  const slot: TimetableSlot = {
    id: 'slot_1',
    day: 'Monday',
    start: '09:00',
    end: '10:00',
    courseId: 'c1',
    courseCode: 'CS101',
    courseName: 'Algorithms',
    facultyId: 'fac_1',
    facultyName: 'Dr. Rao',
    roomId: 'rm_1',
    roomName: 'A-101',
    groupId: 'grp_1',
    groupName: 'CSE-A',
    roomType: 'Lecture',
    department: 'CS',
    semester: 'Sem 3',
  };

  const validation = validateSchedule([slot], rooms, faculty, groups, courses);
  assert.equal(validation.isConflictFree, false);
  assert.equal(validation.violations.length, 1);
  assert.equal(validation.violations[0].type, 'capacity_exceeded');
});

test('generateCspTimetable creates a conflict-free schedule with backtracking', () => {
  const courses: Course[] = [
    {
      id: 'c1',
      code: 'CS301',
      name: 'Artificial Intelligence',
      facultyId: 'fac_meera',
      facultyName: 'Dr. Meera Rao',
      groupId: 'grp_cse_2a',
      groupName: 'CSE-2A',
      roomType: 'Lecture',
      duration: 1,
      weeklySessions: 3,
      studentCount: 58,
      department: 'Computer Science',
      semester: 'Semester 3',
    },
    {
      id: 'c2',
      code: 'CS302',
      name: 'Database Management',
      facultyId: 'fac_arjun',
      facultyName: 'Prof. Arjun Kumar',
      groupId: 'grp_cse_2a',
      groupName: 'CSE-2A',
      roomType: 'Lecture',
      duration: 1,
      weeklySessions: 3,
      studentCount: 58,
      department: 'Computer Science',
      semester: 'Semester 3',
    },
  ];

  const rooms: Room[] = [
    { id: 'rm_a204', name: 'A-204', type: 'Lecture', capacity: 70, building: 'Main Academic Block' },
  ];

  const faculty: Faculty[] = [
    {
      id: 'fac_meera',
      name: 'Dr. Meera Rao',
      email: 'meera.rao@vignan.edu',
      department: 'Computer Science',
      maxWeeklyHours: 18,
      availability: {
        Monday: ['09:00-16:30'],
        Tuesday: ['09:00-16:30'],
        Wednesday: ['09:00-16:30'],
        Thursday: ['09:00-16:30'],
        Friday: ['09:00-14:00'],
      },
    },
    {
      id: 'fac_arjun',
      name: 'Prof. Arjun Kumar',
      email: 'arjun.k@vignan.edu',
      department: 'Computer Science',
      maxWeeklyHours: 16,
      availability: {
        Monday: ['09:00-16:30'],
        Tuesday: ['09:00-16:30'],
        Wednesday: ['09:00-16:30'],
        Thursday: ['09:00-16:30'],
        Friday: ['09:00-16:30'],
      },
    },
  ];

  const groups: StudentGroup[] = [
    {
      id: 'grp_cse_2a',
      name: 'CSE-2A',
      studentCount: 58,
      semester: 'Semester 3',
      department: 'Computer Science',
      preferredStart: '09:00',
      preferredEnd: '16:30',
      avoidLateSlots: true,
      maxSessionsPerDay: 5,
    },
  ];

  const result = generateCspTimetable(courses, rooms, faculty, groups);

  assert.equal(result.slots.length, 6); // 3 sessions for c1 + 3 sessions for c2
  assert.equal(result.validation.isConflictFree, true);
  assert.equal(result.validation.hardConflicts, 0);
  assert.ok(result.validation.score >= 80);
});

test('getCourseColor produces consistent deterministic palette matches', () => {
  const color1 = getCourseColor('CS301');
  const color2 = getCourseColor('CS301');
  assert.equal(color1.key, color2.key);
  assert.ok(color1.hex.startsWith('#'));
});
