import React, { useState, useEffect } from 'react';
import { 
  HardHat, 
  ShieldCheck, 
  Users, 
  FileCheck2, 
  CheckCircle, 
  Activity,
  Calendar
} from 'lucide-react';
import { SAMPLE_MINES } from '../lib/sampleData';
import { api } from '../lib/api';
import AIPredictionCard from '../components/AIPredictionCard';
import WorkforceFatigueCard from '../components/WorkforceFatigueCard';

export default function MineOfficialView({ 
  activeMineId = 'gevra', 
  setActiveMineId, 
  onOpenCopilot, 
  onOpenReport 
}) {
  const selectedMineId = activeMineId;
  const setSelectedMineId = (id) => {
    if (setActiveMineId) setActiveMineId(id);
  };
  const [mineData, setMineData] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    api.getMineDetails(selectedMineId).then((data) => {
      setMineData(data);
      setLoading(false);
    });
  }, [selectedMineId]);

  const activeMine = SAMPLE_MINES.find((m) => m.id === selectedMineId) || SAMPLE_MINES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Header & Mine Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 bg-[#0d1118]/80 border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <HardHat className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">Mine Official Field Hub</h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                CMR 2017 Shift Control
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Site Safety Operations • Permit-to-Work (PTW) • Statutory Shift Logs
            </p>
          </div>
        </div>

        {/* Mine Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-gray-400">Select Site:</label>
          <select
            value={selectedMineId}
            onChange={(e) => setSelectedMineId(e.target.value)}
            className="bg-black/60 border border-white/10 text-xs text-white rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-emerald-500"
          >
            {SAMPLE_MINES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.subsidiary.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 bg-[#0d1118]/80 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">Statutory Mine Manager</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white mt-1">{activeMine.safety_officer}</div>
          <div className="text-[10px] text-gray-400 font-mono mt-1">First Class Certificate Holder</div>
        </div>

        <div className="glass-panel p-4 bg-[#0d1118]/80 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">Active Shift Personnel</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
            {activeMine.worker_count.toLocaleString()} <span className="text-xs text-gray-400 font-normal">Registered</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono mt-1">Biometric Attendance Verified</div>
        </div>

        <div className="glass-panel p-4 bg-[#0d1118]/80 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">Permit-to-Work (PTW)</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-400 font-mono mt-1">
            {activeMine.active_ptw_count} <span className="text-xs text-gray-400 font-normal">Active Permits</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">Blasting & Heavy Haulage Active</div>
        </div>

        <div className="glass-panel p-4 bg-[#0d1118]/80 border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">CTO Permit Expiry</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono mt-1">
            {mineData?.inspection_status?.cto_valid_until || '2027-03-31'}
          </div>
          <div className="text-[10px] text-gray-400 font-mono mt-1">State Pollution Board (Valid)</div>
        </div>

      </div>

      {/* AI Predictive Early-Warning Horizon (The Killer Feature) */}
      <AIPredictionCard 
        mineId={selectedMineId} 
        onConsultCopilot={onOpenCopilot} 
      />

      {/* Main Split Content: Operational Shift Log & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Shift Observations & Statutory Checklists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 bg-[#0d1118]/80 border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Field Observations & DGMS Action Notices
              </h3>
              <span className="text-xs font-mono text-gray-400">
                {mineData?.field_observations?.length || 0} Pending Items
              </span>
            </div>

            {mineData?.field_observations && mineData.field_observations.length > 0 ? (
              mineData.field_observations.map((obs, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-emerald-400 font-bold">{obs.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Severity: {obs.severity}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">{obs.hazard_type}</div>
                  <p className="text-gray-300 leading-relaxed text-[11px]">{obs.description}</p>
                  
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                      Statutory Action Mandated:
                    </div>
                    <div className="text-[11px] text-gray-300">{obs.action_required}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 font-mono">
                    <span>Inspector: {obs.inspector}</span>
                    <span>Deadline: {obs.deadline_hours}h remaining</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-400 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
                No active critical shift violations logged for this mine.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Haul Road & Safety Checklist */}
        <div className="space-y-4">
          <div className="glass-panel p-5 bg-[#0d1118]/80 border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" /> CMR 2017 Shift Compliance Checklist
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-200">Regulation 107 - Haul Road Berm Height</div>
                  <div className="text-[10px] text-gray-400">Continuous 1.8m earthen berm verified on OB Ramp #3.</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-200">Regulation 94 - Audio-Visual Alarms (AVA)</div>
                  <div className="text-[10px] text-gray-400">All active 100T dumpers certified functional.</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-200">Environmental Clearance (EC) Cap Check</div>
                  <div className="text-[10px] text-gray-400">
                    Production {activeMine.production_mtpa} MT within EC {activeMine.ec_limit_mtpa} MT limit.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              {/* Primary Interactive Judge Prompt Button */}
              <button
                onClick={() => onOpenCopilot('What is the biggest safety concern at this mine?', selectedMineId)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-black font-bold text-xs hover:opacity-90 shadow-lg shadow-rose-500/20 transition flex items-center justify-center gap-1.5"
              >
                <span>🚨 Ask Copilot: Biggest Safety Concern?</span>
              </button>

              <button
                onClick={() => onOpenCopilot('What are the statutory shift handover and PTW rules for this mine?', selectedMineId)}
                className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
              >
                Consult Khanan Copilot on Shift Rules
              </button>
              
              <button
                onClick={onOpenReport}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition"
              >
                Generate DGMS Form IV Report
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Miner Fatigue & Health Condition Segregation Card */}
      <WorkforceFatigueCard 
        mineName={activeMine.name} 
        workerCount={activeMine.worker_count} 
      />

    </div>
  );
}

