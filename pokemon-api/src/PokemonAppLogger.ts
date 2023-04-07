import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOTylCoOrqxdJV117qCJHXsBR9KJv4I5M",
  authDomain: "joelquintana-pokemon-api.firebaseapp.com",
  projectId: "joelquintana-pokemon-api",
  storageBucket: "joelquintana-pokemon-api.appspot.com",
  messagingSenderId: "861732344836",
  appId: "1:861732344836:web:3e328b8911b7cf89e41151",
  measurementId: "G-Y6C84KSC82",
};

export function log(event: string) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  logEvent(analytics, event);
}
