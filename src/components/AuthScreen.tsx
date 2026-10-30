/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, ShieldCheck, Sparkles, Database, ArrowRight, Lock, Mail, User, AlertTriangle } from 'lucide-react';
import { getSupabaseClient } from '../utils/storage.ts';

interface AuthScreenProps {
  onAuthenticated: (user: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [tab, setTab] = useState<'welcome' | 'signin' | 'signup' | 'forgot'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleDemoSignIn = () => {
    const demoUser = {
      id: 'usr_demo_admin',
      email: 'admin@vignan.edu',
      user_metadata: {
        full_name: 'Dr. Academic Dean',
        institution: 'Vignan University',
        role: 'Dean / Timetable Admin',
      },
    };
    onAuthenticated(demoUser);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const client = getSupabaseClient();
      const { data, error: signInError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        // If Supabase not reachable or credentials fail, allow quick demo login
        if (email === 'admin@vignan.edu' && password === 'tempo2026') {
          handleDemoSignIn();
          return;
        }
        throw signInError;
      }

      if (data?.user) {
        onAuthenticated(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials or use One-Click Demo Admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const client = getSupabaseClient();
      const { data, error: signUpError } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim() || 'Academic Staff',
            institution: 'Vignan University',
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data?.user) {
        onAuthenticated(data.user);
      } else {
        setMessage('Registration submitted! You can now sign in.');
        setTab('signin');
      }
    } catch (err: any) {
      setError(err.message || 'Could not register user account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col justify-between">
      {/* Top Navbar */}
      <div className="py-6 px-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#FC475C] to-[#FDB365] flex items-center justify-center text-white shadow-md shadow-[#FC475C]/20">
            <Clock size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#172033]">tempo</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#FFF0F2] text-[#FC475C] text-[9px] font-black uppercase tracking-wider">
                CSP & AI
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-semibold">Intelligent Timetable Planner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {tab !== 'welcome' && (
            <button
              onClick={() => {
                setTab('welcome');
                setError(null);
                setMessage(null);
              }}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition"
            >
              Welcome
            </button>
          )}
          <button
            onClick={() => {
              setTab('signin');
              setError(null);
              setMessage(null);
            }}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
              tab === 'signin' ? 'bg-[#172033] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('signup');
              setError(null);
              setMessage(null);
            }}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
              tab === 'signup'
                ? 'bg-[#FC475C] text-white shadow-sm'
                : 'text-[#FC475C] bg-[#FFF0F2] hover:bg-[#ffe3e7]'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Hero & Authentication Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F2] text-[#FC475C] text-xs font-bold border border-[#FDC4CC]">
              <Sparkles size={14} />
              <span>Constraint Satisfaction Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#172033] tracking-tight leading-tight">
              Intelligent Timetable Planner
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg">
              Generate conflict-free academic timetables with Constraint Satisfaction Backtracking,
              real Supabase PostgreSQL persistence, and Google Gemini AI schedule explanations.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#F0F8FF] border border-[#CCE5FC]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#13548E]">
                  Backtracking Search
                </span>
                <p className="text-xs font-bold text-[#172033] mt-1">100% Conflict-Free</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Faculty, rooms & student cohorts</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFF7EE] border border-[#FED9B2]">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8E4702]">
                  Supabase Auth & RLS
                </span>
                <p className="text-xs font-bold text-[#172033] mt-1">Tenant Isolation</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Row-level security policies</p>
              </div>
            </div>
          </div>

          {/* Right Auth Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#edf0f5] shadow-xl">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {message}
              </div>
            )}

            {/* Quick Demo Login Button */}
            <div className="mb-5 pb-5 border-b border-gray-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-2">
                University Timetable Portal
              </span>
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-3 rounded-2xl bg-linear-to-r from-[#FC475C] to-[#FDB365] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#FC475C]/25 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Sparkles size={16} />
                <span>One-Click Sign-In as Demo Administrator</span>
              </button>
              <p className="text-center text-[10px] text-gray-400 mt-1.5">
                admin@vignan.edu • tempo2026
              </p>
            </div>

            {/* Sign In Form */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@vignan.edu"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[#FC475C] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#172033] hover:bg-[#232f4a] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>

                <p className="text-center text-xs text-gray-500 pt-2">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('signup')}
                    className="font-bold text-[#FC475C] hover:underline"
                  >
                    Create one
                  </button>
                </p>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@vignan.edu');
                      setPassword('tempo2026');
                    }}
                    className="text-[11px] text-gray-400 hover:text-gray-600 underline"
                  >
                    Quick Fill: admin@vignan.edu / tempo2026
                  </button>
                </div>
              </form>
            )}

            {/* Sign Up Form */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. K. Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Institutional Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="staff@vignan.edu"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-[#FC475C] hover:bg-[#e0384c] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Register Academic Account'}
                </button>

                <p className="text-center text-xs text-gray-500 pt-2">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('signin')}
                    className="font-bold text-[#FC475C] hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}

            {/* Welcome / Default tab content */}
            {tab === 'welcome' && (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0F2] text-[#FC475C] mx-auto flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-base font-bold text-[#172033]">Vignan University Timetable Portal</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Sign in with your institutional credentials or enter immediately using the Demo Administrator account.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setTab('signin')}
                    className="w-full py-2.5 rounded-xl bg-[#172033] text-white text-xs font-bold hover:bg-[#232f4a] transition shadow-xs"
                  >
                    Enter with Email & Password
                  </button>
                  <button
                    onClick={handleDemoSignIn}
                    className="w-full py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Quick Launch Demo Environment
                  </button>
                </div>
              </div>
            )}

            {/* Forgot tab */}
            {tab === 'forgot' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#172033]">Reset your Password</h3>
                <p className="text-xs text-gray-500">
                  Enter your email to receive recovery instructions.
                </p>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@vignan.edu"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMessage('Recovery email simulated. You can proceed with demo credentials.');
                    setTab('signin');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#172033] text-white text-xs font-bold hover:bg-[#232f4a] transition"
                >
                  Send Recovery Link
                </button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setTab('signin')}
                    className="text-xs font-bold text-[#FC475C] hover:underline"
                  >
                    &larr; Back to Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-8 border-t border-[#edf0f5] bg-white text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Tempo Intelligent Timetable Planner &bull; Vignan University Workspace</span>
          <span>Secured with Supabase Authentication &amp; PostgreSQL RLS</span>
        </div>
      </footer>
    </div>
  );
};
