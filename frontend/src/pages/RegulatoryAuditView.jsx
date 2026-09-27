import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  ShieldAlert, 
  FileWarning, 
  CheckCircle2, 
  Send,
  FileText
} from 'lucide-react';
import { SAMPLE_MINES } from '../lib/sampleData';
import { api } from '../lib/api';

export default function RegulatoryAuditView({ onOpenCopilot, onOpenReport }) {
  const [violations, setViolations] = useState([]);
  const [selectedMine, setSelectedMine] = useState('nigahi');
  const [noticeReason, setNoticeReason] = useState('Regulation 94: HEMM Audio-Visual Alarms (AVA) non-operational');
  const [complianceWindow, setComplianceWindow] = useState('7 Days (Regulation 106/94 Standard)');
  const [noticeIssued, setNoticeIssued] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getRecurringViolations().then((data) => {
      setViolations(data);
    });
  }, []);

  const handleIssueShowCause = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const mine = SAMPLE_MINES.find((m) => m.id === selectedMine) || SAMPLE_MINES[0];
    try {
      await api.submitAuthorityReport({
        mine_id: selectedMine,
        target_authority: 'DGMS',
        reporter_name: 'DGMS Zonal Director',
        reporter_role: 'Statutory Safety Regulator',
        reporter_contact: '+91 11 2338 XXXXX',
        hazard_title: `Statutory Show-Cause: ${noticeReason.slice(0, 50)}`,
        statutory_regulation: 'CMR 2017 & Section 22 of Mines Act 1952',
        severity_level: complianceWindow.includes('24 Hours') ? 'P1_CRITICAL_IMMINENT_DANGER' : 'P2_MAJOR_NON_COMPLIANCE',
        detailed_description: `Statutory contravention order issued under CMR 2017: ${noticeReason}. Compliance window granted: ${complianceWindow}.`,
        mandated_immediate_action: 'Submit compliance rectifications and field test certifications within statutory window.',
        lat: mine.lat,
        lng: mine.lng,
        sla_hours: complianceWindow.includes('24 Hours') ? 6 : 24,
      });
      setNoticeIssued(true);
      setTimeout(() => setNoticeIssued(false), 6000);
    } catch (err) {
      console.warn('Show-cause submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 bg-[#0d1118]/80 border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <Scale className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-display">DGMS & CPCB Regulatory Audit Engine</h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Statutory Enforcement
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Recurring Contravention Analytics • Section 22 Prohibitory Powers • Show-Cause Registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCopilot}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition cursor-pointer"
          >
            Consult CMR Corpus
          </button>
          <button
            onClick={onOpenReport}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Statutory Forms</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Recurring Violation Clusters & Show-Cause Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Clustered Recurring Violation Patterns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 bg-[#0d1118]/80 border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> AI-Identified Recurring Compliance Failure Patterns
              </h3>
              <span className="text-xs font-mono text-emerald-400">DGMS Pattern Engine</span>
            </div>

            <div className="space-y-3">
              {violations.map((v, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300 font-display text-sm">{v.category}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 font-mono text-[10px]">
                      {v.frequency_count} Fatal/Severe Incidents
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-amber-300">{v.statutory_reference}</div>
                  
                  <div className="text-gray-300 text-[11px] leading-relaxed">
                    <strong className="text-gray-400">Root Cause:</strong> {v.root_cause}
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-emerald-300">
                    <strong className="text-emerald-400 font-mono uppercase text-[10px] block mb-1">
                      DGMS Mandatory Preventive Directive:
                    </strong>
                    {v.preventive_directive}
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 text-[10px] text-gray-400 font-mono">
                    <span>Affected Mines:</span>
                    {v.affected_mines?.map((m, i) => (
                      <span key={i} className="px-1.5 py-0.2 rounded bg-white/10 text-white">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Issue Statutory Show-Cause Notice */}
        <div className="space-y-4">
          <div className="glass-panel p-5 bg-[#0d1118]/80 border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-amber-400" /> Issue Statutory Show-Cause Order
            </h3>

            <form onSubmit={handleIssueShowCause} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 font-mono text-[11px] mb-1">Target Mine:</label>
                <select
                  value={selectedMine}
                  onChange={(e) => setSelectedMine(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                >
                  {SAMPLE_MINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.subsidiary.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-[11px] mb-1">Contravention Clause / Reason:</label>
                <textarea
                  value={noticeReason}
                  onChange={(e) => setNoticeReason(e.target.value)}
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono text-xs focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-[11px] mb-1">Mandated Compliance Window:</label>
                <select 
                  value={complianceWindow}
                  onChange={(e) => setComplianceWindow(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                >
                  <option>7 Days (Regulation 106/94 Standard)</option>
                  <option>24 Hours (Immediate Danger Section 22)</option>
                  <option>15 Days (Environmental Telemetry Descaling)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-semibold text-xs hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Recording to Ledger...' : 'Issue & Record to SHA-256 Ledger'}</span>
              </button>
            </form>

            {noticeIssued && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>Show-Cause order dispatched and cryptographically sealed on audit block.</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
