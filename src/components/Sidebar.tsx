/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  Building2,
  GraduationCap,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onSelectPage: (page: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAssistant: () => void;
  slotsCount: number;
  user: any;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  mobileOpen,
  onCloseMobile,
  onOpenAssistant,
  slotsCount,
  user,
  onLogout,
}) => {
  const navItems = [
    { id: 'Overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'Timetable', label: 'Timetable', icon: Calendar, badge: slotsCount },
    { id: 'Courses', label: 'Courses', icon: BookOpen },
    { id: 'Faculty', label: 'Faculty', icon: Users },
    { id: 'Rooms', label: 'Rooms', icon: Building2 },
    { id: 'Student Groups', label: 'Student Groups', icon: GraduationCap },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#edf0f5] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Branding */}
        <div className="p-6 border-b border-[#f1f3f9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#FC475C] to-[#FDB365] flex items-center justify-center text-white shadow-md shadow-[#FC475C]/20">
              <Clock size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-[#172033]">tempo</span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#FFF0F2] text-[#FC475C] text-[9px] font-black uppercase tracking-wider">
                  AI CSP
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-semibold truncate max-w-[130px]">
                Vignan University
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Academic Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  active
                    ? 'bg-[#172033] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={active ? 'text-[#FC475C]' : 'text-gray-400 group-hover:text-gray-600'}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      active
                        ? 'bg-[#FC475C] text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* AI Copilot Callout */}
          <div className="pt-4">
            <button
              onClick={() => {
                onOpenAssistant();
                onCloseMobile();
              }}
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF0F2] via-[#FFF7EE] to-[#F3F5FE] border border-[#FDC4CC]/70 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#FC475C] text-white flex items-center justify-center shadow-xs">
                  <Sparkles size={13} />
                </div>
                <span className="text-xs font-black text-[#172033]">Tempo Copilot</span>
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-[#29689E] border border-blue-100">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Ask constraint questions, verify bottlenecks & optimize scheduling.
              </p>
            </button>
          </div>
        </div>

        {/* User Workspace & Logout */}
        <div className="p-4 border-t border-[#f1f3f9] bg-[#FAFAFA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#6558e8] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {user?.email ? user.email.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#172033] truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Administrator'}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <ShieldCheck size={11} />
                  <span>RLS Verified</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 text-gray-400 hover:text-[#FC475C] rounded-lg hover:bg-gray-100 transition"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
