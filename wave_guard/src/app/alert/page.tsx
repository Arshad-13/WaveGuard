"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/authLib";
import { useAuth } from "@/hooks/useAuth";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import twilio from 'twilio';


export default function NoticeBoard() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [noticeInput, setNoticeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState<any[]>([]);
  

  const router = useRouter();

  useEffect(() => {
    const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
    const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    async function createMessage() {
    const message = await client.messages.create({
        body: "This is the ship that made the Kessel Run in fourteen parsecs?",
        from: "+919328788481",
        to: "+919714110365",
    });

        console.log(message.body);
        }

        createMessage();
  }, [])

  // Fetch user details (role + region)
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRole(userData.role);
          setRegion(userData.region);
        }
      }
    };

    fetchUserDetails();
  }, [user]);

  // Fetch notices for the user's region
useEffect(() => {
  const fetchNotices = async () => {
    if (region) {
      const noticesRef = collection(db, "notices");
      const q = query(
        noticesRef,
        where("region", "==", region),
        orderBy("createdAt", "desc") // 🧠 Order by newest first
      );

      const querySnapshot = await getDocs(q);
      const results = await Promise.all(
        querySnapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const postedByRef = doc(db, "users", data.postedBy);
          const posterSnap = await getDoc(postedByRef);
          const posterName = posterSnap.exists()
            ? posterSnap.data().name || "Unknown Officer"
            : "Unknown Officer";

          return {
            id: docSnap.id,
            ...data,
            officerName: posterName,
          };
        })
      );

      setNotices(results);
    }
  };

  fetchNotices();
}, [region]);

  const handleBroadcast = async () => {
    if (!noticeInput.trim()) return;

    try {
        // console.table(user)
      setLoading(true);
      await addDoc(collection(db, "notices"), {
        text: noticeInput,
        createdAt: new Date(),
        name: user.displayName,
        region,
        postedBy: user.uid,
      });
      setNoticeInput("");
      alert("Notice broadcasted!");
    } catch (error) {
      console.error("Error posting notice:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Notice",
        text,
      });
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  if (!user) return <div>Loading user...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notice Board</h1>

      {role === "officer" && (
        <div className="mb-6">
          <textarea
            className="w-full border p-2 mb-2 rounded-xl"
            rows={4}
            placeholder="Write a notice to broadcast..."
            value={noticeInput}
            onChange={(e) => setNoticeInput(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleBroadcast}
            disabled={loading}
          >
            {loading ? "Broadcasting..." : "Broadcast Notice"}
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-2">Notices for Region: {region}</h2>
        {notices.length === 0 ? (
          <p>No notices yet for your region.</p>
        ) : (
          <ul className="space-y-4">
            {notices.map((notice) => (
              <li key={notice.id} className="border p-4 rounded shadow">
                <p>{notice.text}</p>
                <p className="text-sm text-gray-400 mt-2 rounded-xl">
                  Posted by: { notice.name } <span className="text-gray-500">(officer)</span>
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(notice.createdAt.seconds * 1000).toLocaleString()}
                </p>
                {role === "user" && (
                  <button
                    className="mt-2 text-blue-500 underline"
                    onClick={() => handleShare(notice.text)}
                  >
                    Share
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
