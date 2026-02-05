// GOOGLE APPS SCRIPT - Copy this entire file into your Google Apps Script editor
// Extensions → Apps Script → paste this code → Deploy → New deployment → Web app

// Configuration - Update these to match your sheet tab names
const SHOWS_SHEET = 'Shows';  // Tab name for P&L data

// Allow CORS for web requests
function doGet(e) {
  const output = handleGet(e);
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const output = handlePost(e);
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET: Fetch all shows from the sheet
function handleGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHOWS_SHEET);
    if (!sheet) {
      return { success: false, error: `Sheet "${SHOWS_SHEET}" not found` };
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return { success: true, shows: [] };
    }

    const headers = data[0];
    const shows = data.slice(1).map(row => {
      const show = {};
      headers.forEach((header, i) => {
        let value = row[i];
        // Convert dates to ISO strings
        if (value instanceof Date) {
          value = value.toISOString().split('T')[0];
        }
        // Convert numbers
        if (typeof value === 'number') {
          show[header] = value;
        } else {
          show[header] = value;
        }
      });
      return show;
    }).filter(show => show.id); // Filter out empty rows

    return { success: true, shows };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// POST: Handle create, update, delete operations
function handlePost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { action, show, shows } = payload;

    switch (action) {
      case 'create':
        return createShow(show);
      case 'update':
        return updateShow(show);
      case 'delete':
        return deleteShow(show.id);
      case 'sync':
        return syncAllShows(shows);
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// Create a new show
function createShow(show) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHOWS_SHEET);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const row = headers.map(header => show[header] || '');
  sheet.appendRow(row);

  return { success: true, message: 'Show created' };
}

// Update an existing show
function updateShow(show) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHOWS_SHEET);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');

  if (idCol === -1) {
    return { success: false, error: 'No "id" column found' };
  }

  // Find the row with matching ID
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === show.id) {
      const row = headers.map(header => show[header] !== undefined ? show[header] : data[i][headers.indexOf(header)]);
      sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return { success: true, message: 'Show updated' };
    }
  }

  return { success: false, error: `Show with id "${show.id}" not found` };
}

// Delete a show
function deleteShow(id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHOWS_SHEET);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');

  if (idCol === -1) {
    return { success: false, error: 'No "id" column found' };
  }

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Show deleted' };
    }
  }

  return { success: false, error: `Show with id "${id}" not found` };
}

// Full sync - replaces all data
function syncAllShows(shows) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHOWS_SHEET);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Clear existing data (except headers)
  if (sheet.getLastRow() > 1) {
    sheet.deleteRows(2, sheet.getLastRow() - 1);
  }

  // Write all shows
  if (shows.length > 0) {
    const rows = shows.map(show => headers.map(header => show[header] || ''));
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  return { success: true, message: `Synced ${shows.length} shows` };
}
