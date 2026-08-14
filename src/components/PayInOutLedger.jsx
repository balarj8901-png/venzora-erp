import React, { useState } from 'react';
import { 
  CreditCard, ArrowUpRight, ArrowDownLeft, Plus, 
  Search, Trash2, CheckCircle, UserCheck, DollarSign, Wallet 
} from 'lucide-react';

export default function PayInOutLedger({ payments, parties, purchases, sales, onSavePayment, onDeletePayment }) {
  const [type, setType] = useState('Payment In');
  const [partyId, setPartyId] = useState('');
  const [amountINR, setAmountINR] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState('Bank Transfer (NEFT)');
  const [refNo, setRefNo] = useState('');
  const [remarks, setRemarks] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const selectedParty = parties.find(p => p.id === partyId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!partyId) {
      alert('Please select a party!');
      return;
    }
    if (!amountINR || parseFloat(amountINR) <= 0) {
      alert('Please enter a valid amount!');
      return;
    }

    const newPayment = {
      id: 'PAY-' + Math.floor(1000 + Math.random() * 9000),
      date,
      type,
      partyId,
      partyName: selectedParty?.name || 'Unknown Party',
      amountINR: Math.round(parseFloat(amountINR)),
      mode,
      refNo,
      remarks
    };

    onSavePayment(newPayment);

    // Reset form
    setAmountINR('');
    setRefNo('');
    setRemarks('');
  };

  const filteredPayments = payments.filter(p => 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.refNo && p.refNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalIn = payments.filter(p => p.type === 'Payment In').reduce((acc, p) => acc + p.amountINR, 0);
  const totalOut = payments.filter(p => p.type === 'Payment Out').reduce((acc, p) => acc + p.amountINR, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Payment Received (In)</span>
            <div className="text-xl font-bold font-heading text-emerald-400 mt-0.5">
              ₹{totalIn.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500">Collected from clients</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Payment Paid (Out)</span>
            <div className="text-xl font-bold font-heading text-rose-400 mt-0.5">
              ₹{totalOut.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500">Paid to suppliers/vendors</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Net Cashflow</span>
            <div className="text-xl font-bold font-heading text-cyan-300 mt-0.5">
              ₹{(totalIn - totalOut).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-cyan-500">Net liquidity balance</span>
          </div>
        </div>
      </div>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-cyan-400" />
          New Payment Voucher Entry (PayInOut)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Voucher Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('Payment In')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  type === 'Payment In'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Payment In (Rec)
              </button>
              <button
                type="button"
                onClick={() => setType('Payment Out')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  type === 'Payment Out'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Payment Out (Pay)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Select Party</label>
            <select
              value={partyId}
              onChange={e => setPartyId(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
              required
            >
              <option value="">-- Select Party --</option>
              {parties.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.type} - {p.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Amount (INR ₹)</label>
            <input
              type="number"
              value={amountINR}
              onChange={e => setAmountINR(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono bg-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Payment Mode</label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
            >
              <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="Cash">Cash Account</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Ref / UTR / Cheque No</label>
            <input
              type="text"
              value={refNo}
              onChange={e => setRefNo(e.target.value)}
              placeholder="e.g. NEFT98124012"
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Remarks / Note</label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Part payment for invoice"
              className="w-full glass-input rounded-xl px-3 py-2 text-xs"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <CheckCircle className="w-4 h-4" />
          Save Voucher Entry
        </button>
      </form>

      {/* Transaction History Register Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            Payment Ledger History
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search party or voucher..."
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
                <th className="p-3">Voucher ID / Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Party Name</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Reference No</th>
                <th className="p-3 text-right">Amount (₹)</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500 font-sans">
                    No payment vouchers recorded.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-sans">
                      <div className="font-bold text-white">{p.id}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.date}</div>
                    </td>
                    <td className="p-3 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 w-fit ${
                        p.type === 'Payment In' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {p.type === 'Payment In' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {p.type}
                      </span>
                    </td>
                    <td className="p-3 font-sans font-medium text-slate-200">{p.partyName}</td>
                    <td className="p-3 font-sans">{p.mode}</td>
                    <td className="p-3 text-slate-400">{p.refNo || '-'}</td>
                    <td className={`p-3 text-right font-bold ${p.type === 'Payment In' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {p.type === 'Payment In' ? '+' : '-'}₹{p.amountINR?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onDeletePayment(p.id)}
                        className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete Voucher"
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
