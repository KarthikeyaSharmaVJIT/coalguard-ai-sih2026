import React, { useState, useEffect, useCallback } from 'react';
import { FileText, X, Printer, ShieldCheck, CheckCircle, RefreshCw } from 'lucide-react';
import { SAMPLE_MINES } from '../lib/sampleData';
import { api } from '../lib/api';

export default function StatutoryReportModal({ isOpen, onClose, selectedMineId = 'gevra' }) {
  const [activeTab, setActiveTab] = useState('form_iv');
  const [mineId, setMineId] = useState(selectedMineId);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReport = useCallback(async (tab, mId) => {
    setLoading(true);
    try {
      if (tab === 'form_iv') {
        const data = await api.getFormIV(mId);
        setReportData(data);
      } else {
        const data = await api.getFormV(mId);
        setReportData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedMineId) {
      setMineId(selectedMineId);
    }
  }, [selectedMineId]);

  useEffect(() => {
    if (isOpen) {
      loadReport(activeTab, mineId);
    }
  }, [isOpen, activeTab, mineId, loadReport]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0c1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white-002">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base">Statutory Compliance Report Generator</h2>
              <p className="text-xs text-gray-400 font-mono">DGMS Form IV (Accident Notice) & CPCB Form V (Annual Environmental Statement)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Selector & Mine Switcher */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('form_iv')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'form_iv'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              DGMS Form IV (Safety & Accidents)
            </button>
            <button
              onClick={() => setActiveTab('form_v')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'form_v'
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              CPCB Form V (Environmental Statement)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="modal-mine-select" className="text-gray-400 font-mono text-[11px]">Mine:</label>
            <select
              id="modal-mine-select"
              value={mineId}
              onChange={(e) => setMineId(e.target.value)}
              className="bg-black/60 border border-white/10 text-xs text-gray-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500/60"
            >
              {SAMPLE_MINES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.subsidiary.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Content View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs text-gray-300 bg-[#090c10]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 gap-3">
              <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
              <span>Compiling statutory report data from compliance ledger...</span>
            </div>
          ) : reportData ? (
            activeTab === 'form_iv' ? (
              /* DGMS Form IV Render */
              <div className="bg-black/40 border border-white/10 rounded-xl p-6 space-y-6">
                <div className="text-center border-b border-white/10 pb-4">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">MINISTRY OF LABOUR & EMPLOYMENT</div>
                  <div className="text-sm font-bold text-white mt-1">DIRECTORATE GENERAL OF MINES SAFETY</div>
                  <div className="text-amber-400 font-bold mt-1 text-xs">{reportData.form_title}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{reportData.statutory_act}</div>
                  <div className="text-[10px] text-emerald-400 mt-2">Filing Ref: {reportData.filing_reference}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Mine Name:</span>
                    <p className="text-white font-semibold">{reportData.mine_details?.mine_name || 'No active record'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Subsidiary:</span>
                    <p className="text-white font-semibold">{reportData.mine_details?.subsidiary || 'No active record'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Coordinates (WGS84):</span>
                    <p className="text-white">{reportData.mine_details?.coordinates || 'No active record'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Certifying Mine Manager:</span>
                    <p className="text-white font-semibold">{reportData.mine_details?.mine_manager || 'R. K. Sharma (Mine Manager - First Class)'}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black/40 border border-rose-500/20 space-y-2">
                  <div className="text-rose-300 font-semibold">Occurrence & Incident Particulars:</div>
                  <p><strong className="text-gray-400">DGMS Alert Ref:</strong> {reportData.incident_details?.dgms_alert_reference || 'No active DGMS alert on record'}</p>
                  <p><strong className="text-gray-400">Nature of Occurrence:</strong> {reportData.incident_details?.nature_of_occurrence || 'No active incident on record'}</p>
                  <p><strong className="text-gray-400">Action Taken / Inquiry:</strong> {reportData.incident_details?.action_taken || 'Routine compliance monitoring active; zero statutory inquiries open.'}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-gray-400 font-semibold">Statutory Preventive Directives Mandated:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px]">
                    {reportData.preventive_measures_statutory?.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-white-002 border border-white/10 rounded-lg flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Cryptographic SHA-256 Sign-off: {reportData.digital_sign_off?.crypto_hash?.slice(0, 24)}...</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                    {reportData.digital_sign_off?.status}
                  </span>
                </div>
              </div>
            ) : (
              /* CPCB Form V Render */
              <div className="bg-black/40 border border-white/10 rounded-xl p-6 space-y-6">
                <div className="text-center border-b border-white/10 pb-4">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest">CENTRAL POLLUTION CONTROL BOARD</div>
                  <div className="text-sm font-bold text-white mt-1">FORM V - ENVIRONMENTAL STATEMENT (2025-2026)</div>
                  <div className="text-[10px] text-gray-400 mt-1">{reportData.statutory_act}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Industry / Unit:</span>
                    <p className="text-white font-semibold">{reportData.part_a?.name_and_address_of_industry}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Industry STC Category:</span>
                    <p className="text-rose-400 font-semibold">{reportData.part_a?.primary_stc_code}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">EC Capacity Limit:</span>
                    <p className="text-cyan-400 font-semibold">{reportData.part_a?.production_capacity}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Actual Production:</span>
                    <p className="text-white font-semibold">{reportData.part_a?.actual_production}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-black/30 border border-white/5 rounded-lg">
                    <div className="text-emerald-400 font-semibold mb-2">Water Consumption (m³/day):</div>
                    <p className="text-[11px] text-gray-400">Dust Sprinkling: {reportData.part_b_water_and_raw_material_consumption?.water_consumption_m3_day?.dust_suppression_and_sprinkling} m³</p>
                    <p className="text-[11px] text-gray-400">Workshop Washing: {reportData.part_b_water_and_raw_material_consumption?.water_consumption_m3_day?.heavy_vehicle_washing_workshop} m³</p>
                    <p className="text-[11px] text-emerald-300 mt-1">Recycle Rate: {reportData.part_b_water_and_raw_material_consumption?.treated_effluent_recycle_rate}</p>
                  </div>

                  <div className="p-3.5 bg-black/30 border border-white/5 rounded-lg">
                    <div className="text-cyan-400 font-semibold mb-2">Solid Waste & Biological Reclamation:</div>
                    <p className="text-[11px] text-gray-400">Overburden: {reportData.part_e_solid_wastes?.overburden_generated_m3}</p>
                    <p className="text-[11px] text-gray-400">Reclaimed Area: {reportData.part_e_solid_wastes?.biological_reclamation_hectares} ha</p>
                    <p className="text-[11px] text-cyan-300 mt-1">Saplings: {reportData.part_e_solid_wastes?.saplings_planted_current_year}</p>
                  </div>
                </div>

                <div className="p-3 bg-white-002 border border-white/10 rounded-lg flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Blockchain Seal: {reportData.verification_seal?.blockchain_hash?.slice(0, 24)}...</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                    {reportData.verification_seal?.submission_state}
                  </span>
                </div>
              </div>
            )
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-gray-500">Ministry of Coal Statutory e-Filing Protocol</span>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-semibold flex items-center gap-2 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
