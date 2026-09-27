import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  ShieldAlert
} from 'lucide-react';
import { api } from '../lib/api';

export default function ContractorSupplyChain() {
  const [network, setNetwork] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState('Apex Infrastructure');
  const [simulation, setSimulation] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    api.getCascadeNetwork().then((data) => {
      setNetwork(data);
      if (data && data.length) {
        handleSimulate(data[0].name);
      }
    });
  }, []);

  const handleSimulate = async (contractorName) => {
    setSelectedContractor(contractorName);
    setSimulating(true);
    try {
      const res = await api.simulateCascade(contractorName);
      setSimulation(res);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 bg-[#0d1118]/80 border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Truck className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">Contractor Supply Chain & Cascade Risk</h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Multi-Mine Risk Propagation
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Fleet Compliance Ratings • Downstream Production Ripple Effects • Stop-Work Impact Modeling
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Contractor List & Cascade Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Contractor Network Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400">Contractor Mining Fleets</h3>
          {network.map((c, idx) => {
            const isSelected = selectedContractor.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={idx}
                onClick={() => handleSimulate(c.name)}
                className={`w-full text-left p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-white shadow-sm'
                    : 'bg-[#0d1118]/80 border-white/10 text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{c.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      c.safety_rating < 60
                        ? 'bg-rose-500/20 text-rose-300'
                        : c.safety_rating < 80
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    Rating: {c.safety_rating}/100
                  </span>
                </div>

                <div className="text-[11px] text-gray-400">{c.category}</div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500 font-mono">
                  <span>Fleet: {c.fleet_size} Heavy HEMMs</span>
                  <span>Mines: {c.assigned_mines?.length || 0}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 2 Cols: Cascade Ripple Simulation Result */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 bg-[#0d1118]/90 border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Simulated DGMS Stop-Work Order Ripple Analysis
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">{selectedContractor}</span>
            </div>

            {simulation ? (
              <div className="space-y-4 text-xs">
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="text-[10px] text-gray-400 font-mono">Grounded Fleet</div>
                    <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                      {simulation.fleet_grounded} <span className="text-[10px] text-gray-400">HEMMs</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="text-[10px] text-gray-400 font-mono">Impacted Capacity</div>
                    <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                      {simulation.total_impacted_capacity_mtpa} <span className="text-[10px] text-gray-400">MTPA</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
                    <div className="text-[10px] text-gray-400 font-mono">Est. Daily Loss</div>
                    <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                      ₹{simulation.estimated_daily_revenue_impact_crores} <span className="text-[10px] text-gray-400">Cr/day</span>
                    </div>
                  </div>
                </div>

                {/* Downstream Impacted Mines */}
                <div>
                  <div className="text-gray-400 font-mono text-[11px] mb-2">Downstream Affected Opencast Mines:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {simulation.affected_mines?.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{m.name}</div>
                          <div className="text-[10px] text-gray-400">{m.subsidiary} • {m.state}</div>
                        </div>
                        <div className="text-right font-mono text-cyan-400 font-bold">
                          {m.production_mtpa} MT
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statutory Mitigation Clause */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs">
                  <div className="font-bold text-emerald-400 font-mono text-[11px] uppercase tracking-wide mb-1">
                    Statutory Mitigation Protocol:
                  </div>
                  <p className="leading-relaxed text-[11px]">{simulation.statutory_mitigation_plan}</p>
                </div>

              </div>
            ) : null}

          </div>
        </div>

      </div>

    </div>
  );
}
