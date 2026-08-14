import React, { useState } from 'react';
import { Search, FileSpreadsheet } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SaleRptScreen({ purchases = [], sales = [], onOpenExport }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const c = {
    text: isDark ? '#f0ebe8' : '#1a0a0a',
    muted: isDark ? '#9A7070' : '#7a5050',
    panel: isDark ? '#12080A' : '#ffffff',
    border: isDark ? '#2D1515' : '#e8d8d0',
    rowBg: isDark ? '#1A0A0A' : '#fdf8f6',
    headBg: isDark ? '#1A0A0A' : '#f5ece8',
    inputBg: isDark ? '#1E0D0D' : '#fdf8f6',
    inputBorder: isDark ? '#3D1A1A' : '#c8a898',
    accent: '#5C1A1A',
    accentBorder: '#8B3030',
    accentText: isDark ? '#E8A0A0' : '#5C1A1A',
    purSectionBg: isDark ? '#1A0808' : '#fdf0ee',
    saleSectionBg: isDark ? '#081A08' : '#f0fdf4',
    exportSectionBg: isDark ? '#1A1A08' : '#fefce8',
  };
  const [fromDate, setFromDate] = useState('2025-05-01');
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const num = (val) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Safe Combined Purchase + Sale Records
  const safePurchases = Array.isArray(purchases) ? purchases : [];
  const safeSales = Array.isArray(sales) ? sales : [];

  const combinedRecords = safePurchases.map(p => {
    const matchingSale = safeSales.find(s => String(s.purId) === String(p.purId) || (s.giaNo && s.giaNo === p.giaNo));
    const pDAmount = num(p.dAmount);
    const saleDProfit = matchingSale ? (matchingSale.profit !== undefined ? num(matchingSale.profit) : (num(matchingSale.finalAmt) - pDAmount)) : 0;
    const profitPct = matchingSale && pDAmount > 0 ? (saleDProfit / pDAmount) * 100 : 0;

    return {
      // Purchase Fields
      giaNo: p.giaNo || '-',
      purDate: p.date || '-',
      fromName: p.fromComp || '-',
      size: p.size || '0.000',
      shape: p.shape || '-',
      color: p.color || '-',
      quality: p.quality || '-',
      flor: p.flor || '-',
      cut: p.cut || '-',
      pol: p.pol || '-',
      sym: p.sym || '-',
      measur: p.measurments || '-',
      purLess: num(p.less),
      coDis: num(p.coDis) || 99.800,
      rap: num(p.rap),
      perCarat: num(p.perCarat),
      dAmount: pDAmount,
      rate: num(p.rate) || 87.610,
      indAmount: num(p.indAmount) || (pDAmount * (num(p.rate) || 87.61)),
      bType: p.bill || 'CASH',
      paymentID: p.payDay || 15,
      purUser: p.user || 'DHARMIK SUTARIYA',
      purIsPay: p.isPay !== false,

      // Sale Fields
      saleDate: matchingSale ? (matchingSale.date || '-') : '-',
      clientName: matchingSale ? (matchingSale.clientName || '-') : '-',
      salePerCarat: matchingSale ? num(matchingSale.pCarat || matchingSale.itemRate) : 0,
      saleLess: matchingSale ? num(matchingSale.less) : 0,
      saleDFinal: matchingSale ? num(matchingSale.finalAmt) : 0,
      advDAmt: matchingSale ? num(matchingSale.advAmt) : 0,
      dueAmt: matchingSale ? num(matchingSale.dueAmt) : 0,
      saleRemark: matchingSale ? (matchingSale.remark || '-') : '-',
      saleUser: matchingSale ? (matchingSale.user || '-') : '-',
      saleDProfit,
      profitPct,
      saleIsPay: matchingSale ? matchingSale.isPay !== false : false,
      // Commission = Profit × Rate%
      commissionRate: matchingSale ? num(matchingSale.commissionRate) : 0,
      commissionAmt: matchingSale ? (matchingSale.commissionAmt !== undefined && matchingSale.commissionAmt !== null ? num(matchingSale.commissionAmt) : (saleDProfit > 0 ? (saleDProfit * num(matchingSale.commissionRate)) / 100 : 0)) : 0,

      // Export Status
      isExport: p.isExport !== false,
      purId: p.purId
    };
  });

  const filtered = combinedRecords.filter(r => {
    const pDate = r.purDate || '';
    const matchDate = (!fromDate || pDate >= fromDate) && (!toDate || pDate <= toDate);
    const matchSearch = !searchTerm.trim() || 
      String(r.giaNo).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.fromName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.clientName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(r.shape).toLowerCase().includes(searchTerm.toLowerCase());
    return matchDate && matchSearch;
  });

  // Totals
  const totalDAmount = filtered.reduce((acc, r) => acc + r.dAmount, 0);
  const totalSaleDFinal = filtered.reduce((acc, r) => acc + r.saleDFinal, 0);
  const totalProfit = filtered.reduce((acc, r) => acc + r.saleDProfit, 0);
  const totalCommission = filtered.reduce((acc, r) => acc + r.commissionAmt, 0);

  const inputStyle = {
    background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text,
    borderRadius: '8px', padding: '5px 12px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', outline: 'none'
  };

  return (
    <div className="w-full font-sans text-xs space-y-4" style={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '20px' }}>
      {/* Top Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3" style={{ borderBottom: `1px solid ${c.border}` }}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold" style={{ color: c.text }}>Date:</span>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={inputStyle} />
          <span className="font-semibold" style={{ color: c.text }}>To</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={inputStyle} />
          <button className="px-5 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all hover:opacity-90"
            style={{ background: c.accent, color: '#f0ebe8', border: `1px solid ${c.accentBorder}` }}>
            Show
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 flex items-center gap-1.5 cursor-pointer transition-all shadow"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Excel CSV
            </button>
          )}

          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5" style={{ color: c.muted }} />
            <input type="text" placeholder="Search GIA, Company, Client..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '36px', width: '100%', fontFamily: 'Inter, sans-serif' }} />
          </div>
        </div>
      </div>

      {/* Main Grid Table */}
      <div className="w-full overflow-x-auto rounded-xl max-h-[680px] overflow-y-auto" style={{ border: `1px solid ${c.border}` }}>
        <table className="w-full text-left text-[11px] font-mono" style={{ borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 20 }}>
            {/* Section Banners */}
            <tr>
              <th colSpan="23" style={{ padding: '8px 10px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', background: c.purSectionBg, color: c.accentText, borderRight: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
                PURCHASE DETAILS
              </th>
              <th colSpan="12" style={{ padding: '8px 10px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', background: isDark ? '#081A0A' : '#f0f9f0', color: isDark ? '#80C080' : '#2A6B2A', borderRight: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
                SALE DETAILS
              </th>
              <th colSpan="1" style={{ padding: '8px 10px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', background: isDark ? '#1A1A0A' : '#faf9e8', color: isDark ? '#C0B840' : '#6B6020', borderBottom: `1px solid ${c.border}` }}>
                EXPORT
              </th>
            </tr>
            {/* Column Headers */}
            <tr style={{ background: c.headBg, borderBottom: `1px solid ${c.border}` }}>
              {['GIA No','Date','From Name','Size','Shape','Color','Quality','Flor.','Cut','Pol.','Sym.','Measur','Less','CoDis','Rap','PerCarat','DAmount','Rate','IndAmount','BType','PaymentID','User','isPay',
                'Date','ClientName','SalePerCarat','SaleLess','SaleDFinal','ADV D AMT','DUE AMT','SaleRemark','User','SaleDProfit','Profit %','Commission','isExport'].map((h, idx) => (
                <th key={idx} style={{ padding: '7px 8px', color: idx === 34 ? (isDark ? '#C0A040' : '#8A6020') : c.muted, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', borderRight: idx < 35 ? `1px solid ${c.border}` : 'none', whiteSpace: 'nowrap', minWidth: idx === 2 ? '140px' : idx === 22 || idx === 33 || idx === 34 ? '60px' : '80px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? c.panel : c.rowBg, borderBottom: `1px solid ${c.border}` }}>
                {/* Purchase Cells */}
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.text, whiteSpace: 'nowrap' }}>{r.giaNo}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.muted, whiteSpace: 'nowrap' }}>{r.purDate}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>{r.fromName}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.accentText }}>{r.size}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.accentText }}>{r.shape}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.color}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text, fontWeight: 600 }}>{r.quality}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.muted }}>{r.flor}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.cut}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.pol}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.sym}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.muted }}>{r.measur}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.purLess.toFixed(3)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.coDis.toFixed(3)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>${r.rap.toFixed(2)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.accentText }}>${r.perCarat.toFixed(2)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.accentText }}>${r.dAmount.toFixed(3)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.rate}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.accentText }}>₹{r.indAmount.toFixed(2)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text, fontFamily: 'Inter, sans-serif', fontSize: '10px' }}>{r.bType}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.paymentID}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.muted, fontFamily: 'Inter, sans-serif', fontSize: '10px', textTransform: 'uppercase' }}>{r.purUser}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, textAlign: 'center' }}>
                  <input type="checkbox" checked={r.purIsPay} readOnly style={{ accentColor: c.accentBorder, cursor: 'pointer' }} />
                </td>

                {/* Sale Cells */}
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.muted }}>{r.saleDate}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.text, fontFamily: 'Inter, sans-serif' }}>{r.clientName}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.accentText }}>${r.salePerCarat.toFixed(3)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>{r.saleLess.toFixed(3)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: c.accentText }}>${r.saleDFinal.toFixed(3)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>${r.advDAmt.toFixed(3)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.text }}>${r.dueAmt.toFixed(3)}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.muted, fontFamily: 'Inter, sans-serif', fontSize: '10px' }}>{r.saleRemark}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, color: c.muted, fontFamily: 'Inter, sans-serif', fontSize: '10px', textTransform: 'uppercase' }}>{r.saleUser}</td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, color: r.saleDProfit >= 0 ? '#5C8A40' : '#8A2020' }}>
                  ${r.saleDProfit.toFixed(3)}
                </td>
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, textAlign: 'center', color: r.profitPct >= 0 ? '#5C8A40' : '#8A2020' }}>
                  {r.profitPct.toFixed(2)}%
                </td>
                {/* Commission Cell */}
                <td style={{ padding: '7px 8px', borderRight: `1px solid ${c.border}`, fontWeight: 700, textAlign: 'right', color: r.commissionAmt > 0 ? (isDark ? '#C0A040' : '#8A6020') : c.muted }}>
                  {r.commissionAmt > 0 ? (
                    <span title={`${r.commissionRate}% of $${r.saleDProfit.toFixed(2)} profit`}>
                      ${r.commissionAmt.toFixed(3)}
                      <span style={{ display: 'block', fontSize: '9px', color: c.muted, fontWeight: 400 }}>{r.commissionRate}%</span>
                    </span>
                  ) : <span style={{ color: c.muted }}>-</span>}
                </td>
                <td style={{ padding: '7px 8px', textAlign: 'center' }}>
                  <input type="checkbox" checked={r.isExport} readOnly style={{ accentColor: c.accentBorder, cursor: 'pointer' }} />
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="36" className="text-center py-10 text-xs font-sans" style={{ color: c.muted }}>
                  No purchase or sales records found for the selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 text-xs font-mono"
        style={{ borderTop: `1px solid ${c.border}` }}>
        <div style={{ color: c.muted, fontFamily: 'Inter, sans-serif' }}>
          Total Records: <strong style={{ color: c.text, fontSize: '14px' }}>{filtered.length}</strong>
        </div>
        <div className="flex gap-6 flex-wrap text-sm">
          <div style={{ color: c.text }}>Total Purchase: <strong style={{ color: c.accentText }}>${totalDAmount.toFixed(3)}</strong></div>
          <div style={{ color: c.text }}>Total Sales: <strong style={{ color: c.accentText }}>${totalSaleDFinal.toFixed(3)}</strong></div>
          <div style={{ color: c.text }}>Total Profit: <strong style={{ color: '#5C8A40' }}>${totalProfit.toFixed(3)}</strong></div>
          <div style={{ color: c.text }}>Total Commission: <strong style={{ color: isDark ? '#C0A040' : '#8A6020' }}>${totalCommission.toFixed(3)}</strong></div>
        </div>
      </div>
    </div>
  );
}
