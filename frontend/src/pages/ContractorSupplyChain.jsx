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

  const handleSimulate = async (contractorName) => {
    setSelectedContractor(contractorName);
    try {
      const res = await api.simulateCascade(contractorName);
      setSimulation(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    api.getCascadeNetwork().then((data) => {
      setNetwork(data);
      if (data && data.length) {
        handleSimulate(data[0].name);
      }
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1017] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-white font-display">Contractor Cascade Risk Engine</h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 text-gray-300 border border-white/10">
                Supply Chain Risk Propagation
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Fleet Compliance Ratings • Downstream Production Ripple Effects • Stop-Work Impact Modeling
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Contractor List & Cascade Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Contractor Network Cards */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400">Contractor Mining Fleets</h2>
          <div className="space-y-2">
            {network.map((c, idx) => {
              const isSelected = selectedContractor.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={idx}
                  onClick={() => handleSimulate(c.name)}
                  className={`w-full text-left p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-[#0c1017] border-white/5 text-gray-300 hover:bg-white-003'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{c.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
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
                    <span>Mines: {c.assigned_mines?.length || 0} Sites</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Cascade Ripple Simulation Result */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Simulated DGMS Stop-Work Order Ripple Analysis
              </h2>
              <span className="text-xs font-mono text-cyan-400 font-semibold">{selectedContractor}</span>
            </div>

            {simulation ? (
              <div className="space-y-5 text-xs">
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3.5 bg-black/40 border border-white/5 rounded-lg">
                    <div className="text-[10px] text-gray-400 font-mono">Grounded Fleet</div>
                    <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                      {simulation.fleet_grounded} <span className="text-[10px] text-gray-400">HEMMs</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-black/40 border border-white/5 rounded-lg">
                    <div className="text-[10px] text-gray-400 font-mono">Impacted Capacity</div>
                    <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                      {simulation.total_impacted_capacity_mtpa} <span className="text-[10px] text-gray-400">MTPA</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-black/40 border border-white/5 rounded-lg">
                    <div className="text-[10px] text-gray-400 font-mono">Est. Daily Loss</div>
                    <div className="text-base font-bold text-rose-400 font-mono mt-0.5">
                      ₹{simulation.estimated_daily_revenue_impact_crores} <span className="text-[10px] text-gray-400">Cr/day</span>
                    </div>
                  </div>
                </div>

                {/* Downstream Impacted Mines */}
                <div className="space-y-2">
                  <div className="text-gray-400 font-mono text-[11px]">Downstream Affected Opencast Mines:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {simulation.affected_mines?.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
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
                <div className="p-4 rounded-lg bg-white-002 border border-white/5 text-gray-300 text-xs space-y-1">
                  <div className="font-semibold text-emerald-400 font-mono text-[11px] uppercase tracking-wide">
                    Statutory Mitigation Protocol:
                  </div>
                  <p className="leading-relaxed text-[11px] text-gray-300">{simulation.statutory_mitigation_plan}</p>
                </div>

              </div>
            ) : null}

          </div>
        </div>

      </div>

    </div>
  );
}
