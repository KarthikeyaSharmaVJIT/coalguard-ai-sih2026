import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSearch, 
  X, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  Upload, 
  FileCode
} from 'lucide-react';
import { api } from '../lib/api';

export default function OCRDocumentModal({ isOpen, onClose }) {
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste'
  const [docText, setDocText] = useState('');
  const [docTitle, setDocTitle] = useState('Gevra MoEFCC EC 70 MTPA Expansion');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [samples, setSamples] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      api.getOcrSamples().then((data) => {
        setSamples(data);
        if (data.ec_gevra && !docText) {
          setDocText(data.ec_gevra);
        }
      });
    }
  }, [isOpen, docText]);

  if (!isOpen) return null;

  const handleSelectSample = (key, title) => {
    if (samples[key]) {
      setInputMode('paste');
      setDocText(samples[key]);
      setDocTitle(title);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setResult(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      setResult(null);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      if (inputMode === 'upload' && selectedFile) {
        const data = await api.uploadAndAnalyzeDocument(selectedFile, docTitle);
        setResult(data);
        if (data.raw_text_preview) {
          setDocText(data.raw_text_preview);
        }
      } else {
        if (!docText.trim()) return;
        const data = await api.analyzeDocument(docText, docTitle);
        setResult(data);
      }
    } catch (err) {
      console.error('OCR processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-[#0c1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white-002">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <FileSearch className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-base">OCR & Statutory Document Compliance Digitizer</h2>
              <p className="text-xs text-gray-400 font-mono">Tesseract OCR & regex extraction for EC clearances, CTO permits & DGMS orders</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Mode Switcher & Sample Document Selectors */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setInputMode('upload')}
              className={`px-3 py-1 rounded text-xs transition flex items-center gap-1.5 ${
                inputMode === 'upload' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload File (Image / PDF)
            </button>
            <button
              onClick={() => setInputMode('paste')}
              className={`px-3 py-1 rounded text-xs transition flex items-center gap-1.5 ${
                inputMode === 'paste' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" /> Paste Text / Template
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-gray-400 text-[11px] flex-shrink-0">Load Template:</span>
            <button
              onClick={() => handleSelectSample('ec_gevra', 'Gevra MoEFCC EC 70 MTPA Expansion')}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition flex items-center gap-1.5 text-[11px]"
            >
              <FileText className="w-3 h-3 text-cyan-400" /> Gevra EC (70 MTPA)
            </button>
            <button
              onClick={() => handleSelectSample('dgms_notice_nigahi', 'Nigahi DGMS Show-Cause Order')}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition flex items-center gap-1.5 text-[11px]"
            >
              <ShieldAlert className="w-3 h-3 text-rose-400" /> Nigahi Show-Cause
            </button>
            <button
              onClick={() => handleSelectSample('cto_kusmunda', 'Kusmunda SPCB Consent to Operate')}
              className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition flex items-center gap-1.5 text-[11px]"
            >
              <FileText className="w-3 h-3 text-amber-400" /> Kusmunda CTO
            </button>
          </div>
        </div>

        {/* Main Workspace (Split Grid) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Input Selection (Upload or Paste) */}
          <div className="flex flex-col gap-3">
            {inputMode === 'upload' ? (
              <div className="flex flex-col flex-1 gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 border-2 border-dashed border-white/15 hover:border-cyan-500/50 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-black/20 hover:bg-black/30 min-h-[220px]"
                >
                  {selectedFile ? (
                    <div className="space-y-3 w-full">
                      {filePreviewUrl ? (
                        <div className="relative max-h-36 max-w-full mx-auto overflow-hidden rounded-lg border border-white/10">
                          <img src={filePreviewUrl} alt="Preview" className="max-h-36 mx-auto object-contain" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="font-mono text-xs font-semibold text-white truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Click to choose a different file
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-mono text-gray-300">
                        Click or drag to upload statutory document
                      </div>
                      <div className="text-[10px] font-mono text-gray-500">
                        Supported: PNG, JPEG, WebP images & PDF documents
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-400 flex-shrink-0">Document Title:</span>
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-cyan-500/50"
                    placeholder="Enter document reference or title..."
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-gray-400">Statutory Notice / Gazette / Scan OCR Text</label>
                  <span className="text-[11px] text-gray-500 font-mono">{docText.length} characters</span>
                </div>
                <textarea
                  value={docText}
                  onChange={(e) => setDocText(e.target.value)}
                  placeholder="Paste raw OCR scanned text from MoEFCC clearance, DGMS notice, or CECB CTO permit..."
                  rows={13}
                  className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs text-gray-300 font-mono focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-none min-h-[220px]"
                />
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || (inputMode === 'upload' && !selectedFile) || (inputMode === 'paste' && !docText.trim())}
              className="mt-1 w-full py-2.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 font-mono font-semibold text-xs transition flex items-center justify-center gap-2 border border-cyan-500/30 cursor-pointer disabled:opacity-40"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{loading ? 'Executing OCR & Statutory Extraction...' : (inputMode === 'upload' ? 'Scan & Extract Document' : 'Execute Text Extraction')}</span>
            </button>
          </div>

          {/* Right: Extracted Intelligence */}
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto max-h-[500px]">
            <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracted Compliance Mandates
            </h3>

            {result ? (
              <div className="space-y-3.5 text-xs">
                {/* Meta Grid */}
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase">Issuing Authority</div>
                    <div className="font-semibold text-white mt-0.5">{result.issuing_authority}</div>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase">Target Mine</div>
                    <div className="font-semibold text-emerald-400 mt-0.5">{result.matched_mine}</div>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase">Statutory Capacity Cap</div>
                    <div className="font-semibold text-cyan-400 mt-0.5">{result.statutory_capacity_cap}</div>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase">Enforcement Level</div>
                    <div className={`font-semibold mt-0.5 ${result.requires_immediate_field_action ? 'text-rose-400' : 'text-amber-400'}`}>
                      {result.document_risk_category}
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-gray-300 text-xs">
                  {result.ai_summary}
                </div>

                {/* Key Clauses */}
                <div>
                  <div className="text-[11px] font-mono text-gray-400 mb-2">Key Extracted Clauses & Conditions:</div>
                  <div className="space-y-2">
                    {result.key_statutory_clauses && result.key_statutory_clauses.length > 0 ? (
                      result.key_statutory_clauses.map((clause, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-gray-300 text-xs flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-white/10 text-gray-300 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{clause}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-gray-400 text-xs font-mono">
                        No specific numbered clauses matched standard regex templates. Raw document text was preserved for manual safety audit.
                      </div>
                    )}
                  </div>
                </div>

                {/* Invoked Regulations */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {result.regulations_invoked?.map((r, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono text-[10px]">
                      {r}
                    </span>
                  ))}
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500 font-mono">
                <FileSearch className="w-10 h-10 mb-3 opacity-30 text-gray-400" />
                <p className="text-xs">Upload a scanned statutory document image (PNG/JPG/PDF) or select a sample template to run OCR extraction.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
