/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Copy, Check, Loader2 } from 'lucide-react';
import { Course, Faculty, Room, TimetableSlot, ValidationResult } from '../../utils/scheduler.ts';

import { generateAcademicAnalysis } from '../../utils/aiAnalysis.ts';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  isFallback?: boolean;
}

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: TimetableSlot[];
  validation: ValidationResult | null;
  courses: Course[];
  rooms: Room[];
  faculty: Faculty[];
  initialQuestion?: string;
}

export const AssistantModal: React.FC<AssistantModalProps> = ({
  isOpen,
  onClose,
  slots,
  validation,
  courses,
  rooms,
  faculty,
  initialQuestion = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your Tempo Academic AI Copilot. I analyze timetable constraints, evaluate room utilization, detect faculty workload bottlenecks, and explain why specific slots were scheduled. How can I help you optimize your schedule today?',
    },
  ]);
  const [input, setInput] = useState(initialQuestion);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const SUGGESTED_QUESTIONS = [
    'Why is Lab-2 scheduled on Wednesday 09:00?',
    'Evaluate faculty workload distribution and fatigue risks.',
    'Are there any room bottlenecks or underutilized spaces?',
    'Suggest improvements to student daily schedules.',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || input).trim();
    if (!textToSend || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    const context = {
      totalSessions: slots.length,
      totalCourses: courses.length,
      totalFaculty: faculty.length,
      totalRooms: rooms.length,
      score: validation?.score || 100,
      hardConflicts: validation?.hardConflicts || 0,
      dailyDistribution: validation?.dailyDistribution,
    };

    // If hosted on GitHub Pages or static environment, use local academic analysis engine
    const isStaticHost =
      typeof window !== 'undefined' &&
      (window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:');

    if (isStaticHost) {
      setTimeout(() => {
        const answer = generateAcademicAnalysis(textToSend, context);
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: answer,
            isFallback: true,
          },
        ]);
        setIsLoading(false);
      }, 400);
      return;
    }

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          timetable: slots,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.answer || 'No analysis available.',
          isFallback: data.isFallback,
        },
      ]);
    } catch {
      // Graceful fallback to heuristic analysis engine without error noise
      const answer = generateAcademicAnalysis(textToSend, context);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: answer,
          isFallback: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs">
      <div className="bg-[#FCFCFC] rounded-3xl shadow-2xl w-full max-w-2xl h-[620px] flex flex-col overflow-hidden border border-[#edf0f5]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f1f3f9] bg-gradient-to-r from-[#F0F3FF] via-white to-[#FFF5F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#FC475C] text-white flex items-center justify-center shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#172033]">Tempo AI Assistant</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#EBF3FE] text-[#29689E] text-[9px] font-bold">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Academic constraint explanations & optimization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close Assistant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#29689E] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed transition ${
                    isUser
                      ? 'bg-[#172033] text-white font-medium rounded-tr-xs shadow-sm'
                      : 'bg-white text-[#172033] border border-[#edf0f5] rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {!isUser && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                      <span>{msg.isFallback ? 'Local Heuristic Analysis' : 'Gemini AI Explanation'}</span>
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="hover:text-gray-700 flex items-center gap-1 transition"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check size={11} className="text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#FC475C] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold shadow-xs">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-gray-500 py-2">
              <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#29689E] flex items-center justify-center animate-pulse">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <span>Gemini is evaluating constraints and timetable heuristics...</span>
            </div>
          )}
        </div>

        {/* Prompt suggestion pills */}
        <div className="px-6 py-2.5 border-t border-[#f1f3f9] bg-[#FCFCFC] flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">Try asking:</span>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-[10px] font-semibold text-[#172033] bg-white border border-[#edf0f5] hover:border-[#FC475C] hover:text-[#FC475C] px-3 py-1 rounded-full whitespace-nowrap transition shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-[#f1f3f9] bg-white flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about timetable slots, faculty fatigue, room constraints..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FC475C] bg-[#FAFAFA]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-[#FC475C] text-white hover:bg-[#e0384c] transition disabled:opacity-40 shadow-xs"
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
