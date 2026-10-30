/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Course {
  id: string;
  code: string;
  name: string;
  facultyId: string;
  facultyName: string;
  groupId: string;
  groupName: string;
  roomType: 'Lecture' | 'Lab' | 'Seminar';
  duration: number; // in hours, default 1
  weeklySessions: number;
  studentCount: number;
  department: string;
  semester: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  maxWeeklyHours: number;
  availability: Record<string, string[]>; // e.g. { Monday: ['09:00-16:30'] }
}

export interface Room {
  id: string;
  name: string;
  type: 'Lecture' | 'Lab' | 'Seminar';
  capacity: number;
  building: string;
}

export interface StudentGroup {
  id: string;
  name: string;
  studentCount: number;
  semester: string;
  department: string;
  preferredStart?: string;
  preferredEnd?: string;
  avoidLateSlots?: boolean;
  maxSessionsPerDay?: number;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  start: string; // e.g. "09:00"
  end: string;   // e.g. "10:00"
  courseId: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  roomId: string;
  roomName: string;
  groupId: string;
  groupName: string;
  roomType: 'Lecture' | 'Lab' | 'Seminar';
  department: string;
  semester: string;
}

export interface Violation {
  type: 'capacity_exceeded' | 'room_type_mismatch' | 'faculty_unavailable' | 'faculty_clash' | 'room_clash' | 'group_clash';
  severity: 'hard' | 'soft';
  description: string;
  slotsInvolved: string[];
}

export interface ValidationResult {
  isConflictFree: boolean;
  hardConflicts: number;
  violations: Violation[];
  scheduledTasks: number;
  requestedTasks: number;
  searchNodes: number;
  executionTimeMs: number;
  score: number;
  dailyDistribution: Record<string, number>;
  metrics: {
    facultyUtilization: number;
    roomUtilization: number;
    peakDaySessions: number;
    avgDailyLoad: number;
  };
}

export const DAYS: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const TIME_SLOTS = ['09:00', '10:15', '11:30', '12:45', '14:00', '15:15'];

export const SLOT_DURATIONS: Record<string, string> = {
  '09:00': '10:00',
  '10:15': '11:15',
  '11:30': '12:30',
  '12:45': '13:45',
  '14:00': '15:00',
  '15:15': '16:15',
};

export interface ColorScheme {
  key: string;
  name: string;
  hex: string;
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
  pillBg: string;
  pillText: string;
}

export const COLOR_PALETTE: ColorScheme[] = [
  {
    key: 'coral',
    name: 'Coral',
    hex: '#FC475C',
    bg: '#FFF0F2',
    border: '#FDC4CC',
    text: '#981B2B',
    badgeBg: '#FC475C',
    badgeText: '#FFFFFF',
    accent: '#FC475C',
    pillBg: '#FFE3E7',
    pillText: '#B82034',
  },
  {
    key: 'lightblue',
    name: 'Light Blue',
    hex: '#96CCF6',
    bg: '#F0F8FF',
    border: '#CCE5FC',
    text: '#13548E',
    badgeBg: '#5FAFF3',
    badgeText: '#FFFFFF',
    accent: '#479FEA',
    pillBg: '#E2F1FD',
    pillText: '#1B69B1',
  },
  {
    key: 'mutedgreen',
    name: 'Muted Green',
    hex: '#CAD187',
    bg: '#F8F9EE',
    border: '#E3E7BC',
    text: '#505616',
    badgeBg: '#B3BC67',
    badgeText: '#FFFFFF',
    accent: '#A5AF4F',
    pillBg: '#EDF1D2',
    pillText: '#5A6219',
  },
  {
    key: 'softorange',
    name: 'Soft Orange',
    hex: '#FDB365',
    bg: '#FFF7EE',
    border: '#FED9B2',
    text: '#8E4702',
    badgeBg: '#FCA03E',
    badgeText: '#FFFFFF',
    accent: '#FDB365',
    pillBg: '#FFEEDD',
    pillText: '#A8570A',
  },
  {
    key: 'lavender',
    name: 'Lavender',
    hex: '#869BEE',
    bg: '#F3F5FE',
    border: '#C8D2F8',
    text: '#2C3E96',
    badgeBg: '#7088EA',
    badgeText: '#FFFFFF',
    accent: '#869BEE',
    pillBg: '#E5EAFA',
    pillText: '#374EB7',
  },
];

export function getCourseColor(identifier: string): ColorScheme {
  if (!identifier) return COLOR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
}

export function parseMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function isTimeOverlapping(
  day1: string,
  start1: string,
  end1: string,
  day2: string,
  start2: string,
  end2: string
): boolean {
  if (day1 !== day2) return false;
  const s1 = parseMinutes(start1);
  const e1 = parseMinutes(end1);
  const s2 = parseMinutes(start2);
  const e2 = parseMinutes(end2);
  return s1 < e2 && s2 < e1;
}

export function isFacultyAvailable(
  faculty: Faculty | undefined,
  day: string,
  start: string,
  end: string
): boolean {
  if (!faculty || !faculty.availability) return true;
  const dayRanges = faculty.availability[day];
  if (!dayRanges || dayRanges.length === 0) return true;

  const reqStart = parseMinutes(start);
  const reqEnd = parseMinutes(end);

  return dayRanges.some((range) => {
    const [rStart, rEnd] = range.split('-');
    if (!rStart || !rEnd) return true;
    const winStart = parseMinutes(rStart.trim());
    const winEnd = parseMinutes(rEnd.trim());
    return reqStart >= winStart && reqEnd <= winEnd;
  });
}

export function validateSchedule(
  slots: TimetableSlot[],
  rooms: Room[],
  faculty: Faculty[],
  groups: StudentGroup[],
  courses: Course[]
): ValidationResult {
  const violations: Violation[] = [];
  const roomMap = new Map<string, Room>(rooms.map((r) => [r.id, r]));
  const facultyMap = new Map<string, Faculty>(faculty.map((f) => [f.id, f]));
  const groupMap = new Map<string, StudentGroup>(groups.map((g) => [g.id, g]));

  // 1. Single-slot checks: capacity, room type, faculty availability
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const room = roomMap.get(slot.roomId);
    const fac = facultyMap.get(slot.facultyId);
    const grp = groupMap.get(slot.groupId);

    if (room) {
      const course = courses.find((c) => c.id === slot.courseId);
      const studentCount = course ? course.studentCount : grp?.studentCount || 0;

      if (room.capacity < studentCount) {
        violations.push({
          type: 'capacity_exceeded',
          severity: 'hard',
          description: `Room "${room.name}" capacity (${room.capacity}) is too small for "${slot.courseCode}" (${studentCount} students)`,
          slotsInvolved: [slot.id],
        });
      }

      if (slot.roomType && room.type !== slot.roomType) {
        violations.push({
          type: 'room_type_mismatch',
          severity: 'hard',
          description: `Course "${slot.courseName}" requires "${slot.roomType}" but assigned to "${room.type}" room "${room.name}"`,
          slotsInvolved: [slot.id],
        });
      }
    }

    if (fac && !isFacultyAvailable(fac, slot.day, slot.start, slot.end)) {
      violations.push({
        type: 'faculty_unavailable',
        severity: 'hard',
        description: `Faculty "${slot.facultyName}" is marked unavailable on ${slot.day} between ${slot.start} and ${slot.end}`,
        slotsInvolved: [slot.id],
      });
    }

    // 2. Pairwise clash checks: faculty clash, room clash, student group clash
    for (let j = i + 1; j < slots.length; j++) {
      const other = slots[j];
      if (isTimeOverlapping(slot.day, slot.start, slot.end, other.day, other.start, other.end)) {
        if (slot.facultyId && other.facultyId && slot.facultyId === other.facultyId) {
          violations.push({
            type: 'faculty_clash',
            severity: 'hard',
            description: `Faculty clash: "${slot.facultyName}" scheduled for both "${slot.courseCode}" and "${other.courseCode}" on ${slot.day} at ${slot.start}`,
            slotsInvolved: [slot.id, other.id],
          });
        }

        if (slot.roomId && other.roomId && slot.roomId === other.roomId) {
          violations.push({
            type: 'room_clash',
            severity: 'hard',
            description: `Room clash: Room "${slot.roomName}" double-booked for "${slot.courseCode}" and "${other.courseCode}" on ${slot.day} at ${slot.start}`,
            slotsInvolved: [slot.id, other.id],
          });
        }

        if (slot.groupId && other.groupId && slot.groupId === other.groupId) {
          violations.push({
            type: 'group_clash',
            severity: 'hard',
            description: `Student Group clash: "${slot.groupName}" has two simultaneous classes ("${slot.courseCode}" & "${other.courseCode}") on ${slot.day} at ${slot.start}`,
            slotsInvolved: [slot.id, other.id],
          });
        }
      }
    }
  }

  const hardConflicts = violations.filter((v) => v.severity === 'hard').length;
  const isConflictFree = hardConflicts === 0;

  // Distribution
  const dailyDistribution: Record<string, number> = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
  };
  for (const s of slots) {
    dailyDistribution[s.day] = (dailyDistribution[s.day] || 0) + 1;
  }

  const distValues = Object.values(dailyDistribution);
  const peakDaySessions = Math.max(...distValues, 0);
  const minDaySessions = Math.min(...distValues);
  const variance = peakDaySessions - minDaySessions;

  // Penalties for optimization score
  const lateSlotCount = slots.filter((s) => parseMinutes(s.start) >= 840).length; // >= 14:00
  const latePenalty = Math.min(20, Math.round((lateSlotCount / Math.max(1, slots.length)) * 25));
  const variancePenalty = Math.min(15, variance * 3);

  let score = 100 - hardConflicts * 30 - latePenalty - variancePenalty;
  score = Math.max(0, Math.min(100, score));

  const requestedTasks = courses.reduce((acc, c) => acc + (c.weeklySessions || 1), 0);

  return {
    isConflictFree,
    hardConflicts,
    violations,
    scheduledTasks: slots.length,
    requestedTasks,
    searchNodes: slots.length,
    executionTimeMs: 0,
    score,
    dailyDistribution,
    metrics: {
      facultyUtilization: Math.min(100, Math.round((slots.length / Math.max(1, faculty.length * 6)) * 100)),
      roomUtilization: Math.min(100, Math.round((slots.length / Math.max(1, rooms.length * 6 * 5)) * 100)),
      peakDaySessions,
      avgDailyLoad: Number((slots.length / 5).toFixed(1)),
    },
  };
}

export interface TaskSession {
  taskId: string;
  course: Course;
  sessionIndex: number;
}

export function generateCspTimetable(
  courses: Course[],
  rooms: Room[],
  faculty: Faculty[],
  groups: StudentGroup[]
): { slots: TimetableSlot[]; validation: ValidationResult } {
  const startTime = Date.now();
  let searchNodes = 0;

  if (!courses || courses.length === 0) {
    throw new Error('At least one course is required to generate a timetable.');
  }

  // 1. Expand all required sessions
  const tasks: TaskSession[] = [];
  for (const course of courses) {
    const sessionCount = Math.max(1, course.weeklySessions || 1);
    for (let i = 0; i < sessionCount; i++) {
      tasks.push({
        taskId: `${course.id}_sess_${i}`,
        course,
        sessionIndex: i,
      });
    }
  }

  // MRV heuristic: sort tasks with specialized requirements first (e.g. Lab first, then by larger class size)
  tasks.sort((a, b) => {
    if (a.course.roomType === 'Lab' && b.course.roomType !== 'Lab') return -1;
    if (b.course.roomType === 'Lab' && a.course.roomType !== 'Lab') return 1;
    return b.course.studentCount - a.course.studentCount;
  });

  const facultyMap = new Map<string, Faculty>(faculty.map((f) => [f.id, f]));
  const groupMap = new Map<string, StudentGroup>(groups.map((g) => [g.id, g]));

  // Domain values: all possible (day, timeSlot) tuples
  const domainSlots: Array<{ day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'; start: string; end: string }> = [];
  for (const day of DAYS) {
    for (const start of TIME_SLOTS) {
      domainSlots.push({
        day,
        start,
        end: SLOT_DURATIONS[start] || '10:00',
      });
    }
  }

  const assignedSlots: TimetableSlot[] = [];

  function isCandidateValid(
    task: TaskSession,
    slotDef: { day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'; start: string; end: string },
    room: Room
  ): boolean {
    const course = task.course;
    const fac = facultyMap.get(course.facultyId);
    const grp = groupMap.get(course.groupId);

    // Hard Constraint 1: Room type match
    if (course.roomType && room.type !== course.roomType) {
      return false;
    }

    // Hard Constraint 2: Room capacity
    if (room.capacity < course.studentCount) {
      return false;
    }

    // Hard Constraint 3: Faculty availability window
    if (fac && !isFacultyAvailable(fac, slotDef.day, slotDef.start, slotDef.end)) {
      return false;
    }

    // Hard Constraint 4: Clashes with already placed slots
    for (const existing of assignedSlots) {
      if (
        isTimeOverlapping(
          slotDef.day,
          slotDef.start,
          slotDef.end,
          existing.day,
          existing.start,
          existing.end
        )
      ) {
        // Faculty clash
        if (course.facultyId && existing.facultyId && course.facultyId === existing.facultyId) {
          return false;
        }
        // Room clash
        if (room.id === existing.roomId) {
          return false;
        }
        // Student Group clash
        if (course.groupId && existing.groupId && course.groupId === existing.groupId) {
          return false;
        }
      }
    }

    // Soft heuristic: Try to not place two sessions of the same course on the same day
    const sameCourseSameDay = assignedSlots.filter(
      (s) => s.courseId === course.id && s.day === slotDef.day
    ).length;
    if (sameCourseSameDay >= 1 && course.weeklySessions <= DAYS.length) {
      return false; // strongly prefer different days
    }

    // Soft heuristic: Max sessions per day for the student group
    const groupSessionsThisDay = assignedSlots.filter(
      (s) => s.groupId === course.groupId && s.day === slotDef.day
    ).length;
    const maxPerDay = grp?.maxSessionsPerDay || 5;
    if (groupSessionsThisDay >= maxPerDay) {
      return false;
    }

    // Soft heuristic: Avoid late slots (15:15) if preference is set
    if (grp?.avoidLateSlots && parseMinutes(slotDef.start) >= 915) {
      // Allow only if earlier slots are congested
      const groupCount = assignedSlots.filter((s) => s.groupId === course.groupId).length;
      if (groupCount < 4) return false;
    }

    return true;
  }

  // Backtracking solver
  function backtrack(taskIndex: number): boolean {
    if (taskIndex >= tasks.length) {
      return true;
    }

    const task = tasks[taskIndex];
    searchNodes++;

    // Order candidate rooms (best fit capacity first to avoid wasting big auditoriums)
    const validRooms = rooms
      .filter((r) => !task.course.roomType || r.type === task.course.roomType)
      .sort((a, b) => a.capacity - b.capacity);

    // Order slots to balance across days
    const dayCounts: Record<string, number> = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
    };
    for (const s of assignedSlots) {
      dayCounts[s.day] = (dayCounts[s.day] || 0) + 1;
    }

    // Sort domain slots prioritizing least loaded days first, then morning slots
    const orderedSlots = [...domainSlots].sort((a, b) => {
      const loadDiff = (dayCounts[a.day] || 0) - (dayCounts[b.day] || 0);
      if (loadDiff !== 0) return loadDiff;
      return parseMinutes(a.start) - parseMinutes(b.start);
    });

    for (const slotDef of orderedSlots) {
      for (const room of validRooms) {
        if (isCandidateValid(task, slotDef, room)) {
          const newSlot: TimetableSlot = {
            id: `slot_${taskIndex}_${slotDef.day}_${slotDef.start.replace(':', '')}`,
            day: slotDef.day,
            start: slotDef.start,
            end: slotDef.end,
            courseId: task.course.id,
            courseCode: task.course.code,
            courseName: task.course.name,
            facultyId: task.course.facultyId,
            facultyName: task.course.facultyName,
            roomId: room.id,
            roomName: room.name,
            groupId: task.course.groupId,
            groupName: task.course.groupName,
            roomType: task.course.roomType,
            department: task.course.department,
            semester: task.course.semester,
          };

          assignedSlots.push(newSlot);

          if (backtrack(taskIndex + 1)) {
            return true;
          }

          assignedSlots.pop();
        }
      }
    }

    return false;
  }

  // Execute backtracking
  const success = backtrack(0);

  // If strict soft constraints were too tight, retry with relaxed soft constraints to guarantee schedule
  if (!success && assignedSlots.length < tasks.length) {
    assignedSlots.length = 0; // reset
    for (let t = 0; t < tasks.length; t++) {
      const task = tasks[t];
      let placed = false;
      const validRooms = rooms.filter(
        (r) => !task.course.roomType || r.type === task.course.roomType
      );

      for (const slotDef of domainSlots) {
        if (placed) break;
        for (const room of validRooms) {
          // Check ONLY absolute hard constraints
          const roomClash = assignedSlots.some(
            (s) =>
              s.roomId === room.id &&
              isTimeOverlapping(slotDef.day, slotDef.start, slotDef.end, s.day, s.start, s.end)
          );
          const facClash = assignedSlots.some(
            (s) =>
              s.facultyId === task.course.facultyId &&
              isTimeOverlapping(slotDef.day, slotDef.start, slotDef.end, s.day, s.start, s.end)
          );
          const grpClash = assignedSlots.some(
            (s) =>
              s.groupId === task.course.groupId &&
              isTimeOverlapping(slotDef.day, slotDef.start, slotDef.end, s.day, s.start, s.end)
          );

          if (!roomClash && !facClash && !grpClash) {
            assignedSlots.push({
              id: `slot_${t}_${slotDef.day}_${slotDef.start.replace(':', '')}`,
              day: slotDef.day,
              start: slotDef.start,
              end: slotDef.end,
              courseId: task.course.id,
              courseCode: task.course.code,
              courseName: task.course.name,
              facultyId: task.course.facultyId,
              facultyName: task.course.facultyName,
              roomId: room.id,
              roomName: room.name,
              groupId: task.course.groupId,
              groupName: task.course.groupName,
              roomType: task.course.roomType,
              department: task.course.department,
              semester: task.course.semester,
            });
            placed = true;
            break;
          }
        }
      }
    }
  }

  const executionTimeMs = Math.max(1, Date.now() - startTime);
  const validation = validateSchedule(assignedSlots, rooms, faculty, groups, courses);
  validation.executionTimeMs = executionTimeMs;
  validation.searchNodes = searchNodes;

  return {
    slots: assignedSlots,
    validation,
  };
}

export function getWeekDates(weekOffset = 0): {
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  dates: Array<{ day: string; dateNum: number; fullDate: string }>;
} {
  const weekNumber = 44 + weekOffset;
  const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'> = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];
  const baseDate = 26 + weekOffset * 7;
  const dates = days.map((day, idx) => {
    let dateNum = baseDate + idx;
    let month = 'Oct';
    if (dateNum > 31) {
      dateNum -= 31;
      month = 'Nov';
    }
    return {
      day,
      dateNum,
      fullDate: `${month} ${dateNum}`,
    };
  });

  return {
    weekNumber,
    year: 2026,
    startDate: dates[0].fullDate,
    endDate: dates[4].fullDate,
    dates,
  };
}
