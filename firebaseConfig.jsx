import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDSAdHedJqAwo0sHDE-M5Q3jm6_OIapzSo",
  authDomain: "studentassistant-18fdd.firebaseapp.com",
  projectId: "studentassistant-18fdd",
  storageBucket: "studentassistant-18fdd.appspot.com",
  messagingSenderId: "969817872121",
  appId: "1:969817872121:web:a8a56ab5c188783ae6f428",
  measurementId: "G-9W2VC26NPV"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app); // Use the already-initialized auth instance
  } else {
    throw error;
  }
}

export { app, database, storage, auth };
