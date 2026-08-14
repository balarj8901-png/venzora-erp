import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ShoppingCart, FileSpreadsheet, Settings, 
  Sun, Moon, Gem, ChevronDown, KeyRound, LogOut, ShieldCheck, Download
} from 'lucide-react';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import PurchaseEntryScreen from './components/PurchaseEntryScreen';
import SaleEntryScreen from './components/SaleEntryScreen';
import SaleRptScreen from './components/SaleRptScreen';
import SettingsScreen from './components/SettingsScreen';
import LoginModal from './components/LoginModal';
import AdminExcelExportModal from './components/AdminExcelExportModal';

import { getPurchasesData, savePurchasesData, getSalesData, saveSalesData } from './utils/erpStorage';
import { getFieldSettings, saveFieldSettings } from './utils/fieldSettings';

function ErpApp() {
  const { theme, toggleTheme } = useTheme();
  const { 
    currentUser, users, switchUser, logAudit, isLoginModalOpen, 
    openLoginPrompt, isAuthenticated, logoutUser 
  } = useAuth();

  const [purchases, setPurchases] = useState(getPurchasesData());
  const [sales, setSales] = useState(getSalesData());
  const [fieldSettings, setFieldSettingsState] = useState(getFieldSettings());
  const [usdRate, setUsdRate] = useState(87.61);

  // Admin Smart Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);

  // Gated Navigation: Calculate allowed items safely only when authenticated
  const allNavItems = currentUser ? [
    { id: 'purchase', label: 'Purchase Entry', icon: ShoppingBag, perm: currentUser.canPurchase !== false },
    { id: 'sale', label: 'Sale Entry', icon: ShoppingCart, perm: currentUser.canSale !== false },
    { id: 'salerpt', label: 'SaleRpt (Report)', icon: FileSpreadsheet, perm: currentUser.canSaleRpt !== false },
    { id: 'settings', label: 'Settings', icon: Settings, perm: currentUser.canSettings !== false }
  ] : [];

  const allowedNavItems = allNavItems.filter(item => item.perm);
  const [activeTab, setActiveTab] = useState(allowedNavItems[0]?.id || 'purchase');

  useEffect(() => {
    if (allowedNavItems.length > 0 && !allowedNavItems.some(i => i.id === activeTab)) {
      setActiveTab(allowedNavItems[0].id);
    }
  }, [currentUser]);

  const handleSavePurchase = (newPurchase) => {
    const updated = [newPurchase, ...purchases];
    setPurchases(updated);
    savePurchasesData(updated);

    if (logAudit) {
      logAudit(
        'CREATE_PURCHASE',
        'Purchase Entry',
        `Created Purchase Entry (GIA: ${newPurchase.giaNo}, ${newPurchase.shape} ${newPurchase.size}ct, $${newPurchase.dAmount})`
      );
    }
  };

  const handleSaveSale = (newSale) => {
    const updated = [newSale, ...sales];
    setSales(updated);
    saveSalesData(updated);

    if (logAudit) {
      logAudit(
        'CREATE_SALE',
        'Sale Entry',
        `Saved Sales Order ${newSale.saleId} for client ${newSale.clientName} ($${newSale.finalAmt}) • Profit: $${newSale.profit}`
      );
    }
  };

  const handleSaveFieldSettings = (newSettings) => {
    setFieldSettingsState(newSettings);
    saveFieldSettings(newSettings);

    if (logAudit) {
      logAudit('UPDATE_FIELD_SETTINGS', 'Settings', 'Updated Purchase/Sale form field visibility toggles');
    }
  };

  const handleSaveUsdRate = (newRate) => {
    setUsdRate(newRate);
    if (logAudit) {
      logAudit('UPDATE_USD_RATE', 'Settings', `Updated System Exchange Rate ($1 = ₹${newRate})`);
    }
  };

  // Production Login Security Wall: If not authenticated, render Login Modal Gate only
  if (!isAuthenticated || !currentUser) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans ${
        theme === 'dark' ? 'bg-[#0a0608] text-[#f0ebe8]' : 'bg-[#f8f5f3] text-[#1a0a0a]'
      }`}>
        <LoginModal isOpen={true} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans ${
      theme === 'dark'
        ? 'bg-[#0a0608] text-[#f0ebe8]'
        : 'bg-[#f8f5f3] text-[#1a0a0a]'
    }`}>
      {/* 2FA Login / User Switcher Modal */}
      <LoginModal isOpen={isLoginModalOpen} />

      {/* Admin Smart Excel Export Modal */}
      <AdminExcelExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        purchases={purchases}
        sales={sales}
      />

      {/* Header */}
      <header className={`glass-panel sticky top-0 z-40 px-6 py-3 ${
        theme === 'dark' ? 'border-b border-[#2D1515]' : 'border-b border-[#e8d8d0]'
      }`}>
        <div className="w-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#5C1A1A] flex items-center justify-center shadow-md">
              <Gem className="w-4 h-4 text-[#f0ebe8] stroke-[2]" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold font-heading tracking-[0.15em] uppercase"
                  style={{ color: theme === 'dark' ? '#f0ebe8' : '#1a0a0a' }}>
                VENZORA
              </h1>
              <p className="text-[10px] tracking-wide"
                 style={{ color: theme === 'dark' ? '#6B4040' : '#a08080' }}>
                Diamond ERP
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`hidden md:flex items-center gap-1 p-1 rounded-xl ${
            theme === 'dark' ? 'bg-[#1A0A0A] border border-[#2D1515]' : 'bg-[#f0ebe8] border border-[#e8d8d0]'
          }`}>
            {allowedNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#5C1A1A] text-[#f0ebe8] shadow-sm'
                      : theme === 'dark'
                        ? 'text-[#6B4040] hover:text-[#f0ebe8] hover:bg-[#2D1010]'
                        : 'text-[#a08080] hover:text-[#1a0a0a] hover:bg-[#e8d8d0]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Admin Smart Excel Export Button (Restricted to Admin Only) */}
            {currentUser?.role === 'Admin' && (
              <button
                onClick={() => setShowExportModal(true)}
                className="px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white border-emerald-600 shadow"
                title="Export Purchases, Sales, Master Register or Audit Logs to Excel CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export Excel</span>
              </button>
            )}

            {/* User Switcher Dropdown */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              theme === 'dark'
                ? 'bg-[#1A0A0A] border-[#2D1515] text-[#f0ebe8]'
                : 'bg-white border-[#e8d8d0] text-[#1a0a0a]'
            }`}>
              <span className="text-base">{currentUser.avatar}</span>
              <select
                value={currentUser.id}
                onChange={e => switchUser(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                style={{ color: theme === 'dark' ? '#f0ebe8' : '#1a0a0a' }}
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}
                    className="bg-[#1A0A0A] text-[#f0ebe8]">
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutUser}
              className="px-3 py-1.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold bg-rose-950/80 hover:bg-rose-900 border-rose-800 text-rose-200"
              title="Sign Out & Lock ERP System"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#1A0A0A] border-[#2D1515] hover:border-[#8B3030]'
                  : 'bg-white border-[#e8d8d0] hover:border-[#8B3030]'
              }`}
              title="Toggle Light / Dark Theme"
            >
              {theme === 'dark'
                ? <Sun className="w-4 h-4 text-[#C08060]" />
                : <Moon className="w-4 h-4 text-[#5C1A1A]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full px-6 py-4">
        {activeTab === 'purchase' && currentUser.canPurchase !== false && (
          <PurchaseEntryScreen purchases={purchases} fieldSettings={fieldSettings} usdRate={usdRate} onSavePurchase={handleSavePurchase} onOpenExport={currentUser?.role === 'Admin' ? () => setShowExportModal(true) : null} />
        )}
        {activeTab === 'sale' && currentUser.canSale !== false && (
          <SaleEntryScreen purchases={purchases} sales={sales} fieldSettings={fieldSettings} usdRate={usdRate} onSaveSale={handleSaveSale} onOpenExport={currentUser?.role === 'Admin' ? () => setShowExportModal(true) : null} />
        )}
        {activeTab === 'salerpt' && currentUser.canSaleRpt !== false && (
          <SaleRptScreen purchases={purchases} sales={sales} onOpenExport={currentUser?.role === 'Admin' ? () => setShowExportModal(true) : null} />
        )}
        {activeTab === 'settings' && currentUser.canSettings !== false && (
          <SettingsScreen fieldSettings={fieldSettings} onSaveFieldSettings={handleSaveFieldSettings} usdRate={usdRate} onSaveUsdRate={handleSaveUsdRate} onOpenExport={currentUser?.role === 'Admin' ? () => setShowExportModal(true) : null} />
        )}
      </main>

      {/* Footer */}
      <footer className={`py-2.5 px-6 text-center text-[11px] border-t flex items-center justify-between ${
        theme === 'dark' ? 'border-[#2D1515] text-[#6B4040]' : 'border-[#e8d8d0] text-[#a08080]'
      }`}>
        <span>VENZORA Diamond ERP &nbsp;•&nbsp; Active User: <strong className="text-[#8B3030] uppercase">{currentUser.name}</strong></span>
        <span className="flex items-center gap-1 font-mono text-[10px]">
          🔒 Production Security Gate Active &nbsp;•&nbsp; 📊 Excel Export Enabled &nbsp;•&nbsp; 📜 Audit Trail Logged
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ErpApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
