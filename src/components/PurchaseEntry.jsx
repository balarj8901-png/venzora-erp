import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Plus, Trash2, Calendar, User, DollarSign, 
  Search, ArrowDownRight, CheckCircle, Clock, FileText 
} from 'lucide-react';
import { DIAMOND_SHAPES, DIAMOND_COLORS, DIAMOND_CLARITIES, DIAMOND_CUTS } from '../utils/rapMatrixData';

export default function PurchaseEntry({ purchases, parties, usdRate, onSavePurchase, onDeletePurchase, prefillItem }) {
  const [vendorId, setVendorId] = useState(parties.find(p => p.type === 'Vendor')?.id || '');
  const [billNo, setBillNo] = useState('PUR-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  
  // Item details
  const [lotNo, setLotNo] = useState('LOT-' + Math.floor(1000 + Math.random() * 9000));
  const [giaNo, setGiaNo] = useState('');
  const [shape, setShape] = useState('BR');
  const [color, setColor] = useState('D');
  const [clarity, setClarity] = useState('VVS1');
  const [cut, setCut] = useState('EX');
  const [carat, setCarat] = useState('0.75');
  const [pcs, setPcs] = useState('1');
  const [rapPrice, setRapPrice] = useState('4200');
  const [discount, setDiscount] = useState('-18.5');
  const [advancePaid, setAdvancePaid] = useState('0');

  const [searchTerm, setSearchTerm] = useState('');

  // Prefill if passed from RapCalculator
  useEffect(() => {
    if (prefillItem) {
      if (prefillItem.shape) setShape(prefillItem.shape);
      if (prefillItem.color) setColor(prefillItem.color);
      if (prefillItem.clarity) setClarity(prefillItem.clarity);
      if (prefillItem.cut) setCut(prefillItem.cut);
      if (prefillItem.carat) setCarat(prefillItem.carat.toString());
      if (prefillItem.pcs) setPcs(prefillItem.pcs.toString());
      if (prefillItem.rapPrice) setRapPrice(prefillItem.rapPrice.toString());
      if (prefillItem.discount) setDiscount(prefillItem.discount.toString());
      if (prefillItem.lotNo) setLotNo(prefillItem.lotNo);
      if (prefillItem.giaNo) setGiaNo(prefillItem.giaNo);
    }
  }, [prefillItem]);

  // Calculations
  const rapNum = parseFloat(rapPrice) || 0;
  const discNum = parseFloat(discount) || 0;
  const rateUSD = rapNum * (1 + discNum / 100);
  const totalCts = (parseFloat(carat) || 0) * (parseInt(pcs) || 1);
  const totalUSD = rateUSD * totalCts;
  const totalINR = totalUSD * usdRate;
  const advanceNum = parseFloat(advancePaid) || 0;
  const dueINR = Math.max(0, totalINR - advanceNum);

  const selectedVendor = parties.find(p => p.id === vendorId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorId) {
      alert('Please select a vendor!');
      return;
    }

    const newPurchase = {
      id: billNo,
      date,
      partyId: vendorId,
      partyName: selectedVendor?.name || 'Unknown Vendor',
      lotNo,
      giaNo,
      shape,
      color,
      clarity,
      cut,
      carat: totalCts.toFixed(2),
      pcs: parseInt(pcs) || 1,
      rapPrice: rapNum,
      discount: discNum,
      ratePerCarat: Math.round(rateUSD),
      totalUSD: parseFloat(totalUSD.toFixed(2)),
      totalINR: Math.round(totalINR),
      advancePaid: advanceNum,
      dueAmount: Math.round(dueINR),
      dueDate,
      status: dueINR <= 0 ? 'Paid' : (advanceNum > 0 ? 'Partial' : 'Pending')
    };

    onSavePurchase(newPurchase);
    
    // Reset form
    setBillNo('PUR-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900));
    setLotNo('LOT-' + Math.floor(1000 + Math.random() * 9000));
    setGiaNo('');
    setAdvancePaid('0');
  };

  const filteredPurchases = purchases.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.lotNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPurchasesINR = purchases.reduce((acc, p) => acc + (p.totalINR || 0), 0);
  const totalDueINR = purchases.reduce((acc, p) => acc + (p.dueAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Purchase Volume</span>
            <div className="text-xl font-bold font-heading text-white mt-0.5">
              ₹{totalPurchasesINR.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500">{purchases.length} Purchase Invoices</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Outstanding Vendor Dues</span>
            <div className="text-xl font-bold font-heading text-amber-400 mt-0.5">
              ₹{totalDueINR.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-amber-500/80">Payable to suppliers</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium font-mono">LIVE USD RATE</span>
            <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
              1 USD = ₹{usdRate}
            </div>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Active Stock Import
          </span>
        </div>
      </div>

      {/* Main Entry Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" />
          New Purchase Order Entry (PurEnt)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Select Vendor (Supplier)</label>
            <select
              value={vendorId}
              onChange={e => setVendorId(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
              required
            >
              <option value="">-- Choose Vendor --</option>
              {parties.filter(p => p.type === 'Vendor').map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Invoice / Bill No</label>
            <input
              type="text"
              value={billNo}
              onChange={e => setBillNo(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Purchase Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Payment Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono bg-slate-900"
            />
          </div>
        </div>

        {/* Diamond Line Item Details */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 mb-5">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-3">
            Diamond Specifications & Pricing
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Lot / Packet No</label>
              <input
                type="text"
                value={lotNo}
                onChange={e => setLotNo(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">GIA Cert No</label>
              <input
                type="text"
                value={giaNo}
                onChange={e => setGiaNo(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono"
                placeholder="2489012384"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Shape</label>
              <select
                value={shape}
                onChange={e => setShape(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs bg-slate-900"
              >
                {DIAMOND_SHAPES.map(s => <option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Color</label>
              <select
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs bg-slate-900"
              >
                {DIAMOND_COLORS.slice(0, 11).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Clarity</label>
              <select
                value={clarity}
                onChange={e => setClarity(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs bg-slate-900"
              >
                {DIAMOND_CLARITIES.map(cl => <option key={cl} value={cl}>{cl}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Carat / Stone</label>
              <input
                type="number"
                step="0.01"
                value={carat}
                onChange={e => setCarat(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Rap Rate ($/ct)</label>
              <input
                type="number"
                value={rapPrice}
                onChange={e => setRapPrice(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Discount %</label>
              <input
                type="number"
                step="0.5"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Advance Paid (INR ₹)</label>
              <input
                type="number"
                value={advancePaid}
                onChange={e => setAdvancePaid(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400"
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-right">
                <span className="text-[10px] text-slate-500 block">Calculated Total</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  ₹{Math.round(totalINR).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          Save Purchase Record
        </button>
      </form>

      {/* Existing Purchases Records Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Purchase Register
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search vendor, bill or lot..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Bill ID / Date</th>
                <th className="p-3">Vendor Name</th>
                <th className="p-3">Lot & Spec</th>
                <th className="p-3">Carat</th>
                <th className="p-3">Net $/ct</th>
                <th className="p-3 text-right">Total Amount (₹)</th>
                <th className="p-3 text-right">Due Amount (₹)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500 font-sans">
                    No purchase records found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-sans">
                      <div className="font-bold text-white">{p.id}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.date}</div>
                    </td>
                    <td className="p-3 font-sans font-medium text-slate-200">{p.partyName}</td>
                    <td className="p-3 font-sans">
                      <span className="text-cyan-300 font-bold">{p.shape}</span> {p.color}/{p.clarity} ({p.cut})
                      <div className="text-[10px] text-slate-500">{p.lotNo} {p.giaNo ? `• GIA ${p.giaNo}` : ''}</div>
                    </td>
                    <td className="p-3">{p.carat} Cts ({p.pcs} Pcs)</td>
                    <td className="p-3 text-cyan-400">${p.ratePerCarat}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">₹{p.totalINR?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-amber-400">₹{p.dueAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        p.status === 'Partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onDeletePurchase(p.id)}
                        className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete Purchase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
