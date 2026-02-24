import { useMemo, useState } from 'react';
import { exportDashboardSummary } from '../../utils/exportUtils';
import { STANDARD_DAY_RATE } from '../../data/sampleData';
import './Dashboard.css';

export default function Dashboard({ shows, contacts = [], venues = [], employees = [], onNavigateToRevenue, onNavigateToContact }) {
  // Get available years from data
  const availableYears = useMemo(() => {
    const years = new Set();
    shows.forEach(s => {
      const year = new Date(s.startDate).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a); // Most recent first
  }, [shows]);

  // Default to current year or most recent year with data
  const currentYear = new Date().getFullYear();
  const defaultYear = availableYears.includes(currentYear) ? currentYear : availableYears[0] || currentYear;
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  // Calculate days worked from show durations
  const calculateDaysWorked = (showList) => {
    return showList.reduce((sum, s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0);
  };

  // Filter shows by year
  const showsByYear = useMemo(() => {
    return shows.filter(s => new Date(s.startDate).getFullYear() === selectedYear);
  }, [shows, selectedYear]);

  // Calculate annual payroll from full-time employees
  const annualPayroll = useMemo(() => {
    return employees
      .filter(e => e.isActive && e.employmentType === 'full_time')
      .reduce((sum, e) => sum + (e.annualSalary || 0), 0);
  }, [employees]);

  // Calculate aggregate metrics for ALL TIME
  const allTimeMetrics = useMemo(() => {
    const totalShows = shows.length;
    const totalRevenue = shows.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
    const totalMerch = shows.reduce((sum, s) => sum + (s.merchandiseSales || 0), 0);
    const totalFees = shows.reduce((sum, s) => sum + (s.performanceFee || 0), 0);
    const totalExpenses = shows.reduce((sum, s) => sum + (s.expenses || 0) + (s.materialsUsed || 0), 0);
    const totalDayRateCost = shows.reduce((sum, s) => sum + (s.dayRateCost || 0), 0);
    const totalMileageCost = shows.reduce((sum, s) => sum + (s.mileageCost || 0), 0);
    const daysWorked = calculateDaysWorked(shows);

    // Count unique years for payroll spread
    const yearsSpanned = new Set(shows.map(s => new Date(s.startDate).getFullYear())).size || 1;
    const totalPayroll = annualPayroll * yearsSpanned;

    // Payroll share per show: total payroll / total show-days * this show's days
    const payrollPerDay = daysWorked > 0 ? totalPayroll / daysWorked : 0;
    const totalProfit = totalRevenue - totalExpenses - totalDayRateCost - totalMileageCost - totalPayroll;
    const avgProfit = totalShows > 0 ? totalProfit / totalShows : 0;

    return { totalShows, totalRevenue, totalProfit, totalMerch, totalFees, totalExpenses, totalDayRateCost, totalMileageCost, totalPayroll, avgProfit, daysWorked, payrollPerDay };
  }, [shows, annualPayroll]);

  // Calculate metrics for SELECTED YEAR
  const yearlyMetrics = useMemo(() => {
    const totalShows = showsByYear.length;
    const totalRevenue = showsByYear.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
    const totalMerch = showsByYear.reduce((sum, s) => sum + (s.merchandiseSales || 0), 0);
    const totalFees = showsByYear.reduce((sum, s) => sum + (s.performanceFee || 0), 0);
    const totalExpenses = showsByYear.reduce((sum, s) => sum + (s.expenses || 0) + (s.materialsUsed || 0), 0);
    const totalDayRateCost = showsByYear.reduce((sum, s) => sum + (s.dayRateCost || 0), 0);
    const totalMileageCost = showsByYear.reduce((sum, s) => sum + (s.mileageCost || 0), 0);
    const daysWorked = calculateDaysWorked(showsByYear);

    // Payroll share: spread annual payroll across show-days for this year
    const payrollPerDay = daysWorked > 0 ? annualPayroll / daysWorked : 0;
    const totalProfit = totalRevenue - totalExpenses - totalDayRateCost - totalMileageCost - annualPayroll;
    const avgProfit = totalShows > 0 ? totalProfit / totalShows : 0;

    return { totalShows, totalRevenue, totalProfit, totalMerch, totalFees, totalExpenses, totalDayRateCost, totalMileageCost, annualPayroll, avgProfit, daysWorked, payrollPerDay };
  }, [showsByYear, annualPayroll]);

  // Calculate per-team metrics for SELECTED YEAR
  const yearlyTeamMetrics = useMemo(() => {
    const redTeam = showsByYear.filter(s => s.tour === 'Red Team');
    const blueTeam = showsByYear.filter(s => s.tour === 'Blue Team');
    const totalDaysAllTeams = calculateDaysWorked(showsByYear);

    const calcTeamStats = (teamShows) => {
      const showCount = teamShows.length;
      const revenue = teamShows.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
      const merch = teamShows.reduce((sum, s) => sum + (s.merchandiseSales || 0), 0);
      const expenses = teamShows.reduce((sum, s) => sum + (s.expenses || 0) + (s.materialsUsed || 0), 0);
      const dayRateCost = teamShows.reduce((sum, s) => sum + (s.dayRateCost || 0), 0);
      const mileageCost = teamShows.reduce((sum, s) => sum + (s.mileageCost || 0), 0);
      const daysWorked = calculateDaysWorked(teamShows);
      // Proportional payroll share based on days worked
      const payrollShare = totalDaysAllTeams > 0 ? annualPayroll * (daysWorked / totalDaysAllTeams) : 0;
      const profit = revenue - expenses - dayRateCost - mileageCost - payrollShare;
      const avgPerShow = showCount > 0 ? profit / showCount : 0;
      const uniqueVenues = new Set(teamShows.map(s => s.venueId)).size;
      return { showCount, revenue, profit, merch, daysWorked, avgPerShow, uniqueVenues };
    };

    return {
      red: calcTeamStats(redTeam),
      blue: calcTeamStats(blueTeam)
    };
  }, [showsByYear, annualPayroll]);

  // Calculate per-team metrics for ALL TIME
  const allTimeTeamMetrics = useMemo(() => {
    const redTeam = shows.filter(s => s.tour === 'Red Team');
    const blueTeam = shows.filter(s => s.tour === 'Blue Team');
    const totalDaysAllTeams = calculateDaysWorked(shows);
    const yearsSpanned = new Set(shows.map(s => new Date(s.startDate).getFullYear())).size || 1;
    const totalPayroll = annualPayroll * yearsSpanned;

    const calcTeamStats = (teamShows) => {
      const showCount = teamShows.length;
      const revenue = teamShows.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
      const merch = teamShows.reduce((sum, s) => sum + (s.merchandiseSales || 0), 0);
      const expenses = teamShows.reduce((sum, s) => sum + (s.expenses || 0) + (s.materialsUsed || 0), 0);
      const dayRateCost = teamShows.reduce((sum, s) => sum + (s.dayRateCost || 0), 0);
      const mileageCost = teamShows.reduce((sum, s) => sum + (s.mileageCost || 0), 0);
      const daysWorked = calculateDaysWorked(teamShows);
      const payrollShare = totalDaysAllTeams > 0 ? totalPayroll * (daysWorked / totalDaysAllTeams) : 0;
      const profit = revenue - expenses - dayRateCost - mileageCost - payrollShare;
      const avgPerShow = showCount > 0 ? profit / showCount : 0;
      const uniqueVenues = new Set(teamShows.map(s => s.venueId)).size;
      return { showCount, revenue, profit, merch, daysWorked, avgPerShow, uniqueVenues };
    };

    return {
      red: calcTeamStats(redTeam),
      blue: calcTeamStats(blueTeam)
    };
  }, [shows, annualPayroll]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate percentage for breakdown bars
  const getPercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Calculate follow-up reminders
  const followUpReminders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reminders = contacts
      .filter(c => c.followUpDate)
      .map(contact => {
        const followUp = new Date(contact.followUpDate + 'T00:00:00');
        const diffDays = Math.ceil((followUp - today) / (1000 * 60 * 60 * 24));
        const venue = venues.find(v => v.id === contact.venueId);
        return {
          ...contact,
          diffDays,
          venueName: venue?.name || 'Independent',
          isOverdue: diffDays < 0,
          isToday: diffDays === 0,
          isSoon: diffDays > 0 && diffDays <= 7
        };
      })
      .filter(r => r.diffDays <= 14) // Show reminders for next 2 weeks
      .sort((a, b) => a.diffDays - b.diffDays);

    return {
      overdue: reminders.filter(r => r.isOverdue),
      today: reminders.filter(r => r.isToday),
      upcoming: reminders.filter(r => !r.isOverdue && !r.isToday && r.isSoon),
      all: reminders
    };
  }, [contacts, venues]);

  // Format follow-up date for display
  const formatFollowUpDate = (diffDays, date) => {
    if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Render team card with all metrics
  const renderTeamCard = (team, teamData, className) => (
    <div className={`team-card ${className}`}>
      <div className="team-card-header">{team}</div>
      <div className="team-card-stats expanded">
        <div className="stat-item">
          <span className="stat-label">Shows</span>
          <span className="stat-value">{teamData.showCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Revenue</span>
          <span className="stat-value">{formatCurrency(teamData.revenue)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Profit</span>
          <span className="stat-value">{formatCurrency(teamData.profit)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Merch Sales</span>
          <span className="stat-value">{formatCurrency(teamData.merch)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Days Worked</span>
          <span className="stat-value">{teamData.daysWorked}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Profit/Show</span>
          <span className="stat-value">{formatCurrency(teamData.avgPerShow)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {/* Follow-up Reminders - MOVED TO TOP */}
      {followUpReminders.all.length > 0 && (
        <section className="follow-up-reminders priority">
          <h3>
            Follow-up Reminders
            {followUpReminders.overdue.length > 0 && (
              <span className="overdue-count">{followUpReminders.overdue.length} overdue</span>
            )}
          </h3>
          <div className="reminders-list">
            {followUpReminders.all.map(reminder => (
              <div
                key={reminder.id}
                className={`reminder-item ${reminder.isOverdue ? 'overdue' : ''} ${reminder.isToday ? 'today' : ''}`}
                onClick={() => onNavigateToContact?.(reminder.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onNavigateToContact?.(reminder.id)}
              >
                <div className="reminder-contact">
                  <span className="reminder-name">{reminder.firstName} {reminder.lastName}</span>
                  <span className="reminder-venue">{reminder.venueName}</span>
                </div>
                <div className={`reminder-date ${reminder.isOverdue ? 'overdue' : ''} ${reminder.isToday ? 'today' : ''}`}>
                  {reminder.isOverdue && <span className="reminder-icon">⚠️</span>}
                  {reminder.isToday && <span className="reminder-icon">📞</span>}
                  {!reminder.isOverdue && !reminder.isToday && <span className="reminder-icon">📅</span>}
                  {formatFollowUpDate(reminder.diffDays, reminder.followUpDate)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Year Selector Tabs */}
      <section className="year-selector">
        <div className="year-tabs">
          {availableYears.map(year => (
            <button
              key={year}
              className={`year-tab ${selectedYear === year ? 'active' : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      {/* Yearly Summary Cards */}
      <section className="summary-section">
        <h3 className="section-title">{selectedYear} Overview</h3>
        <div className="summary-cards">
          <div className="summary-card">
            <span className="summary-card-title">Shows</span>
            <span className="summary-card-value">{yearlyMetrics.totalShows}</span>
          </div>
          <div
            className="summary-card clickable"
            onClick={onNavigateToRevenue}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigateToRevenue?.()}
            title="Click to view revenue details"
          >
            <span className="summary-card-title">Revenue</span>
            <span className="summary-card-value">{formatCurrency(yearlyMetrics.totalRevenue)}</span>
            <span className="card-link-hint">View details &rarr;</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Profit</span>
            <span className="summary-card-value highlight">{formatCurrency(yearlyMetrics.totalProfit)}</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Days Worked</span>
            <span className="summary-card-value">{yearlyMetrics.daysWorked}</span>
          </div>
          <div className="summary-card">
            <span className="summary-card-title">Avg Profit/Show</span>
            <span className="summary-card-value">{formatCurrency(yearlyMetrics.avgProfit)}</span>
          </div>
        </div>
      </section>

      {/* Yearly Team Breakdown */}
      <section className="team-section">
        <h3 className="section-title">{selectedYear} Team Breakdown</h3>
        <div className="team-breakdown">
          {renderTeamCard('Red Team', yearlyTeamMetrics.red, 'red')}
          {renderTeamCard('Blue Team', yearlyTeamMetrics.blue, 'blue')}
        </div>
      </section>

      {/* All Time Overview */}
      <section className="all-time-section">
        <h3 className="section-title">All Time Overview</h3>
        <div className="summary-cards all-time">
          <div className="summary-card compact">
            <span className="summary-card-title">Total Shows</span>
            <span className="summary-card-value">{allTimeMetrics.totalShows}</span>
          </div>
          <div className="summary-card compact">
            <span className="summary-card-title">Total Revenue</span>
            <span className="summary-card-value">{formatCurrency(allTimeMetrics.totalRevenue)}</span>
          </div>
          <div className="summary-card compact">
            <span className="summary-card-title">Total Profit</span>
            <span className="summary-card-value highlight">{formatCurrency(allTimeMetrics.totalProfit)}</span>
          </div>
          <div className="summary-card compact">
            <span className="summary-card-title">Total Days</span>
            <span className="summary-card-value">{allTimeMetrics.daysWorked}</span>
          </div>
        </div>

        {/* All Time Team Comparison */}
        <div className="team-breakdown compact">
          <div className="team-card red compact">
            <div className="team-card-header">Red Team (All Time)</div>
            <div className="team-card-stats compact-row">
              <div className="stat-item inline">
                <span className="stat-label">Shows:</span>
                <span className="stat-value">{allTimeTeamMetrics.red.showCount}</span>
              </div>
              <div className="stat-item inline">
                <span className="stat-label">Revenue:</span>
                <span className="stat-value">{formatCurrency(allTimeTeamMetrics.red.revenue)}</span>
              </div>
              <div className="stat-item inline">
                <span className="stat-label">Profit:</span>
                <span className="stat-value">{formatCurrency(allTimeTeamMetrics.red.profit)}</span>
              </div>
            </div>
          </div>
          <div className="team-card blue compact">
            <div className="team-card-header">Blue Team (All Time)</div>
            <div className="team-card-stats compact-row">
              <div className="stat-item inline">
                <span className="stat-label">Shows:</span>
                <span className="stat-value">{allTimeTeamMetrics.blue.showCount}</span>
              </div>
              <div className="stat-item inline">
                <span className="stat-label">Revenue:</span>
                <span className="stat-value">{formatCurrency(allTimeTeamMetrics.blue.revenue)}</span>
              </div>
              <div className="stat-item inline">
                <span className="stat-label">Profit:</span>
                <span className="stat-value">{formatCurrency(allTimeTeamMetrics.blue.profit)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Breakdown (for selected year) */}
      <section className="revenue-breakdown">
        <h3>{selectedYear} Revenue Breakdown</h3>
        <div className="breakdown-item">
          <div className="breakdown-label">
            <span>Performance Fees</span>
            <span>{formatCurrency(yearlyMetrics.totalFees)} ({getPercentage(yearlyMetrics.totalFees, yearlyMetrics.totalRevenue)}%)</span>
          </div>
          <div className="breakdown-bar-track">
            <div
              className="breakdown-bar-fill fees"
              style={{ width: `${getPercentage(yearlyMetrics.totalFees, yearlyMetrics.totalRevenue)}%` }}
            />
          </div>
        </div>
        <div className="breakdown-item">
          <div className="breakdown-label">
            <span>Merchandise</span>
            <span>{formatCurrency(yearlyMetrics.totalMerch)} ({getPercentage(yearlyMetrics.totalMerch, yearlyMetrics.totalRevenue)}%)</span>
          </div>
          <div className="breakdown-bar-track">
            <div
              className="breakdown-bar-fill merch"
              style={{ width: `${getPercentage(yearlyMetrics.totalMerch, yearlyMetrics.totalRevenue)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Costs Overview (for selected year) */}
      <section className="costs-overview">
        <h3>{selectedYear} Costs Overview</h3>
        <div className="costs-row">
          <div className="cost-item">
            <span className="cost-label">Full-Time Payroll</span>
            <span className="cost-value">{formatCurrency(annualPayroll)}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Day-Rate Labor</span>
            <span className="cost-value">{formatCurrency(yearlyMetrics.totalDayRateCost)}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Materials & Expenses</span>
            <span className="cost-value">{formatCurrency(yearlyMetrics.totalExpenses)}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Mileage</span>
            <span className="cost-value">{formatCurrency(yearlyMetrics.totalMileageCost)}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Total Costs</span>
            <span className="cost-value">{formatCurrency(annualPayroll + yearlyMetrics.totalDayRateCost + yearlyMetrics.totalExpenses + yearlyMetrics.totalMileageCost)}</span>
          </div>
        </div>
        <div className="costs-row">
          <div className="cost-item">
            <span className="cost-label">Net Profit</span>
            <span className="cost-value highlight">{formatCurrency(yearlyMetrics.totalProfit)}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Profit Margin</span>
            <span className="cost-value highlight">
              {yearlyMetrics.totalRevenue > 0 ? Math.round((yearlyMetrics.totalProfit / yearlyMetrics.totalRevenue) * 100) : 0}%
            </span>
          </div>
        </div>
      </section>

      {shows.length === 0 && (
        <div className="empty-state">
          <p>No shows yet. Add your first show to see analytics!</p>
        </div>
      )}

      {/* Export Button */}
      <div className="export-section">
        <button
          className="btn-export"
          onClick={() => exportDashboardSummary(shows, venues, contacts)}
        >
          Download Dashboard Summary (CSV)
        </button>
      </div>
    </div>
  );
}
