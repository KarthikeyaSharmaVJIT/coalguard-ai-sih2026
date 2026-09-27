import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import NavigationTabs from './components/NavigationTabs';
import OverviewDashboard from './pages/OverviewDashboard';
import MineOfficialView from './pages/MineOfficialView';
import CorporateExecutiveView from './pages/CorporateExecutiveView';
import RegulatoryAuditView from './pages/RegulatoryAuditView';
import FieldInspectionApp from './pages/FieldInspectionApp';
import ContractorSupplyChain from './pages/ContractorSupplyChain';
import BlockchainAuditLedger from './pages/BlockchainAuditLedger';
import AuthorityReportingView from './pages/AuthorityReportingView';

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

  const openCopilotWithContext = (query = '', mineId = null) => {
    if (mineId) setActiveMineId(mineId);
    setCopilotQuery(query);
    setIsCopilotOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#07090e] text-gray-100 selection:bg-emerald-500 selection:text-black">
        {/* Topbar */}
        <Topbar
          currentPersona={currentPersona}
          onSelectPersona={setCurrentPersona}
          onOpenCopilot={() => openCopilotWithContext()}
          onOpenOCR={() => setIsOCROpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
        />

        {/* Navigation Bar */}
        <NavigationTabs />

        {/* Main Content Router */}
        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route
              path="/"
              element={
                <OverviewDashboard
                  onOpenCopilot={openCopilotWithContext}
                  onOpenOCR={() => setIsOCROpen(true)}
                  onOpenReport={() => setIsReportOpen(true)}
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
                  onOpenReport={() => setIsReportOpen(true)}
                />
              }
            />
            <Route
              path="/authority-dispatch"
              element={
                <AuthorityReportingView
                  onOpenCopilot={openCopilotWithContext}
                />
              }
            />
            <Route path="/corporate" element={<CorporateExecutiveView />} />
            <Route
              path="/regulatory"
              element={
                <RegulatoryAuditView
                  onOpenCopilot={openCopilotWithContext}
                  onOpenReport={() => setIsReportOpen(true)}
                />
              }
            />
            <Route path="/field-app" element={<FieldInspectionApp />} />
            <Route path="/contractors" element={<ContractorSupplyChain />} />
            <Route path="/ledger" element={<BlockchainAuditLedger />} />
          </Routes>
        </main>

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
        />
      </div>
    </Router>
  );
}

