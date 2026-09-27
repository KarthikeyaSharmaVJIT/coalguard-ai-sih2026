import React from 'react';
import { 
  ShieldCheck, 
  Bot, 
  FileSearch, 
  FileText, 
  UserCheck
} from 'lucide-react';

export default function Topbar({ 
  currentPersona, 
  onSelectPersona, 
  onOpenCopilot, 
  onOpenOCR, 
  onOpenReport
}) {
  const personas = [
    { id: 'mine_officer', label: 'Mine Safety Officer', desc: 'Site Operations & PTW' },
    { id: 'corporate_hq', label: 'Corporate HQ (CIL)', desc: 'Multi-Subsidiary Analytics' },
    { id: 'regulatory_auditor', label: 'Regulatory DGMS / CPCB', desc: 'Enforcement & Clearances' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0c10]/90 backdrop-blur-xl px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Ministry Emblem & Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-wide">
                COAL<span className="text-emerald-400">GUARD</span> AI
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GOVERNANCE v2.4
              </span>
            </div>
            <p className="text-[11px] text-gray-400 tracking-wider uppercase font-mono">
              Ministry of Coal • Smart Compliance & Safety Grid
            </p>
          </div>
        </div>

        {/* Center: Persona Switcher */}
        <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <span className="text-gray-400 px-2 flex items-center gap-1 font-mono text-[11px]">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Role:
          </span>
          <div className="flex gap-1">
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPersona(p.id)}
                className={`px-3 py-1.5 rounded-lg transition-all text-xs font-medium flex items-center gap-1.5 ${
                  currentPersona === p.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Quick Action Modals Trigger */}
        <div className="flex items-center gap-2">
          {/* Khanan Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>खनन Copilot</span>
            <span className="text-[10px] bg-black/20 px-1 py-0.2 rounded font-mono">AI</span>
          </button>

          {/* OCR Digitizer */}
          <button
            onClick={onOpenOCR}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs transition cursor-pointer"
            title="OCR Document Digitizer"
          >
            <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">OCR Parser</span>
          </button>

          {/* Statutory Reports */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs transition cursor-pointer"
            title="Generate Statutory Forms"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Form IV/V</span>
          </button>
        </div>

      </div>
    </header>
  );
}
