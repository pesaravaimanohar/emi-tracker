import { useState } from 'react';
import { usePaymentStore } from './hooks/usePaymentStore';
import MonthNavigator from './components/MonthNavigator';
import SummaryDashboard from './components/SummaryDashboard';
import AccountSection from './components/AccountSection';
import AddPaymentModal from './components/AddPaymentModal';

export default function App() {
  const store = usePaymentStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="app">
      {/* Decorative blobs */}
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#00d9a6" />
                </linearGradient>
              </defs>
              <rect x="2" y="3" width="20" height="18" rx="3" />
              <line x1="2" y1="9" x2="22" y2="9" />
              <line x1="9" y1="3" x2="9" y2="9" />
            </svg>
          </div>
          <h1 className="header-title">
            EMI <span className="gradient-text">Tracker</span>
          </h1>
        </div>
      </header>

      <main className="app-main">
        <MonthNavigator
          selectedMonth={store.selectedMonth}
          onMonthChange={store.setMonth}
        />

        <SummaryDashboard
          totalStats={store.totalStats}
          momStats={store.momStats}
          myStats={store.myStats}
        />

        {/* Controls bar */}
        <div className="controls-bar">
          <button
            className={`filter-toggle ${!store.showAll ? 'active' : ''}`}
            onClick={store.toggleShowAll}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            {store.showAll ? 'Show Remaining Only' : 'Show All'}
          </button>

          <div className="controls-right">
            <button
              className="btn-add"
              onClick={() => setShowAddModal(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add
            </button>

            <button
              className="btn-reset"
              onClick={() => setShowResetConfirm(true)}
              title="Reset to original data"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </button>
          </div>
        </div>

        {/* Account Sections */}
        <AccountSection
          title="Mom Account"
          icon="👩"
          payments={store.momPayments}
          stats={store.momStats}
          isPaid={store.isPaid}
          getCompletedCount={store.getCompletedCount}
          getInstallmentNumber={store.getInstallmentNumber}
          onToggle={store.togglePaid}
          onDelete={store.deletePayment}
          onUpdatePaidCount={store.updatePaidCount}
          accentClass="accent-mom"
        />

        <AccountSection
          title="My Account"
          icon="👤"
          payments={store.myPayments}
          stats={store.myStats}
          isPaid={store.isPaid}
          getCompletedCount={store.getCompletedCount}
          getInstallmentNumber={store.getInstallmentNumber}
          onToggle={store.togglePaid}
          onDelete={store.deletePayment}
          onUpdatePaidCount={store.updatePaidCount}
          accentClass="accent-my"
        />
      </main>

      <footer className="app-footer">
        <p>EMI Tracker · Data saved locally in your browser</p>
      </footer>

      {/* Modals */}
      {showAddModal && (
        <AddPaymentModal
          onAdd={store.addPayment}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <h3>Reset All Data?</h3>
            <p className="reset-warning">This will restore the original spreadsheet data and remove all changes.</p>
            <div className="delete-confirm-actions">
              <button className="btn-cancel" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="btn-delete" onClick={() => { store.resetData(); setShowResetConfirm(false); }}>Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
