/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Course, Faculty, Room, StudentGroup, TimetableSlot } from './scheduler.ts';

export interface SavedTimetable {
  id: string;
  name: string;
  group_id?: string;
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  sessions_count: number;
  score: number;
  slots: TimetableSlot[];
}

export const STORAGE_KEYS = {
  COURSES: 'tempo_courses_v2',
  FACULTY: 'tempo_faculty_v2',
  ROOMS: 'tempo_rooms_v2',
  GROUPS: 'tempo_groups_v2',
  SLOTS: 'tempo_slots_v2',
  TIMETABLES: 'tempo_saved_timetables_v2',
  INITIALIZED: 'tempo_initialized_flag_v2',
  SUPABASE_URL: 'tempo_supabase_url',
  SUPABASE_KEY: 'tempo_supabase_key',
  AUTH_SESSION: 'tempo_auth_session',
  AUTH_TOKEN: 'tempo_admin_token',
};

export const INITIAL_GROUPS: StudentGroup[] = [
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
  {
    id: 'grp_aids_2a',
    name: 'AI&DS-2A',
    studentCount: 45,
    semester: 'Semester 3',
    department: 'AI & Data Science',
    preferredStart: '09:00',
    preferredEnd: '16:30',
    avoidLateSlots: true,
    maxSessionsPerDay: 5,
  },
];

export const INITIAL_FACULTY: Faculty[] = [
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
  {
    id: 'fac_suresh',
    name: 'Dr. Suresh Nair',
    email: 'suresh.n@vignan.edu',
    department: 'AI & Data Science',
    maxWeeklyHours: 18,
    availability: {
      Monday: ['09:00-16:30'],
      Tuesday: ['09:00-16:30'],
      Wednesday: ['09:00-16:30'],
      Thursday: ['09:00-16:30'],
      Friday: ['09:00-16:30'],
    },
  },
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'rm_a204',
    name: 'A-204',
    type: 'Lecture',
    capacity: 70,
    building: 'Main Academic Block (2nd Floor)',
  },
  {
    id: 'rm_lab2',
    name: 'Lab-2',
    type: 'Lab',
    capacity: 50,
    building: 'Tech Park (Ground Floor)',
  },
  {
    id: 'rm_s101',
    name: 'Seminar-101',
    type: 'Seminar',
    capacity: 80,
    building: 'Innovation Block (1st Floor)',
  },
];

export const INITIAL_COURSES: Course[] = [
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
  {
    id: 'c3',
    code: 'CS303L',
    name: 'Database Systems Lab',
    facultyId: 'fac_arjun',
    facultyName: 'Prof. Arjun Kumar',
    groupId: 'grp_cse_2a',
    groupName: 'CSE-2A',
    roomType: 'Lab',
    duration: 1,
    weeklySessions: 2,
    studentCount: 45,
    department: 'Computer Science',
    semester: 'Semester 3',
  },
  {
    id: 'c4',
    code: 'AI301',
    name: 'Machine Learning Fundamentals',
    facultyId: 'fac_suresh',
    facultyName: 'Dr. Suresh Nair',
    groupId: 'grp_aids_2a',
    groupName: 'AI&DS-2A',
    roomType: 'Lecture',
    duration: 1,
    weeklySessions: 3,
    studentCount: 45,
    department: 'AI & Data Science',
    semester: 'Semester 3',
  },
];

export const INITIAL_SLOTS: TimetableSlot[] = [
  {
    id: 's_mon_0900',
    day: 'Monday',
    start: '09:00',
    end: '10:00',
    courseId: 'c1',
    courseCode: 'CS301',
    courseName: 'Artificial Intelligence',
    facultyId: 'fac_meera',
    facultyName: 'Dr. Meera Rao',
    roomId: 'rm_a204',
    roomName: 'A-204',
    groupId: 'grp_cse_2a',
    groupName: 'CSE-2A',
    roomType: 'Lecture',
    department: 'Computer Science',
    semester: 'Semester 3',
  },
  {
    id: 's_mon_1015',
    day: 'Monday',
    start: '10:15',
    end: '11:15',
    courseId: 'c2',
    courseCode: 'CS302',
    courseName: 'Database Management',
    facultyId: 'fac_arjun',
    facultyName: 'Prof. Arjun Kumar',
    roomId: 'rm_a204',
    roomName: 'A-204',
    groupId: 'grp_cse_2a',
    groupName: 'CSE-2A',
    roomType: 'Lecture',
    department: 'Computer Science',
    semester: 'Semester 3',
  },
  {
    id: 's_tue_0900',
    day: 'Tuesday',
    start: '09:00',
    end: '10:00',
    courseId: 'c1',
    courseCode: 'CS301',
    courseName: 'Artificial Intelligence',
    facultyId: 'fac_meera',
    facultyName: 'Dr. Meera Rao',
    roomId: 'rm_a204',
    roomName: 'A-204',
    groupId: 'grp_cse_2a',
    groupName: 'CSE-2A',
    roomType: 'Lecture',
    department: 'Computer Science',
    semester: 'Semester 3',
  },
  {
    id: 's_wed_1130',
    day: 'Wednesday',
    start: '11:30',
    end: '12:30',
    courseId: 'c3',
    courseCode: 'CS303L',
    courseName: 'Database Systems Lab',
    facultyId: 'fac_arjun',
    facultyName: 'Prof. Arjun Kumar',
    roomId: 'rm_lab2',
    roomName: 'Lab-2',
    groupId: 'grp_cse_2a',
    groupName: 'CSE-2A',
    roomType: 'Lab',
    department: 'Computer Science',
    semester: 'Semester 3',
  },
];

function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return localStorage.getItem(STORAGE_KEYS.INITIALIZED) ? ([] as unknown as T) : defaultValue;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    } catch (err) {
      console.error(`Error saving ${key} to storage:`, err);
    }
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL);
    if (stored && stored.trim()) return stored.trim();
  }
  const envUrl =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL)
      : undefined;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim();
  }
  return '';
}

export function getSupabaseKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY);
    if (stored && stored.trim()) return stored.trim();
  }
  const envKey =
    typeof import.meta !== 'undefined' && import.meta.env
      ? (import.meta.env.VITE_SUPABASE_ANON_KEY ||
         import.meta.env.VITE_SUPABASE_KEY ||
         import.meta.env.SUPABASE_ANON_KEY)
      : undefined;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }
  return '';
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (!url || !key) return false;
  if (typeof window !== 'undefined') {
    if (url === window.location.origin || url === window.location.href) return false;
  }
  if (
    url.startsWith('/') ||
    url === 'http://localhost:3000' ||
    url === 'http://127.0.0.1:3000'
  ) {
    return false;
  }
  try {
    const parsed = new URL(url);
    if (!parsed.protocol.startsWith('http')) return false;
    return key.length >= 20 && key !== 'tempo-supabase-anon-key-v1';
  } catch {
    return false;
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    supabaseInstance = null;
    return null;
  }
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
      return null;
    }
  }
  return supabaseInstance;
}

export function setSupabaseConfig(url: string, key: string): void {
  const cleanUrl = url.trim();
  const cleanKey = key.trim();
  if (typeof window !== 'undefined') {
    if (cleanUrl && cleanKey) {
      localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, cleanUrl);
      localStorage.setItem(STORAGE_KEYS.SUPABASE_KEY, cleanKey);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
      localStorage.removeItem(STORAGE_KEYS.SUPABASE_KEY);
    }
  }
  supabaseInstance = null;
  getSupabaseClient();
}

export function getSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  return {
    url: getSupabaseUrl(),
    key: getSupabaseKey(),
    isConfigured: isSupabaseConfigured(),
  };
}

export class TimetableStore {
  private static courses: Course[] = getStoredItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  private static faculty: Faculty[] = getStoredItem(STORAGE_KEYS.FACULTY, INITIAL_FACULTY);
  private static rooms: Room[] = getStoredItem(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
  private static groups: StudentGroup[] = getStoredItem(STORAGE_KEYS.GROUPS, INITIAL_GROUPS);
  private static slots: TimetableSlot[] = getStoredItem(STORAGE_KEYS.SLOTS, INITIAL_SLOTS);
  private static savedTimetables: SavedTimetable[] = getStoredItem(STORAGE_KEYS.TIMETABLES, [
    {
      id: 'tt_sample_initial',
      name: 'Semester 3 Baseline Schedule',
      status: 'published',
      created_at: new Date().toISOString(),
      sessions_count: INITIAL_SLOTS.length,
      score: 100,
      slots: INITIAL_SLOTS,
    },
  ]);

  public static ensureInitialized(): void {
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      setStoredItem(STORAGE_KEYS.COURSES, this.courses);
      setStoredItem(STORAGE_KEYS.FACULTY, this.faculty);
      setStoredItem(STORAGE_KEYS.ROOMS, this.rooms);
      setStoredItem(STORAGE_KEYS.GROUPS, this.groups);
      setStoredItem(STORAGE_KEYS.SLOTS, this.slots);
      setStoredItem(STORAGE_KEYS.TIMETABLES, this.savedTimetables);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  public static async syncWithSupabase(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message: 'Supabase credentials not configured. Operating in local storage mode.',
      };
    }

    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase client could not be initialized.' };
    }

    try {
      const [coursesRes, facultyRes, roomsRes, groupsRes, timetablesRes] = await Promise.all([
        client.from('courses').select('*'),
        client.from('faculty').select('*'),
        client.from('rooms').select('*'),
        client.from('academic_groups').select('*'),
        client.from('timetables').select('*'),
      ]);

      const errors = [
        coursesRes.error,
        facultyRes.error,
        roomsRes.error,
        groupsRes.error,
        timetablesRes.error,
      ].filter(Boolean);

      if (errors.length > 0) {
        const errorMsg = errors.map((e) => e?.message).join(' | ');
        console.warn('Supabase query error:', errorMsg);
        return {
          success: false,
          message: `Database query error: ${errorMsg}`,
        };
      }

      if (coursesRes.data && coursesRes.data.length > 0) {
        this.courses = coursesRes.data.map((c: any) => ({
          id: String(c.id),
          code: c.code,
          name: c.name,
          facultyId: c.faculty_id || c.facultyId || '',
          facultyName: c.facultyName || '',
          groupId: c.group_id || c.groupId || '',
          groupName: c.groupName || '',
          roomType: c.room_type || c.roomType || 'Lecture',
          duration: Number(c.duration) || 1,
          weeklySessions: Number(c.weekly_sessions || c.weeklySessions) || 3,
          studentCount: Number(c.student_count || c.studentCount) || 50,
          department: c.department || 'Computer Science',
          semester: c.semester || 'Semester 3',
        }));
        setStoredItem(STORAGE_KEYS.COURSES, this.courses);
      }

      if (facultyRes.data && facultyRes.data.length > 0) {
        this.faculty = facultyRes.data.map((f: any) => ({
          id: String(f.id),
          name: f.name,
          email: f.email || '',
          department: f.department || 'Computer Science',
          maxWeeklyHours: Number(f.max_weekly_hours || f.maxWeeklyHours) || 16,
          availability: f.availability || {
            Monday: ['09:00-16:30'],
            Tuesday: ['09:00-16:30'],
            Wednesday: ['09:00-16:30'],
            Thursday: ['09:00-16:30'],
            Friday: ['09:00-16:30'],
          },
        }));
        setStoredItem(STORAGE_KEYS.FACULTY, this.faculty);
      }

      if (roomsRes.data && roomsRes.data.length > 0) {
        this.rooms = roomsRes.data.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          type: r.room_type || r.type || 'Lecture',
          capacity: Number(r.capacity) || 60,
          building: r.building || 'Main Campus',
        }));
        setStoredItem(STORAGE_KEYS.ROOMS, this.rooms);
      }

      if (groupsRes.data && groupsRes.data.length > 0) {
        this.groups = groupsRes.data.map((g: any) => ({
          id: String(g.id),
          name: g.name,
          studentCount: Number(g.student_count || g.studentCount) || 50,
          semester: g.semester || 'Semester 3',
          department: g.department || 'Computer Science',
          preferredStart: g.preferredStart || '09:00',
          preferredEnd: g.preferredEnd || '16:30',
          avoidLateSlots: Boolean(g.avoidLateSlots),
          maxSessionsPerDay: Number(g.maxSessionsPerDay) || 5,
        }));
        setStoredItem(STORAGE_KEYS.GROUPS, this.groups);
      }

      if (timetablesRes.data && timetablesRes.data.length > 0) {
        this.savedTimetables = timetablesRes.data.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          group_id: t.group_id,
          status: t.status || 'published',
          created_at: t.created_at,
          sessions_count: Number(t.sessions_count) || (Array.isArray(t.slots) ? t.slots.length : 0),
          score: Number(t.score) || 100,
          slots: t.slots || [],
        }));
        setStoredItem(STORAGE_KEYS.TIMETABLES, this.savedTimetables);
      }

      return {
        success: true,
        message: `Synced ${this.courses.length} courses, ${this.faculty.length} faculty, ${this.rooms.length} rooms from Supabase.`,
      };
    } catch (err: any) {
      console.warn('Supabase sync warning:', err);
      return { success: false, message: err.message || 'Sync error' };
    }
  }

  // Courses
  public static getCourses(): Course[] {
    return [...this.courses];
  }

  public static async addCourse(course: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: course.id || `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    this.courses.push(newCourse);
    setStoredItem(STORAGE_KEYS.COURSES, this.courses);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('courses').insert([
          {
            id: newCourse.id,
            code: newCourse.code,
            name: newCourse.name,
            faculty_id: newCourse.facultyId || null,
            group_id: newCourse.groupId || null,
            room_type: newCourse.roomType,
            duration: newCourse.duration,
            weekly_sessions: newCourse.weeklySessions,
            student_count: newCourse.studentCount,
            department: newCourse.department,
            semester: newCourse.semester,
          },
        ]);
      } catch (err) {
        console.warn('Supabase addCourse error:', err);
      }
    }

    return newCourse;
  }

  public static async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    const idx = this.courses.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const updated = { ...this.courses[idx], ...updates };
    this.courses[idx] = updated;
    setStoredItem(STORAGE_KEYS.COURSES, this.courses);

    const client = getSupabaseClient();
    if (client) {
      try {
        const payload: Record<string, any> = {};
        if (updates.code !== undefined) payload.code = updates.code;
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.facultyId !== undefined) payload.faculty_id = updates.facultyId || null;
        if (updates.groupId !== undefined) payload.group_id = updates.groupId || null;
        if (updates.roomType !== undefined) payload.room_type = updates.roomType;
        if (updates.duration !== undefined) payload.duration = updates.duration;
        if (updates.weeklySessions !== undefined) payload.weekly_sessions = updates.weeklySessions;
        if (updates.studentCount !== undefined) payload.student_count = updates.studentCount;
        if (updates.department !== undefined) payload.department = updates.department;
        if (updates.semester !== undefined) payload.semester = updates.semester;

        await client.from('courses').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateCourse error:', err);
      }
    }

    return updated;
  }

  public static async deleteCourse(id: string): Promise<boolean> {
    this.courses = this.courses.filter((c) => c.id !== id);
    setStoredItem(STORAGE_KEYS.COURSES, this.courses);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('courses').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteCourse error:', err);
      }
    }

    return true;
  }

  // Faculty
  public static getFaculty(): Faculty[] {
    return [...this.faculty];
  }

  public static async addFaculty(fac: Omit<Faculty, 'id'> & { id?: string }): Promise<Faculty> {
    const newFac: Faculty = {
      ...fac,
      id: fac.id || `fac_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    this.faculty.push(newFac);
    setStoredItem(STORAGE_KEYS.FACULTY, this.faculty);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('faculty').insert([
          {
            id: newFac.id,
            name: newFac.name,
            email: newFac.email || null,
            department: newFac.department,
            max_weekly_hours: newFac.maxWeeklyHours,
            availability: newFac.availability,
          },
        ]);
      } catch (err) {
        console.warn('Supabase addFaculty error:', err);
      }
    }

    return newFac;
  }

  public static async updateFaculty(id: string, updates: Partial<Faculty>): Promise<Faculty | null> {
    const idx = this.faculty.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    const updated = { ...this.faculty[idx], ...updates };
    this.faculty[idx] = updated;
    setStoredItem(STORAGE_KEYS.FACULTY, this.faculty);

    if (updates.name) {
      this.courses = this.courses.map((c) =>
        c.facultyId === id ? { ...c, facultyName: updates.name! } : c
      );
      setStoredItem(STORAGE_KEYS.COURSES, this.courses);
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        const payload: Record<string, any> = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.email !== undefined) payload.email = updates.email || null;
        if (updates.department !== undefined) payload.department = updates.department;
        if (updates.maxWeeklyHours !== undefined) payload.max_weekly_hours = updates.maxWeeklyHours;
        if (updates.availability !== undefined) payload.availability = updates.availability;

        await client.from('faculty').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateFaculty error:', err);
      }
    }

    return updated;
  }

  public static async deleteFaculty(id: string): Promise<boolean> {
    this.faculty = this.faculty.filter((f) => f.id !== id);
    setStoredItem(STORAGE_KEYS.FACULTY, this.faculty);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('faculty').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteFaculty error:', err);
      }
    }

    return true;
  }

  // Rooms
  public static getRooms(): Room[] {
    return [...this.rooms];
  }

  public static async addRoom(room: Omit<Room, 'id'> & { id?: string }): Promise<Room> {
    const newRoom: Room = {
      ...room,
      id: room.id || `rm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    this.rooms.push(newRoom);
    setStoredItem(STORAGE_KEYS.ROOMS, this.rooms);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('rooms').insert([
          {
            id: newRoom.id,
            name: newRoom.name,
            room_type: newRoom.type,
            capacity: newRoom.capacity,
            building: newRoom.building,
          },
        ]);
      } catch (err) {
        console.warn('Supabase addRoom error:', err);
      }
    }

    return newRoom;
  }

  public static async updateRoom(id: string, updates: Partial<Room>): Promise<Room | null> {
    const idx = this.rooms.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const updated = { ...this.rooms[idx], ...updates };
    this.rooms[idx] = updated;
    setStoredItem(STORAGE_KEYS.ROOMS, this.rooms);

    const client = getSupabaseClient();
    if (client) {
      try {
        const payload: Record<string, any> = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.type !== undefined) payload.room_type = updates.type;
        if (updates.capacity !== undefined) payload.capacity = updates.capacity;
        if (updates.building !== undefined) payload.building = updates.building;

        await client.from('rooms').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateRoom error:', err);
      }
    }

    return updated;
  }

  public static async deleteRoom(id: string): Promise<boolean> {
    this.rooms = this.rooms.filter((r) => r.id !== id);
    setStoredItem(STORAGE_KEYS.ROOMS, this.rooms);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('rooms').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteRoom error:', err);
      }
    }

    return true;
  }

  // Groups
  public static getGroups(): StudentGroup[] {
    return [...this.groups];
  }

  public static async addGroup(group: Omit<StudentGroup, 'id'> & { id?: string }): Promise<StudentGroup> {
    const newGroup: StudentGroup = {
      ...group,
      id: group.id || `grp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    this.groups.push(newGroup);
    setStoredItem(STORAGE_KEYS.GROUPS, this.groups);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('academic_groups').insert([
          {
            id: newGroup.id,
            name: newGroup.name,
            student_count: newGroup.studentCount,
            semester: newGroup.semester,
            department: newGroup.department,
          },
        ]);
      } catch (err) {
        console.warn('Supabase addGroup error:', err);
      }
    }

    return newGroup;
  }

  public static async updateGroup(id: string, updates: Partial<StudentGroup>): Promise<StudentGroup | null> {
    const idx = this.groups.findIndex((g) => g.id === id);
    if (idx === -1) return null;
    const updated = { ...this.groups[idx], ...updates };
    this.groups[idx] = updated;
    setStoredItem(STORAGE_KEYS.GROUPS, this.groups);

    if (updates.name) {
      this.courses = this.courses.map((c) =>
        c.groupId === id ? { ...c, groupName: updates.name! } : c
      );
      setStoredItem(STORAGE_KEYS.COURSES, this.courses);
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        const payload: Record<string, any> = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.studentCount !== undefined) payload.student_count = updates.studentCount;
        if (updates.semester !== undefined) payload.semester = updates.semester;
        if (updates.department !== undefined) payload.department = updates.department;

        await client.from('academic_groups').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateGroup error:', err);
      }
    }

    return updated;
  }

  public static async deleteGroup(id: string): Promise<boolean> {
    this.groups = this.groups.filter((g) => g.id !== id);
    setStoredItem(STORAGE_KEYS.GROUPS, this.groups);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('academic_groups').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteGroup error:', err);
      }
    }

    return true;
  }

  // Slots
  public static getSlots(): TimetableSlot[] {
    return [...this.slots];
  }

  public static setSlots(slots: TimetableSlot[]): void {
    this.slots = slots;
    setStoredItem(STORAGE_KEYS.SLOTS, this.slots);
  }

  // Saved Timetables
  public static getSavedTimetables(): SavedTimetable[] {
    return [...this.savedTimetables];
  }

  public static async saveTimetable(
    name: string,
    slots: TimetableSlot[],
    score = 100,
    groupId?: string
  ): Promise<SavedTimetable> {
    const record: SavedTimetable = {
      id: `tt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim() || 'University Timetable Schedule',
      group_id: groupId,
      status: 'published',
      created_at: new Date().toISOString(),
      sessions_count: slots.length,
      score,
      slots,
    };
    this.savedTimetables.unshift(record);
    setStoredItem(STORAGE_KEYS.TIMETABLES, this.savedTimetables);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('timetables').insert([
          {
            id: record.id,
            name: record.name,
            group_id: record.group_id || null,
            status: record.status,
            score: record.score,
            sessions_count: record.sessions_count,
            slots: record.slots,
          },
        ]);
      } catch (err) {
        console.warn('Supabase saveTimetable error:', err);
      }
    }

    return record;
  }

  public static async deleteSavedTimetable(id: string): Promise<boolean> {
    this.savedTimetables = this.savedTimetables.filter((t) => t.id !== id);
    setStoredItem(STORAGE_KEYS.TIMETABLES, this.savedTimetables);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('timetables').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteTimetable error:', err);
      }
    }

    return true;
  }

  public static resetToDefaults(): void {
    this.courses = [...INITIAL_COURSES];
    this.faculty = [...INITIAL_FACULTY];
    this.rooms = [...INITIAL_ROOMS];
    this.groups = [...INITIAL_GROUPS];
    this.slots = [...INITIAL_SLOTS];
    this.savedTimetables = [
      {
        id: 'tt_sample_initial',
        name: 'Semester 3 Baseline Schedule',
        status: 'published',
        created_at: new Date().toISOString(),
        sessions_count: INITIAL_SLOTS.length,
        score: 100,
        slots: INITIAL_SLOTS,
      },
    ];

    setStoredItem(STORAGE_KEYS.COURSES, this.courses);
    setStoredItem(STORAGE_KEYS.FACULTY, this.faculty);
    setStoredItem(STORAGE_KEYS.ROOMS, this.rooms);
    setStoredItem(STORAGE_KEYS.GROUPS, this.groups);
    setStoredItem(STORAGE_KEYS.SLOTS, this.slots);
    setStoredItem(STORAGE_KEYS.TIMETABLES, this.savedTimetables);
  }

  public static async testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        message:
          'Supabase is not configured. Please enter a valid Project URL (https://<project-ref>.supabase.co) and public Anon Key.',
      };
    }
    const client = getSupabaseClient();
    if (!client) {
      return {
        success: false,
        message: 'Could not initialize Supabase client with the provided credentials.',
      };
    }
    try {
      const { error } = await client.from('academic_groups').select('id, name').limit(1);
      if (error) {
        return {
          success: false,
          message: `Database query error: ${error.message} (Code: ${error.code || 'UNKNOWN'})`,
        };
      }
      return {
        success: true,
        message: 'Successfully connected to Supabase PostgreSQL! Connection verified.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Connection test error: ${err.message || 'Check credentials'}`,
      };
    }
  }
}
