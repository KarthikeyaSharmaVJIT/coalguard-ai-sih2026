import React, { useState } from 'react';
import { Users, BatteryCharging, AlertTriangle, ShieldCheck, HeartPulse, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function WorkforceFatigueCard({ mineName = 'Gevra Opencast Mine', workerCount = 3420 }) {
  const [reallocated, setReallocated] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fatigueMetrics = {
    overall_fatigue_score: reallocated ? 24 : 68,
    status: reallocated ? 'OPTIMIZED' : 'HIGH_FATIGUE_DETECTED',
    wet_bulb_temp: '31.4°C (Elevated Heat Index)',
    night_shift_overtime_workers: reallocated ? 0 : 18,
    flagged_dumper_operators: reallocated ? 0 : 7,
  };

  const sampleWorkers = [
    {
      id: 'EMP-7801',
      name: 'Manoj Kumar',
      role: '100T Dumper Operator',
      shift_hours: '11.5 hrs (Shift 3)',
      consecutive_nights: 4,
      health_condition: 'Mild Hypertension / Sleep Deficit',
      fatigue_score: 88,
      status: reallocated ? 'Reassigned: Surface Workshop' : 'HIGH RISK (Micro-Sleep Hazard)',
      action: reallocated ? 'Safe Rotation Assigned' : 'Immediate Relief Mandated',
      tier: 'HIGH_RISK',
    },
    {
      id: 'EMP-7844',
      name: 'Rajesh Oraon',
      role: 'Face Shovel Operator',
      shift_hours: '9.0 hrs',
      consecutive_nights: 3,
      health_condition: 'Dust Sensitivity / Early Pneumoconiosis Flag',
      fatigue_score: 76,
      status: reallocated ? 'Reassigned: Low-Dust Haulage' : 'ELEVATED RISK (Dust Exceedance)',
      action: reallocated ? 'Low-Dust Zone Active' : 'Relocate from In-Pit Crusher',
      tier: 'HEALTH_SEGREGATED',
    },
    {
      id: 'EMP-7912',
      name: 'Sunil Soren',
      role: 'Drill & Blast Helper',
      shift_hours: '7.5 hrs',
      consecutive_nights: 1,
      health_condition: 'Medical Fit (Class A)',
      fatigue_score: 32,
      status: 'Fit for Underground/Pit Duties',
      action: 'Standard Shift Allocation',
      tier: 'FIT',
    },
    {
      id: 'EMP-8021',
      name: 'Amitabh Sen',
      role: 'Tipper Driver (Contractor B)',
      shift_hours: '10.0 hrs',
      consecutive_nights: 3,
      health_condition: 'Normal / Heat Stress Indicator',
      fatigue_score: 82,
      status: reallocated ? 'Reassigned: Rest Pavilion' : 'HIGH RISK (Fatigue Spikes)',
      action: reallocated ? 'Mandatory 45m Cool-Down' : 'Rotate Driver Immediately',
      tier: 'HIGH_RISK',
    },
  ];

  const filteredWorkers = sampleWorkers.filter((w) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'HIGH_RISK') return w.tier === 'HIGH_RISK';
    if (selectedFilter === 'HEALTH_SEGREGATED') return w.tier === 'HEALTH_SEGREGATED';
    return w.tier === 'FIT';
  });

  return (
    <div className="glass-panel p-5 bg-[#0d1118]/90 border-amber-500/20 shadow-xl relative overflow-hidden space-y-4">
      {/* Background ambient lighting */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <HeartPulse className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                WORKFORCE FATIGUE & HEALTH-BASED DUTY ALLOCATION
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Shift Biometrics
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              AI evaluates shift fatigue, wet-bulb heat stress, and worker health condition to assign safe job zones
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setReallocated(!reallocated)}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs flex items-center gap-1.5 transition border ${
            reallocated
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-amber-500 text-black font-semibold border-amber-400 hover:bg-amber-400'
          }`}
        >
          {reallocated ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Rotations Enforced (Reset)</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>AI Auto-Reallocate High-Risk Crew</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 block">Shift Fatigue Index</span>
          <div
            className={`text-lg font-bold font-mono mt-0.5 ${
              reallocated ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {fatigueMetrics.overall_fatigue_score}/100
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {reallocated ? 'Controlled / Safe' : 'Spike in Shift 3'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 block">Heat Stress (WBGT)</span>
          <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">31.4°C</div>
          <span className="text-[10px] text-gray-400 font-mono">Cooling breaks enforced</span>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 block">Flagged Heavy Operators</span>
          <div
            className={`text-lg font-bold font-mono mt-0.5 ${
              reallocated ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {fatigueMetrics.flagged_dumper_operators} <span className="text-xs text-gray-400 font-normal">Drivers</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">
            {reallocated ? '0 at micro-sleep risk' : 'Overtime consecutive nights'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 block">Health Segregation</span>
          <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">100% Mapped</div>
          <span className="text-[10px] text-gray-400 font-mono">Dust & heat sensitive placed</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        <span className="text-gray-400 text-[11px]">Filter Crew:</span>
        {['ALL', 'HIGH_RISK', 'HEALTH_SEGREGATED', 'FIT'].map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-2.5 py-0.5 rounded-lg border text-[10px] transition ${
              selectedFilter === f
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Worker List Table */}
      <div className="space-y-2">
        {filteredWorkers.map((w) => {
          const isHigh = w.tier === 'HIGH_RISK';
          const isHealth = w.tier === 'HEALTH_SEGREGATED';

          return (
            <div
              key={w.id}
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition ${
                reallocated
                  ? 'bg-emerald-950/10 border-emerald-500/20'
                  : isHigh
                  ? 'bg-rose-950/10 border-rose-500/20'
                  : isHealth
                  ? 'bg-amber-950/10 border-amber-500/20'
                  : 'bg-white/5 border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    isHigh && !reallocated
                      ? 'bg-rose-500/20 text-rose-300'
                      : isHealth
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {w.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{w.name}</span>
                    <span className="text-[10px] font-mono text-gray-400">{w.id}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-gray-300 font-mono">
                      {w.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Shift: {w.shift_hours} • {w.consecutive_nights} nights • Medical: <span className="text-gray-300">{w.health_condition}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div className="hidden sm:block">
                  <span
                    className={`text-[11px] font-mono block ${
                      reallocated
                        ? 'text-emerald-400 font-bold'
                        : isHigh
                        ? 'text-rose-400 font-bold'
                        : 'text-amber-400'
                    }`}
                  >
                    {w.status}
                  </span>
                  <span className="text-[10px] text-gray-400">{w.action}</span>
                </div>

                <div className="text-center font-mono">
                  <span
                    className={`text-sm font-bold block ${
                      reallocated ? 'text-emerald-400' : isHigh ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {reallocated ? Math.max(20, w.fatigue_score - 45) : w.fatigue_score}%
                  </span>
                  <span className="text-[9px] text-gray-400 -mt-1 block">Fatigue</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
