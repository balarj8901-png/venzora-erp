import React, { useState } from 'react';
import { Save, RotateCcw, Search, MousePointerClick, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SaleEntryScreen({ purchases, sales, fieldSettings, usdRate, onSaveSale, onOpenExport }) {
  const { currentUser, users } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get this user's commission rate from users list (always fresh)
  const thisUserFull = users.find(u => u.id === currentUser.id) || currentUser;
  const commissionRate = thisUserFull.commissionRate ?? 0;

  const c = {
    text: isDark ? '#f0ebe8' : '#1a0a0a',
    muted: isDark ? '#9A7070' : '#7a5050',
    panel: isDark ? '#12080A' : '#ffffff',
    border: isDark ? '#2D1515' : '#e8d8d0',
    rowBg: isDark ? '#1A0A0A' : '#fdf8f6',
    rowHover: isDark ? '#2D1010' : '#f5ece8',
    rowSelected: isDark ? '#3D1515' : '#fce8e8',
    rowSelectedBorder: '#8B3030',
    inputBg: isDark ? '#1E0D0D' : '#fdf8f6',
    inputBorder: isDark ? '#3D1A1A' : '#c8a898',
    accent: '#5C1A1A',
    accentBorder: '#8B3030',
    accentText: isDark ? '#E8A0A0' : '#5C1A1A',
    headBg: isDark ? '#1A0A0A' : '#f5ece8',
  };

  const [selectedPurchase, setSelectedPurchase] = useState(purchases[0] || null);
  const [clientName, setClientName] = useState('Steven Biggs');
  const [toCountry, setToCountry] = useState('USA');
  const [mobileNo, setMobileNo] = useState('+1 415 890 1234');
  const [itemRate, setItemRate] = useState('157.890');
  const [pCarat, setPCarat] = useState('105.000');
  const [coDis, setCoDis] = useState('99.710');
  const [less, setLess] = useState('0.000');
  const [finalAmt, setFinalAmt] = useState('239.990');
  const [br, setBr] = useState('1.00');
  const [remark, setRemark] = useState('Solitaire order');
  const [advAmt, setAdvAmt] = useState('0.000');
  const [advAmtINR, setAdvAmtINR] = useState('0.000');
  const [searchTerm, setSearchTerm] = useState('');

  const fs = fieldSettings?.sale || {};

  const purDAmount = selectedPurchase ? selectedPurchase.dAmount || 0 : 0;
  const sellFinalAmtNum = parseFloat(finalAmt) || 0;
  const profitNum = sellFinalAmtNum - purDAmount;
  const profitPctNum = purDAmount > 0 ? (profitNum / purDAmount) * 100 : 0;
  const totalSellINR = sellFinalAmtNum * usdRate;
  const advINRNum = parseFloat(advAmtINR) || 0;

  // Commission = Profit × Commission Rate %
  // e.g. Buy $100, Sell $150 → Profit $50, Rate 8% → Commission = $50 × 8% = $4.00
  const commissionAmt = profitNum > 0 ? (profitNum * commissionRate) / 100 : 0;

  const handleSelectPurchaseRow = (p) => {
    setSelectedPurchase(p);
    if (p.perCarat) setPCarat(p.perCarat.toString());
    if (p.dAmount) setItemRate((p.dAmount * 1.2).toFixed(3));
  };

  const handleClear = () => {
    setClientName(''); setMobileNo(''); setItemRate('0'); setFinalAmt('0'); setAdvAmt('0'); setAdvAmtINR('0'); setRemark('');
  };

  const handleSaveSale = (e) => {
    e.preventDefault();
    if (!selectedPurchase) { alert('Please select a purchase item from the right side table!'); return; }
    const newSale = {
      saleId: 'S-' + Math.floor(1000 + Math.random() * 9000),
      purId: selectedPurchase.purId,
      giaNo: selectedPurchase.giaNo,
      date: new Date().toISOString().split('T')[0],
      clientName, toCountry, mobileNo,
      itemRate: parseFloat(itemRate) || 0,
      pCarat: parseFloat(pCarat) || 0,
      coDis: parseFloat(coDis) || 0,
      less: parseFloat(less) || 0,
      finalAmt: parseFloat(finalAmt) || 0,
      br: parseFloat(br) || 1.0,
      remark,
      profit: parseFloat(profitNum.toFixed(3)),
      profitPct: parseFloat(profitPctNum.toFixed(2)),
      commissionRate,
      commissionAmt: parseFloat(commissionAmt.toFixed(3)),
      amt: parseFloat(sellFinalAmtNum.toFixed(3)),
      dueAmt: parseFloat(sellFinalAmtNum.toFixed(3)),
      advAmt: parseFloat(advAmt) || 0,
      advAmtINR: advINRNum,
      user: currentUser.name,
      isPay: true, isExport: true
    };
    onSaveSale(newSale);
    alert(`Sales record saved successfully for client ${clientName}!`);
  };

  const filteredPurchases = purchases.filter(p =>
    p.giaNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.fromComp?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = {
    background: c.inputBg,
    border: `1px solid ${c.inputBorder}`,
    color: c.text,
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '11px',
    fontFamily: 'JetBrains Mono, monospace',
    width: '100%',
    outline: 'none',
  };

  const labelStyle = { fontSize: '10px', color: c.muted, display: 'block', marginBottom: '2px', fontWeight: 600 };

  const panelStyle = {
    background: c.panel,
    border: `1px solid ${c.border}`,
    borderRadius: '12px',
    padding: '16px',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column */}
      <div className="flex-1 space-y-4">
        {/* Purchase Summary (Read-Only) */}
        <div style={panelStyle}>
          <div className="flex items-center justify-between pb-2 mb-3" style={{ borderBottom: `1px solid ${c.border}` }}>
            <span className="font-bold text-xs uppercase tracking-wide flex items-center gap-2 font-heading"
              style={{ color: c.accentText }}>
              <MousePointerClick className="w-4 h-4" style={{ color: c.accentBorder }} />
              Purchase Details (Auto-filled on Click)
            </span>
            {selectedPurchase ? (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono"
                style={{ background: c.rowSelected, color: c.accentText, border: `1px solid ${c.accentBorder}` }}>
                PurId: {selectedPurchase.purId} • GIA: {selectedPurchase.giaNo}
              </span>
            ) : (
              <span className="text-[10px]" style={{ color: c.muted }}>Select a row from the right table</span>
            )}
          </div>

          {selectedPurchase ? (
            <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-[11px] font-mono">
              {[
                { label: 'GIA Number', val: selectedPurchase.giaNo, bold: true },
                { label: 'Date', val: selectedPurchase.date },
                { label: 'From Comp', val: selectedPurchase.fromComp, span: 2 },
                { label: 'Size', val: selectedPurchase.size },
                { label: 'Shape', val: selectedPurchase.shape },
                { label: 'Color', val: selectedPurchase.color },
                { label: 'Quality', val: selectedPurchase.quality },
                { label: 'Cut', val: selectedPurchase.cut },
                { label: 'Pol', val: selectedPurchase.pol },
                { label: 'Sym', val: selectedPurchase.sym },
                { label: 'Fluor', val: selectedPurchase.flor },
                { label: 'Rap ($)', val: `$${selectedPurchase.rap}`, span: 2 },
                { label: 'PerCarat', val: `$${selectedPurchase.perCarat}`, bold: true },
                { label: '$Amount', val: `$${selectedPurchase.dAmount}`, bold: true },
                { label: '₹Amount', val: `₹${selectedPurchase.indAmount?.toLocaleString()}`, bold: true },
                { label: 'Bill', val: selectedPurchase.bill },
              ].map(({ label, val, bold, span }) => (
                <div key={label} className={span === 2 ? 'col-span-2' : ''}>
                  <span style={{ color: c.muted, fontSize: '10px', display: 'block' }}>{label}:</span>
                  <span style={{ color: bold ? c.accentText : c.text, fontWeight: bold ? 700 : 500 }}>{val}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-center py-4" style={{ color: c.muted }}>
              No Purchase Record Selected. Click a row from the right side table.
            </p>
          )}
        </div>

        {/* Sell Form */}
        <form onSubmit={handleSaveSale} style={panelStyle} className="space-y-3">
          <span className="font-bold text-xs uppercase tracking-wide block pb-2 font-heading"
            style={{ color: c.text, borderBottom: `1px solid ${c.border}` }}>
            Sell Details Entry
          </span>

          <div className="grid grid-cols-2 gap-3">
            {fs.clientName !== false && (
              <div><label style={labelStyle}>Client Name:</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} style={inputStyle} required /></div>
            )}
            {fs.toCountry !== false && (
              <div><label style={labelStyle}>To Country:</label>
                <input type="text" value={toCountry} onChange={e => setToCountry(e.target.value)} style={inputStyle} /></div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {fs.mobileNo !== false && (
              <div><label style={labelStyle}>Mobile No:</label>
                <input type="text" value={mobileNo} onChange={e => setMobileNo(e.target.value)} style={inputStyle} /></div>
            )}
            {fs.itemRate !== false && (
              <div><label style={labelStyle}>$Item Rate:</label>
                <input type="text" value={itemRate} onChange={e => setItemRate(e.target.value)} style={{ ...inputStyle, color: c.accentText, fontWeight: 700 }} /></div>
            )}
            {fs.pCarat !== false && (
              <div><label style={labelStyle}>P.Carat:</label>
                <input type="text" value={pCarat} onChange={e => setPCarat(e.target.value)} style={inputStyle} /></div>
            )}
            {fs.coDis !== false && (
              <div><label style={labelStyle}>Co.Dis:</label>
                <input type="text" value={coDis} onChange={e => setCoDis(e.target.value)} style={inputStyle} /></div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {fs.less !== false && (
              <div><label style={labelStyle}>Less:</label>
                <input type="text" value={less} onChange={e => setLess(e.target.value)} style={inputStyle} /></div>
            )}
            {fs.finalAmt !== false && (
              <div><label style={labelStyle}>$ Final:</label>
                <input type="text" value={finalAmt} onChange={e => setFinalAmt(e.target.value)} style={{ ...inputStyle, color: c.accentText, fontWeight: 700 }} /></div>
            )}
            {fs.br !== false && (
              <div><label style={labelStyle}>BR:</label>
                <input type="text" value={br} onChange={e => setBr(e.target.value)} style={inputStyle} /></div>
            )}
            {fs.remark !== false && (
              <div><label style={labelStyle}>Remark:</label>
                <input type="text" value={remark} onChange={e => setRemark(e.target.value)} style={inputStyle} /></div>
            )}
          </div>

          {/* Calculation Summary */}
          <div className="p-3 rounded-lg text-xs font-mono space-y-2"
            style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>

            {/* Row 1: Purchase | Sale | Profit */}
            <div className="grid grid-cols-3 gap-2 pb-2" style={{ borderBottom: `1px solid ${c.border}` }}>
              <div>
                <span style={{ color: c.muted, fontSize: '10px', display: 'block' }}>Purchase ($):</span>
                <span style={{ fontWeight: 700, color: c.text }}>${purDAmount.toFixed(3)}</span>
              </div>
              <div>
                <span style={{ color: c.muted, fontSize: '10px', display: 'block' }}>Sale ($):</span>
                <span style={{ fontWeight: 700, color: c.accentText }}>${sellFinalAmtNum.toFixed(3)}</span>
              </div>
              <div>
                <span style={{ color: c.muted, fontSize: '10px', display: 'block' }}>Profit ($):</span>
                <span style={{ fontWeight: 700, color: profitNum >= 0 ? '#5C8A40' : '#8A2020' }}>
                  ${profitNum.toFixed(3)} ({profitPctNum.toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* Row 2: Commission | ₹Amount | Due */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span style={{ color: c.muted, fontSize: '10px', display: 'block' }}>
                  Commission ({commissionRate}% of Profit):
                </span>
                <span style={{ fontWeight: 700, color: commissionAmt > 0 ? '#8A5A20' : c.muted }}>
                  ${commissionAmt.toFixed(3)}
                </span>
                {commissionRate > 0 && profitNum > 0 && (
                  <span style={{ display: 'block', fontSize: '9px', color: c.muted, marginTop: '1px' }}>
                    ${profitNum.toFixed(2)} × {commissionRate}% = ${commissionAmt.toFixed(3)}
                  </span>
                )}
              </div>
              <div>
                <span style={{ color: c.muted, fontSize: '10px', display: 'block' }}>₹ Amount:</span>
                <span style={{ fontWeight: 700, color: c.text }}>₹{Math.round(totalSellINR).toLocaleString()}</span>
              </div>
              <div>
                <span style={{ color: c.muted, fontSize: '10px', display: 'block' }}>User:</span>
                <span style={{ fontWeight: 600, color: c.text, fontSize: '10px', textTransform: 'uppercase' }}>{currentUser.name}</span>
                {commissionRate > 0 && (
                  <span style={{ display: 'block', fontSize: '9px', color: c.muted }}>Rate: {commissionRate}%</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div><label style={labelStyle}>$Adv Amt:</label>
              <input type="text" value={advAmt} onChange={e => setAdvAmt(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>₹Adv Amt:</label>
              <input type="text" value={advAmtINR} onChange={e => setAdvAmtINR(e.target.value)} style={inputStyle} /></div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: c.accent, color: '#f0ebe8', border: `1px solid ${c.accentBorder}` }}>
              <Save className="w-3.5 h-3.5" />
              Save Sales Order
            </button>
            <button type="button" onClick={handleClear} className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: c.inputBg, color: c.muted, border: `1px solid ${c.inputBorder}` }}>
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Purchase Lookup Table */}
      <div className="lg:w-80 shrink-0 flex flex-col font-mono text-xs" style={panelStyle}>
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-xs font-heading" style={{ color: c.text }}>Purchase Lookup</h3>
            <div className="flex items-center gap-2">
              {onOpenExport && (
                <button
                  type="button"
                  onClick={onOpenExport}
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 flex items-center gap-1 cursor-pointer transition-all shadow"
                >
                  <FileSpreadsheet className="w-3 h-3" /> Export
                </button>
              )}
              <span className="text-[10px] font-semibold" style={{ color: c.accentText }}>Click to Select</span>
            </div>
          </div>
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-2.5" style={{ color: c.muted }} />
            <input
              type="text"
              placeholder="Search PurId or GIA..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '24px', fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-[540px] rounded-lg" style={{ border: `1px solid ${c.border}` }}>
          <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ background: c.headBg, position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                {['PurId', 'GIA No', 'Date'].map(h => (
                  <th key={h} style={{ padding: '8px', color: c.muted, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${c.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((p, i) => {
                const isSelected = selectedPurchase?.purId === p.purId;
                return (
                  <tr
                    key={p.purId}
                    onClick={() => handleSelectPurchaseRow(p)}
                    onDoubleClick={() => handleSelectPurchaseRow(p)}
                    style={{
                      background: isSelected ? c.rowSelected : (i % 2 === 0 ? c.panel : c.rowBg),
                      borderLeft: isSelected ? `3px solid ${c.accentBorder}` : '3px solid transparent',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${c.border}`,
                    }}
                  >
                    <td style={{ padding: '7px 8px', fontWeight: 700, color: isSelected ? c.accentText : c.text }}>{p.purId}</td>
                    <td style={{ padding: '7px 8px', fontWeight: isSelected ? 700 : 600, color: isSelected ? c.accentText : c.text }}>{p.giaNo}</td>
                    <td style={{ padding: '7px 8px', color: c.muted, fontSize: '10px' }}>{p.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
