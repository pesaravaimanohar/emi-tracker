import { useMemo } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthNavigator({ selectedMonth, onMonthChange }) {
  const [year, month] = selectedMonth.split('-').map(Number);

  const displayLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = selectedMonth === currentKey;

  const goBack = () => {
    const d = new Date(year, month - 2, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(key);
  };

  const goForward = () => {
    const d = new Date(year, month, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    onMonthChange(key);
  };

  const goToday = () => {
    onMonthChange(currentKey);
  };

  // Generate surrounding months for the pill strip
  const months = useMemo(() => {
    const result = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date(year, month - 1 + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      result.push({
        key,
        label: MONTH_NAMES[d.getMonth()].slice(0, 3),
        year: d.getFullYear(),
        isSelected: key === selectedMonth,
        isCurrent: key === currentKey,
      });
    }
    return result;
  }, [selectedMonth]);

  return (
    <div className="month-navigator">
      <div className="month-nav-main">
        <button className="month-nav-arrow" onClick={goBack} aria-label="Previous month">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="month-nav-center">
          <h2 className="month-nav-title">{displayLabel}</h2>
          {!isCurrentMonth && (
            <button className="month-nav-today" onClick={goToday}>
              Today
            </button>
          )}
        </div>

        <button className="month-nav-arrow" onClick={goForward} aria-label="Next month">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="month-pills">
        {months.map((m) => (
          <button
            key={m.key}
            className={`month-pill ${m.isSelected ? 'active' : ''} ${m.isCurrent ? 'current' : ''}`}
            onClick={() => onMonthChange(m.key)}
          >
            <span className="month-pill-label">{m.label}</span>
            <span className="month-pill-year">{m.year}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
