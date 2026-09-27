import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { RotateCw, Compass } from 'lucide-react';

export default function GlobeVisualizer({ mines, selectedMine, onSelectMine }) {
  const globeRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 700 });
  const [isRotating, setIsRotating] = useState(true);
  const [globeReady, setGlobeReady] = useState(false);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w > 0 && h > 0) {
        setDimensions({ width: w, height: h });
      }
    }
  }, []);

  // ResizeObserver for reliable dimension tracking
  // Multiple staggered delays handle React 19 StrictMode remounting cycle
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    updateDimensions();
    const t1 = setTimeout(updateDimensions, 150);
    const t2 = setTimeout(updateDimensions, 500);
    const t3 = setTimeout(updateDimensions, 1000);

    const ro = new ResizeObserver(() => updateDimensions());
    ro.observe(el);
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      ro.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  // Configure globe controls after onGlobeReady fires
  // (avoids calling controls() before three.js renderer is initialized)
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    globeRef.current.pointOfView({ lat: 22.8, lng: 82.2, altitude: 1.55 }, 1200);
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = isRotating;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
    }
    // Final dimension sync after globe canvas is in the DOM
    updateDimensions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globeReady, updateDimensions]);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) controls.autoRotate = isRotating;
    }
  }, [isRotating]);

  useEffect(() => {
    if (selectedMine && globeRef.current) {
      globeRef.current.pointOfView(
        { lat: selectedMine.lat, lng: selectedMine.lng, altitude: 1.15 },
        1000
      );
    }
  }, [selectedMine]);

  const handleResetCamera = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 22.8, lng: 82.2, altitude: 1.55 }, 1000);
    }
  };

  const pointsData = mines.map((m) => ({
    ...m,
    lat: m.lat,
    lng: m.lng,
    size: m.capacity_mtpa > 50 ? 1.4 : (m.capacity_mtpa > 20 ? 1.0 : 0.7),
    color: m.composite_risk_score >= 70 ? '#ef4444' : (m.composite_risk_score >= 45 ? '#f59e0b' : '#10b981'),
  }));

  const ringsData = mines.map((m) => ({
    lat: m.lat,
    lng: m.lng,
    maxR: m.composite_risk_score >= 70 ? 4.5 : 2.5,
    propagationSpeed: m.composite_risk_score >= 70 ? 2.5 : 1.2,
    repeatPeriod: 1200,
    color: m.composite_risk_score >= 70 ? '#ef4444' : (m.composite_risk_score >= 45 ? '#f59e0b' : '#10b981'),
  }));

  return (
    /*
     * KEY FIX: Use absolute inset-0 (inline style) instead of w-full h-full inside a
     * flex items-center parent. In CSS spec, height:100% on a flex child with
     * align-items:center resolves to 'auto' (content height), not the container height.
     * absolute inset-0 guarantees the div fills the positioned ancestor regardless of
     * flex context, so ResizeObserver reads the correct dimensions on first mount.
     */
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#07090e' }}
    >
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#10b981"
        atmosphereAltitude={0.18}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.06}
        pointRadius="size"
        pointsMerge={false}
        onPointClick={(point) => onSelectMine(point)}
        pointLabel={(p) => `
          <div style="background: rgba(10,12,16,0.95); border: 1px solid ${p.color}; padding: 10px 14px; border-radius: 8px; font-family: monospace; color: #fff; font-size: 11px; box-shadow: 0 4px 20px rgba(0,0,0,0.6);">
            <div style="font-weight: bold; color: ${p.color}; font-size: 13px;">${p.name}</div>
            <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">${p.subsidiary} \u2022 ${p.state}</div>
            <div style="margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">
              Governance Risk: <strong>${p.composite_risk_score}/100</strong> (${p.risk_level})
            </div>
            <div>Production: <strong>${p.production_mtpa} MTPA</strong> (EC Cap: ${p.ec_limit_mtpa} MTPA)</div>
            <div style="color: #34d399; font-size: 10px; margin-top: 2px;">Click to inspect details</div>
          </div>
        `}
        ringsData={ringsData}
        ringLat="lat"
        ringLng="lng"
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        onGlobeReady={() => setGlobeReady(true)}
      />

      {/* Floating Globe Controls */}
      <div className="absolute bottom-16 right-96 z-20 flex flex-col gap-2">
        <button
          onClick={handleResetCamera}
          className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/10 shadow-lg backdrop-blur-md transition flex items-center justify-center"
          title="Reset Camera to India"
        >
          <Compass className="w-4 h-4 text-emerald-400" />
        </button>
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2.5 rounded-xl border shadow-lg backdrop-blur-md transition flex items-center justify-center ${
            isRotating ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-black/60 border-white/10 text-gray-400'
          }`}
          title="Toggle Auto-Rotation"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
