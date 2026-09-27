import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  BarChart3, 
  Award
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

export default function CorporateExecutiveView() {
  const [mines, setMines] = useState(SAMPLE_MINES);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('ALL');

  useEffect(() => {
    api.getMines().then((data) => {
      if (data && data.length) setMines(data);
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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 bg-[#0d1118]/80 border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">Corporate HQ & Subsidiary Matrix</h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Coal India Limited (Apex Board)
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Subsidiary Benchmark • Production vs EC Limits • High-Level Governance Analytics
            </p>
          </div>
        </div>

        {/* Subsidiary Filter */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          {subsidiaries.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubsidiary(sub)}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition ${
                selectedSubsidiary === sub
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Production vs EC Limit Chart Panel */}
      <div className="glass-panel p-5 bg-[#0d1118]/80 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Actual Production vs Environmental Clearance (EC) Cap (MTPA)
          </h3>
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
      <div className="glass-panel p-5 bg-[#0d1118]/80 border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" /> Subsidiary Compliance Scorecard
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/5 font-mono text-gray-400 uppercase text-[10px] border-b border-white/10">
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
                  <tr key={m.id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-semibold text-white">{m.name}</td>
                    <td className="p-3 text-gray-400">{m.subsidiary.split(' ')[0]}</td>
                    <td className="p-3">{m.production_mtpa} / {m.capacity_mtpa} MT</td>
                    <td className="p-3">
                      <span className={`font-bold ${parseFloat(util) > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {util}%
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 truncate max-w-[180px]">{m.contractor}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : isElevated
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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

    </div>
  );
}
