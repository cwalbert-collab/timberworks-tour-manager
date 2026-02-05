import { useMemo } from 'react';
import { exportDashboardSummary } from '../../utils/exportUtils';
import './Dashboard.css';

export default function Dashboard({ shows, contacts = [], venues = [], onNavigateToRevenue, onNavigateToContact }) {
  // Calculate aggregate metrics
  const metrics = useMemo(() => {
    const totalShows = shows.length;
    const totalRevenue = shows.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
    const totalProfit = shows.reduce((sum, s) => sum + (s.profit || 0), 0);
    const totalMerch = shows.reduce((sum, s) => sum + (s.merchandiseSales || 0), 0);
    const totalFees = shows.reduce((sum, s) => sum + (s.performanceFee || 0), 0);
    const totalExpenses = shows.reduce((sum, s) => sum + (s.expenses || 0) + (s.materialsUsed || 0), 0);
    const avgProfit = totalShows > 0 ? totalProfit / totalShows : 0;

    return { totalShows, totalRevenue, totalProfit, totalMerch, totalFees, totalExpenses, avgProfit };
  }, [shows]);

  // Calculate per-team metrics
  const teamMetrics = useMemo(() => {
    const redTeam = shows.filter(s => s.tour === 'Red Team');
    const blueTeam = shows.filter(s => s.tour === 'Blue Team');

    const calcTeamStats = (teamShows) => ({
      showCount: teamShows.length,
      revenue: teamShows.reduce((sum, s) => sum + (s.totalRevenue || 0), 0),
      profit: teamShows.reduce((sum, s) => sum + (s.profit || 0), 0),
      merch: teamShows.reduce((sum, s) => sum + (s.merchandiseSales || 0), 0)
    });

    return {
      red: calcTeamStats(redTeam),
      blue: calcTeamStats(blueTeam)
    };
  }, [shows]);

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

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <section className="summary-cards">
        <div className="summary-card">
          <span className="summary-card-title">Total Shows</span>
          <span className="summary-card-value">{metrics.totalShows}</span>
        </div>
        <div
          className="summary-card clickable"
          onClick={onNavigateToRevenue}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigateToRevenue?.()}
          title="Click to view revenue details"
        >
          <span className="summary-card-title">Total Revenue</span>
          <span className="summary-card-value">{formatCurrency(metrics.totalRevenue)}</span>
          <span className="card-link-hint">View details &rarr;</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-title">Total Profit</span>
          <span className="summary-card-value highlight">{formatCurrency(metrics.totalProfit)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-title">Avg Profit/Show</span>
          <span className="summary-card-value">{formatCurrency(metrics.avgProfit)}</span>
        </div>
      </section>

      {/* Team Breakdown */}
      <section className="team-breakdown">
        <div className="team-card red">
          <div className="team-card-header">Red Team</div>
          <div className="team-card-stats">
            <div className="stat-item">
              <span className="stat-label">Shows</span>
              <span className="stat-value">{teamMetrics.red.showCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Revenue</span>
              <span className="stat-value">{formatCurrency(teamMetrics.red.revenue)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Profit</span>
              <span className="stat-value">{formatCurrency(teamMetrics.red.profit)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Merch Sales</span>
              <span className="stat-value">{formatCurrency(teamMetrics.red.merch)}</span>
            </div>
          </div>
        </div>

        <div className="team-card blue">
          <div className="team-card-header">Blue Team</div>
          <div className="team-card-stats">
            <div className="stat-item">
              <span className="stat-label">Shows</span>
              <span className="stat-value">{teamMetrics.blue.showCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Revenue</span>
              <span className="stat-value">{formatCurrency(teamMetrics.blue.revenue)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Profit</span>
              <span className="stat-value">{formatCurrency(teamMetrics.blue.profit)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Merch Sales</span>
              <span className="stat-value">{formatCurrency(teamMetrics.blue.merch)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Breakdown */}
      <section className="revenue-breakdown">
        <h3>Revenue Breakdown</h3>
        <div className="breakdown-item">
          <div className="breakdown-label">
            <span>Performance Fees</span>
            <span>{formatCurrency(metrics.totalFees)} ({getPercentage(metrics.totalFees, metrics.totalRevenue)}%)</span>
          </div>
          <div className="breakdown-bar-track">
            <div
              className="breakdown-bar-fill fees"
              style={{ width: `${getPercentage(metrics.totalFees, metrics.totalRevenue)}%` }}
            />
          </div>
        </div>
        <div className="breakdown-item">
          <div className="breakdown-label">
            <span>Merchandise</span>
            <span>{formatCurrency(metrics.totalMerch)} ({getPercentage(metrics.totalMerch, metrics.totalRevenue)}%)</span>
          </div>
          <div className="breakdown-bar-track">
            <div
              className="breakdown-bar-fill merch"
              style={{ width: `${getPercentage(metrics.totalMerch, metrics.totalRevenue)}%` }}
            />
          </div>
        </div>
      </section>

      {/* Costs Overview */}
      <section className="costs-overview">
        <h3>Costs Overview</h3>
        <div className="costs-row">
          <div className="cost-item">
            <span className="cost-label">Total Expenses</span>
            <span className="cost-value">{formatCurrency(metrics.totalExpenses)}</span>
          </div>
          <div className="cost-item">
            <span className="cost-label">Profit Margin</span>
            <span className="cost-value highlight">
              {metrics.totalRevenue > 0 ? Math.round((metrics.totalProfit / metrics.totalRevenue) * 100) : 0}%
            </span>
          </div>
        </div>
      </section>

      {/* Follow-up Reminders */}
      {followUpReminders.all.length > 0 && (
        <section className="follow-up-reminders">
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
