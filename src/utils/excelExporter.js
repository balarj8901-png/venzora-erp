// VENZORA Smart Excel & CSV Exporter Engine

// Helper to escape CSV cell values
const escapeCsvCell = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

// Generate CSV Blob with UTF-8 BOM for Microsoft Excel
export const downloadCsvFile = (headers, rows, filename = 'VENZORA_Export.csv') => {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const rowLines = rows.map(row => row.map(escapeCsvCell).join(','));
  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 1. Export Purchases Only
export const exportPurchasesCsv = (purchases, fromDate, toDate) => {
  const filtered = purchases.filter(p => {
    if (!fromDate && !toDate) return true;
    const pDate = p.date || '';
    const matchFrom = !fromDate || pDate >= fromDate;
    const matchTo = !toDate || pDate <= toDate;
    return matchFrom && matchTo;
  });

  const headers = [
    'PURCHASE_ID', 'TYPE', 'GIA_NUMBER', 'DATE', 'SUPPLIER_COMPANY', 'COUNTRY',
    'SHAPE', 'SIZE_CARAT', 'COLOR', 'QUALITY', 'FLUOR', 'CUT', 'POLISH', 'SYMMETRY',
    'MEASUREMENTS', 'RAP_PRICE_USD', 'PER_CARAT_USD', 'DISCOUNT_PCT', 'D_AMOUNT_USD',
    'DOLLAR_RATE_INR', 'IND_AMOUNT_INR', 'BILL_TYPE', 'PAY_DAYS', 'PURCHASE_USER', 'ASSIGNED_SALES_REP'
  ];

  const rows = filtered.map(p => [
    p.purId || '',
    p.type || (p.isCertified ? 'GIA' : 'LOS'),
    p.giaNo || '',
    p.date || '',
    p.fromComp || '',
    p.fromCountry || '',
    p.shape || '',
    p.size || '',
    p.color || '',
    p.quality || '',
    p.flor || '',
    p.cut || '',
    p.pol || '',
    p.sym || '',
    p.measurments || '',
    p.rap || 0,
    p.perCarat || 0,
    p.less || 0,
    p.dAmount || 0,
    p.rate || 87.61,
    p.indAmount || (p.dAmount * 87.61),
    p.bill || 'CASH',
    p.payDay || 15,
    p.user || '',
    p.assignedSalesUser || ''
  ]);

  const filename = `VENZORA_Purchases_${fromDate || 'All'}_to_${toDate || 'All'}.csv`;
  downloadCsvFile(headers, rows, filename);
  return filtered.length;
};

// 2. Export Sales Only
export const exportSalesCsv = (sales, purchases, fromDate, toDate) => {
  const filtered = sales.filter(s => {
    if (!fromDate && !toDate) return true;
    const sDate = s.date || '';
    const matchFrom = !fromDate || sDate >= fromDate;
    const matchTo = !toDate || sDate <= toDate;
    return matchFrom && matchTo;
  });

  const headers = [
    'SALE_ID', 'PURCHASE_ID', 'GIA_NUMBER', 'SALE_DATE', 'CLIENT_NAME', 'COUNTRY',
    'MOBILE_NO', 'ITEM_RATE_USD', 'CARAT', 'LESS_PCT', 'FINAL_AMOUNT_USD', 'ADVANCE_USD',
    'DUE_AMOUNT_USD', 'PROFIT_USD', 'PROFIT_PCT', 'COMMISSION_RATE_PCT', 'COMMISSION_AMOUNT_USD',
    'REMARK', 'SALES_USER'
  ];

  const rows = filtered.map(s => [
    s.saleId || '',
    s.purId || '',
    s.giaNo || '',
    s.date || '',
    s.clientName || '',
    s.toCountry || '',
    s.mobileNo || '',
    s.itemRate || 0,
    s.pCarat || 0,
    s.less || 0,
    s.finalAmt || 0,
    s.advAmt || 0,
    s.dueAmt || 0,
    s.profit || 0,
    s.profitPct || 0,
    s.commissionRate || 0,
    s.commissionAmt || 0,
    s.remark || '',
    s.user || ''
  ]);

  const filename = `VENZORA_Sales_${fromDate || 'All'}_to_${toDate || 'All'}.csv`;
  downloadCsvFile(headers, rows, filename);
  return filtered.length;
};

// 3. Export Complete Master Register (Purchases + Sales Combined)
export const exportMasterRegisterCsv = (purchases, sales, fromDate, toDate) => {
  const combined = purchases.map(p => {
    const matchingSale = sales.find(s => s.purId === p.purId || s.giaNo === p.giaNo);
    const saleDProfit = matchingSale ? matchingSale.profit || (matchingSale.finalAmt - p.dAmount) : 0;
    const profitPct = matchingSale && p.dAmount > 0 ? (saleDProfit / p.dAmount) * 100 : 0;
    return { p, s: matchingSale, saleDProfit, profitPct };
  }).filter(({ p, s }) => {
    if (!fromDate && !toDate) return true;
    const checkDate = s ? s.date : p.date;
    const matchFrom = !fromDate || checkDate >= fromDate;
    const matchTo = !toDate || checkDate <= toDate;
    return matchFrom && matchTo;
  });

  const headers = [
    // Purchase Columns
    'GIA_NO', 'PURCHASE_DATE', 'FROM_COMPANY', 'SIZE_CARAT', 'SHAPE', 'COLOR', 'QUALITY',
    'FLUOR', 'CUT', 'POLISH', 'SYMMETRY', 'MEASUREMENTS', 'PUR_LESS_PCT', 'CO_DIS_PCT',
    'RAP_USD', 'PER_CARAT_USD', 'PURCHASE_D_AMOUNT_USD', 'EXCHANGE_RATE_INR', 'IND_AMOUNT_INR',
    'BILL_TYPE', 'PAYMENT_DAYS', 'PURCHASE_USER', 'IS_PURCHASE_PAID',
    // Sale Columns
    'SALE_DATE', 'CLIENT_NAME', 'SALE_PER_CARAT_USD', 'SALE_LESS_PCT', 'SALE_FINAL_AMOUNT_USD',
    'ADVANCE_D_AMOUNT_USD', 'DUE_AMOUNT_USD', 'REMARK', 'SALES_USER', 'SALE_PROFIT_USD',
    'PROFIT_PCT', 'COMMISSION_RATE_PCT', 'COMMISSION_AMOUNT_USD', 'IS_EXPORT'
  ];

  const rows = combined.map(({ p, s, saleDProfit, profitPct }) => [
    p.giaNo || '',
    p.date || '',
    p.fromComp || '',
    p.size || '',
    p.shape || '',
    p.color || '',
    p.quality || '',
    p.flor || '',
    p.cut || '',
    p.pol || '',
    p.sym || '',
    p.measurments || '',
    p.less || 0,
    p.coDis || 99.8,
    p.rap || 0,
    p.perCarat || 0,
    p.dAmount || 0,
    p.rate || 87.61,
    p.indAmount || (p.dAmount * 87.61),
    p.bill || 'CASH',
    p.payDay || 15,
    p.user || '',
    p.isPay !== false ? 'YES' : 'NO',
    // Sale
    s ? s.date : '-',
    s ? s.clientName : '-',
    s ? (s.pCarat || s.itemRate) : 0,
    s ? s.less : 0,
    s ? s.finalAmt : 0,
    s ? s.advAmt : 0,
    s ? s.dueAmt : 0,
    s ? s.remark : '-',
    s ? s.user : '-',
    s ? saleDProfit : 0,
    s ? profitPct.toFixed(2) : '0.00',
    s ? (s.commissionRate || 0) : 0,
    s ? (s.commissionAmt || 0) : 0,
    p.isExport !== false ? 'YES' : 'NO'
  ]);

  const filename = `VENZORA_Master_Register_${fromDate || 'All'}_to_${toDate || 'All'}.csv`;
  downloadCsvFile(headers, rows, filename);
  return combined.length;
};

// 4. Export Audit Logs Security Report
export const exportAuditLogsCsv = (auditLogs) => {
  const headers = ['LOG_ID', 'TIMESTAMP', 'USER_NAME', 'USER_ROLE', 'MODULE', 'ACTION_TYPE', 'DETAILS', 'IP_ADDRESS'];
  const rows = auditLogs.map(l => [
    l.id || '',
    l.timestamp || '',
    l.userName || '',
    l.userRole || '',
    l.module || '',
    l.action || '',
    l.details || '',
    l.ip || ''
  ]);

  const filename = `VENZORA_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsvFile(headers, rows, filename);
  return auditLogs.length;
};
