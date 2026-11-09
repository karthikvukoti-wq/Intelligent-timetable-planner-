/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  generateCspTimetable,
  validateSchedule,
  Course,
  Room,
  Faculty,
  StudentGroup,
  TimetableSlot,
} from './src/utils/scheduler.ts';
import {
  validateAdminCredentials,
  createAdminToken,
  verifyAdminToken,
  revokeAdminToken,
} from './src/utils/authServer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

/**
 * Middleware: Enforce secure administrator session on protected endpoints
 */
function requireAdminAuth(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Administrator authentication token required.' });
  }

  const verification = verifyAdminToken(token);
  if (!verification.valid || !verification.payload) {
    return res.status(401).json({ error: `Unauthorized: ${verification.error || 'Invalid session'}` });
  }

  (req as any).adminUser = verification.payload;
  next();
}

// 1. Admin Authentication: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Administrator username and password are required.' });
    }

    const isValid = validateAdminCredentials(String(username), String(password));
    if (!isValid) {
      return res.status(401).json({ error: 'Access denied: Invalid administrator credentials.' });
    }

    const token = createAdminToken(String(username));
    const { payload } = verifyAdminToken(token);

    return res.json({
      success: true,
      token,
      user: payload,
    });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'Internal authentication server error.' });
  }
});

// 2. Admin Authentication: Session Verification
app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ valid: false, error: 'Authorization header missing.' });
  }

  const result = verifyAdminToken(token);
  if (!result.valid || !result.payload) {
    return res.status(401).json({ valid: false, error: result.error || 'Session expired or invalid.' });
  }

  return res.json({ valid: true, user: result.payload });
});

// 3. Admin Authentication: Logout & Revocation
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    revokeAdminToken(token);
  }

  return res.json({ success: true, message: 'Logged out successfully.' });
});

// 1. Timetable Generation API (Constraint Satisfaction Backtracking - Protected)
app.post('/api/timetable/generate', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { courses, rooms, faculty, groups } = req.body as {
      courses: Course[];
      rooms: Room[];
      faculty: Faculty[];
      groups: StudentGroup[];
    };

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: 'At least one course is required to generate a timetable.' });
    }

    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return res.status(400).json({ error: 'At least one classroom/lab is required.' });
    }

    const result = generateCspTimetable(
      courses,
      rooms,
      Array.isArray(faculty) ? faculty : [],
      Array.isArray(groups) ? groups : []
    );

    return res.json(result);
  } catch (err: any) {
    console.error('Timetable generation error:', err);
    return res.status(500).json({ error: err.message || 'Timetable scheduling error.' });
  }
});

// 2. Schedule Validation API (Protected)
app.post('/api/timetable/validate', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { slots, rooms, faculty, groups, courses } = req.body as {
      slots: TimetableSlot[];
      rooms: Room[];
      faculty: Faculty[];
      groups: StudentGroup[];
      courses: Course[];
    };

    const validation = validateSchedule(
      slots || [],
      rooms || [],
      faculty || [],
      groups || [],
      courses || []
    );

    return res.json({ validation });
  } catch (err: any) {
    console.error('Schedule validation error:', err);
    return res.status(500).json({ error: err.message || 'Schedule validation error.' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      base: '/',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Tempo Timetable Planner server running on http://localhost:${PORT}`);
  });
}

startServer();
