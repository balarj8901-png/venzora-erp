import React, { useState } from 'react';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, X, AlertCircle, Gem, Lock, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginModal({ isOpen, onClose }) {
  const { 
    loginStep, pendingUser, verify2FA, cancelLoginStep, 
    isAuthenticated, authenticateWithCredentials 
  } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen && loginStep === 'LOGGED_IN' && isAuthenticated) return null;

  const c = {
    panel: isDark ? '#12080A' : '#ffffff',
    border: isDark ? '#2D1515' : '#e8d8d0',
    rowBg: isDark ? '#1A0A0A' : '#fdf8f6',
    inputBg: isDark ? '#1E0D0D' : '#fdf8f6',
    inputBorder: isDark ? '#3D1A1A' : '#c8a898',
    accent: '#5C1A1A',
    accentLight: isDark ? '#2D1010' : '#fdf0ee',
    accentText: isDark ? '#E8A0A0' : '#5C1A1A',
    accentBorder: '#8B3030',
    text: isDark ? '#f0ebe8' : '#1a0a0a',
    muted: isDark ? '#9A7070' : '#7a5050',
  };

  const handleSendCodeSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!emailInput.trim()) {
      setErrorMsg('Please enter your email address!');
      return;
    }

    const res = authenticateWithCredentials(emailInput, '');
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setOtpInput(''); // Keep blank for user to type code
    }
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      const success = verify2FA(otpInput.trim());
      setIsSubmitting(false);
      if (!success) {
        setErrorMsg('Invalid verification code! Please check your code and try again.');
      } else {
        setOtpInput('');
        if (onClose) onClose();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4"
        style={{ background: c.panel, border: `1.5px solid ${c.accentBorder}`, color: c.text }}>

        {/* Brand Header */}
        <div className="text-center pb-3 border-b" style={{ borderColor: c.border }}>
          <div className="w-12 h-12 rounded-xl bg-[#5C1A1A] flex items-center justify-center shadow-lg mx-auto mb-2">
            <Gem className="w-6 h-6 text-[#f0ebe8]" />
          </div>
          <h2 className="text-base font-extrabold tracking-widest font-heading uppercase" style={{ color: c.text }}>
            VENZORA DIAMOND ERP
          </h2>
          <p className="text-[11px] font-semibold flex items-center justify-center gap-1 mt-0.5" style={{ color: c.accentText }}>
            <Lock className="w-3 h-3" /> Secure Production Authentication Portal
          </p>
        </div>

        {/* Modal Sub-Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: c.accent, color: '#f0ebe8' }}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-heading" style={{ color: c.accentText }}>
                {loginStep === '2FA_OTP' ? 'Enter Verification Code' : 'Sign In'}
              </h3>
              <p className="text-[10px]" style={{ color: c.muted }}>
                {loginStep === '2FA_OTP' ? 'Enter code sent to your registered email' : 'Enter your registered email address to receive code'}
              </p>
            </div>
          </div>
          {isAuthenticated && cancelLoginStep && (
            <button onClick={() => { cancelLoginStep(); if (onClose) onClose(); }} className="p-1 rounded-lg hover:opacity-80 cursor-pointer">
              <X className="w-4 h-4" style={{ color: c.muted }} />
            </button>
          )}
        </div>

        {/* Step 1: Email Address Input Form (No password, no auto-filled values) */}
        {loginStep !== '2FA_OTP' && (
          <form onSubmit={handleSendCodeSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-semibold mb-1.5" style={{ color: c.muted }}>Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3" style={{ color: c.muted }} />
                <input
                  type="text"
                  placeholder="Enter your email address"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 font-sans rounded-xl outline-none text-xs"
                  style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text }}
                  required
                  autoFocus
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all"
              style={{ background: c.accent, color: '#f0ebe8', border: `1px solid ${c.accentBorder}` }}
            >
              Send Code <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: 2FA Gmail OTP Verification (Clean, no codes displayed on UI) */}
        {loginStep === '2FA_OTP' && pendingUser && (
          <form onSubmit={handleOtpVerify} className="space-y-4 text-xs font-sans">
            {/* Target Account Summary */}
            <div className="p-3.5 rounded-xl flex items-center gap-3" style={{ background: c.rowBg, border: `1px solid ${c.border}` }}>
              <span className="text-3xl">{pendingUser.avatar}</span>
              <div>
                <div className="font-bold text-xs" style={{ color: c.text }}>{pendingUser.name}</div>
                <div className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: c.muted }}>
                  <Mail className="w-3 h-3 text-emerald-600" />
                  Code sent to: <strong style={{ color: c.accentText }}>{pendingUser.email}</strong>
                </div>
              </div>
            </div>

            {/* Code Input */}
            <div>
              <label className="block font-semibold mb-1.5" style={{ color: c.muted }}>
                Enter 6-Digit Code:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-3.5" style={{ color: c.muted }} />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="••••••"
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-2.5 text-center text-xl tracking-[0.3em] font-mono font-extrabold rounded-xl outline-none"
                  style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.accentText }}
                  autoFocus
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitting || otpInput.length < 6}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isSubmitting || otpInput.length < 6 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'
                }`}
                style={{ background: c.accent, color: '#f0ebe8', border: `1px solid ${c.accentBorder}` }}
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Log In'}
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={cancelLoginStep}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
                  style={{ background: c.rowBg, color: c.muted, border: `1px solid ${c.border}` }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
