Apps Script sample: store and update visit count in Google Sheets

This sample shows a minimal Google Apps Script (doGet/doPost) that stores a single counter in a Google Sheet and returns JSON.

1) Create a Google Sheet with one sheet named "meta" and in cell A1 put a number (initial count), e.g. 0.

2) In the Apps Script editor (Extensions → Apps Script) create a new project and paste this code:

```javascript
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ count: readCount() }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // Accept JSON body { count: N } and overwrite sheet value with that count
  try {
    const payload = e.postData && e.postData.type === 'application/json' ? JSON.parse(e.postData.contents) : null;
    if (payload && typeof payload.count !== 'undefined') {
      const written = writeCount(Number(payload.count));
      return ContentService
        .createTextOutput(JSON.stringify({ count: written }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Fallback: return current value
      return ContentService
        .createTextOutput(JSON.stringify({ count: readCount() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function readCount() {
  const ss = SpreadsheetApp.openById("<YOUR_SHEET_ID>");
  const sheet = ss.getSheetByName("meta");
  const value = sheet.getRange("A1").getValue();
  return Number(value) || 0;
}

function writeCount(n) {
  const ss = SpreadsheetApp.openById("<YOUR_SHEET_ID>");
  const sheet = ss.getSheetByName("meta");
  const range = sheet.getRange("A1");
  range.setValue(n);
  return n;
}
```

3) Replace `<YOUR_SHEET_ID>` with your sheet's ID (from the spreadsheet URL).

4) Deploy the script as a Web App (top-right: Deploy → New deployment → select "Web app"):
   - Who has access: set to "Anyone" or "Anyone, even anonymous" depending on your needs.
   - Copy the Web App URL and use it in your site (the `appsScriptUrl` in the client).

Notes
- If you set access to "Anyone", the endpoint can be called without authentication, which is suitable for a public visit counter.
- For more security, require authentication and adjust client accordingly.
- Google Apps Script has quotas; for a low-traffic public counter this is usually fine.

Troubleshooting
- If you get 403/401 when calling the Web App, check deployment access settings.
- If updates seem delayed, check that the script is deployed (and use the latest deployment if you've previously deployed).
