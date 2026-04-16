import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9cqd8Dn7HNIJiTFXez6DmY2J0kVZgt8c",
  authDomain: "ratemycourse-e0b8d.firebaseapp.com",
  projectId: "ratemycourse-e0b8d",
  storageBucket: "ratemycourse-e0b8d.firebasestorage.app",
  messagingSenderId: "346469082620",
  appId: "1:346469082620:web:165b495ae392315cfa3e79",
  measurementId: "G-0TVBZTZ774"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
