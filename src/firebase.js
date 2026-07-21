import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// Initialize Firebase with dummy values to prevent crash during development
// The user normally needs to replace these with real values
const firebaseConfig = {
  apiKey: "AIzaSyDddAG3X7m6m-iHLLdEX2X0bb1mfUjUi64",
  authDomain: "udaykiranportfolio.firebaseapp.com",
  projectId: "udaykiranportfolio",
  storageBucket: "udaykiranportfolio.firebasestorage.app",
  messagingSenderId: "1076964994338",
  appId: "1:1076964994338:web:67b15488de523cfdedc97b",
  measurementId: ""
};

// Initialize Firebase
// We wrap this in a try-catch or just export mocks if no real config
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable Offline Persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a a time.
    console.warn("Firebase persistence failed: Multiple tabs open");
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.warn("Firebase persistence not supported in this browser");
  }
});

export default app;
