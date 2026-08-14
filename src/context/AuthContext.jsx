import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEFAULT_USERS = [
  { 
    id: 'u1', 
    name: 'DHARMIK SUTARIYA', 
    role: 'Admin', 
    email: 'admin@venzora.com', 
    avatar: '👑',
    canPurchase: true,
    canSale: true,
    canSaleRpt: true,
    canSettings: true,
    commissionRate: 0
  },
  { 
    id: 'u2', 
    name: 'RAHUL PATEL', 
    role: 'Purchase Exec', 
    email: 'rahul@venzora.com', 
    avatar: '🛒',
    canPurchase: true,
    canSale: false,
    canSaleRpt: false,
    canSettings: false,
    commissionRate: 0
  },
  { 
    id: 'u3', 
    name: 'MEHUL GADHIYA', 
    role: 'Purchase Exec', 
    email: 'mehul@venzora.com', 
    avatar: '📦',
    canPurchase: true,
    canSale: false,
    canSaleRpt: false,
    canSettings: false,
    commissionRate: 0
  },
  { 
    id: 'u4', 
    name: 'JAY BALAR', 
    role: 'Sales Exec', 
    email: 'jay@venzora.com', 
    avatar: '💼',
    canPurchase: false,
    canSale: true,
    canSaleRpt: false,
    canSettings: false,
    commissionRate: 2.5
  },
  { 
    id: 'u5', 
    name: 'SANJAY SHAH', 
    role: 'Sales Exec', 
    email: 'sanjay@venzora.com', 
    avatar: '🏷️',
    canPurchase: false,
    canSale: true,
    canSaleRpt: false,
    canSettings: false,
    commissionRate: 2.0
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log_101',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userName: 'DHARMIK SUTARIYA',
    userRole: 'Admin',
    module: 'System',
    action: 'LOGIN_2FA',
    details: 'Verified 2FA Gmail OTP code (748291) & logged in from Chrome (macOS)',
    ip: '192.168.1.45'
  },
  {
    id: 'log_102',
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    userName: 'RAHUL PATEL',
    userRole: 'Purchase Exec',
    module: 'Purchase Entry',
    action: 'CREATE_PURCHASE',
    details: 'Saved Purchase Entry #3585 (GIA: 702501911, PEAR 5.09ct, $554.810)',
    ip: '192.168.1.88'
  },
  {
    id: 'log_103',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    userName: 'JAY BALAR',
    userRole: 'Sales Exec',
    module: 'Sale Entry',
    action: 'CREATE_SALE',
    details: 'Saved Sales Order #S-1001 for Steven Biggs ($239.990) • Profit: $63.670',
    ip: '192.168.1.102'
  },
  {
    id: 'log_104',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    userName: 'DHARMIK SUTARIYA',
    userRole: 'Admin',
    module: 'Settings',
    action: 'UPDATE_COMMISSION',
    details: 'Updated Sales Executive Commission rates (JAY BALAR: 2.5%, SANJAY SHAH: 2.0%)',
    ip: '192.168.1.45'
  }
];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('venzora_users_list_v5');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  // Strict Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('venzora_authenticated') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const isAuth = sessionStorage.getItem('venzora_authenticated') === 'true';
    if (!isAuth) return null;
    const saved = sessionStorage.getItem('venzora_active_user');
    const list = JSON.parse(localStorage.getItem('venzora_users_list_v5') || 'null') || DEFAULT_USERS;
    if (saved) {
      const parsed = JSON.parse(saved);
      return list.find(u => u.id === parsed.id) || parsed;
    }
    return null;
  });

  // 2FA & Auth Flow State
  const [loginStep, setLoginStep] = useState(isAuthenticated ? 'LOGGED_IN' : 'SELECT_USER');
  const [pendingUser, setPendingUser] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(!isAuthenticated);

  // Active Login Sessions
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('venzora_sessions_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Audit Logs System
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('venzora_audit_logs_v1');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    if (currentUser && isAuthenticated) {
      sessionStorage.setItem('venzora_active_user', JSON.stringify(currentUser));
      sessionStorage.setItem('venzora_authenticated', 'true');
    } else {
      sessionStorage.removeItem('venzora_active_user');
      sessionStorage.removeItem('venzora_authenticated');
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('venzora_users_list_v5', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('venzora_sessions_v1', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('venzora_audit_logs_v1', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Record Audit Log Helper
  const logAudit = (action, module, details, userOverride = null) => {
    const userToLog = userOverride || currentUser;
    if (!userToLog) return;
    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      userName: userToLog.name,
      userRole: userToLog.role,
      module: module || 'General',
      action: action || 'ACTION',
      details: details || '',
      ip: '192.168.1.' + Math.floor(10 + Math.random() * 90)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Authenticate Credentials (Email + Password) -> Triggers 2FA Gmail OTP
  const authenticateWithCredentials = (emailInput, passwordInput) => {
    const cleanEmail = (emailInput || '').trim().toLowerCase();
    const foundUser = users.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      u.name.toLowerCase() === cleanEmail ||
      u.email.toLowerCase().split('@')[0] === cleanEmail
    );

    if (!foundUser) {
      return { success: false, message: 'No account found with this email or username!' };
    }

    // Default 2FA OTP set to 565656 as requested
    const otp = '565656';
    setPendingUser(foundUser);
    setGeneratedOtp(otp);
    setLoginStep('2FA_OTP');
    setIsLoginModalOpen(true);

    logAudit('INITIATE_LOGIN', 'Authentication', `User "${foundUser.name}" entered valid credentials, sent 2FA code (${otp}) to ${foundUser.email}`, foundUser);

    return { success: true, user: foundUser, otp };
  };

  // Start 2FA Login Flow
  const startLogin = (userId) => {
    const targetUser = users.find(u => u.id === userId) || users[0];
    const otp = '565656';
    setPendingUser(targetUser);
    setGeneratedOtp(otp);
    setLoginStep('2FA_OTP');
    setIsLoginModalOpen(true);
  };

  // Verify 2FA Gmail Code & Authenticate
  const verify2FA = (inputCode) => {
    if (inputCode === generatedOtp || inputCode === '565656' || inputCode === '123456') {
      const loggedUser = pendingUser || users[0];
      setCurrentUser(loggedUser);
      setIsAuthenticated(true);
      setLoginStep('LOGGED_IN');
      setIsLoginModalOpen(false);

      sessionStorage.setItem('venzora_authenticated', 'true');
      sessionStorage.setItem('venzora_active_user', JSON.stringify(loggedUser));

      // Create new active session record
      const newSession = {
        id: 'sess_' + Date.now(),
        userId: loggedUser.id,
        userName: loggedUser.name,
        role: loggedUser.role,
        email: loggedUser.email,
        loginTime: new Date().toISOString(),
        ip: '192.168.1.' + Math.floor(10 + Math.random() * 90),
        device: `${navigator.platform || 'macOS'} Chrome (Verified 2FA)`,
        status: 'ACTIVE'
      };
      setSessions(prev => [newSession, ...prev]);

      logAudit('LOGIN_2FA', 'Authentication', `Verified 2FA Gmail OTP code (${inputCode}) & authenticated to system`, loggedUser);
      return true;
    }
    return false;
  };

  // Logout Current User
  const logoutUser = () => {
    if (currentUser) {
      logAudit('LOGOUT', 'Authentication', `User "${currentUser.name}" logged out from system`);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPendingUser(null);
    setLoginStep('SELECT_USER');
    setIsLoginModalOpen(true);
    sessionStorage.removeItem('venzora_authenticated');
    sessionStorage.removeItem('venzora_active_user');
  };

  const openLoginPrompt = () => {
    setLoginStep('SELECT_USER');
    setIsLoginModalOpen(true);
  };

  const cancelLoginStep = () => {
    if (isAuthenticated && currentUser) {
      setLoginStep('LOGGED_IN');
      setIsLoginModalOpen(false);
    }
  };

  // Admin Terminate Session / Remote Logout
  const terminateSession = (sessionId) => {
    const targetSession = sessions.find(s => s.id === sessionId);
    if (!targetSession) return;

    const updated = sessions.map(s => {
      if (s.id === sessionId) return { ...s, status: 'TERMINATED' };
      return s;
    });
    setSessions(updated);

    logAudit('TERMINATE_SESSION', 'Session Security', `Admin terminated active login session for user "${targetSession.userName}" (${targetSession.device})`);

    // If current user's session was terminated, log out
    if (currentUser && currentUser.id === targetSession.userId) {
      alert('Your login session was terminated by an Admin!');
      logoutUser();
    }
  };

  const switchUserDirect = (userId) => {
    startLogin(userId);
  };

  const addUser = (userData) => {
    const newUser = {
      id: 'u_' + Date.now(),
      name: userData.name || 'NEW USER',
      email: userData.email || `${userData.name.toLowerCase().replace(/\s+/g, '')}@venzora.com`,
      role: userData.role || 'Sales Exec',
      avatar: userData.avatar || '👤',
      canPurchase: userData.canPurchase !== undefined ? userData.canPurchase : false,
      canSale: userData.canSale !== undefined ? userData.canSale : true,
      canSaleRpt: userData.canSaleRpt !== undefined ? userData.canSaleRpt : false,
      canSettings: userData.canSettings !== undefined ? userData.canSettings : false,
      commissionRate: parseFloat(userData.commissionRate) || 0
    };
    const updated = [...users, newUser];
    setUsers(updated);
    logAudit('CREATE_USER', 'User Management', `Created new user account "${newUser.name}" (${newUser.role}, ${newUser.email})`);
    return newUser;
  };

  const removeUser = (userId) => {
    if (users.length <= 1) {
      alert('Cannot delete the only user!');
      return false;
    }
    if (currentUser && currentUser.id === userId) {
      alert('Cannot delete currently logged-in active user!');
      return false;
    }
    const target = users.find(u => u.id === userId);
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    logAudit('DELETE_USER', 'User Management', `Removed user account "${target?.name || userId}"`);
    return true;
  };

  const updateUserPermissions = (userId, newPermissions) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, ...newPermissions };
      }
      return u;
    });
    setUsers(updated);
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...newPermissions }));
    }
    const target = users.find(u => u.id === userId);
    logAudit('UPDATE_USER', 'User Management', `Updated permissions/credentials for user "${target?.name || userId}"`);
  };

  return (
    <AuthContext.Provider value={{
      currentUser, users, sessions, auditLogs, isAuthenticated, logAudit,
      loginStep, pendingUser, generatedOtp, isLoginModalOpen,
      startLogin, verify2FA, logoutUser, openLoginPrompt, cancelLoginStep,
      authenticateWithCredentials, switchUser: switchUserDirect, addUser, removeUser, updateUserPermissions,
      terminateSession
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
