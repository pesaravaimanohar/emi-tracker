import { useState } from 'react';

export default function PaymentCard({ payment, isPaid, completedCount, installmentNumber, onToggle, onDelete }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const progress = payment.isRecurring
    ? null
    : {
        completed: completedCount,
        total: payment.totalInstallments,
        percent: (completedCount / payment.totalInstallments) * 100,
      };

  const isAlmostDone = progress && progress.completed >= progress.total - 2;
  const isCompleted = progress && progress.completed >= progress.total;

  return (
    <div className={`payment-card ${isPaid ? 'paid' : ''} ${isCompleted ? 'completed-emi' : ''}`}>
      <div className="payment-card-left">
        <label className="checkbox-container" aria-label={`Mark ${payment.name} as paid`}>
          <input
            type="checkbox"
            checked={isPaid}
            onChange={onToggle}
            disabled={isCompleted}
          />
          <span className="checkmark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </label>
      </div>

      <div className="payment-card-center">
        <div className="payment-name-row">
          <span className={`payment-name ${isPaid ? 'struck' : ''}`}>{payment.name}</span>
          {payment.isRecurring && <span className="badge recurring">Recurring</span>}
          {isAlmostDone && !isCompleted && <span className="badge almost-done">Almost Done!</span>}
          {isCompleted && <span className="badge done">✓ Completed</span>}
        </div>

        {progress && !isCompleted && (
          <div className="payment-progress">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(progress.percent, 100)}%` }}
              />
            </div>
            <span className="progress-text">
              {progress.completed}/{progress.total} paid
              {installmentNumber && ` · EMI #${installmentNumber}`}
            </span>
          </div>
        )}
      </div>

      <div className="payment-card-right">
        <span className={`payment-amount ${isPaid ? 'struck' : ''}`}>
          ₹{payment.monthlyAmount.toLocaleString('en-IN')}
        </span>

        <button
          className="delete-btn"
          onClick={() => setShowConfirmDelete(true)}
          aria-label={`Delete ${payment.name}`}
          title="Delete"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {showConfirmDelete && (
        <div className="delete-confirm-overlay" onClick={() => setShowConfirmDelete(false)}>
          <div className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p>Delete <strong>{payment.name}</strong>?</p>
            <div className="delete-confirm-actions">
              <button className="btn-cancel" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
              <button className="btn-delete" onClick={onDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
