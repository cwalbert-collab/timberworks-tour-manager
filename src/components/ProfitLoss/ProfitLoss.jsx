import { useMemo, useState, useRef } from 'react';
import { usePLOverrides } from '../../hooks/usePLOverrides';
import './ProfitLoss.css';

const QUARTERS = [
  { label: 'Q1', months: [0, 1, 2] },
  { label: 'Q2', months: [3, 4, 5] },
  { label: 'Q3', months: [6, 7, 8] },
  { label: 'Q4', months: [9, 10, 11] }
];

export default function ProfitLoss({
  shows,
  employees = [],
  fixedCosts = {},
  totalFixedCosts = 0,
  onUpdateFixedCost,
  onAddFixedCost,
  onRemoveFixedCost,
  onBulkFillTravel
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showQuarterly, setShowQuarterly] = useState(false);
  const [compareYear, setCompareYear] = useState(null);
  const [editingCost, setEditingCost] = useState(null);
  const [bulkFillResult, setBulkFillResult] = useState(null);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [editingLineItem, setEditingLineItem] = useState(null);
  const [newCostLabel, setNewCostLabel] = useState('');
  const [showNewCostInput, setShowNewCostInput] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [showScenarioSave, setShowScenarioSave] = useState(false);
  const printRef = useRef(null);

  const {
    rates,
    lineOverrides,
    scenarios,
    activeScenario,
    hasOverrides,
    updateRate,
    resetRates,
    setLineOverride,
    clearLineOverride,
    clearAllOverrides,
    saveScenario,
    loadScenario,
    deleteScenario,
    clearScenario,
    DEFAULT_RATES
  } = usePLOverrides();

  // Available years from show data
  const availableYears = useMemo(() => {
    const years = new Set();
    shows.forEach(s => {
      const year = new Date(s.startDate).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [shows]);

  // Annual payroll
  const annualPayroll = useMemo(() => {
    return employees
      .filter(e => e.isActive && e.employmentType === 'full_time')
      .reduce((sum, e) => sum + (e.annualSalary || 0), 0);
  }, [employees]);

  // Calculate P&L data using overridden rates
  const calculatePL = (showSet, payroll) => {
    const performanceFees = showSet.reduce((sum, s) => sum + (s.performanceFee || 0), 0);
    const merchandiseSales = showSet.reduce((sum, s) => sum + (s.merchandiseSales || 0), 0);
    const totalRevenue = performanceFees + merchandiseSales;

    const materialsUsed = showSet.reduce((sum, s) => sum + (s.materialsUsed || 0), 0);
    const otherExpenses = showSet.reduce((sum, s) => sum + (s.expenses || 0), 0);
    const totalCOGS = materialsUsed + otherExpenses;

    // Recalculate costs using overridden rates
    const mileageCost = showSet.reduce((sum, s) => sum + Math.round((s.mileage || 0) * rates.mileageRate * 100) / 100, 0);
    const hotelCost = showSet.reduce((sum, s) => {
      const r = rates.hotelRate;
      return sum + Math.round(r * (s.hotelRooms || 0) * (s.hotelNights || 0) * 100) / 100;
    }, 0);
    const dayRateCost = showSet.reduce((sum, s) => {
      const count = s.dayRateCount || 0;
      const days = s.durationDays || 1;
      return sum + (count * rates.dayRate * days);
    }, 0);

    const grossProfit = totalRevenue - totalCOGS;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const travelCost = mileageCost + hotelCost;
    const totalOperating = payroll + dayRateCost + travelCost + totalFixedCosts;

    const netIncome = grossProfit - totalOperating;
    const netMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    return {
      showCount: showSet.length,
      performanceFees,
      merchandiseSales,
      totalRevenue,
      materialsUsed,
      otherExpenses,
      totalCOGS,
      grossProfit,
      grossMargin,
      payroll,
      dayRateCost,
      mileageCost,
      hotelCost,
      travelCost,
      totalFixedCosts,
      fixedCostsDetail: fixedCosts,
      totalOperating,
      netIncome,
      netMargin
    };
  };

  // Filter shows by year
  const showsByYear = useMemo(() => {
    return shows.filter(s => new Date(s.startDate).getFullYear() === selectedYear);
  }, [shows, selectedYear]);

  // Full-year P&L
  const yearPL = useMemo(() => calculatePL(showsByYear, annualPayroll), [showsByYear, annualPayroll, fixedCosts, totalFixedCosts, rates]);

  // Quarterly P&L
  const quarterlyPL = useMemo(() => {
    return QUARTERS.map(q => {
      const qShows = showsByYear.filter(s => {
        const month = new Date(s.startDate).getMonth();
        return q.months.includes(month);
      });
      return {
        label: q.label,
        ...calculatePL(qShows, annualPayroll / 4)
      };
    });
  }, [showsByYear, annualPayroll, fixedCosts, totalFixedCosts, rates]);

  // Comparison year P&L
  const comparePL = useMemo(() => {
    if (!compareYear) return null;
    const compareShows = shows.filter(s => new Date(s.startDate).getFullYear() === compareYear);
    return calculatePL(compareShows, annualPayroll);
  }, [shows, compareYear, annualPayroll, fixedCosts, totalFixedCosts, rates]);

  const formatCurrency = (value) => {
    const abs = Math.abs(value);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(abs);
    return value < 0 ? `(${formatted})` : formatted;
  };

  const formatPercent = (value) => `${Math.round(value)}%`;

  // Variance between two values
  const renderVariance = (current, compare) => {
    if (compare === null || compare === undefined) return null;
    const diff = current - compare;
    const className = diff >= 0 ? 'variance-positive' : 'variance-negative';
    return <span className={`variance ${className}`}>{diff >= 0 ? '+' : ''}{formatCurrency(diff)}</span>;
  };

  // Export P&L as CSV
  const exportCSV = () => {
    const lines = [
      ['Timberworks Tour Manager - Profit & Loss Statement'],
      [`Year: ${selectedYear}`],
      ...(activeScenario ? [[`Scenario: ${activeScenario}`]] : []),
      [''],
      ['Category', 'Amount'],
      [''],
      ['REVENUE'],
      ['Performance Fees', yearPL.performanceFees],
      ['Merchandise Sales', yearPL.merchandiseSales],
      ['Total Revenue', yearPL.totalRevenue],
      [''],
      ['COST OF GOODS SOLD'],
      ['Materials Used', yearPL.materialsUsed],
      ['Other Show Expenses', yearPL.otherExpenses],
      ['Total COGS', yearPL.totalCOGS],
      [''],
      ['GROSS PROFIT', yearPL.grossProfit],
      [`Gross Margin`, `${Math.round(yearPL.grossMargin)}%`],
      [''],
      ['OPERATING EXPENSES'],
      ['Full-Time Payroll', yearPL.payroll],
      ['Day-Rate Labor', yearPL.dayRateCost],
      ['Mileage', yearPL.mileageCost],
      ['Hotels', yearPL.hotelCost],
      ...Object.entries(fixedCosts).map(([, c]) => [c.label, c.amount || 0]),
      ['Total Operating Expenses', yearPL.totalOperating],
      [''],
      ['NET INCOME', yearPL.netIncome],
      [`Net Margin`, `${Math.round(yearPL.netMargin)}%`],
      [''],
      ['RATE ASSUMPTIONS'],
      ['Mileage Rate ($/mi)', rates.mileageRate],
      ['Hotel Rate ($/night)', rates.hotelRate],
      ['Day Rate ($/person/day)', rates.dayRate]
    ];

    const csv = lines.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timberworks-pl-${selectedYear}${activeScenario ? `-${activeScenario}` : ''}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print P&L
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>P&L - Timberworks ${selectedYear}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 40px; color: #333; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            h2 { font-size: 14px; color: #666; margin-top: 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 6px 12px; text-align: left; font-size: 13px; }
            td:not(:first-child), th:not(:first-child) { text-align: right; }
            .section-header td { font-weight: 700; font-size: 13px; color: #1a1a1a; border-top: 2px solid #333; padding-top: 12px; }
            .subtotal td { font-weight: 600; border-top: 1px solid #ccc; }
            .total td { font-weight: 700; border-top: 2px solid #333; border-bottom: 2px solid #333; font-size: 14px; }
            .indent td:first-child { padding-left: 24px; }
            .negative { color: #c62828; }
            .muted { color: #999; font-size: 12px; }
            .overridden-value { color: #e65100; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>Timberworks Tour Manager</h1>
          <h2>Profit & Loss Statement — ${selectedYear} (${yearPL.showCount} shows)${activeScenario ? ` — Scenario: ${activeScenario}` : ''}</h2>
          ${printContent.querySelector('.pl-table-wrap').innerHTML}
          <p style="margin-top:20px;font-size:12px;color:#999;">Rates: Mileage $${rates.mileageRate}/mi | Hotel $${rates.hotelRate}/night | Day Rate $${rates.dayRate}/day</p>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // Handle adding a custom fixed cost
  const handleAddCost = () => {
    if (newCostLabel.trim() && onAddFixedCost) {
      onAddFixedCost(newCostLabel.trim());
      setNewCostLabel('');
      setShowNewCostInput(false);
    }
  };

  // Handle saving a scenario
  const handleSaveScenario = () => {
    if (scenarioName.trim()) {
      saveScenario(scenarioName.trim());
      setScenarioName('');
      setShowScenarioSave(false);
    }
  };

  // Render a P&L line item row with override support
  const PLRow = ({ label, lineKey, value, compareValue, className = '', indent = false }) => {
    const overridden = lineOverrides[lineKey] !== undefined;
    const displayValue = overridden ? lineOverrides[lineKey] : value;
    const isEditing = editingLineItem === lineKey;

    return (
      <tr className={`${className} ${indent ? 'indent' : ''} ${overridden ? 'overridden-row' : ''}`}>
        <td>
          {label}
          {overridden && (
            <button
              className="btn-clear-override"
              onClick={(e) => { e.stopPropagation(); clearLineOverride(lineKey); }}
              title="Clear override"
            >
              x
            </button>
          )}
        </td>
        <td
          className={`${displayValue < 0 ? 'negative' : ''} ${overridden ? 'overridden-value' : ''} editable-cell`}
          onClick={() => setEditingLineItem(lineKey)}
        >
          {isEditing ? (
            <input
              type="number"
              className="line-override-input"
              defaultValue={displayValue}
              autoFocus
              onBlur={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v !== value) {
                  setLineOverride(lineKey, v);
                } else if (v === value) {
                  clearLineOverride(lineKey);
                }
                setEditingLineItem(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.target.blur();
                if (e.key === 'Escape') setEditingLineItem(null);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            formatCurrency(displayValue)
          )}
        </td>
        {compareYear && (
          <>
            <td className={compareValue < 0 ? 'negative' : ''}>{compareValue !== undefined ? formatCurrency(compareValue) : ''}</td>
            <td>{compareValue !== undefined ? renderVariance(displayValue, compareValue) : ''}</td>
          </>
        )}
      </tr>
    );
  };

  const SectionHeader = ({ label }) => (
    <tr className="section-header">
      <td colSpan={compareYear ? 4 : 2}>{label}</td>
    </tr>
  );

  const SubtotalRow = ({ label, lineKey, value, compareValue }) => {
    const overridden = lineKey && lineOverrides[lineKey] !== undefined;
    const displayValue = overridden ? lineOverrides[lineKey] : value;

    return (
      <tr className={`subtotal ${overridden ? 'overridden-row' : ''}`}>
        <td>
          {label}
          {overridden && (
            <button className="btn-clear-override" onClick={() => clearLineOverride(lineKey)} title="Clear override">x</button>
          )}
        </td>
        <td
          className={`${displayValue < 0 ? 'negative' : ''} ${overridden ? 'overridden-value' : ''} ${lineKey ? 'editable-cell' : ''}`}
          onClick={lineKey ? () => setEditingLineItem(lineKey) : undefined}
        >
          {editingLineItem === lineKey ? (
            <input
              type="number"
              className="line-override-input"
              defaultValue={displayValue}
              autoFocus
              onBlur={(e) => {
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v !== value) setLineOverride(lineKey, v);
                else if (v === value) clearLineOverride(lineKey);
                setEditingLineItem(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.target.blur();
                if (e.key === 'Escape') setEditingLineItem(null);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : formatCurrency(displayValue)}
        </td>
        {compareYear && (
          <>
            <td className={compareValue < 0 ? 'negative' : ''}>{compareValue !== undefined ? formatCurrency(compareValue) : ''}</td>
            <td>{compareValue !== undefined ? renderVariance(displayValue, compareValue) : ''}</td>
          </>
        )}
      </tr>
    );
  };

  const TotalRow = ({ label, value, compareValue, percent, comparePercent }) => (
    <tr className="total">
      <td>{label}{percent !== undefined ? ` (${formatPercent(percent)})` : ''}</td>
      <td className={value < 0 ? 'negative' : ''}>{formatCurrency(value)}</td>
      {compareYear && (
        <>
          <td className={compareValue < 0 ? 'negative' : ''}>
            {compareValue !== undefined ? formatCurrency(compareValue) : ''}
            {comparePercent !== undefined ? ` (${formatPercent(comparePercent)})` : ''}
          </td>
          <td>{compareValue !== undefined ? renderVariance(value, compareValue) : ''}</td>
        </>
      )}
    </tr>
  );

  return (
    <div className="pl-container">
      {/* Controls */}
      <div className="pl-controls">
        <div className="pl-controls-left">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="pl-year-select"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <label className="pl-toggle">
            <input
              type="checkbox"
              checked={showQuarterly}
              onChange={(e) => setShowQuarterly(e.target.checked)}
            />
            Quarterly Breakdown
          </label>
          <button
            className={`btn-pl-action ${showAssumptions ? 'active' : ''}`}
            onClick={() => setShowAssumptions(!showAssumptions)}
          >
            Assumptions
          </button>
        </div>
        <div className="pl-controls-right">
          {/* Scenario controls */}
          {scenarios.length > 0 && (
            <select
              value={activeScenario || ''}
              onChange={(e) => {
                if (e.target.value) loadScenario(e.target.value);
                else clearScenario();
              }}
              className="pl-compare-select"
            >
              <option value="">Actual</option>
              {scenarios.map(s => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
          )}
          {hasOverrides && (
            <button className="btn-pl-action" onClick={() => setShowScenarioSave(true)}>Save Scenario</button>
          )}
          <select
            value={compareYear || ''}
            onChange={(e) => setCompareYear(e.target.value ? parseInt(e.target.value) : null)}
            className="pl-compare-select"
          >
            <option value="">Compare to...</option>
            {availableYears.filter(y => y !== selectedYear).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button className="btn-pl-action" onClick={exportCSV}>Export CSV</button>
          <button className="btn-pl-action" onClick={handlePrint}>Print / PDF</button>
        </div>
      </div>

      {/* Scenario Save Dialog */}
      {showScenarioSave && (
        <div className="pl-scenario-save">
          <input
            type="text"
            placeholder="Scenario name (e.g. Budget 2025, Optimistic)"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveScenario(); }}
            autoFocus
            className="scenario-name-input"
          />
          <button className="btn-bulk-fill btn-small" onClick={handleSaveScenario}>Save</button>
          <button className="btn-pl-action btn-small" onClick={() => setShowScenarioSave(false)}>Cancel</button>
          {activeScenario && (
            <button className="btn-pl-action btn-small btn-danger" onClick={() => { deleteScenario(activeScenario); setShowScenarioSave(false); }}>Delete "{activeScenario}"</button>
          )}
        </div>
      )}

      {/* Override indicator */}
      {hasOverrides && (
        <div className="pl-override-banner">
          <span>Modified assumptions active{activeScenario ? ` (${activeScenario})` : ''}</span>
          <div className="override-banner-actions">
            {Object.keys(lineOverrides).length > 0 && (
              <button className="btn-pl-action btn-small" onClick={clearAllOverrides}>Clear Line Overrides</button>
            )}
            <button className="btn-pl-action btn-small" onClick={() => { resetRates(); clearAllOverrides(); }}>Reset All</button>
          </div>
        </div>
      )}

      {/* Rate Assumptions Panel */}
      {showAssumptions && (
        <div className="pl-assumptions">
          <h3>Rate Assumptions</h3>
          <div className="assumptions-grid">
            <div className="assumption-item">
              <label className="assumption-label">Mileage Rate</label>
              <div className="assumption-input-row">
                <span className="assumption-prefix">$</span>
                <input
                  type="number"
                  value={rates.mileageRate}
                  onChange={(e) => updateRate('mileageRate', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className="assumption-input"
                />
                <span className="assumption-suffix">/mi</span>
              </div>
              <span className="assumption-note">IRS standard: ${DEFAULT_RATES.mileageRate}/mi</span>
            </div>
            <div className="assumption-item">
              <label className="assumption-label">Hotel Rate</label>
              <div className="assumption-input-row">
                <span className="assumption-prefix">$</span>
                <input
                  type="number"
                  value={rates.hotelRate}
                  onChange={(e) => updateRate('hotelRate', parseFloat(e.target.value) || 0)}
                  step="1"
                  min="0"
                  className="assumption-input"
                />
                <span className="assumption-suffix">/night</span>
              </div>
              <span className="assumption-note">Default estimate: ${DEFAULT_RATES.hotelRate}/night</span>
            </div>
            <div className="assumption-item">
              <label className="assumption-label">Day Rate Pay</label>
              <div className="assumption-input-row">
                <span className="assumption-prefix">$</span>
                <input
                  type="number"
                  value={rates.dayRate}
                  onChange={(e) => updateRate('dayRate', parseFloat(e.target.value) || 0)}
                  step="1"
                  min="0"
                  className="assumption-input"
                />
                <span className="assumption-suffix">/person/day</span>
              </div>
              <span className="assumption-note">Standard: ${DEFAULT_RATES.dayRate}/person/day</span>
            </div>
          </div>
          {(rates.mileageRate !== DEFAULT_RATES.mileageRate ||
            rates.hotelRate !== DEFAULT_RATES.hotelRate ||
            rates.dayRate !== DEFAULT_RATES.dayRate) && (
            <button className="btn-pl-action btn-small" onClick={resetRates} style={{ marginTop: 8 }}>Reset to Defaults</button>
          )}
        </div>
      )}

      {/* Fixed Costs Editor */}
      <div className="pl-fixed-costs">
        <h3>Annual Fixed Costs <span className="pl-fixed-total">{formatCurrency(totalFixedCosts)}/yr</span></h3>
        <div className="fixed-costs-grid">
          {Object.entries(fixedCosts).map(([key, cost]) => (
            <div key={key} className="fixed-cost-item">
              <div className="fixed-cost-header">
                <label className="fixed-cost-label">{cost.label}</label>
                {cost.custom && onRemoveFixedCost && (
                  <button
                    className="btn-remove-cost"
                    onClick={() => onRemoveFixedCost(key)}
                    title="Remove category"
                  >
                    x
                  </button>
                )}
              </div>
              <div className="fixed-cost-input-row">
                <span className="fixed-cost-dollar">$</span>
                <input
                  type="number"
                  value={editingCost === key ? (cost.amount || '') : (cost.amount || 0)}
                  onFocus={() => setEditingCost(key)}
                  onBlur={() => setEditingCost(null)}
                  onChange={(e) => onUpdateFixedCost(key, { amount: parseFloat(e.target.value) || 0 })}
                  min="0"
                  placeholder="0"
                  className="fixed-cost-input"
                />
                <span className="fixed-cost-period">/yr</span>
              </div>
              {cost.custom ? (
                <input
                  type="text"
                  value={cost.notes}
                  onChange={(e) => onUpdateFixedCost(key, { notes: e.target.value })}
                  placeholder="Notes..."
                  className="fixed-cost-notes-input"
                />
              ) : (
                <span className="fixed-cost-notes">{cost.notes}</span>
              )}
            </div>
          ))}

          {/* Add Custom Category */}
          {showNewCostInput ? (
            <div className="fixed-cost-item new-cost-item">
              <input
                type="text"
                value={newCostLabel}
                onChange={(e) => setNewCostLabel(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCost(); if (e.key === 'Escape') setShowNewCostInput(false); }}
                placeholder="Category name..."
                className="fixed-cost-input"
                autoFocus
              />
              <div className="new-cost-actions">
                <button className="btn-bulk-fill btn-small" onClick={handleAddCost}>Add</button>
                <button className="btn-pl-action btn-small" onClick={() => { setShowNewCostInput(false); setNewCostLabel(''); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="btn-add-cost" onClick={() => setShowNewCostInput(true)}>
              + Add Category
            </button>
          )}
        </div>
      </div>

      {/* Bulk Fill Travel Costs */}
      {onBulkFillTravel && (() => {
        const missingMileage = shows.filter(s => !s.mileage || s.mileage === 0).length;
        const missingHotel = shows.filter(s => (!s.hotelNights || s.hotelNights === 0) && (!s.hotelRooms || s.hotelRooms === 0)).length;
        const hasMissing = missingMileage > 0 || missingHotel > 0;
        return (
          <div className="pl-bulk-fill">
            <div className="bulk-fill-info">
              <span className="bulk-fill-label">Travel Cost Estimates</span>
              <span className="bulk-fill-stats">
                {missingMileage} show{missingMileage !== 1 ? 's' : ''} missing mileage, {missingHotel} missing hotel data
              </span>
            </div>
            <div className="bulk-fill-actions">
              {hasMissing ? (
                <button
                  className="btn-bulk-fill"
                  onClick={() => {
                    const count = onBulkFillTravel();
                    setBulkFillResult(`Updated ${count} show${count !== 1 ? 's' : ''} with estimated travel costs`);
                    setTimeout(() => setBulkFillResult(null), 4000);
                  }}
                >
                  Auto-Fill {missingMileage + missingHotel > 0 ? `(${Math.max(missingMileage, missingHotel)} shows)` : ''}
                </button>
              ) : (
                <span className="bulk-fill-done">All shows have travel data</span>
              )}
              {bulkFillResult && <span className="bulk-fill-result">{bulkFillResult}</span>}
            </div>
          </div>
        );
      })()}

      {/* P&L Statement */}
      <div className="pl-statement" ref={printRef}>
        <div className="pl-header">
          <h2>Profit & Loss Statement</h2>
          <p className="pl-subtitle">
            {selectedYear} — {yearPL.showCount} shows
            {activeScenario && <span className="scenario-badge">{activeScenario}</span>}
          </p>
          <p className="pl-hint">Click any value to override</p>
        </div>

        <div className="pl-table-wrap">
          <table className="pl-table">
            <thead>
              <tr>
                <th></th>
                <th>{selectedYear}</th>
                {compareYear && <th>{compareYear}</th>}
                {compareYear && <th>Variance</th>}
              </tr>
            </thead>
            <tbody>
              <SectionHeader label="REVENUE" />
              <PLRow label="Performance Fees" lineKey="performanceFees" value={yearPL.performanceFees} compareValue={comparePL?.performanceFees} indent />
              <PLRow label="Merchandise Sales" lineKey="merchandiseSales" value={yearPL.merchandiseSales} compareValue={comparePL?.merchandiseSales} indent />
              <SubtotalRow label="Total Revenue" lineKey="totalRevenue" value={yearPL.totalRevenue} compareValue={comparePL?.totalRevenue} />

              <SectionHeader label="COST OF GOODS SOLD" />
              <PLRow label="Materials Used" lineKey="materialsUsed" value={yearPL.materialsUsed} compareValue={comparePL?.materialsUsed} indent />
              <PLRow label="Other Show Expenses" lineKey="otherExpenses" value={yearPL.otherExpenses} compareValue={comparePL?.otherExpenses} indent />
              <SubtotalRow label="Total COGS" lineKey="totalCOGS" value={yearPL.totalCOGS} compareValue={comparePL?.totalCOGS} />

              <TotalRow
                label="GROSS PROFIT"
                value={yearPL.grossProfit}
                compareValue={comparePL?.grossProfit}
                percent={yearPL.grossMargin}
                comparePercent={comparePL?.grossMargin}
              />

              <SectionHeader label="OPERATING EXPENSES" />
              <PLRow label="Full-Time Payroll" lineKey="payroll" value={yearPL.payroll} compareValue={comparePL?.payroll} indent />
              <PLRow label="Day-Rate Labor" lineKey="dayRateCost" value={yearPL.dayRateCost} compareValue={comparePL?.dayRateCost} indent />
              <PLRow label={`Mileage ($${rates.mileageRate}/mi)`} lineKey="mileageCost" value={yearPL.mileageCost} compareValue={comparePL?.mileageCost} indent />
              <PLRow label={`Hotels ($${rates.hotelRate}/night)`} lineKey="hotelCost" value={yearPL.hotelCost} compareValue={comparePL?.hotelCost} indent />
              {Object.entries(fixedCosts).map(([key, cost]) => (
                <PLRow key={key} label={cost.label} lineKey={`fixed_${key}`} value={cost.amount || 0} compareValue={cost.amount || 0} indent />
              ))}
              <SubtotalRow label="Total Operating Expenses" lineKey="totalOperating" value={yearPL.totalOperating} compareValue={comparePL?.totalOperating} />

              <TotalRow
                label="NET INCOME"
                value={yearPL.netIncome}
                compareValue={comparePL?.netIncome}
                percent={yearPL.netMargin}
                comparePercent={comparePL?.netMargin}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Quarterly Breakdown */}
      {showQuarterly && (
        <div className="pl-quarterly">
          <h3>Quarterly Breakdown — {selectedYear}</h3>
          <div className="pl-table-wrap">
            <table className="pl-table quarterly">
              <thead>
                <tr>
                  <th></th>
                  {quarterlyPL.map(q => <th key={q.label}>{q.label}</th>)}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="section-header"><td colSpan={6}>REVENUE</td></tr>
                <tr className="indent">
                  <td>Performance Fees</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.performanceFees)}</td>)}
                  <td>{formatCurrency(yearPL.performanceFees)}</td>
                </tr>
                <tr className="indent">
                  <td>Merchandise Sales</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.merchandiseSales)}</td>)}
                  <td>{formatCurrency(yearPL.merchandiseSales)}</td>
                </tr>
                <tr className="subtotal">
                  <td>Total Revenue</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.totalRevenue)}</td>)}
                  <td>{formatCurrency(yearPL.totalRevenue)}</td>
                </tr>

                <tr className="section-header"><td colSpan={6}>COST OF GOODS SOLD</td></tr>
                <tr className="indent">
                  <td>Materials Used</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.materialsUsed)}</td>)}
                  <td>{formatCurrency(yearPL.materialsUsed)}</td>
                </tr>
                <tr className="indent">
                  <td>Other Show Expenses</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.otherExpenses)}</td>)}
                  <td>{formatCurrency(yearPL.otherExpenses)}</td>
                </tr>
                <tr className="subtotal">
                  <td>Total COGS</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.totalCOGS)}</td>)}
                  <td>{formatCurrency(yearPL.totalCOGS)}</td>
                </tr>

                <tr className="total">
                  <td>GROSS PROFIT ({formatPercent(yearPL.grossMargin)})</td>
                  {quarterlyPL.map(q => <td key={q.label} className={q.grossProfit < 0 ? 'negative' : ''}>{formatCurrency(q.grossProfit)}</td>)}
                  <td className={yearPL.grossProfit < 0 ? 'negative' : ''}>{formatCurrency(yearPL.grossProfit)}</td>
                </tr>

                <tr className="section-header"><td colSpan={6}>OPERATING EXPENSES</td></tr>
                <tr className="indent">
                  <td>Full-Time Payroll</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.payroll)}</td>)}
                  <td>{formatCurrency(yearPL.payroll)}</td>
                </tr>
                <tr className="indent">
                  <td>Day-Rate Labor</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.dayRateCost)}</td>)}
                  <td>{formatCurrency(yearPL.dayRateCost)}</td>
                </tr>
                <tr className="indent">
                  <td>Mileage (${rates.mileageRate}/mi)</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.mileageCost)}</td>)}
                  <td>{formatCurrency(yearPL.mileageCost)}</td>
                </tr>
                <tr className="indent">
                  <td>Hotels (${rates.hotelRate}/night)</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.hotelCost)}</td>)}
                  <td>{formatCurrency(yearPL.hotelCost)}</td>
                </tr>
                {Object.entries(fixedCosts).map(([key, cost]) => (
                  <tr key={key} className="indent">
                    <td>{cost.label}</td>
                    {quarterlyPL.map(q => <td key={q.label}>{formatCurrency((cost.amount || 0) / 4)}</td>)}
                    <td>{formatCurrency(cost.amount || 0)}</td>
                  </tr>
                ))}
                <tr className="subtotal">
                  <td>Total Operating</td>
                  {quarterlyPL.map(q => <td key={q.label}>{formatCurrency(q.totalOperating)}</td>)}
                  <td>{formatCurrency(yearPL.totalOperating)}</td>
                </tr>

                <tr className="total">
                  <td>NET INCOME ({formatPercent(yearPL.netMargin)})</td>
                  {quarterlyPL.map(q => <td key={q.label} className={q.netIncome < 0 ? 'negative' : ''}>{formatCurrency(q.netIncome)}</td>)}
                  <td className={yearPL.netIncome < 0 ? 'negative' : ''}>{formatCurrency(yearPL.netIncome)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
