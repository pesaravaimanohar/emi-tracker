import { useState } from 'react';

export default function AddPaymentModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: '',
    account: 'my',
    monthlyAmount: '',
    totalInstallments: '',
    startDate: '',
    isRecurring: false,
    alreadyPaid: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.monthlyAmount) return;

    onAdd({
      name: form.name,
      account: form.account,
      monthlyAmount: Number(form.monthlyAmount),
      totalInstallments: form.isRecurring ? null : Number(form.totalInstallments) || null,
      startDate: form.isRecurring ? null : form.startDate || null,
      isRecurring: form.isRecurring,
    }, form.isRecurring ? 0 : Number(form.alreadyPaid) || 0);
    onClose();
  };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Payment</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="payment-name">Name</label>
            <input
              id="payment-name"
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="e.g. Laptop EMI"
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="payment-account">Account</label>
              <select
                id="payment-account"
                value={form.account}
                onChange={(e) => update('account', e.target.value)}
              >
                <option value="my">My Account</option>
                <option value="mom">Mom Account</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="payment-amount">Monthly Amount (₹)</label>
              <input
                id="payment-amount"
                type="number"
                value={form.monthlyAmount}
                onChange={(e) => update('monthlyAmount', e.target.value)}
                placeholder="5000"
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={form.isRecurring}
                onChange={(e) => update('isRecurring', e.target.checked)}
              />
              <span className="toggle-switch" />
              <span>Recurring (no end date)</span>
            </label>
          </div>

          {!form.isRecurring && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="payment-installments">Total Installments</label>
                <input
                  id="payment-installments"
                  type="number"
                  value={form.totalInstallments}
                  onChange={(e) => update('totalInstallments', e.target.value)}
                  placeholder="12"
                  min="1"
                />
              </div>
              <div className="form-group">
                <label htmlFor="payment-start">Start Date</label>
                <input
                  id="payment-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update('startDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {!form.isRecurring && (
            <div className="form-group">
              <label htmlFor="payment-already-paid">Already Paid EMIs (Optional)</label>
              <input
                id="payment-already-paid"
                type="number"
                value={form.alreadyPaid}
                onChange={(e) => update('alreadyPaid', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          )}

          <button type="submit" className="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Payment
          </button>
        </form>
      </div>
    </div>
  );
}
