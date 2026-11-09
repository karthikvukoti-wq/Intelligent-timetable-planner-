/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { OverviewView } from './components/OverviewView.tsx';
import { TimetableView } from './components/TimetableView.tsx';
import { CoursesView } from './components/CoursesView.tsx';
import { FacultyView } from './components/FacultyView.tsx';
import { RoomsView } from './components/RoomsView.tsx';
import { GroupsView } from './components/GroupsView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';

// Modals
import { CourseModal } from './components/modals/CourseModal.tsx';
import { FacultyModal } from './components/modals/FacultyModal.tsx';
import { RoomModal } from './components/modals/RoomModal.tsx';
import { GroupModal } from './components/modals/GroupModal.tsx';
import { SlotDetailModal } from './components/modals/SlotDetailModal.tsx';
import { ValidationModal } from './components/modals/ValidationModal.tsx';
import { SavedTimetablesModal } from './components/modals/SavedTimetablesModal.tsx';
import { AssistantModal } from './components/modals/AssistantModal.tsx';

import {
  Course,
  Faculty,
  Room,
  StudentGroup,
  TimetableSlot,
  ValidationResult,
  validateSchedule,
  generateCspTimetable,
} from './utils/scheduler.ts';

import {
  TimetableStore,
  getSupabaseClient,
  getSupabaseConfig,
  isSupabaseConfigured,
  SavedTimetable,
  STORAGE_KEYS,
} from './utils/storage.ts';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [currentPage, setCurrentPage] = useState<string>('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Entities
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [savedTimetables, setSavedTimetables] = useState<SavedTimetable[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);

  // Status & notifications
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{ isSyncing: boolean; error: string | null }>({
    isSyncing: false,
    error: null,
  });

  // Modals state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const [facultyModalOpen, setFacultyModalOpen] = useState(false);
  const [facultyToEdit, setFacultyToEdit] = useState<Faculty | null>(null);

  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState<StudentGroup | null>(null);

  const [selectedSlot, setSelectedSlot] = useState<TimetableSlot | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [savedTimetablesOpen, setSavedTimetablesOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [initialAssistantQuestion, setInitialAssistantQuestion] = useState('');

  // Reload store data into component state
  const reloadData = () => {
    TimetableStore.ensureInitialized();
    const c = TimetableStore.getCourses();
    const f = TimetableStore.getFaculty();
    const r = TimetableStore.getRooms();
    const g = TimetableStore.getGroups();
    const s = TimetableStore.getSlots();
    const t = TimetableStore.getSavedTimetables();

    setCourses(c);
    setFaculty(f);
    setRooms(r);
    setGroups(g);
    setSlots(s);
    setSavedTimetables(t);

    const val = validateSchedule(s, r, f, g, c);
    setValidation(val);
  };

  // Re-run validation whenever data changes
  const runValidation = (
    currentSlots = slots,
    currentRooms = rooms,
    currentFaculty = faculty,
    currentGroups = groups,
    currentCourses = courses
  ) => {
    const val = validateSchedule(currentSlots, currentRooms, currentFaculty, currentGroups, currentCourses);
    setValidation(val);
  };

  // Show auto-dismiss notification toast
  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => {
      setNotice(null);
    }, 4500);
  };

  // Auth initialization
  useEffect(() => {
    const client = getSupabaseClient();

    if (client) {
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setDbStatus({ isSyncing: true, error: null });
          TimetableStore.syncWithSupabase().then((res) => {
            setDbStatus({ isSyncing: false, error: res.success ? null : res.message });
            reloadData();
          });
        } else {
          const localSession = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
          if (localSession) {
            try {
              setUser(JSON.parse(localSession));
              reloadData();
            } catch {
              setUser(null);
            }
          }
        }
        setIsLoadingSession(false);
      });

      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session.user));
          setDbStatus({ isSyncing: true, error: null });
          TimetableStore.syncWithSupabase().then((res) => {
            setDbStatus({ isSyncing: false, error: res.success ? null : res.message });
            reloadData();
          });
        } else {
          setUser(null);
          localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        }
        setIsLoadingSession(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      const localSession = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (localSession) {
        try {
          setUser(JSON.parse(localSession));
          reloadData();
        } catch {
          setUser(null);
        }
      }
      setIsLoadingSession(false);
    }
  }, []);

  // Logout handler
  const handleLogout = async () => {
    const client = getSupabaseClient();
    if (client) {
      await client.auth.signOut().catch(() => {});
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    setUser(null);
    showNotice('Signed out of academic workspace.');
  };

  // Generate timetable via CSP Backtracking
  const handleGenerate = async () => {
    setIsGenerating(true);
    setNotice(null);

    const isStaticHost =
      typeof window !== 'undefined' &&
      (window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:');

    if (isStaticHost) {
      try {
        const localResult = generateCspTimetable(courses, rooms, faculty, groups);
        setSlots(localResult.slots);
        TimetableStore.setSlots(localResult.slots);
        setValidation(localResult.validation);
        showNotice(
          `Timetable Generated: ${localResult.slots.length} sessions scheduled in ${localResult.validation.executionTimeMs}ms (${localResult.validation.hardConflicts} hard conflicts · score ${localResult.validation.score}%)`
        );
      } catch (localErr: any) {
        showNotice(`Generation notice: ${localErr.message}`);
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    try {
      // 1. Try server-side generation endpoint
      const response = await fetch('/api/timetable/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courses, rooms, faculty, groups }),
      });

      if (!response.ok) {
        // Fallback to local CSP backtracking solver
        const localResult = generateCspTimetable(courses, rooms, faculty, groups);
        setSlots(localResult.slots);
        TimetableStore.setSlots(localResult.slots);
        setValidation(localResult.validation);
        showNotice(
          `Timetable Generated: ${localResult.slots.length} sessions scheduled in ${localResult.validation.executionTimeMs}ms (${localResult.validation.hardConflicts} hard conflicts · score ${localResult.validation.score}%)`
        );
        return;
      }

      const data = await response.json();
      setSlots(data.slots);
      TimetableStore.setSlots(data.slots);
      setValidation(data.validation);
      showNotice(
        `Timetable Generated: ${data.slots.length} sessions scheduled in ${data.validation.executionTimeMs}ms (${data.validation.hardConflicts} hard conflicts · score ${data.validation.score}%)`
      );
    } catch (err: any) {
      // Offline fallback: run local backtracking solver
      try {
        const localResult = generateCspTimetable(courses, rooms, faculty, groups);
        setSlots(localResult.slots);
        TimetableStore.setSlots(localResult.slots);
        setValidation(localResult.validation);
        showNotice(
          `Timetable Generated (Local CSP): ${localResult.slots.length} sessions scheduled (${localResult.validation.hardConflicts} conflicts · score ${localResult.validation.score}%)`
        );
      } catch (localErr: any) {
        showNotice(`Generation error: ${localErr.message}. Retaining current timetable.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Save current schedule
  const handleSaveTimetable = async () => {
    if (slots.length === 0) {
      showNotice('Cannot save an empty timetable. Please generate a timetable first.');
      return;
    }

    const defaultTitle = `Semester Timetable (${new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })})`;
    const title = window.prompt('Enter a title for this saved timetable:', defaultTitle);
    if (!title) return;

    const saved = await TimetableStore.saveTimetable(title, slots, validation?.score || 100);
    setSavedTimetables(TimetableStore.getSavedTimetables());
    showNotice(`Timetable "${saved.name}" archived to Supabase successfully!`);
  };

  // Load an archived timetable
  const handleLoadTimetable = (loadedSlots: TimetableSlot[], name: string) => {
    setSlots(loadedSlots);
    TimetableStore.setSlots(loadedSlots);
    runValidation(loadedSlots, rooms, faculty, groups, courses);
    showNotice(`Loaded archived timetable: "${name}" (${loadedSlots.length} sessions)`);
  };

  // Delete archived timetable
  const handleDeleteSavedTimetable = async (id: string) => {
    await TimetableStore.deleteSavedTimetable(id);
    setSavedTimetables(TimetableStore.getSavedTimetables());
    showNotice('Archived timetable removed from database.');
  };

  // Course handlers
  const handleSaveCourse = async (courseData: Partial<Course>) => {
    if (courseData.id) {
      const updated = await TimetableStore.updateCourse(courseData.id, courseData);
      if (updated) {
        const updatedList = courses.map((c) => (c.id === updated.id ? updated : c));
        setCourses(updatedList);
        runValidation(slots, rooms, faculty, groups, updatedList);
        showNotice(`Updated course: ${updated.code} - ${updated.name}`);
      }
    } else {
      const created = await TimetableStore.addCourse(courseData as any);
      const updatedList = [...courses, created];
      setCourses(updatedList);
      runValidation(slots, rooms, faculty, groups, updatedList);
      showNotice(`Added new course: ${created.code} - ${created.name}`);
    }
    setCourseModalOpen(false);
    setCourseToEdit(null);
  };

  const handleDeleteCourse = async (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (course && window.confirm(`Delete course "${course.code}: ${course.name}"?`)) {
      await TimetableStore.deleteCourse(id);
      const updatedList = courses.filter((c) => c.id !== id);
      setCourses(updatedList);
      runValidation(slots, rooms, faculty, groups, updatedList);
      showNotice(`Deleted course: ${course.code}`);
    }
  };

  // Faculty handlers
  const handleSaveFaculty = async (facultyData: Partial<Faculty>) => {
    if (facultyData.id) {
      const updated = await TimetableStore.updateFaculty(facultyData.id, facultyData);
      if (updated) {
        const updatedList = faculty.map((f) => (f.id === updated.id ? updated : f));
        setFaculty(updatedList);
        runValidation(slots, rooms, updatedList, groups, courses);
        showNotice(`Updated faculty member: ${updated.name}`);
      }
    } else {
      const created = await TimetableStore.addFaculty(facultyData as any);
      const updatedList = [...faculty, created];
      setFaculty(updatedList);
      runValidation(slots, rooms, updatedList, groups, courses);
      showNotice(`Added faculty member: ${created.name}`);
    }
    setFacultyModalOpen(false);
    setFacultyToEdit(null);
  };

  const handleDeleteFaculty = async (id: string) => {
    const fac = faculty.find((f) => f.id === id);
    if (fac && window.confirm(`Delete faculty member "${fac.name}"?`)) {
      await TimetableStore.deleteFaculty(id);
      const updatedList = faculty.filter((f) => f.id !== id);
      setFaculty(updatedList);
      runValidation(slots, rooms, updatedList, groups, courses);
      showNotice(`Deleted faculty: ${fac.name}`);
    }
  };

  // Room handlers
  const handleSaveRoom = async (roomData: Partial<Room>) => {
    if (roomData.id) {
      const updated = await TimetableStore.updateRoom(roomData.id, roomData);
      if (updated) {
        const updatedList = rooms.map((r) => (r.id === updated.id ? updated : r));
        setRooms(updatedList);
        runValidation(slots, updatedList, faculty, groups, courses);
        showNotice(`Updated classroom facility: ${updated.name}`);
      }
    } else {
      const created = await TimetableStore.addRoom(roomData as any);
      const updatedList = [...rooms, created];
      setRooms(updatedList);
      runValidation(slots, updatedList, faculty, groups, courses);
      showNotice(`Added classroom facility: ${created.name}`);
    }
    setRoomModalOpen(false);
    setRoomToEdit(null);
  };

  const handleDeleteRoom = async (id: string) => {
    const rm = rooms.find((r) => r.id === id);
    if (rm && window.confirm(`Delete classroom "${rm.name}"?`)) {
      await TimetableStore.deleteRoom(id);
      const updatedList = rooms.filter((r) => r.id !== id);
      setRooms(updatedList);
      runValidation(slots, updatedList, faculty, groups, courses);
      showNotice(`Deleted classroom: ${rm.name}`);
    }
  };

  // Group handlers
  const handleSaveGroup = async (groupData: Partial<StudentGroup>) => {
    if (groupData.id) {
      const updated = await TimetableStore.updateGroup(groupData.id, groupData);
      if (updated) {
        const updatedList = groups.map((g) => (g.id === updated.id ? updated : g));
        setGroups(updatedList);
        runValidation(slots, rooms, faculty, updatedList, courses);
        showNotice(`Updated student cohort: ${updated.name}`);
      }
    } else {
      const created = await TimetableStore.addGroup(groupData as any);
      const updatedList = [...groups, created];
      setGroups(updatedList);
      runValidation(slots, rooms, faculty, updatedList, courses);
      showNotice(`Added student cohort: ${created.name}`);
    }
    setGroupModalOpen(false);
    setGroupToEdit(null);
  };

  const handleDeleteGroup = async (id: string) => {
    const grp = groups.find((g) => g.id === id);
    if (grp && window.confirm(`Delete student cohort "${grp.name}"?`)) {
      await TimetableStore.deleteGroup(id);
      const updatedList = groups.filter((g) => g.id !== id);
      setGroups(updatedList);
      runValidation(slots, rooms, faculty, updatedList, courses);
      showNotice(`Deleted student cohort: ${grp.name}`);
    }
  };

  // Trigger Ask AI for slot
  const handleAskAiForSlot = (questionText: string) => {
    setInitialAssistantQuestion(questionText);
    setAssistantOpen(true);
  };

  // Loading state
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#FC475C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500">Connecting to Tempo Supabase Workspace...</p>
        </div>
      </div>
    );
  }

  // Not signed in: render AuthScreen
  if (!user) {
    return (
      <AuthScreen
        onAuthenticated={(authenticatedUser) => {
          setUser(authenticatedUser);
          localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(authenticatedUser));
          TimetableStore.syncWithSupabase().then(() => reloadData());
        }}
      />
    );
  }

  const supabaseConfig = getSupabaseConfig();

  return (
    <div className="min-h-screen flex bg-[#FCFCFC]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={(page) => {
          if (page === 'AI Assistant') {
            setAssistantOpen(true);
          } else {
            setCurrentPage(page);
          }
        }}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onOpenAssistant={() => setAssistantOpen(true)}
        slotsCount={slots.length}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all">
        {/* Top Header */}
        <Header
          currentPage={currentPage}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenAssistant={() => setAssistantOpen(true)}
          onOpenSettings={() => setCurrentPage('Settings')}
          isSupabaseConfigured={supabaseConfig.isConfigured}
          validationScore={validation?.score || 100}
          user={user}
          onLogout={handleLogout}
        />

        {/* Database Status Alerts */}
        {dbStatus.isSyncing && (
          <div className="mx-4 sm:mx-8 mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2 text-xs text-blue-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Synchronizing workspace with Supabase PostgreSQL...</span>
          </div>
        )}

        {dbStatus.error && (
          <div className="mx-4 sm:mx-8 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="truncate">
                <strong>Database Sync Notice:</strong> {dbStatus.error}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                onClick={() => setCurrentPage('Settings')}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg transition"
              >
                Settings
              </button>
              <button
                onClick={() => setDbStatus((s) => ({ ...s, error: null }))}
                className="text-amber-700 hover:text-amber-900 px-1 font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {currentPage === 'Overview' && (
            <OverviewView
              slots={slots}
              courses={courses}
              faculty={faculty}
              rooms={rooms}
              groups={groups}
              validation={validation}
              savedTimetablesCount={savedTimetables.length}
              onNavigate={(page) => setCurrentPage(page)}
              onOpenGenerate={handleGenerate}
              onOpenAssistant={() => setAssistantOpen(true)}
              onAddCourse={() => {
                setCourseToEdit(null);
                setCourseModalOpen(true);
              }}
            />
          )}

          {currentPage === 'Timetable' && (
            <TimetableView
              slots={slots}
              courses={courses}
              faculty={faculty}
              rooms={rooms}
              groups={groups}
              validation={validation}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onOpenValidation={() => setValidationModalOpen(true)}
              onSelectSlot={(slot) => setSelectedSlot(slot)}
              onSaveTimetable={handleSaveTimetable}
              onOpenSavedTimetables={() => setSavedTimetablesOpen(true)}
              notice={notice}
            />
          )}

          {currentPage === 'Courses' && (
            <CoursesView
              courses={courses}
              faculty={faculty}
              groups={groups}
              onAddCourse={() => {
                setCourseToEdit(null);
                setCourseModalOpen(true);
              }}
              onEditCourse={(course) => {
                setCourseToEdit(course);
                setCourseModalOpen(true);
              }}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {currentPage === 'Faculty' && (
            <FacultyView
              faculty={faculty}
              slots={slots}
              onAddFaculty={() => {
                setFacultyToEdit(null);
                setFacultyModalOpen(true);
              }}
              onEditFaculty={(fac) => {
                setFacultyToEdit(fac);
                setFacultyModalOpen(true);
              }}
              onDeleteFaculty={handleDeleteFaculty}
            />
          )}

          {currentPage === 'Rooms' && (
            <RoomsView
              rooms={rooms}
              slots={slots}
              onAddRoom={() => {
                setRoomToEdit(null);
                setRoomModalOpen(true);
              }}
              onEditRoom={(room) => {
                setRoomToEdit(room);
                setRoomModalOpen(true);
              }}
              onDeleteRoom={handleDeleteRoom}
            />
          )}

          {currentPage === 'Student Groups' && (
            <GroupsView
              groups={groups}
              courses={courses}
              slots={slots}
              onAddGroup={() => {
                setGroupToEdit(null);
                setGroupModalOpen(true);
              }}
              onEditGroup={(group) => {
                setGroupToEdit(group);
                setGroupModalOpen(true);
              }}
              onDeleteGroup={handleDeleteGroup}
            />
          )}

          {currentPage === 'Analytics' && (
            <AnalyticsView
              slots={slots}
              courses={courses}
              faculty={faculty}
              rooms={rooms}
              groups={groups}
              validation={validation}
            />
          )}

          {currentPage === 'Settings' && (
            <SettingsView onRefreshData={reloadData} onShowNotice={showNotice} />
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 px-8 border-t border-[#edf0f5] bg-white text-xs text-gray-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; 2026 Tempo Intelligent Timetable Planner &bull; Vignan University Workspace</span>
            <span>Authenticated via Supabase &bull; CSP Backtracking &amp; Gemini AI</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <CourseModal
        isOpen={courseModalOpen}
        onClose={() => {
          setCourseModalOpen(false);
          setCourseToEdit(null);
        }}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
        facultyList={faculty}
        groupsList={groups}
      />

      <FacultyModal
        isOpen={facultyModalOpen}
        onClose={() => {
          setFacultyModalOpen(false);
          setFacultyToEdit(null);
        }}
        onSave={handleSaveFaculty}
        facultyToEdit={facultyToEdit}
      />

      <RoomModal
        isOpen={roomModalOpen}
        onClose={() => {
          setRoomModalOpen(false);
          setRoomToEdit(null);
        }}
        onSave={handleSaveRoom}
        roomToEdit={roomToEdit}
      />

      <GroupModal
        isOpen={groupModalOpen}
        onClose={() => {
          setGroupModalOpen(false);
          setGroupToEdit(null);
        }}
        onSave={handleSaveGroup}
        groupToEdit={groupToEdit}
      />

      <SlotDetailModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onAskAi={handleAskAiForSlot}
      />

      <ValidationModal
        isOpen={validationModalOpen}
        onClose={() => setValidationModalOpen(false)}
        validation={validation}
      />

      <SavedTimetablesModal
        isOpen={savedTimetablesOpen}
        onClose={() => setSavedTimetablesOpen(false)}
        savedTimetables={savedTimetables}
        onLoadTimetable={handleLoadTimetable}
        onDeleteTimetable={handleDeleteSavedTimetable}
      />

      <AssistantModal
        isOpen={assistantOpen}
        onClose={() => {
          setAssistantOpen(false);
          setInitialAssistantQuestion('');
        }}
        slots={slots}
        validation={validation}
        courses={courses}
        rooms={rooms}
        faculty={faculty}
        initialQuestion={initialAssistantQuestion}
      />
    </div>
  );
}
