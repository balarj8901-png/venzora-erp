import React, { useState } from 'react';
import { Save, RotateCcw, Search, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function PurchaseEntryScreen({ purchases, fieldSettings, usdRate, onSavePurchase, onOpenExport }) {
  const { currentUser, users } = useAuth();
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
  };

  const [isCertified, setIsCertified] = useState(true);
  const [giaNo, setGiaNo] = useState('775604773');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromComp, setFromComp] = useState('Creative Diamond');
  const [fromCountry, setFromCountry] = useState('INDIA');
  const [size, setSize] = useState('1.040');
  const [shape, setShape] = useState('ROUND');
  const [color, setColor] = useState('E');
  const [quality, setQuality] = useState('VVS2');
  const [fluor, setFluor] = useState('NONE');
  const [cut, setCut] = useState('EX');
  const [pol, setPol] = useState('EX');
  const [sym, setSym] = useState('EX');
  const [measurements, setMeasurements] = useState('123');
  const [rap, setRap] = useState('9300.000');
  const [dis, setDis] = useState('0.000');
  const [perCarat, setPerCarat] = useState('108.000');
  const [pcsRate, setPcsRate] = useState('0.000');
  const [less, setLess] = useState('0.000');
  const [finalAmt, setFinalAmt] = useState('112.320');
  const [br, setBr] = useState('1.00');
  const [payDay, setPayDay] = useState('15');
  const [bill, setBill] = useState('CASH');
  const [assignedSalesUser, setAssignedSalesUser] = useState('JAY BALAR');
  const [customRate, setCustomRate] = useState(usdRate ? usdRate.toString() : '87.610');
  const [searchTerm, setSearchTerm] = useState('');

  const fs = fieldSettings?.purchase || {};

  const sizeNum = parseFloat(size) || 0;
  const perCaratNum = parseFloat(perCarat) || 0;
  const lessNum = parseFloat(less) || 0;
  const currentRateNum = parseFloat(customRate) || usdRate || 87.61;
  const calculatedDAmount = (perCaratNum * sizeNum) * (1 - lessNum / 100);
  const calculatedIndINR = calculatedDAmount * currentRateNum;

  const handleClear = () => { setGiaNo(''); setSize(''); setRap('0'); setPerCarat('0'); setLess('0'); };

  const handleSave = (e) => {
    e.preventDefault();
    const newPurchase = {
      purId: Math.floor(1000 + Math.random() * 9000),
      type: isCertified ? 'GIA' : 'LOS',
      giaNo, date, fromComp, fromCountry, shape,
      size: parseFloat(size).toFixed(3),
      color, quality, flor: fluor, cut, pol, sym,
      measurments: measurements,
      coDis: 99.800,
      rap: parseFloat(rap) || 0,
      perCarat: parseFloat(perCarat) || 0,
      pcsRate: parseFloat(pcsRate) || 0,
      less: parseFloat(less) || 0,
      finalAmt: parseFloat(finalAmt) || calculatedDAmount,
      br: parseFloat(br) || 1.0,
      dAmount: parseFloat(calculatedDAmount.toFixed(3)),
      rate: currentRateNum,
      indAmount: parseFloat(calculatedIndINR.toFixed(2)),
      payDay: parseInt(payDay) || 15,
      bill,
      user: currentUser.name,
      assignedSalesUser,
      isCertified, isPay: true, isExport: true
    };
    onSavePurchase(newPurchase);
    alert(`Purchase Entry saved & assigned to: ${assignedSalesUser}!`);
  };

  const filteredPurchases = purchases.filter(p =>
    p.giaNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.fromComp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.shape?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const selectStyle = {
    ...inputStyle,
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
  };

  const labelStyle = { fontSize: '10px', color: c.muted, display: 'block', marginBottom: '2px', fontWeight: 600, fontFamily: 'Inter, sans-serif' };

  const panelStyle = {
    background: c.panel,
    border: `1px solid ${c.border}`,
    borderRadius: '12px',
    padding: '16px',
  };

  const row3 = { display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '8px' };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Form Panel */}
      <div className="lg:w-96 shrink-0 space-y-3" style={panelStyle}>
        {/* Type Toggle */}
        <div className="flex items-center gap-5 pb-2" style={{ borderBottom: `1px solid ${c.border}` }}>
          {[{ label: 'Certified', val: true }, { label: 'Loose', val: false }].map(({ label, val }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer text-xs font-semibold" style={{ color: isCertified === val ? c.accentText : c.muted }}>
              <input type="radio" name="certType" checked={isCertified === val}
                onChange={() => {
                  setIsCertified(val);
                  if (!val) setGiaNo('123'); // Loose → GIA No fixed to '123'
                }}
                style={{ accentColor: c.accentBorder, cursor: 'pointer' }} />
              {label}
            </label>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-2">
          {fs.giaNo !== false && (
            <div style={row3}>
              <label style={labelStyle}>GIA Number:</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={giaNo}
                  onChange={e => isCertified ? setGiaNo(e.target.value) : null}
                  readOnly={!isCertified}
                  style={{
                    ...inputStyle,
                    color: !isCertified ? c.muted : c.text,
                    cursor: !isCertified ? 'not-allowed' : 'text',
                    fontWeight: !isCertified ? 700 : 500,
                  }}
                />
                {!isCertified && (
                  <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px', color: c.accentText, fontWeight: 700 }}>FIXED</span>
                )}
              </div>
            </div>
          )}
          {fs.date !== false && (
            <div style={row3}>
              <label style={labelStyle}>Date:</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
            </div>
          )}
          {fs.fromComp !== false && (
            <div style={row3}>
              <label style={labelStyle}>From Comp:</label>
              <select value={fromComp} onChange={e => setFromComp(e.target.value)} style={selectStyle}>
                {['Creative Diamond','pragani Diamond','RADHE SWAMI GEMS','VEER KRUPA GEMS','HARIKRISHNA EXPORTS','SITARAM GEMS'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}
          {fs.fromCountry !== false && (
            <div style={row3}>
              <label style={labelStyle}>From Country:</label>
              <input type="text" value={fromCountry} onChange={e => setFromCountry(e.target.value)} style={inputStyle} />
            </div>
          )}
          {fs.sizeCarat !== false && (
            <div style={row3}>
              <label style={labelStyle}>Size & Carat:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <input type="text" value={size} onChange={e => setSize(e.target.value)} placeholder="Size" style={{ ...inputStyle, fontWeight: 700, color: c.accentText }} />
                <input type="text" value={size} readOnly placeholder="Carat" style={{ ...inputStyle, color: c.muted, cursor: 'not-allowed' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div>
              <label style={labelStyle}>Shape:</label>
              <select value={shape} onChange={e => setShape(e.target.value)} style={selectStyle}>
                {['ROUND','PEAR','OVAL','EMERALD','TRIANGLE','MARQUISE','RADIANT','ASSCHER'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Color:</label>
              <select value={color} onChange={e => setColor(e.target.value)} style={selectStyle}>
                {['D','E','F','G','H','I','J','K','DEF'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div>
              <label style={labelStyle}>Quality:</label>
              <select value={quality} onChange={e => setQuality(e.target.value)} style={selectStyle}>
                {['IF','VVS1','VVS2','VS1','VS2','SI1','SI2','VVS VS'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fluor.:</label>
              <select value={fluor} onChange={e => setFluor(e.target.value)} style={selectStyle}>
                {['NONE','FAINT','MEDIUM','STRONG'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
            {[{ label: 'Cut', val: cut, set: setCut }, { label: 'Pol', val: pol, set: setPol }, { label: 'Sym', val: sym, set: setSym }].map(({ label, val, set }) => (
              <div key={label}>
                <label style={labelStyle}>{label}:</label>
                <select value={val} onChange={e => set(e.target.value)} style={selectStyle}>
                  {['EX','VG','G','ID'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={row3}>
            <label style={labelStyle}>Measurements:</label>
            <input type="text" value={measurements} onChange={e => setMeasurements(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div><label style={labelStyle}>Rap ($):</label>
              <input type="text" value={rap} onChange={e => setRap(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Dis (%):</label>
              <input type="text" value={dis} onChange={e => setDis(e.target.value)} style={inputStyle} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div><label style={labelStyle}>PerCarat ($):</label>
              <input type="text" value={perCarat} onChange={e => setPerCarat(e.target.value)} style={{ ...inputStyle, color: c.accentText, fontWeight: 700 }} /></div>
            <div><label style={labelStyle}>$Pcs Rate:</label>
              <input type="text" value={pcsRate} onChange={e => setPcsRate(e.target.value)} style={inputStyle} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div><label style={labelStyle}>Less (%):</label>
              <input type="text" value={less} onChange={e => setLess(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>$Amount (Auto):</label>
              <input type="text" value={calculatedDAmount.toFixed(3)} readOnly style={{ ...inputStyle, color: c.accentText, fontWeight: 700, cursor: 'not-allowed' }} /></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div><label style={labelStyle}>Bill:</label>
              <select value={bill} onChange={e => setBill(e.target.value)} style={selectStyle}>
                {['CASH','CHEQUE','NEFT','CREDIT'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>Pay Day:</label>
              <input type="text" value={payDay} onChange={e => setPayDay(e.target.value)} style={inputStyle} /></div>
          </div>

          {/* Dollar Rate ($1 = ₹) Manual Override Input */}
          <div style={row3}>
            <label style={{ ...labelStyle, color: c.accentText, fontWeight: 700 }}>$1 = ₹ Rate (Manual):</label>
            <input
              type="number"
              step="0.01"
              value={customRate}
              onChange={e => setCustomRate(e.target.value)}
              placeholder="e.g. 87.61"
              style={{ ...inputStyle, color: c.accentText, fontWeight: 700, borderColor: c.accentBorder }}
            />
          </div>

          {/* INR Amount Display */}
          <div className="p-2 rounded-lg text-xs font-mono flex items-center justify-between" style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>
            <span style={{ color: c.muted, fontSize: '10px' }}>₹ Amount (@ ₹{currentRateNum}): </span>
            <span style={{ fontWeight: 700, color: c.accentText, fontSize: '13px' }}>₹{calculatedIndINR.toFixed(2)}</span>
          </div>

          <div style={row3}>
            <label style={labelStyle}>Assign Sales Rep:</label>
            <select value={assignedSalesUser} onChange={e => setAssignedSalesUser(e.target.value)} style={{ ...selectStyle, fontWeight: 700, color: c.accentText }}>
              {users.filter(u => u.role === 'Sales Exec' || u.role === 'Admin').map(u => (
                <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <div style={row3}>
            <label style={labelStyle}>User:</label>
            <input type="text" value={currentUser.name} readOnly style={{ ...inputStyle, color: c.muted, cursor: 'not-allowed', textTransform: 'uppercase' }} />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: c.accent, color: '#f0ebe8', border: `1px solid ${c.accentBorder}` }}>
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button type="button" onClick={handleClear} className="flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: c.inputBg, color: c.muted, border: `1px solid ${c.inputBorder}` }}>
              <RotateCcw className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </form>
      </div>

      {/* Right Data Grid Panel */}
      <div className="flex-1" style={panelStyle}>
        <div className="flex items-center justify-between gap-4 mb-3">
          <h3 className="text-sm font-bold font-heading" style={{ color: c.text }}>Purchase Entry Register</h3>
          <div className="flex items-center gap-2">
            {onOpenExport && (
              <button
                type="button"
                onClick={onOpenExport}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 flex items-center gap-1.5 cursor-pointer transition-all shadow"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Export
              </button>
            )}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5" style={{ color: c.muted }} />
              <input
                type="text"
                placeholder="Search GIA, Company, Shape..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '30px', fontFamily: 'Inter, sans-serif', borderRadius: '8px' }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${c.border}` }}>
          <table className="w-full text-left text-[11px] font-mono" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ background: c.headBg, position: 'sticky', top: 0 }}>
              <tr>
                {['TYPE','GIA No','Date','From Name','Shape','Size','Color','Quality','Flor.','Cut','Pol.','Sym.','Measur','Rap','PerCarat','DAmount','$ Rate','₹ Amount','Assigned To'].map(h => (
                  <th key={h} style={{ padding: '8px', color: c.muted, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', borderBottom: `1px solid ${c.border}`, whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((p, i) => (
                <tr key={p.purId} style={{
                  background: i % 2 === 0 ? c.panel : c.rowBg,
                  borderBottom: `1px solid ${c.border}`,
                  transition: 'background 0.15s',
                }}>
                  <td style={{ padding: '7px 8px', fontWeight: 700, color: c.accentText, whiteSpace: 'nowrap' }}>{p.type}</td>
                  <td style={{ padding: '7px 8px', fontWeight: 700, color: c.text, whiteSpace: 'nowrap' }}>{p.giaNo}</td>
                  <td style={{ padding: '7px 8px', color: c.muted, whiteSpace: 'nowrap' }}>{p.date}</td>
                  <td style={{ padding: '7px 8px', color: c.text, fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap' }}>{p.fromComp}</td>
                  <td style={{ padding: '7px 8px', fontWeight: 700, color: c.accentText }}>{p.shape}</td>
                  <td style={{ padding: '7px 8px', fontWeight: 700, color: c.text }}>{p.size}</td>
                  <td style={{ padding: '7px 8px', color: c.text }}>{p.color}</td>
                  <td style={{ padding: '7px 8px', color: c.text }}>{p.quality}</td>
                  <td style={{ padding: '7px 8px', color: c.muted }}>{p.flor}</td>
                  <td style={{ padding: '7px 8px', color: c.text }}>{p.cut}</td>
                  <td style={{ padding: '7px 8px', color: c.text }}>{p.pol}</td>
                  <td style={{ padding: '7px 8px', color: c.text }}>{p.sym}</td>
                  <td style={{ padding: '7px 8px', color: c.muted }}>{p.measurments}</td>
                  <td style={{ padding: '7px 8px', color: c.text }}>${p.rap}</td>
                  <td style={{ padding: '7px 8px', fontWeight: 700, color: c.accentText }}>${p.perCarat}</td>
                  <td style={{ padding: '7px 8px', fontWeight: 700, color: c.accentText, textAlign: 'right' }}>${p.dAmount}</td>
                  <td style={{ padding: '7px 8px', fontWeight: 700, color: c.accentText, textAlign: 'right' }}>₹{p.rate || usdRate}</td>
                  <td style={{ padding: '7px 8px', fontWeight: 700, color: c.text, textAlign: 'right' }}>₹{p.indAmount?.toLocaleString() || Math.round((p.dAmount || 0) * (p.rate || usdRate)).toLocaleString()}</td>
                  <td style={{ padding: '7px 8px', color: c.muted, fontFamily: 'Inter, sans-serif', fontSize: '10px', whiteSpace: 'nowrap' }}>{p.assignedSalesUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
