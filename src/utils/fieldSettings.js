// Field Settings Utility for Enabling / Disabling fields in Purchase & Sale Entry

const SETTINGS_KEY = 'venzora_field_settings_v3';

export const DEFAULT_FIELD_SETTINGS = {
  purchase: {
    giaNo: true,
    date: true,
    fromComp: true,
    fromCountry: true,
    sizeCarat: true,
    shape: true,
    color: true,
    quality: true,
    fluor: true,
    cut: true,
    pol: true,
    sym: true,
    measurements: true,
    rap: true,
    dis: true,
    perCarat: true,
    pcsRate: true,
    less: true,
    finalAmt: true,
    br: true,
    dAmount: true,
    payDay: true,
    bill: true,
    assignedSalesUser: true
  },
  sale: {
    clientName: true,
    toCountry: true,
    mobileNo: true,
    itemRate: true,
    pCarat: true,
    coDis: true,
    less: true,
    finalAmt: true,
    br: true,
    remark: true,
    profit: true,
    amt: true,
    dueAmt: true,
    advAmt: true,
    advAmtINR: true
  }
};

export const getFieldSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_FIELD_SETTINGS;
  } catch (e) {
    return DEFAULT_FIELD_SETTINGS;
  }
};

export const saveFieldSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving field settings:', e);
  }
};
