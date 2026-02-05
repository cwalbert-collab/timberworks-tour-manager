import { Document, Page, Text, View } from '@react-pdf/renderer';
import { baseStyles, COLORS, COMPANY, formatCurrency, formatDate, formatDateRange } from './pdfStyles';

export default function InvoicePDF({ show, venue, contact, invoiceNumber, dueDate }) {
  const subtotal = (show.performanceFee || 0) + (show.merchandiseSales || 0);
  const expenses = (show.materialsUsed || 0) + (show.expenses || 0);
  const total = subtotal;

  return (
    <Document>
      <Page size="LETTER" style={baseStyles.page}>
        {/* Header */}
        <View style={baseStyles.header}>
          <View>
            <Text style={baseStyles.logo}>{COMPANY.name}</Text>
            <Text style={baseStyles.tagline}>{COMPANY.tagline}</Text>
          </View>
          <View style={baseStyles.companyInfo}>
            <Text>{COMPANY.address}</Text>
            <Text>{COMPANY.city}, {COMPANY.state} {COMPANY.zip}</Text>
            <Text>{COMPANY.phone}</Text>
            <Text>{COMPANY.email}</Text>
          </View>
        </View>

        {/* Invoice Title */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
          <Text style={baseStyles.title}>INVOICE</Text>
          <View style={{ textAlign: 'right' }}>
            <Text style={baseStyles.textBold}>Invoice #: {invoiceNumber || `INV-${show.id?.slice(0, 8).toUpperCase()}`}</Text>
            <Text style={baseStyles.text}>Date: {formatDate(new Date().toISOString())}</Text>
            <Text style={baseStyles.text}>Due Date: {formatDate(dueDate) || 'Upon Receipt'}</Text>
          </View>
        </View>

        {/* Bill To / Show Info */}
        <View style={{ flexDirection: 'row', marginBottom: 30 }}>
          <View style={baseStyles.col}>
            <Text style={baseStyles.sectionTitle}>Bill To</Text>
            <Text style={baseStyles.textBold}>{venue?.name || show.venueName || 'Venue'}</Text>
            {contact && <Text style={baseStyles.text}>Attn: {contact.name}</Text>}
            <Text style={baseStyles.text}>{venue?.address || show.address || ''}</Text>
            <Text style={baseStyles.text}>
              {venue?.city || show.city}, {venue?.state || show.state} {venue?.zip || show.zip}
            </Text>
            {contact?.email && <Text style={baseStyles.text}>{contact.email}</Text>}
          </View>
          <View style={baseStyles.col}>
            <Text style={baseStyles.sectionTitle}>Show Details</Text>
            <Text style={baseStyles.text}>
              <Text style={baseStyles.textBold}>Date: </Text>
              {formatDateRange(show.startDate, show.endDate)}
            </Text>
            {show.showTime && (
              <Text style={baseStyles.text}>
                <Text style={baseStyles.textBold}>Time: </Text>
                {show.showTime}
              </Text>
            )}
            <Text style={baseStyles.text}>
              <Text style={baseStyles.textBold}>Tour: </Text>
              {show.tour || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={baseStyles.section}>
          <View style={baseStyles.table}>
            <View style={baseStyles.tableHeader}>
              <Text style={{ flex: 4 }}>Description</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>Qty</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>Rate</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>Amount</Text>
            </View>

            {/* Performance Fee */}
            <View style={baseStyles.tableRow}>
              <Text style={{ flex: 4 }}>Professional Lumberjack Show Performance</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>1</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(show.performanceFee)}</Text>
              <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(show.performanceFee)}</Text>
            </View>

            {/* Merchandise (if any) */}
            {show.merchandiseSales > 0 && (
              <View style={baseStyles.tableRowAlt}>
                <Text style={{ flex: 4 }}>Merchandise Sales (Revenue Share)</Text>
                <Text style={{ flex: 1, textAlign: 'center' }}>1</Text>
                <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(show.merchandiseSales)}</Text>
                <Text style={{ flex: 2, textAlign: 'right' }}>{formatCurrency(show.merchandiseSales)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Totals */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 }}>
          <View style={{ width: 200 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={baseStyles.text}>Subtotal:</Text>
              <Text style={baseStyles.text}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={baseStyles.text}>Tax (0%):</Text>
              <Text style={baseStyles.text}>{formatCurrency(0)}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTopWidth: 2,
              borderTopColor: COLORS.primary
            }}>
              <Text style={baseStyles.textLarge}>Total Due:</Text>
              <Text style={baseStyles.amountLarge}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={baseStyles.highlightBox}>
          <Text style={baseStyles.textBold}>Payment Information</Text>
          <Text style={baseStyles.text}>Please make checks payable to: {COMPANY.name}</Text>
          <Text style={baseStyles.text}>Mail to: {COMPANY.address}, {COMPANY.city}, {COMPANY.state} {COMPANY.zip}</Text>
          <Text style={{ ...baseStyles.textSmall, marginTop: 8 }}>
            For electronic payment options, please contact {COMPANY.email}
          </Text>
        </View>

        {/* Notes */}
        {show.notes && (
          <View style={baseStyles.section}>
            <Text style={baseStyles.sectionTitle}>Notes</Text>
            <Text style={baseStyles.text}>{show.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={baseStyles.footer}>
          <Text>Thank you for your business!</Text>
          <Text style={{ marginTop: 4 }}>{COMPANY.name} | {COMPANY.phone} | {COMPANY.email}</Text>
        </View>
      </Page>
    </Document>
  );
}
