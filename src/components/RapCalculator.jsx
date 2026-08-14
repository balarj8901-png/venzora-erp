import React, { useState, useEffect } from 'react';
import { 
  Calculator, Sparkles, DollarSign, Percent, ArrowRight, Save, 
  ShoppingCart, Tag, Award, Check, RefreshCw
} from 'lucide-react';
import { 
  DIAMOND_SHAPES, DIAMOND_COLORS, DIAMOND_CLARITIES, 
  DIAMOND_CUTS, DIAMOND_FLUORESCENCE, getRapPrice 
} from '../utils/rapMatrixData';

export default function RapCalculator({ usdRate, onAddSaleItem, onAddPurchaseItem }) {
  const [shape, setShape] = useState('BR');
  const [color, setColor] = useState('D');
  const [clarity, setClarity] = useState('VVS1');
  const [carat, setCarat] = useState('0.75');
  const [pcs, setPcs] = useState('1');
  const [cut, setCut] = useState('EX');
  const [fluorescence, setFluorescence] = useState('NONE');
  const [discount, setDiscount] = useState('-18.5');
  const [lotNo, setLotNo] = useState('LOT-' + Math.floor(1000 + Math.random() * 9000));
  const [giaNo, setGiaNo] = useState('');
  const [customRap, setCustomRap] = useState('');

  // Calculations
  const autoRap = getRapPrice(shape, color, clarity, parseFloat(carat) || 0);
  const rapPrice = customRap !== '' ? parseFloat(customRap) || 0 : autoRap;
  
  const discountNum = parseFloat(discount) || 0;
  const ratePerCaratUSD = rapPrice * (1 + discountNum / 100);
  const totalCaratNum = (parseFloat(carat) || 0) * (parseInt(pcs) || 1);
  const totalUSD = ratePerCaratUSD * totalCaratNum;
  const totalINR = totalUSD * usdRate;
  const perPcsINR = totalINR / (parseInt(pcs) || 1);

  const handleReset = () => {
    setShape('BR');
    setColor('D');
    setClarity('VVS1');
    setCarat('0.75');
    setPcs('1');
    setDiscount('-18.5');
    setCustomRap('');
  };

  const handleCreateSale = () => {
    if (onAddSaleItem) {
      onAddSaleItem({
        shape, color, clarity, cut, carat: totalCaratNum.toFixed(2),
        pcs: parseInt(pcs), rapPrice, discount: discountNum,
        ratePerCarat: Math.round(ratePerCaratUSD),
        totalUSD: parseFloat(totalUSD.toFixed(2)),
        totalINR: Math.round(totalINR), lotNo, giaNo
      });
    }
  };

  const handleCreatePurchase = () => {
    if (onAddPurchaseItem) {
      onAddPurchaseItem({
        shape, color, clarity, cut, carat: totalCaratNum.toFixed(2),
        pcs: parseInt(pcs), rapPrice, discount: discountNum,
        ratePerCarat: Math.round(ratePerCaratUSD),
        totalUSD: parseFloat(totalUSD.toFixed(2)),
        totalINR: Math.round(totalINR), lotNo, giaNo
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Input Matrix Form */}
      <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Rapaport Calculator (RapCalc)</h2>
              <p className="text-xs text-slate-400">Live Diamond Valuation & Discount Matrix Engine</p>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Shape Selector Grid */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Diamond Shape (Form)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {DIAMOND_SHAPES.map(s => (
              <button
                key={s.code}
                onClick={() => setShape(s.code)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  shape === s.code
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-lg mb-1">{s.icon}</span>
                <span className="text-xs font-semibold">{s.code}</span>
                <span className="text-[10px] text-slate-500 truncate max-w-full">{s.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Matrix */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Color Grade
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIAMOND_COLORS.slice(0, 11).map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  color === c
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Clarity Matrix */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Clarity Grade (Purity)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIAMOND_CLARITIES.map(cl => (
              <button
                key={cl}
                onClick={() => setClarity(cl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  clarity === cl
                    ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {cl}
              </button>
            ))}
          </div>
        </div>

        {/* Carats & Quantity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Carat / Stone</label>
            <input
              type="number"
              step="0.01"
              value={carat}
              onChange={e => setCarat(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-sm font-mono"
              placeholder="0.75"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Quantity (Pcs)</label>
            <input
              type="number"
              value={pcs}
              onChange={e => setPcs(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-sm font-mono"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Cut Grade</label>
            <select
              value={cut}
              onChange={e => setCut(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-sm bg-slate-900"
            >
              {DIAMOND_CUTS.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Fluorescence</label>
            <select
              value={fluorescence}
              onChange={e => setFluorescence(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-sm bg-slate-900"
            >
              {DIAMOND_FLUORESCENCE.map(fl => (
                <option key={fl} value={fl}>{fl}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Discount & Rap Rates Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-400">Discount % (Back/Less)</label>
              <span className={`text-xs font-bold font-mono ${discountNum <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {discountNum > 0 ? `+${discountNum}%` : `${discountNum}%`}
              </span>
            </div>
            <input
              type="number"
              step="0.5"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              className="w-full glass-input rounded-lg px-3 py-1.5 text-sm font-mono mb-2"
              placeholder="-18.5"
            />
            <input
              type="range"
              min="-80"
              max="20"
              step="0.5"
              value={discount}
              onChange={e => setDiscount(e.target.value)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Rap Price ($/ct) {customRap !== '' && <span className="text-amber-400 text-[10px]">(Custom Override)</span>}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 text-xs font-mono">$</span>
              <input
                type="number"
                value={customRap !== '' ? customRap : autoRap}
                onChange={e => setCustomRap(e.target.value)}
                className="w-full glass-input rounded-lg pl-7 py-1.5 text-sm font-mono text-cyan-300 font-bold"
                placeholder={autoRap.toString()}
              />
            </div>
            <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
              <span>Auto Rap Sheet: <strong className="text-slate-300 font-mono">${autoRap}</strong></span>
              {customRap !== '' && (
                <button onClick={() => setCustomRap('')} className="text-cyan-400 hover:underline text-[10px]">
                  Reset Auto
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Calculation Display Panel */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Main Valuation Summary Card */}
        <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden bg-gradient-to-b from-cyan-950/20 via-slate-900/90 to-slate-950/90">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wide">
              {shape} • {color} / {clarity} • {totalCaratNum.toFixed(2)} Cts
            </span>
            <span className="text-xs font-mono text-slate-400">1 USD = ₹{usdRate}</span>
          </div>

          <div className="mb-6">
            <span className="text-xs text-slate-400 font-medium">Total Amount (INR)</span>
            <div className="text-3xl font-extrabold font-heading text-emerald-400 mt-1">
              ₹{Math.round(totalINR).toLocaleString('en-IN')}
            </div>
            <div className="text-sm font-mono text-cyan-300 mt-0.5">
              ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-slate-800 text-xs mb-6">
            <div>
              <span className="text-slate-500 block mb-0.5">Rap Rate</span>
              <span className="font-mono text-slate-200 font-semibold">${rapPrice} / ct</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Discount (Back)</span>
              <span className={`font-mono font-semibold ${discountNum <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {discountNum}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Net Rate ($/ct)</span>
              <span className="font-mono text-cyan-300 font-semibold">${ratePerCaratUSD.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Price / Piece (INR)</span>
              <span className="font-mono text-amber-300 font-semibold">₹{Math.round(perPcsINR).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleCreateSale}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Sales Invoice
            </button>
            <button
              onClick={handleCreatePurchase}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <Tag className="w-4 h-4 text-emerald-400" />
              Add to Purchase Record
            </button>
          </div>
        </div>

        {/* Lot / Certificate Info Panel */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-xs">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Inventory Tag & Certificate
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Lot / Packet No</label>
              <input
                type="text"
                value={lotNo}
                onChange={e => setLotNo(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">GIA / IGI Report No</label>
              <input
                type="text"
                value={giaNo}
                onChange={e => setGiaNo(e.target.value)}
                className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-mono"
                placeholder="2489012384"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
