import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Globe2, 
  HardHat, 
  Building2, 
  Truck, 
  Link2 
} from 'lucide-react';

export default function NavigationTabs() {
  const tabs = [
    { to: '/', label: 'National 3D Grid', icon: Globe2 },
    { to: '/mine-hub', label: 'Mine Safety Hub', icon: HardHat },
    { to: '/corporate', label: 'Corporate HQ Matrix', icon: Building2 },
    { to: '/contractors', label: 'Contractor Cascade', icon: Truck },
    { to: '/ledger', label: 'Blockchain Audit Ledger', icon: Link2 },
  ];

  return (
    <nav className="w-full border-b border-white/5 bg-[#0a0c10] px-6 py-2 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
