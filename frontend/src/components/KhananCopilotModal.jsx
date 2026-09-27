import React, { useState, useEffect } from 'react';
import { Bot, X, Send, Sparkles, BookOpen, Languages, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';

export default function KhananCopilotModal({ isOpen, onClose, defaultMineId = 'gevra', initialQuery = '' }) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'copilot',
      text: 'Greetings! I am Khanan Copilot (खनन मित्र), your AI statutory safety intelligence officer for Coal Mines Regulations (CMR 2017), Mines Act 1952, DGMS directives, and live multi-sensor telemetry.',
      reference: 'CMR 2017 & DGMS Safety Core Knowledgebase',
    },
  ]);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSend(initialQuery);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const quickQuestions = [
    { label: '🚨 Biggest Safety Concern', query: 'What is the biggest safety concern at this mine?' },
    { label: '🚜 Haul Road Berm Rules (Reg 107)', query: 'Explain haul road and berm rules under CMR 2017 Reg 107' },
    { label: '⚠️ HEMM AVA & Radar (Reg 94)', query: 'What are mandatory safety sensors for dumpers under Reg 94?' },
    { label: '📋 Shift Handover & PTW', query: 'What are the statutory shift handover and PTW rules?' },
    { label: '💨 CAAQMS Air Limits (NAAQS)', query: 'What are the 24-hour NAAQS limits for PM10 and PM2.5 in mining areas?' },
  ];

  const handleSend = async (qText) => {
    const textToSend = qText || query;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.queryCopilot(textToSend, defaultMineId, language);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: res.answer,
          reference: res.statutory_reference,
          mine: res.referenced_mine,
          risk_score: res.risk_score,
          risk_level: res.risk_level,
          action_required: res.action_required,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'copilot',
          text: 'Encountered connection timeout with regulatory engine. Under CMR 2017, all field observations and hazard notices require immediate digital verification.',
          reference: 'Offline Fallback Rule',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0f131a] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white text-base">खनन Copilot (Khanan Copilot)</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono border border-emerald-500/30">
                  AI CMR 2017
                </span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-full font-mono border border-cyan-500/20">
                  Site: {defaultMineId.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-400">Bilingual Statutory & Safety Intelligence Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono uppercase">{language === 'en' ? 'EN' : 'हिन्दी'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-black/30 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-gray-400 font-mono text-[11px] flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Quick Prompts:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.query)}
              className="flex-shrink-0 px-2.5 py-1 rounded-md bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/10 text-gray-300 text-xs transition whitespace-nowrap"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none space-y-2.5'
                }`}
              >
                {/* Risk Score Highlight Badge if returned */}
                {m.risk_score && (
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      <AlertTriangle className="w-3 h-3" /> AI Risk: {m.risk_score}/100 ({m.risk_level})
                    </span>
                    {m.mine && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        Target: {m.mine}
                      </span>
                    )}
                  </div>
                )}

                {/* Formatted Text Content */}
                <div className="whitespace-pre-line text-gray-200">
                  {m.text}
                </div>

                {/* Action Required Box */}
                {m.action_required && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Mandated Corrective Action: </span>
                      {m.action_required}
                    </div>
                  </div>
                )}

                {/* Statutory Reference Tag */}
                {m.reference && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {m.reference}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 p-2">
              <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Synthesizing CMR 2017 statutes and live multi-sensor mine telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-white/10 bg-black/40 flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'जैसे: खदान में सबसे बड़ा खतरा क्या है? या नियम 107 बर्म मानक...'
                : 'Ask: "What is the biggest safety concern at this mine?" or Reg 107 haul road berm rules...'
            }
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
}

