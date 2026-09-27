import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import Topbar from './components/Topbar';
import NavigationTabs from './components/NavigationTabs';
import OverviewDashboard from './pages/OverviewDashboard';
import MineOfficialView from './pages/MineOfficialView';
import CorporateExecutiveView from './pages/CorporateExecutiveView';
import ContractorSupplyChain from './pages/ContractorSupplyChain';
import BlockchainAuditLedger from './pages/BlockchainAuditLedger';
import FieldInspectionApp from './pages/FieldInspectionApp';

import KhananCopilotModal from './components/KhananCopilotModal';
import OCRDocumentModal from './components/OCRDocumentModal';
import StatutoryReportModal from './components/StatutoryReportModal';

export default function App() {
  const [currentPersona, setCurrentPersona] = useState('corporate_hq');
  const [activeMineId, setActiveMineId] = useState('gevra');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState('');
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportMineId, setReportMineId] = useState('gevra');

  const openCopilotWithContext = (query = '', mineId = null) => {
    if (mineId) setActiveMineId(mineId);
    setCopilotQuery(query);
    setIsCopilotOpen(true);
  };

  const openReportForMine = (mineId = null) => {
    if (mineId) setReportMineId(mineId);
    else if (activeMineId) setReportMineId(activeMineId);
    setIsReportOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#07090e] text-gray-100 selection:bg-emerald-500 selection:text-black">
        {/* Topbar */}
        <Topbar
          currentPersona={currentPersona}
          onSelectPersona={setCurrentPersona}
        />

        {/* 5-Item Navigation Bar */}
        <NavigationTabs />

        {/* Main Content Router */}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            {/* Primary 5 Core Views */}
            <Route
              path="/"
              element={
                <OverviewDashboard
                  onOpenCopilot={openCopilotWithContext}
                  onOpenOCR={() => setIsOCROpen(true)}
                  onOpenReport={openReportForMine}
                />
              }
            />
            <Route
              path="/mine-hub"
              element={
                <MineOfficialView
                  activeMineId={activeMineId}
                  setActiveMineId={setActiveMineId}
                  onOpenCopilot={openCopilotWithContext}
                  onOpenOCR={() => setIsOCROpen(true)}
                  onOpenReport={openReportForMine}
                />
              }
            />
            <Route
              path="/corporate"
              element={
                <CorporateExecutiveView
                  onOpenCopilot={openCopilotWithContext}
                  onOpenReport={openReportForMine}
                />
              }
            />
            <Route path="/contractors" element={<ContractorSupplyChain />} />
            <Route
              path="/ledger"
              element={
                <BlockchainAuditLedger
                  onOpenReport={openReportForMine}
                />
              }
            />

            {/* Preserved Secondary / Sub-Flow Routes */}
            <Route path="/field-app" element={<FieldInspectionApp />} />

            {/* Catch-all redirect to National Grid */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Floating Action Button: Khanan Copilot (Bottom-Right) */}
        <button
          onClick={() => openCopilotWithContext()}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0c1017] border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all shadow-xl font-mono text-xs font-semibold cursor-pointer group"
          title="Open Khanan Copilot Assistant"
        >
          <Bot className="w-4 h-4 text-emerald-400 group-hover:text-black transition-colors" />
          <span>Khanan Copilot</span>
        </button>

        {/* Global Floating Modals */}
        <KhananCopilotModal
          isOpen={isCopilotOpen}
          onClose={() => {
            setIsCopilotOpen(false);
            setCopilotQuery('');
          }}
          defaultMineId={activeMineId}
          initialQuery={copilotQuery}
        />

        <OCRDocumentModal
          isOpen={isOCROpen}
          onClose={() => setIsOCROpen(false)}
        />

        <StatutoryReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          selectedMineId={reportMineId}
        />
      </div>
    </Router>
  );
}
