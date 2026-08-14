import React, { useState } from 'react';
import { 
  Settings, ToggleLeft, ToggleRight, Shield, Percent, UserPlus, 
  Trash2, Edit3, X, Check, Globe, Activity, LogOut, History, Search, Filter, ShieldCheck, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { DEFAULT_FIELD_SETTINGS } from '../utils/fieldSettings';

export default function SettingsScreen({ fieldSettings, onSaveFieldSettings, usdRate, onSaveUsdRate }) {
  const { 
    currentUser, users, sessions, auditLogs, addUser, removeUser, 
    updateUserPermissions, terminateSession 
  } = useAuth();
  const { theme } = useTheme();
  const [settings, setSettings] = useState(fieldSettings || DEFAULT_FIELD_SETTINGS);
  const [rateInput, setRateInput] = useState(usdRate.toString());

  // Modal State for Adding New User
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Sales Exec');
  const [newUserAvatar, setNewUserAvatar] = useState('💼');
  const [newUserCommRate, setNewUserCommRate] = useState('2.0');
  const [newUserPerms, setNewUserPerms] = useState({
    canPurchase: false,
    canSale: true,
    canSaleRpt: false,
    canSettings: false
  });

  // Modal / Editing State for User Credentials
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Audit Logs Filter State
  const [auditSearch, setAuditSearch] = useState('');
  const [auditModuleFilter, setAuditModuleFilter] = useState('ALL');

  const isDark = theme === 'dark';

  const c = {
    text: isDark ? '#f0ebe8' : '#1a0a0a',
    muted: isDark ? '#9A7070' : '#7a5050',
    panel: isDark ? '#12080A' : '#ffffff',
    border: isDark ? '#2D1515' : '#e8d8d0',
    rowBg: isDark ? '#1A0A0A' : '#fdf8f6',
    inputBg: isDark ? '#1E0D0D' : '#fdf8f6',
    inputBorder: isDark ? '#3D1A1A' : '#c8a898',
    accent: '#5C1A1A',
    accentLight: isDark ? '#2D1010' : '#fdf0ee',
    accentText: isDark ? '#E8A0A0' : '#5C1A1A',
    accentBorder: '#8B3030',
  };

  const panelStyle = {
    background: c.panel,
    border: `1px solid ${c.border}`,
    borderRadius: '14px',
    padding: '20px',
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 16px rgba(60,14,14,0.05)'
  };

  const inputStyle = {
    background: c.inputBg,
    border: `1px solid ${c.inputBorder}`,
    color: c.text,
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '12px',
    fontWeight: 600,
    outline: 'none',
    fontFamily: 'Inter, sans-serif'
  };

  const togglePurchaseField = (key) => {
    const updated = { ...settings, purchase: { ...settings.purchase, [key]: !settings.purchase[key] } };
    setSettings(updated);
    onSaveFieldSettings(updated);
  };

  const toggleSaleField = (key) => {
    const updated = { ...settings, sale: { ...settings.sale, [key]: !settings.sale[key] } };
    setSettings(updated);
    onSaveFieldSettings(updated);
  };

  const handleRolePreset = (role) => {
    setNewUserRole(role);
    if (role === 'Admin') {
      setNewUserAvatar('👑');
      setNewUserPerms({ canPurchase: true, canSale: true, canSaleRpt: true, canSettings: true });
    } else if (role === 'Purchase Exec') {
      setNewUserAvatar('🛒');
      setNewUserPerms({ canPurchase: true, canSale: false, canSaleRpt: false, canSettings: false });
    } else if (role === 'Sales Exec') {
      setNewUserAvatar('💼');
      setNewUserPerms({ canPurchase: false, canSale: true, canSaleRpt: false, canSettings: false });
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) { alert('Please enter user name!'); return; }
    addUser({
      name: newUserName.trim().toUpperCase(),
      email: newUserEmail.trim() || `${newUserName.trim().toLowerCase().replace(/\s+/g, '')}@venzora.com`,
      role: newUserRole,
      avatar: newUserAvatar,
      commissionRate: parseFloat(newUserCommRate) || 0,
      ...newUserPerms
    });
    setNewUserName('');
    setNewUserEmail('');
    setShowAddModal(false);
    alert(`User "${newUserName.toUpperCase()}" created successfully!`);
  };

  const startEditUser = (u) => {
    setEditingUserId(u.id);
    setEditName(u.name);
    setEditEmail(u.email || '');
    setEditRole(u.role);
    setEditAvatar(u.avatar || '👤');
  };

  const saveEditUser = (userId) => {
    updateUserPermissions(userId, {
      name: editName.trim().toUpperCase(),
      email: editEmail.trim(),
      role: editRole,
      avatar: editAvatar
    });
    setEditingUserId(null);
  };

  const handleDeleteUser = (u) => {
    if (confirm(`Are you sure you want to remove user "${u.name}"?`)) {
      removeUser(u.id);
    }
  };

  const filteredLogs = auditLogs.filter(l => {
    const matchModule = auditModuleFilter === 'ALL' || l.module === auditModuleFilter;
    const matchText = !auditSearch.trim() || 
      l.userName?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.details?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.action?.toLowerCase().includes(auditSearch.toLowerCase()) ||
      l.module?.toLowerCase().includes(auditSearch.toLowerCase());
    return matchModule && matchText;
  });

  return (
    <div className="space-y-5 w-full font-sans">

      {/* Top Config Bar */}
      <div style={panelStyle} className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold font-heading flex items-center gap-2" style={{ color: c.text }}>
            <Settings className="w-4 h-4" style={{ color: c.accentBorder }} />
            System Configuration
          </h2>
          <p className="text-[11px] mt-0.5" style={{ color: c.muted }}>
            Manage user accounts, credentials, 2FA Gmail security, active sessions, audit logs, and exchange rates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold" style={{ color: c.muted }}>$1 = ₹ Rate:</label>
          <input
            type="number"
            step="0.1"
            value={rateInput}
            onChange={e => { setRateInput(e.target.value); onSaveUsdRate(parseFloat(e.target.value) || 86.5); }}
            style={{ ...inputStyle, width: '80px', textAlign: 'center', color: c.accentText }}
          />
        </div>
      </div>

      {/* User Management & Credentials */}
      <div style={panelStyle} className="space-y-4">
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${c.border}` }}>
          <div>
            <h3 className="text-sm font-bold font-heading flex items-center gap-2" style={{ color: c.text }}>
              <Shield className="w-4 h-4" style={{ color: c.accentBorder }} />
              User Credentials & Access Management
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: c.muted }}>Create, edit credentials, or remove system users</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: c.accent, color: '#f0ebe8', border: `1px solid ${c.accentBorder}` }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add New User
          </button>
        </div>

        {/* User Cards List */}
        <div className="space-y-2.5">
          {users.map(u => {
            const isEditing = editingUserId === u.id;
            return (
              <div key={u.id} className="p-3.5 rounded-xl transition-all"
                style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>
                {isEditing ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2" style={{ borderBottom: `1px solid ${c.border}` }}>
                      <span className="text-xs font-bold" style={{ color: c.accentText }}>Edit Credentials: {u.name}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => saveEditUser(u.id)} className="px-2.5 py-1 rounded bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer">
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button onClick={() => setEditingUserId(null)} className="px-2.5 py-1 rounded bg-slate-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer">
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold block" style={{ color: c.muted }}>Avatar:</label>
                        <select value={editAvatar} onChange={e => setEditAvatar(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                          {['👑','🛒','📦','💼','🏷️','👤','⚡','💎'].map(a => <option key={a} value={a}>{a} {a}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold block" style={{ color: c.muted }}>Full Name:</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold block" style={{ color: c.muted }}>Email Address:</label>
                        <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold block" style={{ color: c.muted }}>Role:</label>
                        <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                          {['Admin','Purchase Exec','Sales Exec','Custom'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <span className="text-2xl">{u.avatar}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold" style={{ color: c.text }}>{u.name}</span>
                          {currentUser.id === u.id && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-100 font-bold">YOU</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: c.accentLight, color: c.accentText, border: `1px solid ${c.accentBorder}` }}>
                            {u.role}
                          </span>
                          <span className="text-[10px] flex items-center gap-1" style={{ color: c.muted }}>
                            <Mail className="w-2.5 h-2.5" /> {u.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Checkboxes */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold" style={{ color: c.muted }}>
                      {[
                        { key: 'canPurchase', label: 'Purchase Entry' },
                        { key: 'canSale', label: 'Sale Entry' },
                        { key: 'canSaleRpt', label: 'SaleRpt' },
                        { key: 'canSettings', label: 'Settings' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={u[key] !== false}
                            onChange={e => updateUserPermissions(u.id, { [key]: e.target.checked })}
                            className="w-3.5 h-3.5 cursor-pointer rounded"
                            style={{ accentColor: c.accentBorder }}
                          />
                          <span style={{ color: u[key] !== false ? c.text : c.muted }}>{label}</span>
                        </label>
                      ))}
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => startEditUser(u)}
                        title="Edit Credentials"
                        className="p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-80"
                        style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text }}
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u)}
                        disabled={currentUser.id === u.id}
                        title={currentUser.id === u.id ? "Cannot delete currently logged-in user" : "Remove User"}
                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-opacity ${
                          currentUser.id === u.id ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                        }`}
                        style={{ background: isDark ? '#2D0A0A' : '#fee2e2', border: `1px solid ${c.accentBorder}`, color: '#991b1b' }}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Login Sessions (Admin Security & Remote Logout) */}
      <div style={panelStyle} className="space-y-4">
        <div className="pb-3" style={{ borderBottom: `1px solid ${c.border}` }}>
          <h3 className="text-sm font-bold font-heading flex items-center gap-2" style={{ color: c.text }}>
            <Globe className="w-4 h-4" style={{ color: c.accentBorder }} />
            Active Login Sessions & Device Management
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: c.muted }}>
            Admin control to monitor live user logins and remotely terminate / log out sessions
          </p>
        </div>

        <div className="space-y-2">
          {sessions.map(s => {
            const isActive = s.status === 'ACTIVE';
            return (
              <div key={s.id} className="p-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: isActive ? '#064e3b' : '#334155', color: '#f8fafc' }}>
                    {s.userName ? s.userName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: c.text }}>{s.userName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: c.inputBg, color: c.muted }}>
                        {s.role}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono mt-0.5 flex items-center gap-2" style={{ color: c.muted }}>
                      <span>IP: {s.ip}</span> • <span>Device: {s.device}</span> • <span>Time: {new Date(s.loginTime).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {s.status}
                  </span>

                  {isActive && (
                    <button
                      onClick={() => terminateSession(s.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <LogOut className="w-3 h-3" /> Terminate Session
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Audit Logs & Entry Change History */}
      <div style={panelStyle} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3" style={{ borderBottom: `1px solid ${c.border}` }}>
          <div>
            <h3 className="text-sm font-bold font-heading flex items-center gap-2" style={{ color: c.text }}>
              <History className="w-4 h-4" style={{ color: c.accentBorder }} />
              System Audit Logs & Entry History
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: c.muted }}>
              Full timeline of all user actions, entry creations, permission updates, and login events
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={auditModuleFilter}
              onChange={e => setAuditModuleFilter(e.target.value)}
              style={{ ...inputStyle, width: '130px' }}
            >
              <option value="ALL">All Modules</option>
              <option value="Purchase Entry">Purchase Entry</option>
              <option value="Sale Entry">Sale Entry</option>
              <option value="Authentication">Authentication</option>
              <option value="User Management">User Management</option>
              <option value="Settings">Settings</option>
            </select>

            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5" style={{ color: c.muted }} />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '28px', width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Audit Logs Register Table */}
        <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${c.border}` }}>
          <table className="w-full text-left text-[11px] font-mono" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ background: c.rowBg, borderBottom: `1px solid ${c.border}` }}>
              <tr>
                {['Timestamp', 'User', 'Role', 'Module', 'Action', 'Log Details', 'IP Address'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', color: c.muted, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((l, i) => (
                <tr key={l.id} style={{ background: i % 2 === 0 ? c.panel : c.rowBg, borderBottom: `1px solid ${c.border}` }}>
                  <td style={{ padding: '7px 10px', color: c.muted, whiteSpace: 'nowrap' }}>
                    {new Date(l.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '7px 10px', fontWeight: 700, color: c.text, whiteSpace: 'nowrap' }}>
                    {l.userName}
                  </td>
                  <td style={{ padding: '7px 10px', color: c.muted, whiteSpace: 'nowrap' }}>
                    {l.userRole}
                  </td>
                  <td style={{ padding: '7px 10px', fontWeight: 600, color: c.accentText, whiteSpace: 'nowrap' }}>
                    {l.module}
                  </td>
                  <td style={{ padding: '7px 10px', whiteSpace: 'nowrap' }}>
                    <span className="px-2 py-0.5 rounded font-bold text-[9px] uppercase"
                      style={{ background: c.inputBg, color: c.text, border: `1px solid ${c.inputBorder}` }}>
                      {l.action}
                    </span>
                  </td>
                  <td style={{ padding: '7px 10px', color: c.text, fontFamily: 'Inter, sans-serif' }}>
                    {l.details}
                  </td>
                  <td style={{ padding: '7px 10px', color: c.muted, whiteSpace: 'nowrap' }}>
                    {l.ip}
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-xs" style={{ color: c.muted }}>
                    No audit log records match your filter search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Person Commission Rates */}
      <div style={panelStyle} className="space-y-4">
        <div className="pb-3" style={{ borderBottom: `1px solid ${c.border}` }}>
          <h3 className="text-sm font-bold font-heading flex items-center gap-2" style={{ color: c.text }}>
            <Percent className="w-4 h-4" style={{ color: c.accentBorder }} />
            Sales Person Commission Rates (% of Profit)
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: c.muted }}>
            Set commission percentage calculated on <strong>PROFIT</strong> (Sale Amount − Purchase Amount) for each Sales Executive
          </p>
        </div>

        <div className="space-y-2">
          {users.filter(u => u.canSale !== false).map(u => (
            <div key={u.id} className="flex items-center justify-between p-3.5 rounded-xl"
              style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{u.avatar}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: c.text }}>{u.name}</div>
                  <span className="text-[10px]" style={{ color: c.muted }}>{u.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold" style={{ color: c.muted }}>Commission Rate:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={u.commissionRate ?? 0}
                    onChange={e => updateUserPermissions(u.id, { commissionRate: parseFloat(e.target.value) || 0 })}
                    style={{ ...inputStyle, width: '70px', textAlign: 'center', color: c.accentText }}
                  />
                  <span className="text-sm font-bold" style={{ color: c.accentText }}>%</span>
                </div>

                <div className="text-[10px] px-2.5 py-1 rounded-lg" style={{ background: c.accentLight, color: c.accentText, border: `1px solid ${c.accentBorder}` }}>
                  Example: $100 Buy, $150 Sell (<strong>$50 Profit</strong>) → Commission: <strong>${(((u.commissionRate ?? 0) * 50) / 100).toFixed(2)}</strong> ({u.commissionRate ?? 0}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Visibility Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Purchase Fields */}
        <div style={panelStyle} className="space-y-4">
          <h3 className="text-sm font-bold font-heading pb-2" style={{ color: c.text, borderBottom: `1px solid ${c.border}` }}>
            Purchase Entry — Field Visibility
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(settings.purchase).map(key => {
              const on = settings.purchase[key];
              return (
                <button key={key} onClick={() => togglePurchaseField(key)}
                  className="p-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer text-xs font-semibold"
                  style={on
                    ? { background: c.accentLight, border: `1px solid ${c.accentBorder}`, color: c.accentText }
                    : { background: c.rowBg, border: `1px solid ${c.border}`, color: c.muted }
                  }>
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  {on
                    ? <ToggleRight className="w-4 h-4 flex-shrink-0" style={{ color: c.accentBorder }} />
                    : <ToggleLeft className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sale Fields */}
        <div style={panelStyle} className="space-y-4">
          <h3 className="text-sm font-bold font-heading pb-2" style={{ color: c.text, borderBottom: `1px solid ${c.border}` }}>
            Sale Entry — Field Visibility
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(settings.sale).map(key => {
              const on = settings.sale[key];
              return (
                <button key={key} onClick={() => toggleSaleField(key)}
                  className="p-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer text-xs font-semibold"
                  style={on
                    ? { background: c.accentLight, border: `1px solid ${c.accentBorder}`, color: c.accentText }
                    : { background: c.rowBg, border: `1px solid ${c.border}`, color: c.muted }
                  }>
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  {on
                    ? <ToggleRight className="w-4 h-4 flex-shrink-0" style={{ color: c.accentBorder }} />
                    : <ToggleLeft className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add New User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md space-y-4 p-6 rounded-2xl shadow-2xl"
            style={{ background: c.panel, border: `1px solid ${c.accentBorder}`, color: c.text }}>
            
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${c.border}` }}>
              <h3 className="text-sm font-bold font-heading flex items-center gap-2" style={{ color: c.accentText }}>
                <UserPlus className="w-4 h-4" /> Add New User Credentials
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:opacity-80 cursor-pointer">
                <X className="w-4 h-4" style={{ color: c.muted }} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1" style={{ color: c.muted }}>Role Preset:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Admin', 'Purchase Exec', 'Sales Exec'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRolePreset(role)}
                      className="py-1.5 px-2 rounded-lg font-bold text-center border cursor-pointer text-[11px] transition-all"
                      style={newUserRole === role
                        ? { background: c.accent, color: '#f0ebe8', borderColor: c.accentBorder }
                        : { background: c.rowBg, color: c.text, borderColor: c.border }
                      }
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: c.muted }}>Full Name (Username):</label>
                <input
                  type="text"
                  placeholder="e.g. ANIL SHAH"
                  value={newUserName}
                  onChange={e => setNewUserName(e.target.value)}
                  style={{ ...inputStyle, width: '100%' }}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: c.muted }}>Email / User Identifier:</label>
                <input
                  type="email"
                  placeholder="e.g. anil@venzora.com"
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  style={{ ...inputStyle, width: '100%' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: c.muted }}>Avatar Icon:</label>
                  <select value={newUserAvatar} onChange={e => setNewUserAvatar(e.target.value)} style={{ ...inputStyle, width: '100%' }}>
                    {['👑','🛒','📦','💼','🏷️','👤','⚡','💎'].map(a => <option key={a} value={a}>{a} {a}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: c.muted }}>Commission Rate (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newUserCommRate}
                    onChange={e => setNewUserCommRate(e.target.value)}
                    style={{ ...inputStyle, width: '100%', color: c.accentText }}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1" style={{ color: c.muted }}>Module Permissions:</label>
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl" style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>
                  {[
                    { key: 'canPurchase', label: 'Purchase Entry' },
                    { key: 'canSale', label: 'Sale Entry' },
                    { key: 'canSaleRpt', label: 'SaleRpt' },
                    { key: 'canSettings', label: 'Settings' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer font-semibold" style={{ color: c.text }}>
                      <input
                        type="checkbox"
                        checked={newUserPerms[key]}
                        onChange={e => setNewUserPerms({ ...newUserPerms, [key]: e.target.checked })}
                        className="w-3.5 h-3.5 cursor-pointer rounded"
                        style={{ accentColor: c.accentBorder }}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: c.accent, color: '#f0ebe8', border: `1px solid ${c.accentBorder}` }}
                >
                  Create User Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  style={{ background: c.rowBg, color: c.muted, border: `1px solid ${c.border}` }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
