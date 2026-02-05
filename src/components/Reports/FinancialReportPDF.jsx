import { Document, Page, Text, View } from '@react-pdf/renderer';
import { baseStyles, COLORS, COMPANY, formatCurrency, formatDate } from './pdfStyles';

export default function FinancialReportPDF({ shows, transactions, dateRange, reportTitle }) {
  // Filter shows and transactions by date range
  const filteredShows = shows.filter(show => {
    const showDate = new Date(show.startDate);
    return showDate >= new Date(dateRange.start) && showDate <= new Date(dateRange.end);
  });

  const filteredTransactions = transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    return txnDate >= new Date(dateRange.start) && txnDate <= new Date(dateRange.end);
  });

  // Calculate totals
  const totalPerformanceFees = filteredShows.reduce((sum, s) => sum + (s.performanceFee || 0), 0);
  const totalMerchSales = filteredShows.reduce((sum, s) => sum + (s.merchandiseSales || 0), 0);
  const totalRevenue = totalPerformanceFees + totalMerchSales;

  const totalMaterials = filteredShows.reduce((sum, s) => sum + (s.materialsUsed || 0), 0);
  const totalExpenses = filteredShows.reduce((sum, s) => sum + (s.expenses || 0), 0);
  const totalCosts = totalMaterials + totalExpenses;

  const netProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;

  // Team breakdown
  const redTeamShows = filteredShows.filter(s => s.tour === 'Red Team');
  const blueTeamShows = filteredShows.filter(s => s.tour === 'Blue Team');

  const redTeamRevenue = redTeamShows.reduce((sum, s) => sum + (s.performanceFee || 0) + (s.merchandiseSales || 0), 0);
  const blueTeamRevenue = blueTeamShows.reduce((sum, s) => sum + (s.performanceFee || 0) + (s.merchandiseSales || 0), 0);

  const redTeamProfit = redTeamShows.reduce((sum, s) => sum + (s.profit || 0), 0);
  const blueTeamProfit = blueTeamShows.reduce((sum, s) => sum + (s.profit || 0), 0);

  // Monthly breakdown
  const monthlyData = {};
  filteredShows.forEach(show => {
    const date = new Date(show.startDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { name: monthName, revenue: 0, costs: 0, profit: 0, shows: 0 };
    }
    monthlyData[monthKey].revenue += (show.performanceFee || 0) + (show.merchandiseSales || 0);
    monthlyData[monthKey].costs += (show.materialsUsed || 0) + (show.expenses || 0);
    monthlyData[monthKey].profit += show.profit || 0;
    monthlyData[monthKey].shows += 1;
  });

  const monthlyBreakdown = Object.values(monthlyData).sort((a, b) => a.name.localeCompare(b.name));

  // Top venues by revenue
  const venueRevenue = {};
  filteredShows.forEach(show => {
    const venueName = show.venueName || 'Unknown';
    if (!venueRevenue[venueName]) {
      venueRevenue[venueName] = { revenue: 0, shows: 0 };
    }
    venueRevenue[venueName].revenue += (show.performanceFee || 0) + (show.merchandiseSales || 0);
    venueRevenue[venueName].shows += 1;
  });

  const topVenues = Object.entries(venueRevenue)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <Document>
      <Page size="LETTER" style={baseStyles.page}>
        {/* Header */}
        <View style={baseStyles.header}>
          <View>
            <Text style={baseStyles.logo}>{COMPANY.name}</Text>
            <Text style={baseStyles.tagline}>Financial Report</Text>
          </View>
          <View style={baseStyles.companyInfo}>
            <Text>Generated: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Report Title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={baseStyles.title}>{reportTitle || 'Financial Report'}</Text>
          <Text style={baseStyles.subtitle}>
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ ...baseStyles.highlightBox, flex: 1, marginRight: 10 }}>
            <Text style={baseStyles.textSmall}>TOTAL SHOWS</Text>
            <Text style={baseStyles.amountLarge}>{filteredShows.length}</Text>
          </View>
          <View style={{ ...baseStyles.highlightBox, flex: 1, marginRight: 10 }}>
            <Text style={baseStyles.textSmall}>TOTAL REVENUE</Text>
            <Text style={baseStyles.amountLarge}>{formatCurrency(totalRevenue)}</Text>
          </View>
          <View style={{ ...baseStyles.highlightBox, flex: 1, marginRight: 10, borderLeftColor: COLORS.red }}>
            <Text style={baseStyles.textSmall}>TOTAL COSTS</Text>
            <Text style={{ ...baseStyles.amountLarge, color: COLORS.red }}>{formatCurrency(totalCosts)}</Text>
          </View>
          <View style={{ ...baseStyles.highlightBox, flex: 1, borderLeftColor: netProfit >= 0 ? COLORS.primary : COLORS.red }}>
            <Text style={baseStyles.textSmall}>NET PROFIT</Text>
            <Text style={{ ...baseStyles.amountLarge, color: netProfit >= 0 ? COLORS.primary : COLORS.red }}>
              {formatCurrency(netProfit)}
            </Text>
            <Text style={baseStyles.textSmall}>{profitMargin}% margin</Text>
          </View>
        </View>

        {/* Revenue Breakdown */}
        <View style={baseStyles.section}>
          <Text style={baseStyles.sectionTitle}>Revenue Breakdown</Text>
          <View style={baseStyles.table}>
            <View style={baseStyles.tableHeader}>
              <Text style={{ flex: 3 }}>Category</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>Amount</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>%</Text>
            </View>
            <View style={baseStyles.tableRow}>
              <Text style={{ flex: 3 }}>Performance Fees</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(totalPerformanceFees)}</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                {totalRevenue > 0 ? ((totalPerformanceFees / totalRevenue) * 100).toFixed(0) : 0}%
              </Text>
            </View>
            <View style={baseStyles.tableRowAlt}>
              <Text style={{ flex: 3 }}>Merchandise Sales</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(totalMerchSales)}</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                {totalRevenue > 0 ? ((totalMerchSales / totalRevenue) * 100).toFixed(0) : 0}%
              </Text>
            </View>
            <View style={{ ...baseStyles.tableRow, backgroundColor: '#e8f5e9' }}>
              <Text style={{ flex: 3, fontFamily: 'Helvetica-Bold' }}>Total Revenue</Text>
              <Text style={{ flex: 2, textAlign: 'right', fontFamily: 'Helvetica-Bold' }}>{formatCurrency(totalRevenue)}</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>100%</Text>
            </View>
          </View>
        </View>

        {/* Expense Breakdown */}
        <View style={baseStyles.section}>
          <Text style={baseStyles.sectionTitle}>Expense Breakdown</Text>
          <View style={baseStyles.table}>
            <View style={baseStyles.tableHeader}>
              <Text style={{ flex: 3 }}>Category</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>Amount</Text>
            </View>
            <View style={baseStyles.tableRow}>
              <Text style={{ flex: 3 }}>Materials Used</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(totalMaterials)}</Text>
            </View>
            <View style={baseStyles.tableRowAlt}>
              <Text style={{ flex: 3 }}>Other Expenses</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(totalExpenses)}</Text>
            </View>
            <View style={{ ...baseStyles.tableRow, backgroundColor: '#ffebee' }}>
              <Text style={{ flex: 3, fontFamily: 'Helvetica-Bold' }}>Total Expenses</Text>
              <Text style={{ flex: 2, textAlign: 'right', fontFamily: 'Helvetica-Bold' }}>{formatCurrency(totalCosts)}</Text>
            </View>
          </View>
        </View>

        {/* Team Performance */}
        <View style={baseStyles.section}>
          <Text style={baseStyles.sectionTitle}>Team Performance</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...baseStyles.box, flex: 1, marginRight: 10, borderLeftWidth: 4, borderLeftColor: COLORS.red }}>
              <Text style={{ ...baseStyles.textBold, color: COLORS.red }}>Red Team</Text>
              <Text style={baseStyles.text}>{redTeamShows.length} shows</Text>
              <Text style={baseStyles.text}>Revenue: {formatCurrency(redTeamRevenue)}</Text>
              <Text style={baseStyles.text}>Profit: {formatCurrency(redTeamProfit)}</Text>
            </View>
            <View style={{ ...baseStyles.box, flex: 1, borderLeftWidth: 4, borderLeftColor: COLORS.secondary }}>
              <Text style={{ ...baseStyles.textBold, color: COLORS.secondary }}>Blue Team</Text>
              <Text style={baseStyles.text}>{blueTeamShows.length} shows</Text>
              <Text style={baseStyles.text}>Revenue: {formatCurrency(blueTeamRevenue)}</Text>
              <Text style={baseStyles.text}>Profit: {formatCurrency(blueTeamProfit)}</Text>
            </View>
          </View>
        </View>

        {/* Monthly Breakdown */}
        {monthlyBreakdown.length > 0 && (
          <View style={baseStyles.section}>
            <Text style={baseStyles.sectionTitle}>Monthly Breakdown</Text>
            <View style={baseStyles.table}>
              <View style={baseStyles.tableHeader}>
                <Text style={{ flex: 2 }}>Month</Text>
                <Text style={{ flex: 1, textAlign: 'center' }}>Shows</Text>
                <Text style={{ flex: 2, textAlign: 'right' }}>Revenue</Text>
                <Text style={{ flex: 2, textAlign: 'right' }}>Costs</Text>
                <Text style={{ flex: 2, textAlign: 'right' }}>Profit</Text>
              </View>
              {monthlyBreakdown.map((month, idx) => (
                <View key={month.name} style={idx % 2 === 0 ? baseStyles.tableRow : baseStyles.tableRowAlt}>
                  <Text style={{ flex: 2 }}>{month.name}</Text>
                  <Text style={{ flex: 1, textAlign: 'center' }}>{month.shows}</Text>
                  <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(month.revenue)}</Text>
                  <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(month.costs)}</Text>
                  <Text style={{ flex: 2, textAlign: 'right', color: month.profit >= 0 ? COLORS.primary : COLORS.red }}>
                    {formatCurrency(month.profit)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Venues */}
        {topVenues.length > 0 && (
          <View style={baseStyles.section}>
            <Text style={baseStyles.sectionTitle}>Top Venues by Revenue</Text>
            <View style={baseStyles.table}>
              <View style={baseStyles.tableHeader}>
                <Text style={{ flex: 3 }}>Venue</Text>
                <Text style={{ flex: 1, textAlign: 'center' }}>Shows</Text>
                <Text style={{ flex: 2, textAlign: 'right' }}>Revenue</Text>
              </View>
              {topVenues.map((venue, idx) => (
                <View key={venue.name} style={idx % 2 === 0 ? baseStyles.tableRow : baseStyles.tableRowAlt}>
                  <Text style={{ flex: 3 }}>{venue.name}</Text>
                  <Text style={{ flex: 1, textAlign: 'center' }}>{venue.shows}</Text>
                  <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(venue.revenue)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={baseStyles.footer}>
          <Text>{COMPANY.name} | Confidential Financial Report</Text>
          <Text style={{ marginTop: 2 }}>This report is for internal use only.</Text>
        </View>
      </Page>
    </Document>
  );
}
