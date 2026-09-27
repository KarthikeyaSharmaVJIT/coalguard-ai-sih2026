import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, CheckCircle2, ChevronRight, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api';

export default function AIPredictionCard({ mineId = 'gevra', onConsultCopilot }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getMinePredictions(mineId).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
        if (res?.predictions?.length > 0) {
          setSelectedSection(res.predictions[0]);
        }
      }
    });
    return () => { isMounted = false; };
  }, [mineId]);

  if (loading || !data) {
    return (
      <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 flex items-center justify-center min-h-[180px]">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <Brain className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Synthesizing AI Predictive Hazard Trajectories...</span>
        </div>
      </div>
    );
  }

  const { predictions = [] } = data;

  return (
    <div className="p-5 rounded-xl bg-[#0c1017] border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-display">
                AI Predictive Hazard Radar
              </h2>
            </div>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
              Proactive forecasting of safety incidents before shift execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Horizon: Next 24-48 Hours</span>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 text-xs text-gray-300 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-gray-300">
          {data.composite_prediction_summary}
        </p>
      </div>

      {/* Prediction Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {predictions.map((pred) => {
          const isHigh = pred.risk_level === 'HIGH';
          const isMed = pred.risk_level === 'MEDIUM';
          const isSelected = selectedSection?.section_id === pred.section_id;

          return (
            <button
              key={pred.section_id}
              onClick={() => setSelectedSection(pred)}
              className={`p-3.5 rounded-lg border transition text-left cursor-pointer flex flex-col justify-between space-y-2.5 ${
                isSelected
                  ? 'bg-white/10 border-white/20'
                  : 'bg-black/30 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Badge & Probability */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-300'
                      : isMed
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {pred.risk_level}
                </span>

                <div className="text-right font-mono">
                  <span
                    className={`text-sm font-bold ${
                      isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {pred.probability}%
                  </span>
                </div>
              </div>

              {/* Section Name */}
              <div>
                <div className="text-xs font-semibold text-white truncate">{pred.name}</div>
                <div className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">
                  {pred.predicted_incident}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-white/5 font-mono text-gray-400">
                <span>{pred.horizon_hours}h Window</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Section Drilldown & Action Directive */}
      {selectedSection && (
        <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  selectedSection.risk_level === 'HIGH'
                    ? 'bg-rose-500'
                    : selectedSection.risk_level === 'MEDIUM'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <span className="font-semibold text-white text-xs">{selectedSection.name}</span>
              <span className="text-[10px] font-mono text-gray-400">
                ({selectedSection.probability}% probability within {selectedSection.horizon_hours}h)
              </span>
            </div>

            {onConsultCopilot && (
              <button
                onClick={() =>
                  onConsultCopilot(
                    `What is the AI predicted incident risk for ${selectedSection.name}? What immediate preventive action is mandated?`,
                    mineId
                  )
                }
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[10px] font-mono flex items-center gap-1 transition"
              >
                <span>Ask Copilot on {selectedSection.section_id}</span>
                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded bg-white-002 border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" /> Predicted Incident (Next {selectedSection.horizon_hours}h):
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {selectedSection.predicted_incident}
              </p>
            </div>

            <div className="p-3 rounded bg-white-002 border border-white/5 space-y-1">
              <div className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mandated Preventive Directive:
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {selectedSection.preventive_action}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
