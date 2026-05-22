import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';

const firebaseConfig = {
  // USER: Please fill in your Firebase config here
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app, database;

try {
  if (firebaseConfig.databaseURL && firebaseConfig.databaseURL.startsWith("https://")) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } else {
    console.warn("Firebase config is in placeholder state. Local storage fallback will be used.");
  }
} catch (error) {
  console.warn("Firebase initialization failed:", error);
}

export { database, ref, set, onValue, get };

