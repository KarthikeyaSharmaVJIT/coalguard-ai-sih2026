import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';

export default function Topbar({ 
  currentPersona, 
  onSelectPersona 
}) {
  const personas = [
    { id: 'corporate_hq', label: 'Corporate HQ (CIL) — Multi-Subsidiary Analytics' },
    { id: 'mine_officer', label: 'Mine Safety Officer — Site Operations & PTW' },
    { id: 'regulatory_auditor', label: 'Regulatory Auditor — DGMS / CPCB Clearances' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0c10] px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Ministry Emblem & Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-white tracking-wide">
                COAL<span className="text-emerald-400">GUARD</span> AI
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-wide">
              Ministry of Coal • Smart Compliance & Safety Grid
            </p>
          </div>
        </div>

        {/* Right: Clean Single Dropdown Role Switcher */}
        <div className="flex items-center gap-2.5">
          <label htmlFor="role-select" className="text-gray-400 font-mono text-xs flex items-center gap-1.5 hidden sm:flex">
            <UserCheck className="w-3.5 h-3.5 text-gray-400" />
            <span>Role:</span>
          </label>
          <div className="relative">
            <select
              id="role-select"
              value={currentPersona}
              onChange={(e) => onSelectPersona(e.target.value)}
              className="bg-[#0e1219] border border-white/10 hover:border-white/20 text-xs text-gray-200 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-emerald-500/60 cursor-pointer transition"
            >
              {personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
    </header>
  );
}
