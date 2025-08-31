"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
interface User {
  uid: string;
  displayName?: string;
}

interface FirebaseUser {
  uid: string;
  displayName?: string;
}

export default function NoticeBoard() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [noticeInput, setNoticeInput] = useState("");
  const [loading, setLoading] = useState(false);
interface Notice {
  id: string;
  text: string;
  createdAt: { seconds: number; nanoseconds: number };
  name: string;
  region: string;
  postedBy: string;
  officerName: string;
}

  const [notices, setNotices] = useState<Notice[]>([]);

  // Function to send SMS via API route
const sendSMS = async (body: string, from: string, to: string) => {
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body, from, to }),
      });
  
      const result = await response.json();
      
      if (result.success) {
        console.log('SMS sent successfully:', result.body);
        return result;
      } else {
        console.error('Failed to send SMS:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  };

  // Fetch user details (role + region)
  useEffect(() => {
    const fetchUserDetails = async () => {
      // Uncomment the line below if you want to send a test SMS on component mount
      // sendSMS("This is the ship that made the Kessel Run in fourteen parsecs?", "+919328788481", "+919714110365");
      if (user && 'uid' in user && (user as FirebaseUser).uid) {
        const userDocRef = doc(db, "users", (user as FirebaseUser).uid);
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
          } as Notice;
        })
      );

      setNotices(results);
    }
  };

  fetchNotices();
}, [region]);

  const handleBroadcast = async () => {
    if (!noticeInput.trim()) return;
    
    // Ensure region is loaded before proceeding
    if (!region) {
      alert("Please wait while loading your region information...");
      return;
    }

    try {
        // console.table(user)
      setLoading(true);
      await addDoc(collection(db, "notices"), {
        text: noticeInput,
        createdAt: new Date(),
        name: (user as unknown as FirebaseUser)?.displayName || "Unknown Officer",
        region,
        postedBy: (user as unknown as FirebaseUser)?.uid || "",
      });
      setNoticeInput("");
      alert("Notice broadcasted!");
    } catch (error) {
      console.error("Error posting notice:", error);
      alert("Error posting notice. Please try again.");
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
            className={`px-4 py-2 rounded ${
              loading || !region 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            onClick={handleBroadcast}
            disabled={loading || !region}
          >
            {loading 
              ? "Broadcasting..." 
              : !region 
              ? "Loading region..." 
              : "Broadcast Notice"
            }
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
