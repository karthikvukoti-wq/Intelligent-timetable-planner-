/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Key,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Copy,
  Check,
  Cpu,
  Sparkles,
  Server,
} from 'lucide-react';
import {
  getSupabaseConfig,
  setSupabaseConfig,
  TimetableStore,
} from '../utils/storage.ts';

interface SettingsViewProps {
  onRefreshData: () => void;
  onShowNotice: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onRefreshData,
  onShowNotice,
}) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const DDL_SCHEMA = `-- Tempo Intelligent Timetable Planner PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.academic_groups (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  student_count int NOT NULL DEFAULT 0,
  semester text NOT NULL DEFAULT 'Semester 3',
  department text DEFAULT 'Computer Science',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.faculty (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  email text UNIQUE,
  department text,
  max_weekly_hours int NOT NULL DEFAULT 16,
  availability jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text UNIQUE NOT NULL,
  room_type text NOT NULL CHECK (room_type IN ('Lecture', 'Lab', 'Seminar')),
  capacity int NOT NULL CHECK (capacity > 0),
  building text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.courses (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  faculty_id text REFERENCES public.faculty(id) ON DELETE SET NULL,
  group_id text REFERENCES public.academic_groups(id) ON DELETE CASCADE,
  room_type text NOT NULL DEFAULT 'Lecture',
  duration int NOT NULL DEFAULT 1,
  weekly_sessions int NOT NULL DEFAULT 2,
  student_count int DEFAULT 50,
  department text,
  semester text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.timetables (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  group_id text REFERENCES public.academic_groups(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'published',
  score int DEFAULT 100,
  sessions_count int DEFAULT 0,
  slots jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.academic_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated read & write
CREATE POLICY "Allow public read and write" ON public.academic_groups FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.faculty FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.rooms FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.courses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read and write" ON public.timetables FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`;

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseConfig(url, key);
    onShowNotice('Supabase configuration saved.');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await TimetableStore.testSupabaseConnection();
    setTestResult(result);
    setIsTesting(false);
  };

  const handlePullFromSupabase = async () => {
    const res = await TimetableStore.syncWithSupabase();
    if (res.success) {
      onRefreshData();
      onShowNotice(res.message);
    } else {
      onShowNotice(`Sync notice: ${res.message}`);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all courses, rooms, faculty, and timetables back to pristine sample data?')) {
      TimetableStore.resetToDefaults();
      onRefreshData();
      onShowNotice('Reset to initial sample university dataset.');
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(DDL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#edf0f5] shadow-2xs">
        <h2 className="text-base font-black text-[#172033]">Infrastructure & Integration</h2>
        <p className="text-xs text-gray-500 mt-1">
          Supabase PostgreSQL Persistence, Database DDL Scripts & Google AI Studio Gemini Runtime
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Supabase Connection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#edf0f5] shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-[#F0F8FF] text-[#13548E] border border-[#CCE5FC] flex items-center justify-center font-bold">
                <Database size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Supabase PostgreSQL Connection</h3>
                <p className="text-xs text-gray-400">Configure remote cloud database connection or fallback</p>
              </div>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Supabase Project URL
                </label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Supabase Anon / Public Key
                </label>
                <div className="relative">
                  <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6558e8] font-mono"
                  />
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle size={16} className="text-rose-600 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#6558e8] hover:bg-[#5346d8] rounded-xl shadow-sm shadow-[#6558e8]/30 transition"
                >
                  Save Credentials
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition disabled:opacity-50"
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
                <button
                  type="button"
                  onClick={handlePullFromSupabase}
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Pull Records from Supabase</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition flex items-center gap-1.5 ml-auto"
                >
                  <RotateCcw size={13} />
                  <span>Reset to Pristine Sample Data</span>
                </button>
              </div>
            </form>
          </div>

          {/* DDL Schema Viewer */}
          <div className="bg-white p-6 rounded-3xl border border-[#edf0f5] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">PostgreSQL DDL Schema (schema.sql)</h3>
                <p className="text-xs text-gray-400">Run this SQL in your Supabase SQL Editor</p>
              </div>
              <button
                onClick={handleCopySchema}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition flex items-center gap-1.5"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-gray-900 text-gray-200 text-[11px] font-mono overflow-x-auto max-h-72 leading-relaxed">
              {DDL_SCHEMA}
            </pre>
          </div>
        </div>

        {/* Right Column: Google Gemini AI Studio Copilot */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#FFF0F2] via-white to-[#F0F8FF] p-6 rounded-3xl border border-[#FDC4CC]/70 shadow-2xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FC475C] text-white flex items-center justify-center shadow-xs">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Google AI Studio Gemini Copilot</h3>
                <p className="text-xs text-gray-500">Autonomous university operations copilot</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-[#edf0f5]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Gemini SDK Version:</span>
                <span className="font-mono font-bold text-gray-800">@google/genai ^2.4.0</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#edf0f5]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Model Alias:</span>
                <span className="font-mono font-bold text-[#FC475C]">gemini-3.8-flash</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#edf0f5]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Architecture:</span>
                <p className="text-gray-600 mt-0.5 leading-relaxed">
                  Server-side proxy routes via Express (<code className="text-[#2C3E96] font-mono">/api/assistant</code>), protecting API keys and preventing browser leakage.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#edf0f5]">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Capabilities:</span>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mt-1">
                  <li>Natural language explanations of CSP decisions</li>
                  <li>Faculty workload and cognitive fatigue auditing</li>
                  <li>Campus classroom utilization optimization</li>
                  <li>Deterministic heuristic fallback if API key is absent</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
