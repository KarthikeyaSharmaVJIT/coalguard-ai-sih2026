import React, { useState, useEffect } from 'react';
import { FileSearch, X, CheckCircle2, ShieldAlert, Sparkles, FileText } from 'lucide-react';
import { api } from '../lib/api';

export default function OCRDocumentModal({ isOpen, onClose }) {
  const [docText, setDocText] = useState('');
  const [docTitle, setDocTitle] = useState('Gevra MoEFCC EC 70 MTPA Expansion');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [samples, setSamples] = useState({});

  useEffect(() => {
    if (isOpen) {
      api.getOcrSamples().then((data) => {
        setSamples(data);
        if (data.ec_gevra) {
          setDocText(data.ec_gevra);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectSample = (key, title) => {
    if (samples[key]) {
      setDocText(samples[key]);
      setDocTitle(title);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!docText.trim()) return;
    setLoading(true);
    try {
      const data = await api.analyzeDocument(docText, docTitle);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0f131a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">OCR & Statutory Document Compliance Digitizer</h3>
              <p className="text-xs text-gray-400">Automated Extraction of EC Clearances, CTO Permits & DGMS Show-Cause Directives</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample Document Selectors */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-400 font-mono text-[11px] flex-shrink-0">Load Statutory Order:</span>
          <button
            onClick={() => handleSelectSample('ec_gevra', 'Gevra MoEFCC EC 70 MTPA Expansion')}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-white/10 text-cyan-300 transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Gevra EC (70 MTPA)
          </button>
          <button
            onClick={() => handleSelectSample('dgms_notice_nigahi', 'Nigahi DGMS Show-Cause Order')}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 text-rose-300 transition flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Nigahi DGMS Show-Cause
          </button>
          <button
            onClick={() => handleSelectSample('cto_kusmunda', 'Kusmunda SPCB Consent to Operate')}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/40 border border-white/10 text-amber-300 transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Kusmunda CTO (62.5 MTPA)
          </button>
        </div>

        {/* Main Workspace (Split Grid) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Input Text / OCR Scan */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-gray-400">Statutory Notice / Gazette / Scan OCR Text</label>
              <span className="text-[11px] text-gray-500 font-mono">{docText.length} characters</span>
            </div>
            <textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              placeholder="Paste raw OCR scanned text from MoEFCC clearance, DGMS notice, or CECB CTO permit..."
              rows={16}
              className="w-full flex-1 bg-black/50 border border-white/10 rounded-xl p-3.5 text-xs text-gray-300 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !docText.trim()}
              className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Processing Regulatory Extraction...' : 'Execute AI Statutory Extraction'}</span>
            </button>
          </div>

          {/* Right: Extracted Intelligence */}
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto max-h-[500px]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracted Compliance Mandates
            </h4>

            {result ? (
              <div className="space-y-3.5 text-xs">
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-mono">Issuing Authority</div>
                    <div className="font-semibold text-white mt-0.5">{result.issuing_authority}</div>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-mono">Target Mine</div>
                    <div className="font-semibold text-emerald-400 mt-0.5">{result.matched_mine}</div>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-mono">Statutory Capacity Cap</div>
                    <div className="font-semibold text-cyan-400 mt-0.5">{result.statutory_capacity_cap}</div>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase font-mono">Enforcement Level</div>
                    <div className={`font-semibold mt-0.5 ${result.requires_immediate_field_action ? 'text-rose-400' : 'text-amber-400'}`}>
                      {result.document_risk_category}
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs">
                  {result.ai_summary}
                </div>

                {/* Key Clauses */}
                <div>
                  <div className="text-[11px] font-mono text-gray-400 mb-2">Key Extracted Clauses & Conditions:</div>
                  <div className="space-y-2">
                    {result.key_statutory_clauses.map((clause, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-gray-300 text-xs flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{clause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoked Regulations */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {result.regulations_invoked.map((r, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px]">
                      {r}
                    </span>
                  ))}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
                <FileSearch className="w-10 h-10 mb-3 opacity-30 text-cyan-400" />
                <p className="text-xs">Select a sample statutory order or paste OCR text, then click "Execute AI Statutory Extraction".</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
