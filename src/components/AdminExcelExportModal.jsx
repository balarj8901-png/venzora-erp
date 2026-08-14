import React, { useState } from 'react';
import { FileSpreadsheet, Download, Calendar, X, Check, Filter, ShieldCheck, ShoppingBag, ShoppingCart, Gem, History } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { exportPurchasesCsv, exportSalesCsv, exportMasterRegisterCsv, exportAuditLogsCsv } from '../utils/excelExporter';

export default function AdminExcelExportModal({ isOpen, onClose, purchases, sales }) {
  const { theme } = useTheme();
  const { currentUser, auditLogs, logAudit } = useAuth();
  const isDark = theme === 'dark';

  const [exportScope, setExportScope] = useState('master'); // 'master' | 'purchases' | 'sales' | 'audit'
  const [fromDate, setFromDate] = useState('2025-05-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen || currentUser?.role !== 'Admin') return null;

  const c = {
    panel: isDark ? '#12080A' : '#ffffff',
    border: isDark ? '#2D1515' : '#e8d8d0',
    rowBg: isDark ? '#1A0A0A' : '#fdf8f6',
    inputBg: isDark ? '#1E0D0D' : '#fdf8f6',
    inputBorder: isDark ? '#3D1A1A' : '#c8a898',
    accent: '#5C1A1A',
    accentLight: isDark ? '#2D1010' : '#fdf0ee',
    accentText: isDark ? '#E8A0A0' : '#5C1A1A',
    accentBorder: '#8B3030',
    text: isDark ? '#f0ebe8' : '#1a0a0a',
    muted: isDark ? '#9A7070' : '#7a5050',
  };

  const inputStyle = {
    background: c.inputBg,
    border: `1px solid ${c.inputBorder}`,
    color: c.text,
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '11px',
    fontWeight: 600,
    outline: 'none',
    fontFamily: 'JetBrains Mono, monospace'
  };

  // Live Metrics Calculations
  const filteredPurchases = purchases.filter(p => {
    if (!fromDate && !toDate) return true;
    const pDate = p.date || '';
    return (!fromDate || pDate >= fromDate) && (!toDate || pDate <= toDate);
  });

  const filteredSales = sales.filter(s => {
    if (!fromDate && !toDate) return true;
    const sDate = s.date || '';
    return (!fromDate || sDate >= fromDate) && (!toDate || sDate <= toDate);
  });

  const totalPurAmt = filteredPurchases.reduce((acc, p) => acc + (p.dAmount || 0), 0);
  const totalSaleAmt = filteredSales.reduce((acc, s) => acc + (s.finalAmt || 0), 0);
  const totalProfitAmt = filteredSales.reduce((acc, s) => acc + (s.profit || 0), 0);
  const totalCommissionAmt = filteredSales.reduce((acc, s) => acc + (s.commissionAmt || 0), 0);

  const handlePresetDate = (preset) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (preset === 'ALL') {
      setFromDate('');
      setToDate('');
    } else if (preset === '2025-2026') {
      setFromDate('2025-05-01');
      setToDate(todayStr);
    } else if (preset === 'THIS_MONTH') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      setFromDate(firstDay);
      setToDate(todayStr);
    }
  };

  const handleExecuteExport = () => {
    let count = 0;
    if (exportScope === 'master') {
      count = exportMasterRegisterCsv(purchases, sales, fromDate, toDate);
      if (logAudit) logAudit('EXPORT_EXCEL', 'Reports', `Exported Master ERP Register (${count} records) to Excel CSV`);
    } else if (exportScope === 'purchases') {
      count = exportPurchasesCsv(purchases, fromDate, toDate);
      if (logAudit) logAudit('EXPORT_EXCEL', 'Purchase Entry', `Exported Purchases Register (${count} records) to Excel CSV`);
    } else if (exportScope === 'sales') {
      count = exportSalesCsv(sales, purchases, fromDate, toDate);
      if (logAudit) logAudit('EXPORT_EXCEL', 'Sale Entry', `Exported Sales Register (${count} records) to Excel CSV`);
    } else if (exportScope === 'audit') {
      count = exportAuditLogsCsv(auditLogs);
      if (logAudit) logAudit('EXPORT_EXCEL', 'Security', `Exported System Audit Logs (${count} records) to Excel CSV`);
    }

    alert(`Successfully exported ${count} records to Excel CSV! Check your downloads.`);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-xl p-6 rounded-2xl shadow-2xl space-y-4"
        style={{ background: c.panel, border: `1.5px solid ${c.accentBorder}`, color: c.text }}>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: c.border }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold font-heading flex items-center gap-2" style={{ color: c.text }}>
                Admin Smart Excel Exporter
              </h3>
              <p className="text-[11px]" style={{ color: c.muted }}>
                Date-wise custom export for Purchases, Sales, Master Register & Audit Logs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer">
            <X className="w-4 h-4" style={{ color: c.muted }} />
          </button>
        </div>

        {/* 1. Scope Selection Cards */}
        <div>
          <label className="block text-xs font-bold mb-2" style={{ color: c.muted }}>Select Report Scope to Export:</label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'master', title: 'Master ERP Register', desc: 'Full Purchases + Sales 35+ Columns', icon: Gem, color: c.accentText },
              { id: 'purchases', title: 'Purchases Only', desc: 'All diamond purchase records', icon: ShoppingBag, color: '#38bdf8' },
              { id: 'sales', title: 'Sales Only', desc: 'All sales orders, client & profit data', icon: ShoppingCart, color: '#4ade80' },
              { id: 'audit', title: 'Security Audit Logs', desc: 'User login & change activity trail', icon: History, color: '#facc15' },
            ].map(item => {
              const Icon = item.icon;
              const isSel = exportScope === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setExportScope(item.id)}
                  className="p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5"
                  style={isSel
                    ? { background: c.accentLight, borderColor: c.accentBorder }
                    : { background: c.rowBg, borderColor: c.border }
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: item.color }} />
                  <div>
                    <div className="font-bold text-xs" style={{ color: isSel ? c.accentText : c.text }}>{item.title}</div>
                    <div className="text-[10px]" style={{ color: c.muted }}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Date-Wise Filtering Controls */}
        <div className="p-3.5 rounded-xl space-y-2.5" style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: c.text }}>
              <Calendar className="w-3.5 h-3.5" style={{ color: c.accentBorder }} />
              Filter Date Range:
            </span>
            <div className="flex items-center gap-1">
              {['2025-2026', 'THIS_MONTH', 'ALL'].map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetDate(preset)}
                  className="px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer hover:opacity-80"
                  style={{ background: c.panel, borderColor: c.border, color: c.muted }}
                >
                  {preset.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold block mb-1" style={{ color: c.muted }}>From Date:</label>
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <label className="text-[10px] font-semibold block mb-1" style={{ color: c.muted }}>To Date:</label>
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
            </div>
          </div>
        </div>

        {/* 3. Live Metrics Preview */}
        <div className="grid grid-cols-4 gap-2 p-3 rounded-xl text-center font-mono text-xs" style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>
          <div>
            <span style={{ color: c.muted, fontSize: '9px', display: 'block' }}>Purchases:</span>
            <strong style={{ color: c.text }}>${totalPurAmt.toFixed(2)}</strong>
          </div>
          <div>
            <span style={{ color: c.muted, fontSize: '9px', display: 'block' }}>Sales:</span>
            <strong style={{ color: c.accentText }}>${totalSaleAmt.toFixed(2)}</strong>
          </div>
          <div>
            <span style={{ color: c.muted, fontSize: '9px', display: 'block' }}>Profit:</span>
            <strong style={{ color: '#5C8A40' }}>${totalProfitAmt.toFixed(2)}</strong>
          </div>
          <div>
            <span style={{ color: c.muted, fontSize: '9px', display: 'block' }}>Commission:</span>
            <strong style={{ color: isDark ? '#C0A040' : '#8A6020' }}>${totalCommissionAmt.toFixed(2)}</strong>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleExecuteExport}
            className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer transition-all shadow-md"
          >
            <Download className="w-4 h-4" /> Download Excel CSV (.csv)
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            style={{ background: c.rowBg, color: c.muted, border: `1px solid ${c.border}` }}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
