import { useEffect, useRef, useState } from 'react';

function AnimatedNumber({ value, prefix = '' }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === value) return;
    prevRef.current = value;

    const diff = value - prev;
    const steps = 20;
    const stepSize = diff / steps;
    let current = prev;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += stepSize;
      if (step >= steps) {
        setDisplayed(value);
        clearInterval(timer);
      } else {
        setDisplayed(Math.round(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{displayed.toLocaleString('en-IN')}</span>;
}

function CircularProgress({ percent, size = 72, strokeWidth = 6, color }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="circular-progress">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="14"
        fontWeight="700"
      >
        {Math.round(percent)}%
      </text>
    </svg>
  );
}

export default function SummaryDashboard({ totalStats, momStats, myStats }) {
  const paidPercent = totalStats.totalDue > 0
    ? (totalStats.totalPaid / totalStats.totalDue) * 100
    : 0;

  return (
    <div className="summary-dashboard">
      <div className="summary-main-card">
        <div className="summary-main-left">
          <CircularProgress
            percent={paidPercent}
            size={80}
            strokeWidth={7}
            color="url(#progressGradient)"
          />
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d9a6" />
                <stop offset="100%" stopColor="#667eea" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="summary-main-right">
          <div className="summary-stat">
            <span className="summary-stat-label">Total Due</span>
            <span className="summary-stat-value total">
              <AnimatedNumber value={totalStats.totalDue} prefix="₹" />
            </span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label">Paid</span>
            <span className="summary-stat-value paid">
              <AnimatedNumber value={totalStats.totalPaid} prefix="₹" />
            </span>
          </div>
          <div className="summary-stat">
            <span className="summary-stat-label">Remaining</span>
            <span className="summary-stat-value remaining">
              <AnimatedNumber value={totalStats.remaining} prefix="₹" />
            </span>
          </div>
        </div>
      </div>

      <div className="summary-accounts">
        <div className="summary-account-card mom">
          <div className="summary-account-icon">👩</div>
          <div className="summary-account-info">
            <span className="summary-account-name">Mom Account</span>
            <span className="summary-account-amount">
              <AnimatedNumber value={momStats.remaining} prefix="₹" />
              <span className="summary-account-suffix"> remaining</span>
            </span>
          </div>
          <div className="summary-account-badge">
            {momStats.paidCount}/{momStats.count}
          </div>
        </div>
        <div className="summary-account-card my">
          <div className="summary-account-icon">👤</div>
          <div className="summary-account-info">
            <span className="summary-account-name">My Account</span>
            <span className="summary-account-amount">
              <AnimatedNumber value={myStats.remaining} prefix="₹" />
              <span className="summary-account-suffix"> remaining</span>
            </span>
          </div>
          <div className="summary-account-badge">
            {myStats.paidCount}/{myStats.count}
          </div>
        </div>
      </div>
    </div>
  );
}
