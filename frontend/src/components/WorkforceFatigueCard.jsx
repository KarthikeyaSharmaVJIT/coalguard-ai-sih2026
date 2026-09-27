import React, { useState } from 'react';
import { HeartPulse, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function WorkforceFatigueCard({ mineName = 'Gevra Opencast Mine', workerCount = 3420 }) {
  const [reallocated, setReallocated] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const fatigueMetrics = {
    overall_fatigue_score: reallocated ? 24 : 68,
    status: reallocated ? 'OPTIMIZED' : 'HIGH_FATIGUE_DETECTED',
    wet_bulb_temp: '31.4°C',
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
    <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <HeartPulse className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-display">
                Workforce Fatigue & Health Segregation Grid
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 text-gray-400 border border-white/10">
                {mineName} • {workerCount.toLocaleString()} Miners
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
              Shift fatigue evaluation, wet-bulb heat stress index, and health-based duty allocation
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setReallocated(!reallocated)}
          className={`px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-1.5 transition cursor-pointer ${
            reallocated
              ? 'bg-white/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold'
          }`}
        >
          {reallocated ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rotations Enforced (Reset)</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Reallocate High-Risk Crew</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 block uppercase">Shift Fatigue Index</span>
          <div
            className={`text-base font-bold font-mono mt-1 ${
              reallocated ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {fatigueMetrics.overall_fatigue_score}/100
          </div>
          <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
            {reallocated ? 'Controlled / Safe' : 'Spike in Shift 3'}
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 block uppercase">Heat Index (WBGT)</span>
          <div className="text-base font-bold text-amber-400 font-mono mt-1">31.4°C</div>
          <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">Cooling breaks enforced</span>
        </div>

        <div className="p-3.5 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 block uppercase">Flagged Heavy Operators</span>
          <div
            className={`text-base font-bold font-mono mt-1 ${
              reallocated ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {fatigueMetrics.flagged_dumper_operators} <span className="text-xs text-gray-400 font-normal">Drivers</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
            {reallocated ? '0 at micro-sleep risk' : 'Consecutive night shifts'}
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-black/40 border border-white/5">
          <span className="text-[10px] font-mono text-gray-400 block uppercase">Health Mapping</span>
          <div className="text-base font-bold text-white font-mono mt-1">100% Assigned</div>
          <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">Dust & heat zones mapped</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs font-mono pt-1">
        <span className="text-gray-400 text-[11px] mr-1">Filter Crew:</span>
        {['ALL', 'HIGH_RISK', 'HEALTH_SEGREGATED', 'FIT'].map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-2.5 py-1 rounded text-[10px] transition ${
              selectedFilter === f
                ? 'bg-white/15 text-white font-semibold'
                : 'bg-white/5 text-gray-400 hover:text-white'
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
              className={`p-3 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition ${
                reallocated
                  ? 'bg-black/30 border-white/5'
                  : isHigh
                  ? 'bg-black/40 border-rose-500/20'
                  : isHealth
                  ? 'bg-black/40 border-amber-500/20'
                  : 'bg-black/30 border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold ${
                    isHigh && !reallocated
                      ? 'bg-rose-500/20 text-rose-300'
                      : isHealth
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-white/5 text-gray-300'
                  }`}
                >
                  {w.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{w.name}</span>
                    <span className="text-[10px] font-mono text-gray-500">{w.id}</span>
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
                        ? 'text-emerald-400 font-semibold'
                        : isHigh
                        ? 'text-rose-400 font-semibold'
                        : 'text-amber-400'
                    }`}
                  >
                    {w.status}
                  </span>
                  <span className="text-[10px] text-gray-500">{w.action}</span>
                </div>

                <div className="text-center font-mono">
                  <span
                    className={`text-sm font-bold block ${
                      reallocated ? 'text-emerald-400' : isHigh ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {reallocated ? Math.max(20, w.fatigue_score - 45) : w.fatigue_score}%
                  </span>
                  <span className="text-[9px] text-gray-500 -mt-0.5 block">Fatigue</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
