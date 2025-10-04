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
  // Perform an atomic increment on the server using LockService.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // wait up to 30s
    const newCount = atomicIncrement();
    return ContentService
      .createTextOutput(JSON.stringify({ count: newCount }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

function readCount() {
  const ss = SpreadsheetApp.openById("<YOUR_SHEET_ID>");
  const sheet = ss.getSheetByName("meta");
  const value = sheet.getRange("A2").getValue();
  return Number(value) || 0;
}

function writeCount(n) {
  const ss = SpreadsheetApp.openById("<YOUR_SHEET_ID>");
  const sheet = ss.getSheetByName("meta");
  const range = sheet.getRange("A2");
  range.setValue(n);
  return n;
}

function atomicIncrement() {
  const ss = SpreadsheetApp.openById("<YOUR_SHEET_ID>");
  const sheet = ss.getSheetByName("meta");
  const range = sheet.getRange("A2");
  const current = Number(range.getValue()) || 0;
  const next = current + 1;
  range.setValue(next);
  return next;
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

Debugging tips and temporary debug endpoint
-----------------------------------------
If the atomic increment approach isn't working for you, add or temporarily replace `doPost` with a debug version that returns lock and sheet state. Paste this in the Apps Script editor to help identify the failure mode:

```javascript
function doPostDebug(e) {
  const info = {};
  try {
    info.postData = e.postData ? { type: e.postData.type, length: e.postData.contents.length } : null;
  } catch (err) { info.postDataError = String(err); }

  try {
    const lock = LockService.getScriptLock();
    info.lockInfo = { obtained: false };
    try {
      lock.waitLock(5000);
      info.lockInfo.obtained = true;
    } catch (err) { info.lockInfo.error = String(err); }

    try {
      const ss = SpreadsheetApp.openById('<YOUR_SHEET_ID>');
      const sheet = ss.getSheetByName('meta');
      info.sheetRange = 'A2';
      info.current = Number(sheet.getRange('A2').getValue()) || 0;
    } catch (err) { info.sheetError = String(err); }

    try { lock.releaseLock(); } catch (e) {}
  } catch (err) {
    info.globalError = String(err);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ debug: info }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

How to use the debug endpoint
- Deploy (or redeploy) the script and call the deployed URL with curl:

```bash
curl -i -X POST 'https://script.google.com/macros/s/XXXXX/exec' -d ''
```

- Check the JSON returned — it will show whether the lock could be obtained, whether the sheet and range are readable, and any errors.
- Also check Executions in the Apps Script console (View → Executions) for runtime errors and stack traces.

Common problems this reveals
- LockService not available: may show lock acquisition errors.
- Permission errors opening the spreadsheet: will show sheetError (check that the script owner has access to the sheet if running as script owner, or change deployment execution identity).
- Wrong sheet name or range: shows current value or sheetError.

If you paste the debug JSON output here I can read it and tell you the exact fix.
