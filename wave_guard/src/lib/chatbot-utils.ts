// lib/chatbot-utils.ts
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

interface Message {
  role: "user" | "bot";
  type: string;
  content: string;
  timestamp: Date;
}

/**
 * Save a message for a user to Firestore.
 * @param userId - The user ID
 * @param message - { role, content, timestamp }
 */
export async function saveMessageToFirestore(userId: string, message: Message): Promise<void> {
    console.log(99999)
//   const userId = "demo";
  const ref = collection(db, "chatbot", userId, "messages");
  await addDoc(ref, {
    ...message,
    timestamp: new Date(),
  });
}

/**
 * Get all messages for a user from Firestore.
 * @param userId - The user ID
 * @returns Promise<Message[]>
 */
export async function getMessagesFromFirestore(userId: string): Promise<Message[]> {
    console.log(9)
  const ref = collection(db, "chatbot", userId, "messages");
  const q = query(ref, orderBy("timestamp", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data() as Message);
}

