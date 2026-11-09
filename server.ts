/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  generateCspTimetable,
  validateSchedule,
  Course,
  Room,
  Faculty,
  StudentGroup,
  TimetableSlot,
} from './src/utils/scheduler.ts';
import { generateAcademicAnalysis } from './src/utils/aiAnalysis.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// 1. Timetable Generation API (Constraint Satisfaction Backtracking)
app.post('/api/timetable/generate', (req: Request, res: Response) => {
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

// 2. Schedule Validation API
app.post('/api/timetable/validate', (req: Request, res: Response) => {
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

// 3. Gemini Academic Copilot Assistant API
app.post('/api/assistant', async (req: Request, res: Response) => {
  try {
    const { question, timetable, context } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API key is available, call Gemini 3.8 Flash
    if (apiKey) {
      try {
        const ai = new GoogleGenAI();
        const systemPrompt = `You are the Tempo Academic AI Copilot, an expert university academic scheduler and operations research specialist.
You analyze university timetable constraints, faculty teaching loads, classroom utilization, room capacity bottlenecks, and student cohort schedules.
Tone: Professional, articulate, structured, and pedagogical.

Context of the active timetable:
- Total Scheduled Sessions: ${context?.totalSessions || (timetable ? timetable.length : 0)}
- Total Courses: ${context?.totalCourses || 'N/A'}
- Active Faculty: ${context?.totalFaculty || 'N/A'}
- Available Rooms: ${context?.totalRooms || 'N/A'}
- Overall CSP Quality Score: ${context?.score || 100}%
- Hard Conflicts: ${context?.hardConflicts || 0}
- Daily Load Distribution: ${JSON.stringify(context?.dailyDistribution || {})}

Sample of active scheduled slots:
${JSON.stringify((timetable || []).slice(0, 15), null, 2)}

Provide concise, highly informative, and directly actionable guidance regarding timetable structure, constraint satisfaction, and pedagogical load balancing.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question:\n${question}` }] },
          ],
        });

        const answer = response.text || 'No response generated from Gemini.';
        return res.json({ answer, isFallback: false });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using heuristic fallback:', geminiError.message);
      }
    }

    // Heuristic Fallback Analysis if no API key or API call issue
    const heuristicResponse = generateAcademicAnalysis(question, context);
    return res.json({ answer: heuristicResponse, isFallback: true });
  } catch (err: any) {
    console.error('Assistant API error:', err);
    return res.status(500).json({ error: err.message || 'Copilot assistant error.' });
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
