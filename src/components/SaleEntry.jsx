import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Plus, Trash2, Search, Printer, FileText, 
  TrendingUp, CheckCircle, Clock, X, Eye, ShieldCheck 
} from 'lucide-react';
import { DIAMOND_SHAPES, DIAMOND_COLORS, DIAMOND_CLARITIES } from '../utils/rapMatrixData';

export default function SaleEntry({ sales, parties, settings, usdRate, onSaveSale, onDeleteSale, prefillItem }) {
  const [clientId, setClientId] = useState(parties.find(p => p.type === 'Client')?.id || '');
  const [invNo, setInvNo] = useState('INV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Item details
  const [lotNo, setLotNo] = useState('LOT-' + Math.floor(1000 + Math.random() * 9000));
  const [giaNo, setGiaNo] = useState('');
  const [shape, setShape] = useState('BR');
  const [color, setColor] = useState('D');
  const [clarity, setClarity] = useState('VVS1');
  const [cut, setCut] = useState('EX');
  const [carat, setCarat] = useState('1.00');
  const [pcs, setPcs] = useState('1');
  const [rapPrice, setRapPrice] = useState('6500');
  const [discount, setDiscount] = useState('-15.0');
  const [paidAmount, setPaidAmount] = useState('0');
  const [costPriceINR, setCostPriceINR] = useState('');
  const [remarks, setRemarks] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [activeInvoiceModal, setActiveInvoiceModal] = useState(null);

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
  const paidNum = parseFloat(paidAmount) || 0;
  const dueINR = Math.max(0, totalINR - paidNum);
  const costNum = parseFloat(costPriceINR) || (totalINR * 0.85); // 15% estimated default margin
  const profitINR = totalINR - costNum;

  const selectedClient = parties.find(p => p.id === clientId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId) {
      alert('Please select a client!');
      return;
    }

    const newSale = {
      id: invNo,
      date,
      partyId: clientId,
      partyName: selectedClient?.name || 'Unknown Client',
      clientMobile: selectedClient?.mobile || '',
      clientCity: selectedClient?.city || '',
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
      paidAmount: paidNum,
      dueAmount: Math.round(dueINR),
      profitMargin: Math.round(profitINR),
      paymentStatus: dueINR <= 0 ? 'Paid' : (paidNum > 0 ? 'Partial' : 'Pending'),
      remarks
    };

    onSaveSale(newSale);

    // Reset form
    setInvNo('INV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900));
    setLotNo('LOT-' + Math.floor(1000 + Math.random() * 9000));
    setGiaNo('');
    setPaidAmount('0');
    setRemarks('');
  };

  const filteredSales = sales.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lotNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSalesINR = sales.reduce((acc, s) => acc + (s.totalINR || 0), 0);
  const totalReceivableINR = sales.reduce((acc, s) => acc + (s.dueAmount || 0), 0);
  const totalProfitINR = sales.reduce((acc, s) => acc + (s.profitMargin || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Sales Revenue</span>
            <div className="text-xl font-bold font-heading text-white mt-0.5">
              ₹{totalSalesINR.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500">{sales.length} Sales Invoices</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Gross Profit</span>
            <div className="text-xl font-bold font-heading text-emerald-400 mt-0.5">
              ₹{totalProfitINR.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-500/80">Realized Profit Margin</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Outstanding Receivables</span>
            <div className="text-xl font-bold font-heading text-amber-400 mt-0.5">
              ₹{totalReceivableINR.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-amber-500/80">Pending Client Dues</span>
          </div>
        </div>
      </div>

      {/* Main Entry Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-cyan-400" />
          New Client Invoice Entry (SaleEnt)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Select Client (Customer)</label>
            <select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
              required
            >
              <option value="">-- Choose Client --</option>
              {parties.filter(p => p.type === 'Client').map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Invoice Number</label>
            <input
              type="text"
              value={invNo}
              onChange={e => setInvNo(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Sale Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono bg-slate-900"
            />
          </div>
        </div>

        {/* Diamond Line Item Details */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 mb-5">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-3">
            Diamond Details & Selling Price
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
              <label className="block text-[11px] text-slate-400 mb-1">Rap Price ($/ct)</label>
              <input
                type="number"
                value={rapPrice}
                onChange={e => setRapPrice(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Sale Disc %</label>
              <input
                type="number"
                step="0.5"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Received Payment (₹)</label>
              <input
                type="number"
                value={paidAmount}
                onChange={e => setPaidAmount(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-400"
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-right">
                <span className="text-[10px] text-slate-500 block">Total Invoice (INR)</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  ₹{Math.round(totalINR).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          Create Sales Invoice
        </button>
      </form>

      {/* Sales Invoices Register Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Sales Register
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search client, invoice or lot..."
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
                <th className="p-3">Invoice / Date</th>
                <th className="p-3">Client Name</th>
                <th className="p-3">Diamond Spec</th>
                <th className="p-3">Carat</th>
                <th className="p-3 text-right">Invoice (₹)</th>
                <th className="p-3 text-right">Profit (₹)</th>
                <th className="p-3 text-right">Due (₹)</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-500 font-sans">
                    No sales invoices found.
                  </td>
                </tr>
              ) : (
                filteredSales.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-sans">
                      <div className="font-bold text-white">{s.id}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{s.date}</div>
                    </td>
                    <td className="p-3 font-sans font-medium text-slate-200">{s.partyName}</td>
                    <td className="p-3 font-sans">
                      <span className="text-cyan-300 font-bold">{s.shape}</span> {s.color}/{s.clarity}
                      <div className="text-[10px] text-slate-500">{s.lotNo} {s.giaNo ? `• GIA ${s.giaNo}` : ''}</div>
                    </td>
                    <td className="p-3">{s.carat} Cts</td>
                    <td className="p-3 text-right font-bold text-white">₹{s.totalINR?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-emerald-400">+₹{s.profitMargin?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right text-amber-400">₹{s.dueAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-center font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        s.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        s.paymentStatus === 'Partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {s.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center font-sans flex items-center justify-center gap-1">
                      <button
                        onClick={() => setActiveInvoiceModal(s)}
                        className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 rounded-lg transition-colors"
                        title="View Printable Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSale(s.id)}
                        className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete Sale"
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

      {/* Printable Invoice Modal */}
      {activeInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-lg text-white font-heading">{settings.companyName}</h3>
                  <p className="text-xs text-slate-400">{settings.city} • {settings.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveInvoiceModal(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="text-slate-500 block mb-1">BILLED TO</span>
                <div className="font-bold text-white text-sm">{activeInvoiceModal.partyName}</div>
                <div className="text-slate-400">{activeInvoiceModal.clientCity}</div>
                <div className="text-slate-400">{activeInvoiceModal.clientMobile}</div>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block mb-1">INVOICE DETAILS</span>
                <div className="font-mono font-bold text-cyan-300 text-sm">{activeInvoiceModal.id}</div>
                <div className="text-slate-400">Date: {activeInvoiceModal.date}</div>
                <div className="text-emerald-400 font-semibold mt-1">Status: {activeInvoiceModal.paymentStatus}</div>
              </div>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-slate-300 font-semibold">
                  <tr>
                    <th className="p-3">Item Spec</th>
                    <th className="p-3">Shape/Color/Clarity</th>
                    <th className="p-3">Carat</th>
                    <th className="p-3">Rate $/ct</th>
                    <th className="p-3 text-right">Total INR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  <tr>
                    <td className="p-3 font-sans">
                      <div>{activeInvoiceModal.lotNo}</div>
                      {activeInvoiceModal.giaNo && <div className="text-[10px] text-slate-500">GIA: {activeInvoiceModal.giaNo}</div>}
                    </td>
                    <td className="p-3">{activeInvoiceModal.shape} • {activeInvoiceModal.color}/{activeInvoiceModal.clarity} ({activeInvoiceModal.cut})</td>
                    <td className="p-3">{activeInvoiceModal.carat} Cts ({activeInvoiceModal.pcs} Pcs)</td>
                    <td className="p-3">${activeInvoiceModal.ratePerCarat}</td>
                    <td className="p-3 text-right font-bold text-white">₹{activeInvoiceModal.totalINR?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-slate-500">
                Authorized Signature • VENZORA ExDim System
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
