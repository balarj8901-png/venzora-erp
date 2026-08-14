import React, { useState } from 'react';
import { 
  Users, Plus, Trash2, Search, Building, Phone, Mail, 
  MapPin, Tag, CheckCircle, Shield 
} from 'lucide-react';
import { DIAMOND_SHAPES, DIAMOND_COLORS, DIAMOND_CLARITIES, DIAMOND_CUTS, CARAT_BRACKETS } from '../utils/rapMatrixData';

export default function MastersManager({ parties, onSaveParty, onDeleteParty }) {
  const [activeTab, setActiveTab] = useState('parties');

  // Party Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Vendor');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Surat');
  const [gst, setGst] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  const handleAddParty = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newParty = {
      id: 'P' + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      type,
      mobile,
      email,
      city,
      gst,
      balance: 0
    };

    onSaveParty(newParty);

    setName('');
    setMobile('');
    setEmail('');
    setGst('');
  };

  const filteredParties = parties.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="glass-panel rounded-2xl p-2 border border-slate-800 flex gap-2">
        <button
          onClick={() => setActiveTab('parties')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'parties'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          Party & Client Directory (EmpMast)
        </button>

        <button
          onClick={() => setActiveTab('diamond')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'diamond'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Tag className="w-4 h-4" />
          Diamond Masters (Form, Color, Cut, Size)
        </button>
      </div>

      {activeTab === 'parties' ? (
        <div className="space-y-6">
          {/* Add Party Form */}
          <form onSubmit={handleAddParty} className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              Add New Party / Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Party / Company Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Venus Gems Surat"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Party Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
                >
                  <option value="Vendor">Vendor (Supplier)</option>
                  <option value="Client">Client (Customer)</option>
                  <option value="Both">Both (Vendor & Client)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">City / Location</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Surat"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="+91 98250 00000"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="info@party.com"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">GSTIN / PAN No</label>
                <input
                  type="text"
                  value={gst}
                  onChange={e => setGst(e.target.value)}
                  placeholder="24AAAAA0000A1Z5"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Save Party Record
            </button>
          </form>

          {/* Party Directory List Table */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                Party Master Directory
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search party by name or city..."
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
                    <th className="p-3">Party Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Mobile & Email</th>
                    <th className="p-3">GSTIN</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredParties.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white">{p.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          p.type === 'Vendor' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{p.city}</td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>{p.mobile || '-'}</div>
                        <div className="text-[10px] text-slate-500">{p.email || '-'}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-400 text-[11px] uppercase">{p.gst || '-'}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteParty(p.id)}
                          className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete Party"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Diamond Masters Lookup Tables */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
              <span>💎</span> Form / Shape Master (FormMast)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {DIAMOND_SHAPES.map(s => (
                <div key={s.code} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-cyan-300">{s.code}</span>
                  <span className="text-slate-400">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
              <span>🎨</span> Color Master (ColMast)
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {DIAMOND_COLORS.map(c => (
                <span key={c} className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-bold text-amber-300">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
              <span>✨</span> Clarity Master (CharMast)
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {DIAMOND_CLARITIES.map(cl => (
                <span key={cl} className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-bold text-indigo-300">
                  {cl}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
              <span>⚖️</span> Carat Size Range Brackets (SizeMast)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {CARAT_BRACKETS.map((b, i) => (
                <div key={i} className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center text-slate-300">
                  {b.label} Cts
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
