// LocalStorage Persistence Layer for VENZORA (ExDim)

const STORAGE_KEYS = {
  PARTIES: 'venzora_parties_v1',
  PURCHASES: 'venzora_purchases_v1',
  SALES: 'venzora_sales_v1',
  PAYMENTS: 'venzora_payments_v1',
  SETTINGS: 'venzora_settings_v1',
  MASTERS: 'venzora_masters_v1'
};

// Initial Seed Data
const INITIAL_PARTIES = [
  { id: 'P101', name: 'Surat Diamond Craft', type: 'Vendor', mobile: '+91 98251 12345', email: 'surat.gems@gmail.com', city: 'Surat', gst: '24AAAAA0000A1Z5', balance: -4500 },
  { id: 'P102', name: 'Meris Savani Gems', type: 'Vendor', mobile: '+91 98980 54321', email: 'meris.gems@venzora.com', city: 'Surat', gst: '24BBBBB1111B2Z6', balance: -12000 },
  { id: 'P103', name: 'Kothari Jewellers Mumbai', type: 'Client', mobile: '+91 97277 88990', email: 'info@kotharijewels.com', city: 'Mumbai', gst: '27CCCCC2222C3Z7', balance: 18500 },
  { id: 'P104', name: 'Gadhiya Overseas Exports', type: 'Client', mobile: '+91 99044 33221', email: 'exports@gadhiya.com', city: 'Surat', gst: '24DDDDD3333D4Z8', balance: 32000 }
];

const INITIAL_PURCHASES = [
  {
    id: 'PUR-2026-001',
    date: '2026-08-10',
    partyId: 'P101',
    partyName: 'Surat Diamond Craft',
    lotNo: 'LOT-9012',
    giaNo: '2489012384',
    shape: 'BR',
    color: 'D',
    clarity: 'VVS1',
    cut: 'EX',
    carat: '0.75',
    pcs: 1,
    rapPrice: 4200,
    discount: -18.5,
    ratePerCarat: 3423,
    totalUSD: 2567.25,
    totalINR: 222067,
    advancePaid: 50000,
    dueAmount: 172067,
    dueDate: '2026-08-25',
    status: 'Partial'
  },
  {
    id: 'PUR-2026-002',
    date: '2026-08-12',
    partyId: 'P102',
    partyName: 'Meris Savani Gems',
    lotNo: 'LOT-9045',
    giaNo: '5429103982',
    shape: 'PS',
    color: 'E',
    clarity: 'VS1',
    cut: 'EX',
    carat: '1.20',
    pcs: 1,
    rapPrice: 5800,
    discount: -22.0,
    ratePerCarat: 4524,
    totalUSD: 5428.80,
    totalINR: 469591,
    advancePaid: 469591,
    dueAmount: 0,
    dueDate: '2026-08-12',
    status: 'Paid'
  }
];

const INITIAL_SALES = [
  {
    id: 'INV-2026-101',
    date: '2026-08-11',
    partyId: 'P103',
    partyName: 'Kothari Jewellers Mumbai',
    lotNo: 'LOT-8811',
    giaNo: '1192847592',
    shape: 'BR',
    color: 'D',
    clarity: 'IF',
    cut: 'EX',
    carat: '1.05',
    pcs: 1,
    rapPrice: 8500,
    discount: -12.0,
    ratePerCarat: 7480,
    totalUSD: 7854.00,
    totalINR: 679371,
    profitMargin: 45200,
    paidAmount: 500000,
    dueAmount: 179371,
    paymentStatus: 'Partial',
    remarks: 'Solitaire ring center stone'
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'PAY-1001',
    date: '2026-08-11',
    type: 'Payment In',
    partyId: 'P103',
    partyName: 'Kothari Jewellers Mumbai',
    amountINR: 500000,
    mode: 'Bank Transfer (NEFT)',
    refNo: 'NEFT90812398',
    remarks: 'Advance against INV-2026-101'
  },
  {
    id: 'PAY-1002',
    date: '2026-08-10',
    type: 'Payment Out',
    partyId: 'P101',
    partyName: 'Surat Diamond Craft',
    amountINR: 50000,
    mode: 'UPI',
    refNo: 'UPI66291048',
    remarks: 'Part payment for PUR-2026-001'
  }
];

const INITIAL_SETTINGS = {
  usdRate: 86.50,
  companyName: 'VENZORA GEMS & JEWELLERY EXPORT',
  city: 'Surat, Gujarat, India',
  phone: '+91 98250 00000',
  email: 'info@venzoragems.com'
};

// Storage Helpers
export const getStoredData = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return fallback;
  }
};

export const setStoredData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key}:`, e);
  }
};

export const getParties = () => getStoredData(STORAGE_KEYS.PARTIES, INITIAL_PARTIES);
export const saveParties = (parties) => setStoredData(STORAGE_KEYS.PARTIES, parties);

export const getPurchases = () => getStoredData(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
export const savePurchases = (purchases) => setStoredData(STORAGE_KEYS.PURCHASES, purchases);

export const getSales = () => getStoredData(STORAGE_KEYS.SALES, INITIAL_SALES);
export const saveSales = (sales) => setStoredData(STORAGE_KEYS.SALES, sales);

export const getPayments = () => getStoredData(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
export const savePayments = (payments) => setStoredData(STORAGE_KEYS.PAYMENTS, payments);

export const getSettings = () => getStoredData(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
export const saveSettings = (settings) => setStoredData(STORAGE_KEYS.SETTINGS, settings);
