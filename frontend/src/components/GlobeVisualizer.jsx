import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { RotateCw, Compass } from 'lucide-react';

export default function GlobeVisualizer({ mines, selectedMine, onSelectMine }) {
  const globeRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 700 });
  const [isRotating, setIsRotating] = useState(true);

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth || 800,
        height: containerRef.current.clientHeight || 700,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const timer = setTimeout(updateDimensions, 200);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, [updateDimensions]);

  useEffect(() => {
    if (globeRef.current) {
      // Focus on central India coordinates
      globeRef.current.pointOfView({ lat: 22.8, lng: 82.2, altitude: 1.55 }, 1200);
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = isRotating;
        controls.autoRotateSpeed = 0.4;
        controls.enableZoom = true;
      }
    }
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = isRotating;
      }
    }
  }, [isRotating]);

  // When selected mine changes from outside
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

  // Points data
  const pointsData = mines.map((m) => ({
    ...m,
    lat: m.lat,
    lng: m.lng,
    size: m.capacity_mtpa > 50 ? 1.4 : (m.capacity_mtpa > 20 ? 1.0 : 0.7),
    color: m.composite_risk_score >= 70 ? '#ef4444' : (m.composite_risk_score >= 45 ? '#f59e0b' : '#10b981'),
  }));

  // Pulsing rings data
  const ringsData = mines.map((m) => ({
    lat: m.lat,
    lng: m.lng,
    maxR: m.composite_risk_score >= 70 ? 4.5 : 2.5,
    propagationSpeed: m.composite_risk_score >= 70 ? 2.5 : 1.2,
    repeatPeriod: 1200,
    color: m.composite_risk_score >= 70 ? '#ef4444' : (m.composite_risk_score >= 45 ? '#f59e0b' : '#10b981'),
  }));

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#07090e]">
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
            <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">${p.subsidiary} • ${p.state}</div>
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
      />

      {/* Floating Globe Controls */}
      <div className="absolute bottom-16 right-4 z-20 flex flex-col gap-2">
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
