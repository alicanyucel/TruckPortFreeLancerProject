// Local environment file is ignored by git. Create this file from
// src/environments/environment.ts.example and add your real API keys.
// For local development you can keep a copy named environment.local.ts (not committed).

export const environment = {
  production: false,
  // Local Google Maps API key (local-only, file is gitignored)
  googleMapsApiKey: 'AIzaSyCGBCK_xHK1Yqm1OaCB0Iik8nwORIATk-w',
  firebase: {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    databaseURL: 'https://your-project-default-rtdb.firebaseio.com',
    projectId: 'your-project',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '...'
  }
};