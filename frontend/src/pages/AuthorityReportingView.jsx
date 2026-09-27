import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  RefreshCw
} from 'lucide-react';
import { SAMPLE_MINES } from '../lib/sampleData';
import { api } from '../lib/api';

export default function AuthorityReportingView({ onOpenCopilot }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [escalatingId, setEscalatingId] = useState(null);

  // Form State
  const [mineId, setMineId] = useState('nigahi');
  const [targetAuthority, setTargetAuthority] = useState('DGMS');
  const [reporterName, setReporterName] = useState('R. K. Sharma');
  const [reporterRole, setReporterRole] = useState('Mine Safety Head');
  const [reporterContact, setReporterContact] = useState('+91 94251 00234');
  const [hazardTitle, setHazardTitle] = useState('Haul Road Berm Defect & Slope Instability');
  const [statutoryRegulation, setStatutoryRegulation] = useState('Regulation 107 of Coal Mines Regulations 2017');
  const [severityLevel, setSeverityLevel] = useState('P1_CRITICAL_IMMINENT_DANGER');
  const [detailedDescription, setDetailedDescription] = useState('Berm height along the main overburden haul road Bench #4 fell below wheel diameter (1.1m vs 1.8m requirement), presenting immediate truck rollover hazard.');
  const [mandatedImmediateAction, setMandatedImmediateAction] = useState('Halt heavy haulage traffic; reconstruct compacted 1.8m parapet wall prior to night shift.');
  const [slaHours, setSlaHours] = useState(6);
  const [lat, setLat] = useState(24.1355);
  const [lng, setLng] = useState(82.6001);

  const [submittedNotice, setSubmittedNotice] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getAuthorityReports();
      setReports(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateGPS = () => {
    const selected = SAMPLE_MINES.find((m) => m.id === mineId) || SAMPLE_MINES[0];
    setLat(parseFloat((selected.lat + (Math.random() - 0.5) * 0.004).toFixed(5)));
    setLng(parseFloat((selected.lng + (Math.random() - 0.5) * 0.004).toFixed(5)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      mine_id: mineId,
      target_authority: targetAuthority,
      reporter_name: reporterName,
      reporter_role: reporterRole,
      reporter_contact: reporterContact,
      hazard_title: hazardTitle,
      statutory_regulation: statutoryRegulation,
      severity_level: severityLevel,
      detailed_description: detailedDescription,
      mandated_immediate_action: mandatedImmediateAction,
      lat: lat,
      lng: lng,
      sla_hours: parseInt(slaHours),
    };

    try {
      const res = await api.submitAuthorityReport(payload);
      setSubmittedNotice(res.report);
      loadReports();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalate = async (reportId) => {
    setEscalatingId(reportId);
    try {
      await api.escalateAuthorityReport(reportId);
      loadReports();
    } finally {
      setEscalatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 bg-[#0d1118]/80 border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">Statutory Authority Reporting & Escalation Dispatch</h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                DGMS / CPCB / Ministry Direct
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Formal Contravention Lodgement • Digital Audit Seal • Multi-Tier Automated Escalations
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCopilot}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition"
        >
          Check CMR 2017 Contravention Clauses
        </button>
      </div>

      {/* Main Grid: Lodge Form & Live Authority Dispatch Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Lodge Report to Authority */}
        <div className="glass-panel p-6 bg-[#0d1118]/90 border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Send className="w-4 h-4 text-rose-400" /> Lodge Statutory Notice
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">SHA-256 Chained</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-400 font-mono text-[10px] mb-1">Target Mine:</label>
                <select
                  value={mineId}
                  onChange={(e) => {
                    setMineId(e.target.value);
                    handleSimulateGPS();
                  }}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-rose-500"
                >
                  {SAMPLE_MINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.subsidiary.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-[10px] mb-1">Recipient Authority:</label>
                <select
                  value={targetAuthority}
                  onChange={(e) => setTargetAuthority(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-rose-500"
                >
                  <option value="DGMS">DGMS (Mines Safety)</option>
                  <option value="CPCB">CPCB (Pollution Control)</option>
                  <option value="MINISTRY_VIGILANCE">Ministry Coal Vigilance</option>
                  <option value="SPCB">State Pollution Board</option>
                  <option value="NDMA">NDMA (Disaster Cell)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-400 font-mono text-[10px] mb-1">Reporting Officer:</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-gray-400 font-mono text-[10px] mb-1">Designation / Role:</label>
                <input
                  type="text"
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-400 font-mono text-[10px] mb-1">Severity / Escalation SLA:</label>
                <select
                  value={severityLevel}
                  onChange={(e) => {
                    setSeverityLevel(e.target.value);
                    setSlaHours(e.target.value.includes('P1') ? 6 : (e.target.value.includes('P2') ? 12 : 24));
                  }}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-rose-500"
                >
                  <option value="P1_CRITICAL_IMMINENT_DANGER">P1 - Imminent Danger (6h SLA)</option>
                  <option value="P2_MAJOR_NON_COMPLIANCE">P2 - Major Non-Compliance (12h SLA)</option>
                  <option value="P3_ROUTINE_AUDIT">P3 - Compliance Audit (24h SLA)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-[10px] mb-1">Statutory Clause / Act:</label>
                <input
                  type="text"
                  value={statutoryRegulation}
                  onChange={(e) => setStatutoryRegulation(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-[10px] mb-1">Contravention Summary:</label>
              <input
                type="text"
                value={hazardTitle}
                onChange={(e) => setHazardTitle(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-[10px] mb-1">Detailed Factual Findings:</label>
              <textarea
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                rows={2}
                className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 font-mono text-[10px] mb-1">Mandated Immediate Corrective Action:</label>
              <textarea
                value={mandatedImmediateAction}
                onChange={(e) => setMandatedImmediateAction(e.target.value)}
                rows={2}
                className="w-full bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Dispatching to Authority Gateway...' : 'Seal & Dispatch Statutory Notice'}</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Live Authority Dispatch & Escalation Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 bg-[#0d1118]/90 border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Statutory Dispatch & Enforcement Queue ({reports.length} Dispatches)
              </h3>
              <button
                onClick={loadReports}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-mono flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Feed
              </button>
            </div>

            {/* Submission confirmation if any */}
            {submittedNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs space-y-1 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Statutory Notice Dispatched: Ref {submittedNotice.reference_no}</span>
                </div>
                <div className="text-[11px] text-gray-300">
                  Recipient: <strong className="text-white">{submittedNotice.recipient_office}</strong> | SLA: {submittedNotice.sla_hours} hours.
                </div>
              </div>
            )}

            {/* Dispatch Cards */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {reports.map((rep) => {
                const isP1 = rep.severity_level?.includes('P1');
                const isEscalated = rep.escalation_state?.includes('APEX') || rep.escalation_state?.includes('LEVEL_2');

                return (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-rose-500/30 transition-all space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">{rep.reference_no}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/10 text-gray-200">
                            {rep.target_authority}
                          </span>
                          {isEscalated && (
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" /> APEX ESCALATED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          Mine: <strong className="text-white">{rep.mine_name}</strong> ({rep.subsidiary})
                        </div>
                      </div>

                      <div className="text-right font-mono text-[10px] text-gray-400">
                        <div>{rep.timestamp}</div>
                        <div className="text-amber-400">SLA: {rep.sla_hours}h Remaining</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">{rep.hazard_title}</h4>
                      <p className="text-gray-300 text-[11px] mt-1 leading-relaxed">{rep.detailed_description}</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-amber-300">
                      <strong className="text-amber-400 font-mono text-[10px] uppercase block mb-0.5">
                        Mandated Statutory Action:
                      </strong>
                      {rep.mandated_immediate_action}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-white/5 text-[10px] font-mono text-gray-400">
                      <div className="truncate max-w-[280px]">
                        Reporter: <span className="text-gray-300">{rep.reporter_name}</span> ({rep.reporter_role})
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!isEscalated && (
                          <button
                            onClick={() => handleEscalate(rep.id)}
                            disabled={escalatingId === rep.id}
                            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                          >
                            <ArrowUpRight className="w-3 h-3" /> Escalate to Apex Secretary
                          </button>
                        )}
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {rep.status}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
