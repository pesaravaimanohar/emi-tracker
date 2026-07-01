import { useReducer, useEffect, useCallback } from 'react';
import { initialPayments, buildInitialHistory } from '../data/initialData';

const STORAGE_KEY = 'emi-tracker-data';

function getMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      payments: state.payments,
      history: state.history,
    }));
  } catch {
    // ignore
  }
}

function getInitialState() {
  const saved = loadFromStorage();
  const now = new Date();
  const currentMonth = getMonthKey(now);

  if (saved) {
    return {
      payments: saved.payments,
      history: saved.history,
      selectedMonth: currentMonth,
      showAll: false,
    };
  }

  const payments = initialPayments;
  const history = buildInitialHistory(payments);

  return {
    payments,
    history,
    selectedMonth: currentMonth,
    showAll: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_PAID': {
      const { paymentId, monthKey } = action;
      const itemHistory = state.history[paymentId] || {};
      const current = itemHistory[monthKey]?.paid || false;
      return {
        ...state,
        history: {
          ...state.history,
          [paymentId]: {
            ...itemHistory,
            [monthKey]: { paid: !current },
          },
        },
      };
    }

    case 'SET_MONTH': {
      return { ...state, selectedMonth: action.monthKey };
    }

    case 'TOGGLE_SHOW_ALL': {
      return { ...state, showAll: !state.showAll };
    }

    case 'ADD_PAYMENT': {
      const newPayment = {
        ...action.payment,
        id: `custom-${Date.now()}`,
      };
      return {
        ...state,
        payments: [...state.payments, newPayment],
        history: {
          ...state.history,
          [newPayment.id]: {},
        },
      };
    }

    case 'DELETE_PAYMENT': {
      const newHistory = { ...state.history };
      delete newHistory[action.paymentId];
      return {
        ...state,
        payments: state.payments.filter((p) => p.id !== action.paymentId),
        history: newHistory,
      };
    }

    case 'RESET_DATA': {
      localStorage.removeItem(STORAGE_KEY);
      const payments = initialPayments;
      const history = buildInitialHistory(payments);
      return {
        payments,
        history,
        selectedMonth: state.selectedMonth,
        showAll: state.showAll,
      };
    }

    default:
      return state;
  }
}

/**
 * For an EMI item, figure out which installment number a given month corresponds to.
 * Returns null if the month is before startDate or after completion.
 */
function getInstallmentNumber(payment, monthKey) {
  if (payment.isRecurring || !payment.startDate) return null;
  const [year, month] = monthKey.split('-').map(Number);
  const start = new Date(payment.startDate);
  const startYear = start.getFullYear();
  const startMonth = start.getMonth() + 1;
  const diff = (year - startYear) * 12 + (month - startMonth);
  if (diff < 0) return null;
  if (diff >= payment.totalInstallments) return null;
  return diff + 1;
}

/**
 * Count how many installments are paid for a given payment.
 */
function getCompletedCount(history, paymentId) {
  const itemHistory = history[paymentId] || {};
  return Object.values(itemHistory).filter((v) => v.paid).length;
}

/**
 * Check if a payment is active for a given month.
 * - Recurring: always active
 * - EMI: active if month is within [startDate, startDate + totalInstallments)
 */
function isActiveInMonth(payment, monthKey) {
  if (payment.isRecurring) return true;
  return getInstallmentNumber(payment, monthKey) !== null;
}

export function usePaymentStore() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  // Persist on every change
  useEffect(() => {
    saveToStorage(state);
  }, [state.payments, state.history]);

  const togglePaid = useCallback((paymentId, monthKey) => {
    dispatch({ type: 'TOGGLE_PAID', paymentId, monthKey });
  }, []);

  const setMonth = useCallback((monthKey) => {
    dispatch({ type: 'SET_MONTH', monthKey });
  }, []);

  const toggleShowAll = useCallback(() => {
    dispatch({ type: 'TOGGLE_SHOW_ALL' });
  }, []);

  const addPayment = useCallback((payment) => {
    dispatch({ type: 'ADD_PAYMENT', payment });
  }, []);

  const deletePayment = useCallback((paymentId) => {
    dispatch({ type: 'DELETE_PAYMENT', paymentId });
  }, []);

  const resetData = useCallback(() => {
    dispatch({ type: 'RESET_DATA' });
  }, []);

  // Derived data for selected month
  const { selectedMonth, payments, history, showAll } = state;

  const activePayments = payments.filter((p) => isActiveInMonth(p, selectedMonth));

  const momPayments = activePayments.filter((p) => p.account === 'mom');
  const myPayments = activePayments.filter((p) => p.account === 'my');

  const isPaid = (paymentId) => {
    return history[paymentId]?.[selectedMonth]?.paid || false;
  };

  const getStats = (paymentsList) => {
    let totalDue = 0;
    let totalPaid = 0;
    paymentsList.forEach((p) => {
      totalDue += p.monthlyAmount;
      if (isPaid(p.id)) totalPaid += p.monthlyAmount;
    });
    return {
      totalDue,
      totalPaid,
      remaining: totalDue - totalPaid,
      count: paymentsList.length,
      paidCount: paymentsList.filter((p) => isPaid(p.id)).length,
    };
  };

  const momStats = getStats(momPayments);
  const myStats = getStats(myPayments);
  const totalStats = getStats(activePayments);

  // Filter based on showAll toggle
  const filteredMomPayments = showAll
    ? momPayments
    : momPayments.filter((p) => !isPaid(p.id));
  const filteredMyPayments = showAll
    ? myPayments
    : myPayments.filter((p) => !isPaid(p.id));

  return {
    selectedMonth,
    showAll,
    payments: activePayments,
    momPayments: filteredMomPayments,
    myPayments: filteredMyPayments,
    allMomPayments: momPayments,
    allMyPayments: myPayments,
    history,
    momStats,
    myStats,
    totalStats,

    // Per-payment helpers
    isPaid,
    getCompletedCount: (paymentId) => getCompletedCount(history, paymentId),
    getInstallmentNumber: (payment) => getInstallmentNumber(payment, selectedMonth),

    // Actions
    togglePaid: (paymentId) => togglePaid(paymentId, selectedMonth),
    setMonth,
    toggleShowAll,
    addPayment,
    deletePayment,
    resetData,
  };
}
