import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  AlertOctagon,
  RefreshCw,
  FileText
} from 'lucide-react';
import { api } from '../lib/api';

export default function BlockchainAuditLedger({ onOpenReport }) {
  const [blocks, setBlocks] = useState([]);
  const [verification, setVerification] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadLedger = async () => {
    setLoading(true);
    try {
      const data = await api.getBlockchainLedger();
      setBlocks(data);
    } catch (err) {
      console.error('Failed to load ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await api.verifyLedger();
      setVerification(res);
    } catch (err) {
      console.error('Ledger verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0c1017] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <Link2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-white font-display">Cryptographic Audit Ledger</h1>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 text-gray-300 border border-white/10">
                SHA-256 Hash Chained
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Tamper-Proof Statutory History • Immutable Inspection & Clearance Blocks
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadLedger}
            disabled={loading}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs transition cursor-pointer"
            title="Refresh Ledger Blocks"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-mono transition cursor-pointer"
              title="Export Statutory Compliance Certificate"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Audit Certificate</span>
            </button>
          )}

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold transition flex items-center gap-2 border border-white/10 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{verifying ? 'Recalculating Hashes...' : 'Verify Cryptographic Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verification && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between transition-all ${
            verification.valid
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {verification.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <div className="font-bold text-sm">
                {verification.valid ? 'Cryptographic Integrity Verified' : 'Integrity Violation Detected'}
              </div>
              <div className="text-[11px] opacity-90 mt-0.5 font-mono">{verification.message || verification.error}</div>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-gray-400 hidden sm:block">
            Verified {verification.total_blocks} Blocks
          </div>
        </div>
      )}

      {/* Blocks Feed */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Immutable Block Sequence ({blocks.length} Blocks)
        </h2>

        <div className="space-y-3">
          {blocks.map((b) => (
            <div
              key={b.index}
              className="p-4 rounded-xl bg-[#0c1017] border border-white/10 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-white/5 text-gray-300 font-mono text-xs font-bold flex items-center justify-center">
                    #{b.index}
                  </span>
                  <span className="font-semibold text-white text-xs font-mono">{b.action_type}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/5 text-gray-300">
                    Target: {b.mine_id}
                  </span>
                  {b.nonce !== undefined && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-white/5 text-gray-400">
                      Nonce: {b.nonce}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-gray-400 font-mono">
                  {b.timestamp} • Actor: <strong className="text-gray-300">{b.actor_id}</strong> ({b.actor_role})
                </div>
              </div>

              {/* Payload details */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300 overflow-x-auto">
                <span className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">Payload Data:</span>
                <pre className="text-emerald-300/90">{JSON.stringify(b.payload, null, 2)}</pre>
              </div>

              {/* Cryptographic Hashes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-gray-400">
                <div className="truncate">
                  <span className="text-gray-500">Prev Hash: </span>
                  <span className="text-gray-400">{b.prev_hash}</span>
                </div>
                <div className="truncate text-right">
                  <span className="text-gray-500">Block Hash: </span>
                  <span className="text-emerald-400 font-medium">{b.hash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
