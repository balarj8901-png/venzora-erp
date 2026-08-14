// ERP LocalStorage Persistence - Clean Fresh Start

const STORAGE_KEYS = {
  PURCHASES: 'venzora_erp_purchases_v5',
  SALES: 'venzora_erp_sales_v5'
};

export const getPurchasesData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const savePurchasesData = (data) => {
  localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(data));
};

export const getSalesData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveSalesData = (data) => {
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(data));
};

// Clear all ERP data - fresh start
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.PURCHASES);
  localStorage.removeItem(STORAGE_KEYS.SALES);
};
