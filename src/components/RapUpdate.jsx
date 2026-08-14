import React, { useState } from 'react';
import { 
  RefreshCw, Upload, Database, Search, FileSpreadsheet, 
  CheckCircle, Layers, Filter, Info 
} from 'lucide-react';
import { INITIAL_RAP_SHEETS, DIAMOND_SHAPES, DIAMOND_COLORS, DIAMOND_CLARITIES, CARAT_BRACKETS } from '../utils/rapMatrixData';

export default function RapUpdate() {
  const [selectedShape, setSelectedShape] = useState('BR');
  const [colorFilter, setColorFilter] = useState('D');
  const [clarityFilter, setClarityFilter] = useState('VVS1');
  const [rateSheets, setRateSheets] = useState(INITIAL_RAP_SHEETS);
  const [uploadStatus, setUploadStatus] = useState('');

  const currentSheet = rateSheets[selectedShape] || rateSheets['PS'] || [];

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n');
        const parsed = [];
        lines.forEach(line => {
          const row = line.split(',');
          if (row.length >= 6) {
            parsed.append({
              shape: row[0].strip(),
              clarity: row[1].strip(),
              color: row[2].strip(),
              minCarat: parseFloat(row[3].strip()),
              maxCarat: parseFloat(row[4].strip()),
              price: parseFloat(row[5].strip()),
              date: row[6] ? row[6].strip() : new Date().toLocaleDateString()
            });
          }
        });

        if (parsed.length > 0) {
          setRateSheets(prev => ({
            ...prev,
            [selectedShape]: parsed
          }));
          setUploadStatus(`Successfully imported ${parsed.length} rates for ${selectedShape}!`);
        }
      } catch (err) {
        setUploadStatus('Failed to parse CSV file. Ensure format is: Shape,Clarity,Color,MinCarat,MaxCarat,Price');
      }
    };
    reader.readAsText(file);
  };

  const filteredRates = currentSheet.filter(r => 
    (!colorFilter || r.color === colorFilter) &&
    (!clarityFilter || r.clarity === clarityFilter)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            Rapaport Price Matrix & Updates (RapUpdate)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pre-loaded with official <strong>Pear.csv</strong> (1,562 records) and <strong>Round.csv</strong> (2,046 records).
          </p>
        </div>

        {/* Upload Rate Sheet CSV Button */}
        <label className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center gap-2 cursor-pointer transition-all">
          <Upload className="w-4 h-4" />
          Import New Rate CSV Sheet
          <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
        </label>
      </div>

      {uploadStatus && (
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs rounded-xl flex items-center gap-2">
          <Info className="w-4 h-4" />
          {uploadStatus}
        </div>
      )}

      {/* Shape Selector Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Select Shape Matrix
        </label>
        <div className="flex flex-wrap gap-2">
          {DIAMOND_SHAPES.map(s => (
            <button
              key={s.code}
              onClick={() => setSelectedShape(s.code)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                selectedShape === s.code
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.name} ({s.code})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Color Grade</label>
          <select
            value={colorFilter}
            onChange={e => setColorFilter(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
          >
            {DIAMOND_COLORS.slice(0, 11).map(c => (
              <option key={c} value={c}>{c} Color</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Clarity Grade</label>
          <select
            value={clarityFilter}
            onChange={e => setClarityFilter(e.target.value)}
            className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
          >
            {DIAMOND_CLARITIES.map(cl => (
              <option key={cl} value={cl}>{cl} Clarity</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <div className="text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 font-mono">
            Active Records: <strong className="text-cyan-300">{filteredRates.length} rate brackets</strong>
          </div>
        </div>
      </div>

      {/* Matrix Data Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Shape Code</th>
                <th className="p-3">Color</th>
                <th className="p-3">Clarity</th>
                <th className="p-3">Min Carat</th>
                <th className="p-3">Max Carat</th>
                <th className="p-3 text-right">Rap Price ($/ct)</th>
                <th className="p-3 text-center">Sheet Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRates.slice(0, 100).map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-sans font-bold text-cyan-300">{r.shape}</td>
                  <td className="p-3 font-bold text-amber-300">{r.color}</td>
                  <td className="p-3 font-bold text-indigo-300">{r.clarity}</td>
                  <td className="p-3">{r.minCarat} ct</td>
                  <td className="p-3">{r.maxCarat} ct</td>
                  <td className="p-3 text-right font-bold text-emerald-400 text-sm">${r.price}</td>
                  <td className="p-3 text-center text-slate-500 text-[11px]">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
