import { Document, Page, Text, View } from '@react-pdf/renderer';
import { baseStyles, COLORS, COMPANY, formatCurrency, formatDateRange } from './pdfStyles';

export default function ShowSummaryPDF({ show, venue, contact, employees = [], transactions = [] }) {
  const revenue = (show.performanceFee || 0) + (show.merchandiseSales || 0);
  const costs = (show.materialsUsed || 0) + (show.expenses || 0);
  const profit = revenue - costs;
  const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;

  // Filter transactions for this show
  const showTransactions = transactions.filter(t => t.showId === show.id);

  return (
    <Document>
      <Page size="LETTER" style={baseStyles.page}>
        {/* Header */}
        <View style={baseStyles.header}>
          <View>
            <Text style={baseStyles.logo}>{COMPANY.name}</Text>
            <Text style={baseStyles.tagline}>Show Summary Report</Text>
          </View>
          <View style={baseStyles.companyInfo}>
            <Text>Generated: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Show Title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={baseStyles.title}>{venue?.name || show.venueName || 'Show'}</Text>
          <Text style={baseStyles.subtitle}>
            {formatDateRange(show.startDate, show.endDate)}
            {show.showTime && ` at ${show.showTime}`}
          </Text>
          <View style={{
            ...baseStyles.badge,
            ...(show.tour === 'Red Team' ? baseStyles.badgeRed : baseStyles.badgeBlue),
            alignSelf: 'flex-start',
            marginTop: 8
          }}>
            <Text>{show.tour}</Text>
          </View>
        </View>

        {/* Two Column Layout: Venue & Contact */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ ...baseStyles.col, marginRight: 15 }}>
            <Text style={baseStyles.sectionTitle}>Venue Information</Text>
            <View style={baseStyles.box}>
              <Text style={baseStyles.textBold}>{venue?.name || show.venueName}</Text>
              <Text style={baseStyles.text}>{venue?.address || show.address}</Text>
              <Text style={baseStyles.text}>
                {venue?.city || show.city}, {venue?.state || show.state} {venue?.zip || show.zip}
              </Text>
              {venue?.type && (
                <Text style={{ ...baseStyles.text, marginTop: 8 }}>Type: {venue.type}</Text>
              )}
              {venue?.capacity && (
                <Text style={baseStyles.text}>Capacity: {venue.capacity.toLocaleString()}</Text>
              )}
            </View>
          </View>

          <View style={baseStyles.col}>
            <Text style={baseStyles.sectionTitle}>Contact Information</Text>
            <View style={baseStyles.box}>
              <Text style={baseStyles.textBold}>{contact?.name || show.contactName || 'N/A'}</Text>
              {contact?.role && <Text style={baseStyles.textSmall}>{contact.role}</Text>}
              <Text style={{ ...baseStyles.text, marginTop: 4 }}>{contact?.phone || show.contactPhone}</Text>
              <Text style={baseStyles.text}>{contact?.email || show.contactEmail}</Text>
            </View>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={baseStyles.section}>
          <Text style={baseStyles.sectionTitle}>Financial Summary</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...baseStyles.highlightBox, flex: 1, marginRight: 10 }}>
              <Text style={baseStyles.textSmall}>TOTAL REVENUE</Text>
              <Text style={baseStyles.amountLarge}>{formatCurrency(revenue)}</Text>
            </View>
            <View style={{ ...baseStyles.highlightBox, flex: 1, marginRight: 10 }}>
              <Text style={baseStyles.textSmall}>TOTAL COSTS</Text>
              <Text style={{ ...baseStyles.amountLarge, color: COLORS.red }}>{formatCurrency(costs)}</Text>
            </View>
            <View style={{ ...baseStyles.highlightBox, flex: 1, borderLeftColor: profit >= 0 ? COLORS.primary : COLORS.red }}>
              <Text style={baseStyles.textSmall}>NET PROFIT</Text>
              <Text style={{ ...baseStyles.amountLarge, color: profit >= 0 ? COLORS.primary : COLORS.red }}>
                {formatCurrency(profit)}
              </Text>
              <Text style={baseStyles.textSmall}>{profitMargin}% margin</Text>
            </View>
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
              <Text style={{ flex: 3 }}>Performance Fee</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(show.performanceFee)}</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                {revenue > 0 ? ((show.performanceFee / revenue) * 100).toFixed(0) : 0}%
              </Text>
            </View>
            <View style={baseStyles.tableRowAlt}>
              <Text style={{ flex: 3 }}>Merchandise Sales</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(show.merchandiseSales)}</Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                {revenue > 0 ? ((show.merchandiseSales / revenue) * 100).toFixed(0) : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={baseStyles.section}>
          <Text style={baseStyles.sectionTitle}>Cost Breakdown</Text>
          <View style={baseStyles.table}>
            <View style={baseStyles.tableHeader}>
              <Text style={{ flex: 3 }}>Category</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>Amount</Text>
            </View>
            <View style={baseStyles.tableRow}>
              <Text style={{ flex: 3 }}>Materials Used</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(show.materialsUsed)}</Text>
            </View>
            <View style={baseStyles.tableRowAlt}>
              <Text style={{ flex: 3 }}>Other Expenses</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(show.expenses)}</Text>
            </View>
          </View>
        </View>

        {/* Crew Assignments */}
        {employees.length > 0 && (
          <View style={baseStyles.section}>
            <Text style={baseStyles.sectionTitle}>Crew Assignments</Text>
            <View style={baseStyles.box}>
              {employees.map((emp, idx) => (
                <Text key={idx} style={baseStyles.text}>
                  • {emp.firstName} {emp.lastName} - {emp.role}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Transactions */}
        {showTransactions.length > 0 && (
          <View style={baseStyles.section}>
            <Text style={baseStyles.sectionTitle}>Related Transactions</Text>
            <View style={baseStyles.table}>
              <View style={baseStyles.tableHeader}>
                <Text style={{ flex: 2 }}>Date</Text>
                <Text style={{ flex: 3 }}>Description</Text>
                <Text style={{ flex: 1 }}>Type</Text>
                <Text style={{ flex: 2, textAlign: 'right' }}>Amount</Text>
              </View>
              {showTransactions.slice(0, 10).map((txn, idx) => (
                <View key={txn.id} style={idx % 2 === 0 ? baseStyles.tableRow : baseStyles.tableRowAlt}>
                  <Text style={{ flex: 2 }}>{new Date(txn.date).toLocaleDateString()}</Text>
                  <Text style={{ flex: 3 }}>{txn.description}</Text>
                  <Text style={{ flex: 1 }}>{txn.type}</Text>
                  <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(txn.amount)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        {show.notes && (
          <View style={baseStyles.section}>
            <Text style={baseStyles.sectionTitle}>Notes</Text>
            <View style={baseStyles.box}>
              <Text style={baseStyles.text}>{show.notes}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={baseStyles.footer}>
          <Text>{COMPANY.name} | Confidential Show Summary</Text>
        </View>
      </Page>
    </Document>
  );
}
