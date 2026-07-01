export const initialPayments = [
  // ===== Mom Account =====
  {
    id: 'mom-1lakh-1',
    name: '1 Lakh (Taken) #1',
    account: 'mom',
    totalInstallments: 21,
    monthlyAmount: 5000,
    startDate: '2024-11-01',
    isRecurring: false,
  },
  {
    id: 'mom-1lakh-2',
    name: '1 Lakh (Taken) #2',
    account: 'mom',
    totalInstallments: 21,
    monthlyAmount: 5000,
    startDate: '2024-11-01',
    isRecurring: false,
  },
  {
    id: 'mom-expenses',
    name: 'Mom Expenses',
    account: 'mom',
    totalInstallments: null,
    monthlyAmount: 5000,
    startDate: null,
    isRecurring: true,
  },
  {
    id: 'mom-podhupu',
    name: 'Podhupu',
    account: 'mom',
    totalInstallments: 23,
    monthlyAmount: 10000,
    startDate: '2026-01-01',
    isRecurring: false,
  },
  {
    id: 'mom-dad-mobile',
    name: 'Dad Mobile',
    account: 'mom',
    totalInstallments: 12,
    monthlyAmount: 2000,
    startDate: '2025-10-01',
    isRecurring: false,
  },
  {
    id: 'mom-manohar-mobile',
    name: 'Manohar Mobile',
    account: 'mom',
    totalInstallments: 18,
    monthlyAmount: 3000,
    startDate: '2025-10-01',
    isRecurring: false,
  },

  // ===== My Account =====
  {
    id: 'my-2lakh',
    name: '2 Lakh',
    account: 'my',
    totalInstallments: 21,
    monthlyAmount: 10000,
    startDate: '2025-02-01',
    isRecurring: false,
  },
  {
    id: 'my-house-rent',
    name: 'House Rent',
    account: 'my',
    totalInstallments: null,
    monthlyAmount: 7200,
    startDate: null,
    isRecurring: true,
  },
  {
    id: 'my-wifi-airtel',
    name: 'WiFi Airtel Bill',
    account: 'my',
    totalInstallments: null,
    monthlyAmount: 2000,
    startDate: null,
    isRecurring: true,
  },
  {
    id: 'my-pulsar-bike',
    name: 'Pulsar Bike',
    account: 'my',
    totalInstallments: 24,
    monthlyAmount: 7000,
    startDate: '2026-02-01',
    isRecurring: false,
  },
  {
    id: 'my-pg-fee',
    name: 'PG Fee',
    account: 'my',
    totalInstallments: null,
    monthlyAmount: 6500,
    startDate: null,
    isRecurring: true,
  },
  {
    id: 'my-expenses',
    name: 'My Expenses',
    account: 'my',
    totalInstallments: null,
    monthlyAmount: 10000,
    startDate: null,
    isRecurring: true,
  },
];

/**
 * Build the initial payment history based on the spreadsheet state.
 * The spreadsheet shows state "after paying July 2026".
 * For EMI items, we mark months from startDate through July 2026 as paid
 * based on the completed count.
 */
export function buildInitialHistory(payments) {
  const history = {};

  const emiCompletedMap = {
    'mom-1lakh-1': 20,
    'mom-1lakh-2': 20,
    'mom-podhupu': 6,
    'mom-dad-mobile': 9,
    'mom-manohar-mobile': 9,
    'my-2lakh': 17,
    'my-pulsar-bike': 5,
  };

  payments.forEach((payment) => {
    history[payment.id] = {};

    if (!payment.isRecurring && payment.startDate) {
      const completed = emiCompletedMap[payment.id] || 0;
      const start = new Date(payment.startDate);
      
      for (let i = 0; i < completed; i++) {
        const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        history[payment.id][key] = { paid: true };
      }
    }

    // For recurring items, mark all months up to June 2026 as paid
    // (July is the current month — user decides)
    if (payment.isRecurring) {
      // Mark a reasonable range of past months as paid (Jan 2025 - June 2026)
      const rangeStart = new Date(2025, 0, 1);
      const rangeEnd = new Date(2026, 5, 1); // June 2026
      const d = new Date(rangeStart);
      while (d <= rangeEnd) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        history[payment.id][key] = { paid: true };
        d.setMonth(d.getMonth() + 1);
      }
    }
  });

  return history;
}
