import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Globe2, 
  HardHat, 
  Building2, 
  Scale, 
  Smartphone, 
  Truck, 
  Link2,
  ShieldAlert
} from 'lucide-react';

export default function NavigationTabs() {
  const tabs = [
    { to: '/', label: 'National 3D Grid', icon: Globe2 },
    { to: '/mine-hub', label: 'Mine Safety Hub', icon: HardHat },
    { to: '/authority-dispatch', label: 'Authority Reporting & Escalation', icon: ShieldAlert, badge: 'NEW' },
    { to: '/corporate', label: 'Corporate HQ Matrix', icon: Building2 },
    { to: '/regulatory', label: 'DGMS / CPCB Audit', icon: Scale },
    { to: '/field-app', label: 'Field Mobile PWA', icon: Smartphone },
    { to: '/contractors', label: 'Contractor Cascade', icon: Truck },
    { to: '/ledger', label: 'Blockchain Audit', icon: Link2 },
  ];

  return (
    <nav className="w-full border-b border-white/5 bg-[#0e1219]/60 backdrop-blur-md px-4 py-1.5 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className={`w-3.5 h-3.5 ${tab.badge ? 'text-rose-400' : ''}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                  {tab.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
