import * as firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: window._env_.REACT_APP_FIREBASE_API_KEY, 
  authDomain: window._env_.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: window._env_.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: window._env_.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: window._env_.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: window._env_.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: window._env_.REACT_APP_FIREBASE_APP_ID,
  measurementId: window._env_.REACT_APP_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

export const database = firebase.firestore();
