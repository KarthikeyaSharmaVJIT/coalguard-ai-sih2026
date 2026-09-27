import React, { useState } from 'react';
import { 
  Smartphone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  RefreshCw
} from 'lucide-react';
import { SAMPLE_MINES } from '../lib/sampleData';
import { api } from '../lib/api';

export default function FieldInspectionApp() {
  const [mineId, setMineId] = useState('gevra');
  const [inspectorName, setInspectorName] = useState('A. K. Verma');
  const [inspectorRole, setInspectorRole] = useState('DGMS Field Inspector');
  const [hazardType, setHazardType] = useState('Haul Road Berm Height Defect');
  const [severity, setSeverity] = useState('Major');
  const [description, setDescription] = useState('Measured haul road berm height at 1.1m (below required 1.8m tyre diameter) on Bench #4.');
  const [actionRequired, setActionRequired] = useState('Rebuild compacted earthen berm to 1.8m prior to next shift haulage.');
  const [lat, setLat] = useState(22.3368);
  const [lng, setLng] = useState(82.5461);
  const [deadlineHours, setDeadlineHours] = useState(24);
  
  const [submitting, setSubmitting] = useState(false);
  const [submittedObs, setSubmittedObs] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const handleSimulateGPS = () => {
    const selected = SAMPLE_MINES.find((m) => m.id === mineId) || SAMPLE_MINES[0];
    const jitterLat = selected.lat + (Math.random() - 0.5) * 0.005;
    const jitterLng = selected.lng + (Math.random() - 0.5) * 0.005;
    setLat(parseFloat(jitterLat.toFixed(5)));
    setLng(parseFloat(jitterLng.toFixed(5)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      mine_id: mineId,
      inspector_name: inspectorName,
      inspector_role: inspectorRole,
      hazard_type: hazardType,
      severity: severity,
      description: description,
      action_required: actionRequired,
      lat: lat,
      lng: lng,
      deadline_hours: parseInt(deadlineHours),
    };

    try {
      const res = await api.submitInspection(payload);
      setSubmittedObs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 bg-[#0d1118]/80 border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">Field Inspection Mobile PWA Hub</h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Geo-Tagged & Timestamped
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Offline-Capable Field Reporting • Automated SHA-256 Ledger Synchronization
            </p>
          </div>
        </div>

        {/* Online / Offline Simulator Toggle */}
        <button
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition ${
            isOfflineMode
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span>{isOfflineMode ? 'Offline Mode (Local Cache)' : 'Online (Live Sync)'}</span>
        </button>
      </div>

      {/* Mobile Form Layout */}
      <div className="glass-panel p-6 bg-[#0d1118]/90 border-white/10 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Target Mine & Inspector Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-400 font-mono text-[11px] mb-1">Target Mine:</label>
              <select
                value={mineId}
                onChange={(e) => {
                  setMineId(e.target.value);
                  handleSimulateGPS();
                }}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                {SAMPLE_MINES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.subsidiary.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-[11px] mb-1">Inspector Name:</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-[11px] mb-1">Inspector Designation:</label>
              <select
                value={inspectorRole}
                onChange={(e) => setInspectorRole(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option>DGMS Field Safety Inspector</option>
                <option>CPCB Regional Environment Officer</option>
                <option>Internal Mine Safety Officer</option>
              </select>
            </div>
          </div>

          {/* Geo-Location Coordinates */}
          <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono">
              <MapPin className="w-4 h-4" />
              <span>
                GPS: {lat}, {lng} (Accuracy: ±2.4m)
              </span>
            </div>
            <button
              type="button"
              onClick={handleSimulateGPS}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3 h-3" /> Refresh GPS Lock
            </button>
          </div>

          {/* Hazard Type & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 font-mono text-[11px] mb-1">Hazard / Contravention Category:</label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option>Haul Road Berm Height Defect (Reg 107)</option>
                <option>Tipper Reversing Radar Malfunction (Reg 94)</option>
                <option>Dust Suppression Failure at In-Pit Crusher</option>
                <option>Bench Slope Overhang / Unstable Face (Reg 106)</option>
                <option>Uncalibrated Heavy Earthmovers Operating</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-[11px] mb-1">Severity & Escalation:</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Critical">Critical (Immediate Stop Work / 6h)</option>
                <option value="Major">Major (Action Mandated / 24h)</option>
                <option value="Moderate">Moderate (Routine Fix / 48h)</option>
              </select>
            </div>
          </div>

          {/* Detailed Observations */}
          <div>
            <label className="block text-gray-400 font-mono text-[11px] mb-1">Field Observation Findings:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 font-mono text-[11px] mb-1">Mandated Corrective Action:</label>
            <textarea
              value={actionRequired}
              onChange={(e) => setActionRequired(e.target.value)}
              rows={2}
              className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-xs hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Cryptographically Signing...' : 'Sign & Submit Geo-Inspection Log'}</span>
          </button>
        </form>

        {/* Submission Confirmation Alert */}
        {submittedObs && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Inspection Successfully Recorded & Chained!</span>
            </div>
            <div className="font-mono text-[11px] text-gray-300">
              Observation ID: <strong className="text-white">{submittedObs.observation?.id}</strong> | Target: {submittedObs.observation?.mine_name}
            </div>
            {submittedObs.ledger_block && (
              <div className="font-mono text-[10px] text-emerald-400">
                Blockchain Block #{submittedObs.ledger_block.index} Hash: {submittedObs.ledger_block.hash.slice(0, 32)}...
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
