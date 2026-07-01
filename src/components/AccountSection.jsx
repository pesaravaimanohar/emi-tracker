import { useState } from 'react';
import PaymentCard from './PaymentCard';

export default function AccountSection({
  title,
  icon,
  payments,
  stats,
  isPaid,
  getCompletedCount,
  getInstallmentNumber,
  onToggle,
  onDelete,
  accentClass,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`account-section ${accentClass}`}>
      <button
        className="account-header"
        onClick={() => setCollapsed(!collapsed)}
        aria-expanded={!collapsed}
      >
        <div className="account-header-left">
          <span className="account-icon">{icon}</span>
          <h3 className="account-title">{title}</h3>
          <span className="account-count">{payments.length} items</span>
        </div>
        <div className="account-header-right">
          <span className="account-total">
            ₹{stats.remaining.toLocaleString('en-IN')} due
          </span>
          <svg
            className={`collapse-chevron ${collapsed ? 'collapsed' : ''}`}
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div className={`account-body ${collapsed ? 'hidden' : ''}`}>
        {payments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎉</span>
            <p>All payments done for this month!</p>
          </div>
        ) : (
          payments.map((payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              isPaid={isPaid(payment.id)}
              completedCount={getCompletedCount(payment.id)}
              installmentNumber={getInstallmentNumber(payment)}
              onToggle={() => onToggle(payment.id)}
              onDelete={() => onDelete(payment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
