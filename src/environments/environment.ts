// Local environment file is ignored by git. Create this file from
// src/environments/environment.ts.example and add your real API keys.
// For local development you can keep a copy named environment.local.ts (not committed).

export const environment = {
  production: false,
  // Replace with real values by copying from environment.ts.example
  googleMapsApiKey: 'GOOGLE_MAPS_API_KEY',
  firebase: {
    apiKey: 'FIREBASE_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    databaseURL: 'https://your-project-default-rtdb.firebaseio.com',
    projectId: 'your-project',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '...'
  }
};