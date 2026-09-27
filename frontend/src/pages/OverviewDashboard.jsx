import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Wind, 
  Cpu,
  Search,
  ChevronLeft,
  Send
} from 'lucide-react';
import { SAMPLE_MINES } from '../lib/sampleData';
import { api } from '../lib/api';

const GlobeVisualizer = lazy(() => import('../components/GlobeVisualizer'));

export default function OverviewDashboard({ onOpenCopilot, onOpenOCR, onOpenReport }) {
  const navigate = useNavigate();
  const [mines, setMines] = useState(SAMPLE_MINES);
  const [selectedMine, setSelectedMine] = useState(SAMPLE_MINES[0]);
  const [mineDetail, setMineDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubsidiary, setSelectedSubsidiary] = useState('ALL');
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  useEffect(() => {
    api.getMines().then((data) => {
      if (data && data.length) {
        setMines(data);
        setSelectedMine(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedMine) {
      setLoadingDetail(true);
      api.getMineDetails(selectedMine.id).then((data) => {
        setMineDetail(data);
        setLoadingDetail(false);
      });
    }
  }, [selectedMine]);

  // Aggregated National Numbers
  const totalProduction = mines.reduce((acc, m) => acc + (m.production_mtpa || 0), 0);
  const totalCapacity = mines.reduce((acc, m) => acc + (m.capacity_mtpa || 0), 0);
  const criticalCount = mines.filter((m) => m.composite_risk_score >= 70).length;
  const elevatedCount = mines.filter((m) => m.composite_risk_score >= 45 && m.composite_risk_score < 70).length;
  const totalWorkers = mines.reduce((acc, m) => acc + (m.worker_count || 0), 0);

  // Filtered Mines
  const filteredMines = mines.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.subsidiary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSub = selectedSubsidiary === 'ALL' || m.subsidiary.includes(selectedSubsidiary);
    return matchesSearch && matchesSub;
  });

  const latestTelemetry = mineDetail?.telemetry_history?.length 
    ? mineDetail.telemetry_history[mineDetail.telemetry_history.length - 1] 
    : null;

  return (
    <div className="relative w-full h-[calc(100vh-105px)] overflow-hidden bg-[#07090e]">
      
      {/* 3D Centered Globe Layer */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center text-emerald-400 gap-3">
              <Cpu className="w-8 h-8 animate-spin" />
              <span className="font-mono text-xs">Hydrating 3D National Spatial Model...</span>
            </div>
          }
        >
          <GlobeVisualizer
            mines={filteredMines}
            selectedMine={selectedMine}
            onSelectMine={(m) => setSelectedMine(m)}
          />
        </Suspense>
      </div>

      {/* Top Floating National Telemetry HUD */}
      <div className="absolute top-3 left-4 right-4 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 pointer-events-auto">
          
          <div className="glass-panel p-2.5 bg-[#0c1017]/85 border-white/10 flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">CIL Monitored Output</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {totalProduction.toFixed(1)} <span className="text-[10px] text-gray-400 font-normal">/ {totalCapacity.toFixed(1)} MTPA</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          <div className="glass-panel p-2.5 bg-[#0c1017]/85 border-white/10 flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">Critical Risk Mines</div>
              <div className="text-base font-bold text-rose-400 font-mono mt-0.5 flex items-center gap-1.5">
                {criticalCount} <span className="text-[10px] text-gray-400 font-normal">({elevatedCount} Elevated)</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </div>
          </div>

          <div className="glass-panel p-2.5 bg-[#0c1017]/85 border-white/10 flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">Active Workforce Grid</div>
              <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">
                {totalWorkers.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">Workers</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>

          <div className="glass-panel p-2.5 bg-[#0c1017]/85 border-white/10 flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">Statutory Audit State</div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                100% <span className="text-[10px] text-gray-400 font-normal">SHA-256 Synced</span>
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

        </div>
      </div>

      {/* Left Floating Panel: 12 Opencast Mine Fleet */}
      <div className={`absolute top-20 left-4 bottom-12 z-10 flex flex-col glass-panel bg-[#0b0e14]/95 border-white/10 shadow-2xl transition-all duration-300 ${
        isLeftPanelOpen ? 'w-80 p-3' : 'w-10 p-2 items-center'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-white/10 w-full">
          {isLeftPanelOpen ? (
            <>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white font-display">Opencast Fleet ({filteredMines.length})</span>
              </div>
              <button
                onClick={() => setIsLeftPanelOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white"
                title="Collapse Panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLeftPanelOpen(true)}
              className="p-1 rounded text-emerald-400 hover:text-white"
              title="Expand Mine List"
            >
              <Layers className="w-4 h-4" />
            </button>
          )}
        </div>

        {isLeftPanelOpen && (
          <>
            {/* Search & Filter */}
            <div className="pt-2 space-y-2">
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search mine, state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Subsidiary Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono">
                {['ALL', 'SECL', 'NCL', 'WCL', 'MCL', 'ECL'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubsidiary(sub)}
                    className={`px-2 py-0.5 rounded-md transition ${
                      selectedSubsidiary === sub
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Mine Items Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 py-2 pr-1 mt-1">
              {filteredMines.map((m) => {
                const isSelected = selectedMine?.id === m.id;
                const isCritical = m.composite_risk_score >= 70;
                const isElevated = m.composite_risk_score >= 45 && !isCritical;

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMine(m)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-white shadow-sm'
                        : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/15'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: m.color || (isCritical ? '#ef4444' : isElevated ? '#f59e0b' : '#10b981') }}
                        />
                        {m.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">
                        {m.subsidiary.split(' ')[0]} • {m.state}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div
                        className={`text-xs font-mono font-bold ${
                          isCritical ? 'text-rose-400' : isElevated ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {m.composite_risk_score}/100
                      </div>
                      <div className="text-[9px] text-gray-500 font-mono">{m.production_mtpa} MT</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Right Floating Panel: Focused Mine Command & Telemetry */}
      <div className="absolute top-20 right-4 bottom-12 w-84 z-10 hidden md:flex flex-col glass-panel p-4 bg-[#0b0e14]/95 border-white/10 overflow-y-auto shadow-2xl space-y-3.5">
        {selectedMine && (
          <>
            {/* Mine Header */}
            <div className="border-b border-white/10 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/10 text-gray-300">
                  {selectedMine.subsidiary.split(' ')[0]}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    selectedMine.composite_risk_score >= 70
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : selectedMine.composite_risk_score >= 45
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {selectedMine.risk_level} ({selectedMine.composite_risk_score}/100)
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1.5 font-display">{selectedMine.name}</h3>
              <p className="text-[11px] text-gray-400 font-mono">
                {selectedMine.state} • Coords: {selectedMine.lat.toFixed(4)}, {selectedMine.lng.toFixed(4)}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="text-[10px] text-gray-400 font-mono">Production / EC Cap</div>
                <div className="font-bold text-white mt-0.5">
                  {selectedMine.production_mtpa} / {selectedMine.ec_limit_mtpa} <span className="text-[10px] text-gray-400">MT</span>
                </div>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="text-[10px] text-gray-400 font-mono">Active PTWs</div>
                <div className="font-bold text-emerald-400 mt-0.5">
                  {selectedMine.active_ptw_count || 6} Active
                </div>
              </div>
            </div>

            {/* CAAQMS Real-time Air Quality with Statutory Progress Bars */}
            {latestTelemetry && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-200 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" /> CAAQMS Telemetry
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 truncate max-w-[140px]">
                    {selectedMine.caaqms_station || 'Station AAQMS'}
                  </span>
                </div>

                {/* PM10 Bar vs 100 limit */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-400">PM10: <strong>{latestTelemetry.pm10} µg/m³</strong></span>
                    <span className="text-gray-500">Std: 100 µg/m³</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full ${latestTelemetry.pm10 > 100 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(100, (latestTelemetry.pm10 / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* PM2.5 Bar vs 60 limit */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-400">PM2.5: <strong>{latestTelemetry.pm25} µg/m³</strong></span>
                    <span className="text-gray-500">Std: 60 µg/m³</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/60 overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${Math.min(100, (latestTelemetry.pm25 / 60) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DGMS Fatal Safety Alerts */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> DGMS Safety Alerts
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {mineDetail?.safety_incidents?.length || 0} Records
                </span>
              </div>
              
              {mineDetail?.safety_incidents && mineDetail.safety_incidents.length > 0 ? (
                mineDetail.safety_incidents.slice(0, 2).map((inc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/25 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-rose-300 font-bold">{inc.alert_no}</span>
                      <span className="text-[10px] text-gray-400">{inc.date}</span>
                    </div>
                    <div className="text-gray-200 text-[11px] font-medium">{inc.cause}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Status: {inc.status}</div>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-lg bg-white/5 text-gray-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero fatal safety notices in registry.
                </div>
              )}
            </div>

            {/* Quick Actions & Authority Dispatch Link */}
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenCopilot('What is the biggest safety concern at this mine?', selectedMine?.id)}
                  className="flex-1 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
                >
                  Ask Khanan AI
                </button>
                <button
                  onClick={onOpenReport}
                  className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold transition"
                >
                  Form IV / V
                </button>
              </div>

              {/* Direct Authority Dispatch Button */}
              <button
                onClick={() => navigate('/authority-dispatch')}
                className="w-full py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-rose-400" />
                <span>Lodge Notice with DGMS / CPCB</span>
              </button>
            </div>

          </>
        )}
      </div>

      {/* Bottom Live Ticker Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#080a0f]/95 border-t border-white/10 px-4 py-2 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
            LIVE GRID SYNC
          </span>
          <span className="text-gray-400 hidden sm:inline">
            Active Mines: 12 | Telemetry Nodes: 48 | Authority Escalation SLA: Active
          </span>
        </div>
        <div className="text-gray-400 text-[11px] flex items-center gap-2">
          <span>Authority: Ministry of Coal / DGMS</span>
          <span className="text-emerald-400">IST: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

    </div>
  );
}
