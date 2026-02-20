import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADE8M5nAskhJq_JiAAA9Yx4vDNV7HFiPM",
  authDomain: "artdesing-151e1.firebaseapp.com",
  projectId: "artdesing-151e1",
  storageBucket: "artdesing-151e1.firebasestorage.app",
  messagingSenderId: "301064503657",
  appId: "1:301064503657:web:fd0606e661de77f3cc3df8",
  measurementId: "G-T8N34DVMTT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
