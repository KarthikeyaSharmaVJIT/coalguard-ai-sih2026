import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  BarChart3, 
  Award,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { SAMPLE_MINES } from '../lib/sampleData';
import { api } from '../lib/api';

export default function CorporateExecutiveView({ onOpenReport }) {
  const [mines, setMines] = useState(SAMPLE_MINES);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('ALL');
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    api.getMines().then((data) => {
      if (data && data.length) setMines(data);
    });
    api.getRecurringViolations().then((data) => {
      if (data && data.length) setViolations(data);
    });
  }, []);

  // Subsidiary Grouping
  const subsidiaries = ['ALL', 'SECL', 'NCL', 'WCL', 'MCL', 'ECL'];

  const filteredMines = selectedSubsidiary === 'ALL'
    ? mines
    : mines.filter((m) => m.subsidiary.includes(selectedSubsidiary));

  const chartData = filteredMines.map((m) => ({
    name: m.name.split(' ')[0],
    production: m.production_mtpa,
    ec_limit: m.ec_limit_mtpa,
    risk: m.composite_risk_score,
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1017] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-white font-display">Corporate HQ Matrix</h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 text-gray-300 border border-white/10">
                Coal India Limited Board
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Multi-Subsidiary Benchmark • Environmental Clearance Caps • Systemic Risk Audits
            </p>
          </div>
        </div>

        {/* Subsidiary Filter & Export Compliance Report */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
            {subsidiaries.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubsidiary(sub)}
                className={`px-2.5 py-1 rounded font-mono text-xs transition ${
                  selectedSubsidiary === sub
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-mono transition cursor-pointer"
              title="Export Statutory Compliance Report"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Compliance Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Production vs EC Limit Chart Panel */}
      <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Actual Production vs Environmental Clearance (EC) Cap (MTPA)
          </h2>
          <span className="text-xs font-mono text-gray-400">Showing {filteredMines.length} Opencast Mines</span>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f131a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="production" name="Actual Production (MTPA)" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ec_limit" name="Statutory EC Cap (MTPA)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subsidiary Performance Comparison Table */}
      <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 space-y-4">
        <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" /> Subsidiary Compliance Scorecard
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white-002 font-mono text-gray-400 uppercase text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3">Mine Project</th>
                <th className="p-3">Subsidiary</th>
                <th className="p-3">Capacity / Prod</th>
                <th className="p-3">EC Utilization</th>
                <th className="p-3">Primary Contractor</th>
                <th className="p-3">Governance Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {filteredMines.map((m) => {
                const util = ((m.production_mtpa / m.ec_limit_mtpa) * 100).toFixed(1);
                const isCritical = m.composite_risk_score >= 70;
                const isElevated = m.composite_risk_score >= 45 && !isCritical;

                return (
                  <tr key={m.id} className="hover:bg-white-002 transition">
                    <td className="p-3 font-semibold text-white">{m.name}</td>
                    <td className="p-3 text-gray-400">{m.subsidiary.split(' ')[0]}</td>
                    <td className="p-3">{m.production_mtpa} / {m.capacity_mtpa} MT</td>
                    <td className="p-3">
                      <span className={`font-semibold ${parseFloat(util) > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {util}%
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 truncate max-w-[180px]">{m.contractor}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300'
                            : isElevated
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {m.composite_risk_score}/100 ({m.risk_level})
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Merged Regulatory Intelligence & Recurring Contraventions */}
      {violations.length > 0 && (
        <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Regulatory Compliance & Recurring Contravention Patterns
            </h2>
            <span className="text-xs font-mono text-gray-400">DGMS / CPCB Reference Corpus</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {violations.map((v, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-xs">{v.category}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] font-semibold">
                    {v.frequency_count} Incidents
                  </span>
                </div>
                <div className="text-[11px] font-mono text-gray-400">{v.statutory_reference}</div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  <span className="text-gray-400 font-medium">Root Cause:</span> {v.root_cause}
                </p>
                <div className="p-2.5 rounded bg-white-003 text-[11px] text-emerald-300 space-y-0.5">
                  <div className="text-[10px] text-gray-400 font-mono uppercase font-bold">Mandatory Preventive Directive:</div>
                  <div>{v.preventive_directive}</div>
                </div>
                <div className="flex items-center gap-1.5 pt-1 text-[10px] text-gray-500 font-mono">
                  <span>Mines:</span>
                  {v.affected_mines?.map((m, i) => (
                    <span key={i} className="px-1.5 py-0.2 rounded bg-white/5 text-gray-300">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
