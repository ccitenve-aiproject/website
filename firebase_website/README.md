# Deploying this website with Firebase Hosting & Cloud Functions

This repository contains a static site in `public/` and a small Cloud Function in `functions/` used for a visit counter. Below are step-by-step instructions for installing dependencies, testing locally with the Firebase emulator, and deploying to Firebase.

Prerequisites
- Node.js 18.x (Firebase Functions uses Node 18 in this project)
- npm (comes with Node)
- Firebase CLI (install with `npm install -g firebase-tools`)
- A Firebase project configured (you should have run `firebase init` previously and linked the project)

Quick file overview
- `public/` — static site files served by Firebase Hosting
- `functions/visitcounter.js` — Cloud Function that increments a Firestore counter
- `functions/index.js` — functions entry file (exports the function)
- `functions/package.json` — dependencies for functions (firebase-admin, firebase-functions)
- `firebase.json` — hosting configuration and a rewrite that maps `/incrementVisitCount` to the function

Install dependencies
1. Install root-level dependencies (if any):

```bash
cd /Your Directory/website/firebase_website
npm install
```

2. Install Cloud Functions dependencies:

```bash
cd functions
npm install
```

Run locally with Firebase Emulator (recommended)
1. From project root, start the hosting and functions emulators. This serves your static site and routes `/incrementVisitCount` to the local function:

```bash
cd /Your Directory/website/firebase_website
firebase emulators:start --only functions,hosting
```

2. Open the emulator UI (usually http://localhost:4000) to view logs and function calls. The hosting site is normally at http://localhost:5000.

3. Visit a page (e.g., `http://localhost:5000/300hpa.html`) and watch the Network tab or emulator logs for the POST to `/incrementVisitCount`.

Deploy to Firebase
1. Make sure you're logged in and your project is selected:

```bash
firebase login
firebase use --add  # choose or add your Firebase project
```

2. Deploy hosting and functions together:

```bash
cd /Your Directory/website/firebase_website
firebase deploy --only hosting, functions
```

3. After deploy, visit your Firebase hosting URL (shown in the deploy output) to verify the site and counter.

Common issues & troubleshooting
- Function fails to deploy / not found: ensure `functions/index.js` exports the function name used by `firebase.json` (`incrementVisitCount`) and `functions/package.json` is present.
- CORS errors in browser: the function sets Access-Control-Allow-Origin: *; if you require stricter origins, edit `functions/visitcounter.js`.
- Firestore permission errors: the function runs with the default service account. Ensure Firestore exists and the service account has read/write permissions (usually default is fine).
- Local emulator can show logs and HTTP request/response; check the Functions logs printed in the emulator terminal.

Optional: test the function with curl

After emulator start (or after deploy), you can test the endpoint with curl:

```bash
# Emulator (example):
curl -X POST http://localhost:5001/<your-project-id>/us-central1/incrementVisitCount

# If using hosting rewrite or deployed hosting URL:
curl -X POST https://<your-hosting-domain>/incrementVisitCount
```

If you want, I can also add a small smoke-test script to call the function and print the response. Tell me if you'd like that and whether you prefer emulator or deployed URL testing.
