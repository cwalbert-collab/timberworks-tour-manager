/**
 * Insights Utility Functions
 * Algorithms for route optimization, revenue prediction, and statistical analysis
 */

// Homebase location (Hayward, WI)
export const HOMEBASE = {
  name: 'Homebase (Hayward, WI)',
  latitude: 46.0130,
  longitude: -91.4846
};

/**
 * Calculate distance between two points using Haversine formula
 * @returns distance in miles
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate distance from homebase to a venue
 */
export function distanceFromHomebase(venue) {
  if (!venue?.latitude || !venue?.longitude) return null;
  return calculateDistance(
    HOMEBASE.latitude,
    HOMEBASE.longitude,
    venue.latitude,
    venue.longitude
  );
}

/**
 * Statistical helper functions
 */
export function mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function median(arr) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function standardDeviation(arr) {
  if (arr.length < 2) return 0;
  const avg = mean(arr);
  const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

export function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

/**
 * Route Optimization using Nearest Neighbor algorithm
 * Returns optimized order of venues to minimize total distance
 */
export function optimizeRoute(venues, startFromHomebase = true) {
  if (!venues.length) return { route: [], totalDistance: 0, savings: 0 };

  // Filter venues with valid coordinates
  const validVenues = venues.filter(v => v.latitude && v.longitude);
  if (!validVenues.length) return { route: [], totalDistance: 0, savings: 0 };

  // Calculate original (unoptimized) distance
  let originalDistance = 0;
  if (startFromHomebase) {
    originalDistance += distanceFromHomebase(validVenues[0]) || 0;
  }
  for (let i = 0; i < validVenues.length - 1; i++) {
    originalDistance += calculateDistance(
      validVenues[i].latitude, validVenues[i].longitude,
      validVenues[i + 1].latitude, validVenues[i + 1].longitude
    );
  }
  if (startFromHomebase && validVenues.length > 0) {
    originalDistance += distanceFromHomebase(validVenues[validVenues.length - 1]) || 0;
  }

  // Nearest Neighbor algorithm
  const unvisited = [...validVenues];
  const route = [];
  let totalDistance = 0;

  // Start from homebase
  let currentLat = HOMEBASE.latitude;
  let currentLng = HOMEBASE.longitude;

  while (unvisited.length > 0) {
    // Find nearest unvisited venue
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateDistance(
        currentLat, currentLng,
        unvisited[i].latitude, unvisited[i].longitude
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    // Move to nearest venue
    const nearest = unvisited.splice(nearestIdx, 1)[0];
    route.push({
      ...nearest,
      distanceFromPrevious: nearestDist
    });
    totalDistance += nearestDist;
    currentLat = nearest.latitude;
    currentLng = nearest.longitude;
  }

  // Return to homebase
  if (startFromHomebase && route.length > 0) {
    const returnDistance = calculateDistance(
      currentLat, currentLng,
      HOMEBASE.latitude, HOMEBASE.longitude
    );
    totalDistance += returnDistance;
  }

  return {
    route,
    totalDistance: Math.round(totalDistance),
    originalDistance: Math.round(originalDistance),
    savings: Math.round(originalDistance - totalDistance),
    savingsPercent: originalDistance > 0
      ? Math.round((1 - totalDistance / originalDistance) * 100)
      : 0
  };
}

/**
 * Get season from date
 */
export function getSeason(dateStr) {
  const month = new Date(dateStr).getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

/**
 * Get month name from date
 */
export function getMonthName(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long' });
}

/**
 * Revenue Prediction based on historical data
 */
export function predictRevenue(shows, venues, targetVenue, targetDate) {
  const factors = {
    venueType: { weight: 0.4, value: null },
    state: { weight: 0.25, value: null },
    season: { weight: 0.2, value: null },
    overall: { weight: 0.15, value: null }
  };

  // Calculate overall average
  const allRevenues = shows.map(s => (s.performanceFee || 0) + (s.merchandiseSales || 0));
  factors.overall.value = mean(allRevenues);

  // Find venue info
  const venue = venues.find(v => v.id === targetVenue?.id) || targetVenue;

  // Calculate by venue type
  if (venue?.type) {
    const sameTypeShows = shows.filter(s => {
      const showVenue = venues.find(v => v.id === s.venueId);
      return showVenue?.type === venue.type;
    });
    if (sameTypeShows.length > 0) {
      const typeRevenues = sameTypeShows.map(s => (s.performanceFee || 0) + (s.merchandiseSales || 0));
      factors.venueType.value = mean(typeRevenues);
    }
  }

  // Calculate by state
  if (venue?.state) {
    const sameStateShows = shows.filter(s => {
      const showVenue = venues.find(v => v.id === s.venueId);
      return showVenue?.state === venue.state;
    });
    if (sameStateShows.length > 0) {
      const stateRevenues = sameStateShows.map(s => (s.performanceFee || 0) + (s.merchandiseSales || 0));
      factors.state.value = mean(stateRevenues);
    }
  }

  // Calculate by season
  if (targetDate) {
    const targetSeason = getSeason(targetDate);
    const sameSeasonShows = shows.filter(s => getSeason(s.startDate) === targetSeason);
    if (sameSeasonShows.length > 0) {
      const seasonRevenues = sameSeasonShows.map(s => (s.performanceFee || 0) + (s.merchandiseSales || 0));
      factors.season.value = mean(seasonRevenues);
    }
  }

  // Calculate weighted prediction
  let prediction = 0;
  let totalWeight = 0;

  Object.values(factors).forEach(factor => {
    if (factor.value !== null) {
      prediction += factor.value * factor.weight;
      totalWeight += factor.weight;
    }
  });

  if (totalWeight > 0) {
    prediction = prediction / totalWeight * (totalWeight / 1); // Normalize
  }

  // Calculate confidence based on data availability
  const confidence = Object.values(factors).filter(f => f.value !== null).length / 4;

  return {
    predicted: Math.round(prediction),
    confidence: Math.round(confidence * 100),
    factors: {
      venueType: factors.venueType.value ? Math.round(factors.venueType.value) : null,
      state: factors.state.value ? Math.round(factors.state.value) : null,
      season: factors.season.value ? Math.round(factors.season.value) : null,
      overall: Math.round(factors.overall.value)
    },
    breakdown: {
      estimatedFee: Math.round(prediction * 0.7), // ~70% typically from performance fee
      estimatedMerch: Math.round(prediction * 0.3) // ~30% from merch
    }
  };
}

/**
 * Detect anomalies in show data
 */
export function detectAnomalies(shows, venues) {
  const anomalies = [];

  if (shows.length < 3) {
    return anomalies; // Need sufficient data
  }

  // Calculate statistics for each metric
  const fees = shows.map(s => s.performanceFee || 0).filter(f => f > 0);
  const merch = shows.map(s => s.merchandiseSales || 0).filter(m => m > 0);
  const expenses = shows.map(s => s.expenses || 0).filter(e => e > 0);
  const profits = shows.map(s => s.profit || 0);

  const feeStats = { mean: mean(fees), std: standardDeviation(fees), p25: percentile(fees, 25), p75: percentile(fees, 75) };
  const merchStats = { mean: mean(merch), std: standardDeviation(merch), p25: percentile(merch, 25), p75: percentile(merch, 75) };
  const expenseStats = { mean: mean(expenses), std: standardDeviation(expenses), p25: percentile(expenses, 25), p75: percentile(expenses, 75) };

  shows.forEach(show => {
    const venue = venues.find(v => v.id === show.venueId);
    const venueName = venue?.name || 'Unknown Venue';

    // Check for unusually low performance fee
    if (show.performanceFee > 0 && show.performanceFee < feeStats.p25 * 0.5) {
      anomalies.push({
        showId: show.id,
        type: 'low_fee',
        severity: 'warning',
        field: 'performanceFee',
        value: show.performanceFee,
        expected: feeStats.mean,
        message: `Performance fee ($${show.performanceFee.toLocaleString()}) is significantly below average ($${Math.round(feeStats.mean).toLocaleString()})`,
        venue: venueName,
        date: show.startDate
      });
    }

    // Check for unusually high performance fee
    if (show.performanceFee > feeStats.p75 * 2) {
      anomalies.push({
        showId: show.id,
        type: 'high_fee',
        severity: 'info',
        field: 'performanceFee',
        value: show.performanceFee,
        expected: feeStats.mean,
        message: `Performance fee ($${show.performanceFee.toLocaleString()}) is significantly above average - verify this is correct`,
        venue: venueName,
        date: show.startDate
      });
    }

    // Check for unusually high expenses
    if (show.expenses > 0 && show.expenses > expenseStats.p75 * 2) {
      anomalies.push({
        showId: show.id,
        type: 'high_expenses',
        severity: 'warning',
        field: 'expenses',
        value: show.expenses,
        expected: expenseStats.mean,
        message: `Expenses ($${show.expenses.toLocaleString()}) are unusually high compared to average ($${Math.round(expenseStats.mean).toLocaleString()})`,
        venue: venueName,
        date: show.startDate
      });
    }

    // Check for negative profit
    if (show.profit < 0) {
      anomalies.push({
        showId: show.id,
        type: 'negative_profit',
        severity: 'alert',
        field: 'profit',
        value: show.profit,
        expected: 0,
        message: `Show resulted in a loss of $${Math.abs(show.profit).toLocaleString()}`,
        venue: venueName,
        date: show.startDate
      });
    }

    // Check for missing merchandise sales (if typically has merch)
    if (show.merchandiseSales === 0 && merchStats.mean > 100) {
      anomalies.push({
        showId: show.id,
        type: 'no_merch',
        severity: 'info',
        field: 'merchandiseSales',
        value: 0,
        expected: merchStats.mean,
        message: `No merchandise sales recorded (average is $${Math.round(merchStats.mean).toLocaleString()})`,
        venue: venueName,
        date: show.startDate
      });
    }

    // Check for zero performance fee
    if (!show.performanceFee || show.performanceFee === 0) {
      anomalies.push({
        showId: show.id,
        type: 'missing_fee',
        severity: 'warning',
        field: 'performanceFee',
        value: 0,
        expected: feeStats.mean,
        message: `No performance fee recorded - was this show free/promotional?`,
        venue: venueName,
        date: show.startDate
      });
    }
  });

  // Sort by severity
  const severityOrder = { alert: 0, warning: 1, info: 2 };
  anomalies.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return anomalies;
}

/**
 * Generate pricing recommendations based on venue characteristics
 */
export function getPricingRecommendations(shows, venues, targetVenue) {
  const recommendations = {
    suggestedFee: null,
    suggestedRange: { min: null, max: null },
    factors: [],
    comparisons: []
  };

  if (!targetVenue) return recommendations;

  const venue = venues.find(v => v.id === targetVenue.id) || targetVenue;

  // Get all fees
  const allFees = shows.map(s => s.performanceFee || 0).filter(f => f > 0);
  if (allFees.length === 0) return recommendations;

  const baseAvg = mean(allFees);
  let adjustedFee = baseAvg;

  // Factor 1: Venue Type
  if (venue.type) {
    const typeShows = shows.filter(s => {
      const v = venues.find(v => v.id === s.venueId);
      return v?.type === venue.type;
    });
    if (typeShows.length > 0) {
      const typeFees = typeShows.map(s => s.performanceFee || 0).filter(f => f > 0);
      const typeAvg = mean(typeFees);
      const adjustment = ((typeAvg - baseAvg) / baseAvg) * 100;
      adjustedFee = typeAvg;
      recommendations.factors.push({
        name: `Venue Type: ${venue.type}`,
        adjustment: adjustment > 0 ? `+${Math.round(adjustment)}%` : `${Math.round(adjustment)}%`,
        basedOn: `${typeShows.length} similar shows`,
        average: Math.round(typeAvg)
      });
    }
  }

  // Factor 2: State/Region
  if (venue.state) {
    const stateShows = shows.filter(s => {
      const v = venues.find(v => v.id === s.venueId);
      return v?.state === venue.state;
    });
    if (stateShows.length > 0) {
      const stateFees = stateShows.map(s => s.performanceFee || 0).filter(f => f > 0);
      const stateAvg = mean(stateFees);
      const adjustment = ((stateAvg - baseAvg) / baseAvg) * 100;
      recommendations.factors.push({
        name: `State: ${venue.state}`,
        adjustment: adjustment > 0 ? `+${Math.round(adjustment)}%` : `${Math.round(adjustment)}%`,
        basedOn: `${stateShows.length} shows in ${venue.state}`,
        average: Math.round(stateAvg)
      });
      // Blend with type average
      adjustedFee = (adjustedFee + stateAvg) / 2;
    }
  }

  // Factor 3: Distance from homebase (travel cost consideration)
  const distance = distanceFromHomebase(venue);
  if (distance) {
    const distanceTiers = [
      { max: 100, adjustment: 0, label: 'Local (under 100 mi)' },
      { max: 250, adjustment: 5, label: 'Regional (100-250 mi)' },
      { max: 500, adjustment: 10, label: 'Extended (250-500 mi)' },
      { max: Infinity, adjustment: 15, label: 'Long Distance (500+ mi)' }
    ];
    const tier = distanceTiers.find(t => distance <= t.max);
    if (tier && tier.adjustment > 0) {
      recommendations.factors.push({
        name: tier.label,
        adjustment: `+${tier.adjustment}%`,
        basedOn: `${Math.round(distance)} miles from homebase`,
        note: 'Travel cost consideration'
      });
      adjustedFee *= (1 + tier.adjustment / 100);
    }
  }

  // Factor 4: Capacity (if available)
  if (venue.capacity) {
    const capacityTiers = [
      { max: 500, multiplier: 0.9, label: 'Small Venue' },
      { max: 2000, multiplier: 1.0, label: 'Medium Venue' },
      { max: 5000, multiplier: 1.1, label: 'Large Venue' },
      { max: Infinity, multiplier: 1.2, label: 'Major Venue' }
    ];
    const tier = capacityTiers.find(t => venue.capacity <= t.max);
    if (tier && tier.multiplier !== 1.0) {
      const adjustment = (tier.multiplier - 1) * 100;
      recommendations.factors.push({
        name: `${tier.label} (${venue.capacity.toLocaleString()} capacity)`,
        adjustment: adjustment > 0 ? `+${Math.round(adjustment)}%` : `${Math.round(adjustment)}%`,
        basedOn: 'Venue size category'
      });
      adjustedFee *= tier.multiplier;
    }
  }

  // Calculate final recommendation
  recommendations.suggestedFee = Math.round(adjustedFee / 100) * 100; // Round to nearest $100
  recommendations.suggestedRange = {
    min: Math.round(adjustedFee * 0.85 / 100) * 100,
    max: Math.round(adjustedFee * 1.15 / 100) * 100
  };

  // Add comparisons to similar venues
  if (venue.type) {
    const similarVenues = venues.filter(v =>
      v.id !== venue.id &&
      v.type === venue.type
    ).slice(0, 5);

    similarVenues.forEach(sv => {
      const svShows = shows.filter(s => s.venueId === sv.id);
      if (svShows.length > 0) {
        const svFees = svShows.map(s => s.performanceFee || 0).filter(f => f > 0);
        if (svFees.length > 0) {
          recommendations.comparisons.push({
            venueName: sv.name,
            city: sv.city,
            state: sv.state,
            avgFee: Math.round(mean(svFees)),
            showCount: svShows.length
          });
        }
      }
    });
  }

  return recommendations;
}

/**
 * Smart scheduling - find optimal dates for booking
 */
export function suggestSchedulingDates(shows, venues, targetVenue, targetMonth) {
  const suggestions = [];

  if (!targetVenue) return suggestions;

  const venue = venues.find(v => v.id === targetVenue.id) || targetVenue;
  const year = new Date().getFullYear();
  const month = targetMonth || new Date().getMonth();

  // Get all dates in target month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    monthDates.push(new Date(year, month, day));
  }

  // Check each date
  monthDates.forEach(date => {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    // Skip if there's already a show on this date
    const hasConflict = shows.some(s => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate || s.startDate);
      return date >= start && date <= end;
    });

    if (hasConflict) return;

    // Calculate score for this date
    let score = 50; // Base score
    const reasons = [];

    // Weekend bonus
    if (dayOfWeek === 5 || dayOfWeek === 6) {
      score += 20;
      reasons.push('Weekend (higher attendance)');
    } else if (dayOfWeek === 0) {
      score += 10;
      reasons.push('Sunday');
    }

    // Check nearby shows for efficient routing
    const nearbyShows = shows.filter(s => {
      const showDate = new Date(s.startDate);
      const daysDiff = Math.abs((date - showDate) / (1000 * 60 * 60 * 24));
      return daysDiff > 0 && daysDiff <= 3;
    });

    nearbyShows.forEach(nearbyShow => {
      const nearbyVenue = venues.find(v => v.id === nearbyShow.venueId);
      if (nearbyVenue && venue.latitude && venue.longitude && nearbyVenue.latitude && nearbyVenue.longitude) {
        const dist = calculateDistance(
          venue.latitude, venue.longitude,
          nearbyVenue.latitude, nearbyVenue.longitude
        );
        if (dist < 150) {
          score += 15;
          reasons.push(`Near ${nearbyVenue.name} show (${Math.round(dist)} mi)`);
        }
      }
    });

    // Summer bonus for outdoor venues
    if (venue.type === 'Fair/Festival' || venue.type === 'Outdoor Venue') {
      if (month >= 5 && month <= 8) {
        score += 10;
        reasons.push('Peak outdoor season');
      }
    }

    // Historical success on similar dates
    const historicalSameMonth = shows.filter(s => {
      const showMonth = new Date(s.startDate).getMonth();
      return showMonth === month;
    });
    if (historicalSameMonth.length > 0) {
      const avgRevenue = mean(historicalSameMonth.map(s => (s.performanceFee || 0) + (s.merchandiseSales || 0)));
      if (avgRevenue > 0) {
        reasons.push(`Historical avg: $${Math.round(avgRevenue).toLocaleString()}`);
      }
    }

    if (score >= 50) {
      suggestions.push({
        date: dateStr,
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
        score,
        reasons
      });
    }
  });

  // Sort by score descending
  suggestions.sort((a, b) => b.score - a.score);

  return suggestions.slice(0, 10); // Return top 10 suggestions
}
