import React from 'react';
import { 
  BarChart3, PieChart, TrendingUp, DollarSign, ArrowUpRight, 
  ArrowDownLeft, FileText, Download, Printer 
} from 'lucide-react';

export default function ReportsAnalytics({ purchases, sales, payments, parties }) {
  const totalSalesINR = sales.reduce((acc, s) => acc + (s.totalINR || 0), 0);
  const totalPurchasesINR = purchases.reduce((acc, s) => acc + (s.totalINR || 0), 0);
  const totalProfitINR = sales.reduce((acc, s) => acc + (s.profitMargin || 0), 0);
  const totalReceivableINR = sales.reduce((acc, s) => acc + (s.dueAmount || 0), 0);
  const totalPayableINR = purchases.reduce((acc, p) => acc + (p.dueAmount || 0), 0);

  // Shape Breakdown Summary
  const shapeSummary = sales.reduce((acc, s) => {
    acc[s.shape] = (acc[s.shape] || 0) + (s.totalINR || 0);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Gross Revenue</span>
          <div className="text-2xl font-bold font-heading text-cyan-300 mt-1">
            ₹{totalSalesINR.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-cyan-500 font-mono">{sales.length} Invoices</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Purchase Outflow</span>
          <div className="text-2xl font-bold font-heading text-rose-400 mt-1">
            ₹{totalPurchasesINR.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-500 font-mono">{purchases.length} Orders</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Gross Profit</span>
          <div className="text-2xl font-bold font-heading text-emerald-400 mt-1">
            ₹{totalProfitINR.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-500 font-mono">
            {totalSalesINR > 0 ? ((totalProfitINR / totalSalesINR) * 100).toFixed(1) : 0}% Margin
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Net Receivable Dues</span>
          <div className="text-2xl font-bold font-heading text-amber-400 mt-1">
            ₹{totalReceivableINR.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-500 font-mono">Pending Dues</span>
        </div>
      </div>

      {/* Reports Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales by Diamond Shape */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            Sales Share by Diamond Shape (Form)
          </h3>
          <div className="space-y-3">
            {Object.keys(shapeSummary).length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No sales data logged yet.</p>
            ) : (
              Object.entries(shapeSummary).map(([sh, val]) => {
                const pct = totalSalesINR > 0 ? (val / totalSalesINR) * 100 : 0;
                return (
                  <div key={sh} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="font-bold text-slate-200">{sh} Shape</span>
                      <span className="text-cyan-300">₹{val.toLocaleString('en-IN')} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Financial Outstanding Balance Sheet */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Party Balance Summary (Ledger Dues)
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Total Client Receivables (Inflow Pending)</span>
              <span className="font-bold font-mono text-emerald-400">₹{totalReceivableINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Total Vendor Payables (Outflow Pending)</span>
              <span className="font-bold font-mono text-rose-400">₹{totalPayableINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-cyan-500/20">
              <span className="font-bold text-white">Estimated Liquidity Surplus</span>
              <span className="font-bold font-mono text-cyan-300">₹{(totalReceivableINR - totalPayableINR).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
