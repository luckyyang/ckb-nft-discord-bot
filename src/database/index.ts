import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import serviceAccount from "../config/firebase.json";

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
export default db;
