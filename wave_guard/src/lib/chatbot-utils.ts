// lib/chatbot-utils.js
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Save a message for the "demo" user to Firestore.
 * @param {object} message - { role, content, timestamp }
 */
export async function saveMessageToFirestore(userId, message) {
    console.log(99999)
//   const userId = "demo";
  const ref = collection(db, "chatbot", userId, "messages");
  await addDoc(ref, {
    ...message,
    timestamp: new Date(),
  });
}

/**
 * Get all messages for the "demo" user from Firestore.
 * @returns {Promise<Array>}
 */
export async function getMessagesFromFirestore(userId) {
    console.log(9)
  const ref = collection(db, "chatbot", userId, "messages");
  const q = query(ref, orderBy("timestamp", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}

