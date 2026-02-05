import { Document, Page, Text, View } from '@react-pdf/renderer';
import { baseStyles, COLORS, COMPANY, formatDate, formatDateRange } from './pdfStyles';

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const HOMEBASE = {
  name: 'Homebase (Hayward, WI)',
  latitude: 46.0130,
  longitude: -91.4846,
  address: '123 Timber Lane, Hayward, WI 54843'
};

export default function RouteSheetPDF({ shows, venues, contacts, tourName, dateRange }) {
  // Sort shows by date
  const sortedShows = [...shows].sort((a, b) =>
    new Date(a.startDate) - new Date(b.startDate)
  );

  // Build route with venue info
  const routeStops = sortedShows.map((show, index) => {
    const venue = venues?.find(v => v.id === show.venueId);
    const contact = contacts?.find(c => c.id === show.contactId);

    const lat = venue?.latitude || show.latitude || 0;
    const lng = venue?.longitude || show.longitude || 0;

    // Calculate distance from previous stop
    let distanceFromPrev = 0;
    if (index === 0) {
      distanceFromPrev = calculateDistance(HOMEBASE.latitude, HOMEBASE.longitude, lat, lng);
    } else {
      const prevShow = sortedShows[index - 1];
      const prevVenue = venues?.find(v => v.id === prevShow.venueId);
      const prevLat = prevVenue?.latitude || prevShow.latitude || 0;
      const prevLng = prevVenue?.longitude || prevShow.longitude || 0;
      distanceFromPrev = calculateDistance(prevLat, prevLng, lat, lng);
    }

    return {
      ...show,
      venue,
      contact,
      stopNumber: index + 1,
      distanceFromPrev
    };
  });

  // Calculate total distance
  const totalDistance = routeStops.reduce((sum, stop) => sum + stop.distanceFromPrev, 0);

  // Calculate return distance to homebase
  const lastStop = routeStops[routeStops.length - 1];
  const lastVenue = lastStop?.venue;
  const returnDistance = lastVenue ?
    calculateDistance(lastVenue.latitude || 0, lastVenue.longitude || 0, HOMEBASE.latitude, HOMEBASE.longitude) : 0;

  const grandTotalDistance = totalDistance + returnDistance;

  // Estimated drive time (assuming 55 mph average)
  const estimatedDriveHours = Math.round(grandTotalDistance / 55);

  return (
    <Document>
      <Page size="LETTER" style={baseStyles.page}>
        {/* Header */}
        <View style={baseStyles.header}>
          <View>
            <Text style={baseStyles.logo}>{COMPANY.name}</Text>
            <Text style={baseStyles.tagline}>Tour Route Sheet</Text>
          </View>
          <View style={baseStyles.companyInfo}>
            <Text>Generated: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Route Title */}
        <View style={{ marginBottom: 20 }}>
          <Text style={baseStyles.title}>{tourName || 'Tour Route'}</Text>
          {dateRange && (
            <Text style={baseStyles.subtitle}>
              {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
            </Text>
          )}
        </View>

        {/* Route Summary */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{ ...baseStyles.highlightBox, flex: 1, marginRight: 10 }}>
            <Text style={baseStyles.textSmall}>TOTAL STOPS</Text>
            <Text style={baseStyles.amountLarge}>{routeStops.length}</Text>
          </View>
          <View style={{ ...baseStyles.highlightBox, flex: 1, marginRight: 10 }}>
            <Text style={baseStyles.textSmall}>TOTAL DISTANCE</Text>
            <Text style={baseStyles.amountLarge}>{grandTotalDistance.toLocaleString()} mi</Text>
          </View>
          <View style={{ ...baseStyles.highlightBox, flex: 1 }}>
            <Text style={baseStyles.textSmall}>EST. DRIVE TIME</Text>
            <Text style={baseStyles.amountLarge}>{estimatedDriveHours} hrs</Text>
          </View>
        </View>

        {/* Starting Point */}
        <View style={{ ...baseStyles.box, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: COLORS.primary }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>★</Text>
            <View>
              <Text style={baseStyles.textBold}>START: {HOMEBASE.name}</Text>
              <Text style={baseStyles.textSmall}>{HOMEBASE.address}</Text>
            </View>
          </View>
        </View>

        {/* Route Stops */}
        {routeStops.map((stop, index) => (
          <View key={stop.id} style={{ marginBottom: 15 }}>
            {/* Distance indicator */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, marginLeft: 20 }}>
              <Text style={{ ...baseStyles.textSmall, color: COLORS.primary }}>
                ↓ {stop.distanceFromPrev} miles
              </Text>
            </View>

            {/* Stop card */}
            <View style={{
              ...baseStyles.box,
              borderLeftWidth: 4,
              borderLeftColor: stop.tour === 'Red Team' ? COLORS.red : COLORS.secondary
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: stop.tour === 'Red Team' ? COLORS.red : COLORS.secondary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 8
                    }}>
                      <Text style={{ color: 'white', fontSize: 10, fontFamily: 'Helvetica-Bold' }}>
                        {stop.stopNumber}
                      </Text>
                    </View>
                    <Text style={baseStyles.textBold}>
                      {stop.venue?.name || stop.venueName || 'Venue'}
                    </Text>
                  </View>

                  <View style={{ marginLeft: 32, marginTop: 4 }}>
                    <Text style={baseStyles.text}>
                      {stop.venue?.address || stop.address}
                    </Text>
                    <Text style={baseStyles.text}>
                      {stop.venue?.city || stop.city}, {stop.venue?.state || stop.state} {stop.venue?.zip || stop.zip}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={baseStyles.textBold}>
                    {formatDateRange(stop.startDate, stop.endDate)}
                  </Text>
                  {stop.showTime && (
                    <Text style={baseStyles.text}>{stop.showTime}</Text>
                  )}
                  <View style={{
                    ...baseStyles.badge,
                    ...(stop.tour === 'Red Team' ? baseStyles.badgeRed : baseStyles.badgeBlue),
                    marginTop: 4
                  }}>
                    <Text>{stop.tour}</Text>
                  </View>
                </View>
              </View>

              {/* Contact info */}
              {stop.contact && (
                <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                  <Text style={baseStyles.textSmall}>
                    Contact: {stop.contact.name} | {stop.contact.phone} | {stop.contact.email}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Return to homebase */}
        <View style={{ marginBottom: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, marginLeft: 20 }}>
            <Text style={{ ...baseStyles.textSmall, color: COLORS.primary }}>
              ↓ {returnDistance} miles (return)
            </Text>
          </View>
          <View style={{ ...baseStyles.box, borderLeftWidth: 4, borderLeftColor: COLORS.primary }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginRight: 10 }}>★</Text>
              <View>
                <Text style={baseStyles.textBold}>END: {HOMEBASE.name}</Text>
                <Text style={baseStyles.textSmall}>{HOMEBASE.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Reference */}
        <View style={baseStyles.section}>
          <Text style={baseStyles.sectionTitle}>Quick Reference</Text>
          <View style={baseStyles.table}>
            <View style={baseStyles.tableHeader}>
              <Text style={{ flex: 0.5 }}>#</Text>
              <Text style={{ flex: 2 }}>Venue</Text>
              <Text style={{ flex: 2 }}>Address</Text>
              <Text style={{ flex: 1.5 }}>Contact Phone</Text>
              <Text style={{ flex: 1.5 }}>Dates</Text>
            </View>
            {routeStops.map((stop, idx) => (
              <View key={stop.id} style={idx % 2 === 0 ? baseStyles.tableRow : baseStyles.tableRowAlt}>
                <Text style={{ flex: 0.5 }}>{stop.stopNumber}</Text>
                <Text style={{ flex: 2 }}>{stop.venue?.name || stop.venueName}</Text>
                <Text style={{ flex: 2 }}>
                  {stop.venue?.city || stop.city}, {stop.venue?.state || stop.state}
                </Text>
                <Text style={{ flex: 1.5 }}>{stop.contact?.phone || stop.contactPhone || 'N/A'}</Text>
                <Text style={{ flex: 1.5 }}>{formatDateRange(stop.startDate, stop.endDate)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={baseStyles.footer}>
          <Text>{COMPANY.name} | Tour Route Sheet</Text>
          <Text style={{ marginTop: 2 }}>Safe travels!</Text>
        </View>
      </Page>
    </Document>
  );
}
