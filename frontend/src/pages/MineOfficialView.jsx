import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HardHat, 
  ShieldCheck, 
  Users, 
  FileCheck2, 
  CheckCircle, 
  Activity,
  Calendar,
  FileSearch,
  FileText,
  Smartphone
} from 'lucide-react';
import { SAMPLE_MINES } from '../lib/sampleData';
import { api } from '../lib/api';
import AIPredictionCard from '../components/AIPredictionCard';
import WorkforceFatigueCard from '../components/WorkforceFatigueCard';

export default function MineOfficialView({ 
  activeMineId = 'gevra', 
  setActiveMineId, 
  onOpenCopilot, 
  onOpenOCR,
  onOpenReport 
}) {
  const navigate = useNavigate();
  const selectedMineId = activeMineId;
  const setSelectedMineId = (id) => {
    if (setActiveMineId) setActiveMineId(id);
  };
  const [mineData, setMineData] = useState(null);

  useEffect(() => {
    api.getMineDetails(selectedMineId).then((data) => {
      setMineData(data);
    });
  }, [selectedMineId]);

  const activeMine = SAMPLE_MINES.find((m) => m.id === selectedMineId) || SAMPLE_MINES[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* Top Header & Mine Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1017] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <HardHat className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-white font-display">Mine Safety Hub</h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 text-gray-300 border border-white/10">
                Site Operations & PTW
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Statutory Shift Logs • Permit-to-Work Controls • CMR 2017 Directives
            </p>
          </div>
        </div>

        {/* Site Switcher & Sub-actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="site-select" className="text-xs font-mono text-gray-400">Site:</label>
            <select
              id="site-select"
              value={selectedMineId}
              onChange={(e) => setSelectedMineId(e.target.value)}
              className="bg-[#0e1219] border border-white/10 text-xs text-white rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-emerald-500/60 cursor-pointer"
            >
              {SAMPLE_MINES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.subsidiary.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Demoted sub-features folded into operational controls */}
          <button
            onClick={onOpenOCR}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono transition cursor-pointer"
            title="Scan handwritten shift log or inspection slip"
          >
            <FileSearch className="w-3.5 h-3.5 text-cyan-400" />
            <span>Digitize Shift Slip (OCR)</span>
          </button>

          <button
            onClick={() => onOpenReport(selectedMineId)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono transition cursor-pointer"
            title="Generate Statutory Form IV/V"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Statutory Form IV</span>
          </button>

          <button
            onClick={() => navigate('/field-app')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-mono transition cursor-pointer"
            title="Launch Field Inspection Mobile Capture Simulator"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Field PWA</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono">Statutory Manager</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-semibold text-white">{activeMine.safety_officer}</div>
          <div className="text-[11px] text-gray-500 font-mono">First Class Certificate</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono">Shift Personnel</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-white font-mono">
            {activeMine.worker_count.toLocaleString()}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">Biometric Attendance Verified</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono">Permit-to-Work (PTW)</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-base font-bold text-white font-mono">
            {activeMine.active_ptw_count} Active
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">Blasting & Haulage Cleared</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-mono">CTO Permit Expiry</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono">
            {mineData?.inspection_status?.cto_valid_until || '2027-03-31'}
          </div>
          <div className="text-[11px] text-gray-500 font-mono">State Pollution Board (Valid)</div>
        </div>

      </div>

      {/* AI Predictive Early-Warning Horizon */}
      <AIPredictionCard 
        mineId={selectedMineId} 
        onConsultCopilot={onOpenCopilot} 
      />

      {/* Main Split Content: Operational Shift Log & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Shift Observations & Statutory Checklists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" /> Live Field Observations & DGMS Action Notices
              </h2>
              <span className="text-xs font-mono text-gray-400">
                {mineData?.field_observations?.length || 0} Pending Items
              </span>
            </div>

            {mineData?.field_observations && mineData.field_observations.length > 0 ? (
              mineData.field_observations.map((obs, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-emerald-400 font-bold">{obs.id}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                        obs.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300'
                          : obs.severity === 'Major'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      Severity: {obs.severity}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white">{obs.hazard_type}</div>
                  <p className="text-gray-300 leading-relaxed text-[11px]">{obs.description}</p>
                  
                  <div className="p-3 rounded-lg bg-white-003 space-y-1">
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
          <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" /> CMR 2017 Shift Compliance Checklist
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-200">Regulation 107 — Haul Road Berm Height</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Continuous 1.8m earthen berm verified on OB Ramp #3.</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-200">Regulation 94 — Audio-Visual Alarms (AVA)</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">All active 100T dumpers certified functional.</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-200">Environmental Clearance (EC) Cap Check</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Production {activeMine.production_mtpa} MT within EC {activeMine.ec_limit_mtpa} MT limit.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => onOpenCopilot('What is the biggest safety concern at this mine?', selectedMineId)}
                className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Ask Copilot: Safety Assessment</span>
              </button>
              
              <button
                onClick={onOpenReport}
                className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono border border-white/10 transition"
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
