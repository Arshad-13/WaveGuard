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
import { 
  Bell, 
  Send, 
  Share2, 
  AlertTriangle, 
  Clock, 
  User, 
  MapPin, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface User {
  uid: string;
  displayName?: string;
}

interface FirebaseUser {
  uid: string;
  displayName?: string;
}

interface Notice {
  id: string;
  text: string;
  createdAt: { seconds: number; nanoseconds: number };
  name: string;
  region: string;
  postedBy: string;
  officerName: string;
}

export default function NoticeBoard() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  const [noticeInput, setNoticeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setLoading(true);
        try {
          const noticesRef = collection(db, "notices");
          const q = query(
            noticesRef,
            where("region", "==", region),
            orderBy("createdAt", "desc")
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
        } catch (error) {
          console.error("Error fetching notices:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotices();
  }, [region]);

  const handleBroadcast = async () => {
    if (!noticeInput.trim()) return;
    
    if (!region) {
      alert("Please wait while loading your region information...");
      return;
    }

    try {
      setIsSubmitting(true);
      await addDoc(collection(db, "notices"), {
        text: noticeInput,
        createdAt: new Date(),
        name: (user as unknown as FirebaseUser)?.displayName || "Unknown Officer",
        region,
        postedBy: (user as unknown as FirebaseUser)?.uid || "",
      });
      setNoticeInput("");
      // Refresh notices
      window.location.reload();
    } catch (error) {
      console.error("Error posting notice:", error);
      alert("Error posting notice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: "WaveGuard Alert",
        text,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        alert("Alert copied to clipboard!");
      });
    }
  };

  const formatTimeAgo = (timestamp: { seconds: number; nanoseconds: number }) => {
    const now = new Date();
    const noticeTime = new Date(timestamp.seconds * 1000);
    const diffInMinutes = Math.floor((now.getTime() - noticeTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg mb-4">
            <Bell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Emergency Alerts</h1>
          <p className="text-gray-600">Stay informed with real-time coastal threat notifications</p>
          {region && (
            <div className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-blue-100 rounded-full">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{region}</span>
            </div>
          )}
        </div>

        {/* Officer Broadcast Section */}
        {role === "officer" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Broadcast Alert</h2>
                <p className="text-sm text-gray-600">Send emergency notifications to your region</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <textarea
                className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                rows={4}
                placeholder="Write an emergency alert to broadcast to your region..."
                value={noticeInput}
                onChange={(e) => setNoticeInput(e.target.value)}
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {noticeInput.length}/500 characters
                </span>
                <button
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isSubmitting || !region || !noticeInput.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  }`}
                  onClick={handleBroadcast}
                  disabled={isSubmitting || !region || !noticeInput.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Broadcasting...</span>
                    </>
                  ) : !region ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading region...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Broadcast Alert</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recent Alerts</h2>
                <p className="text-sm text-gray-600">
                  {region ? `Alerts for ${region}` : "Loading region..."}
                </p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            )}
          </div>

          {notices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Alerts</h3>
              <p className="text-gray-500">No emergency alerts for your region at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notices.map((notice, index) => (
                <div 
                  key={notice.id} 
                  className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium leading-relaxed">{notice.text}</p>
                      </div>
                    </div>
                    {role === "user" && (
                      <button
                        onClick={() => handleShare(notice.text)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{notice.name}</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          Officer
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(notice.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
