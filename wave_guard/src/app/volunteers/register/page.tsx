"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Home, Users, MapPin, Phone, User, Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";

interface VolunteerData {
  id?: string;
  name: string;
  email?: string | null;
  city: string;
  contact: string;
  motivation?: string;
  availability?: string;
  skills?: string[];
  created_at?: any;
  updated_at?: any;
  user_id?: string;
}

function VolunteerRegisterContent() {
  const router = useRouter();
  const { user, userProfile, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    contact: "",
    motivation: "",
    availability: "weekends",
    skills: [] as string[],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pre-fill name if user is logged in
  useEffect(() => {
    if (userProfile && !formData.name) {
      const fullName = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
      setFormData(prev => ({
        ...prev,
        name: fullName
      }));
    }
  }, [userProfile]);

  const availableSkills = [
    "Emergency Response",
    "Medical Aid",
    "Search & Rescue",
    "Communication",
    "Logistics",
    "Transportation",
    "Shelter Management",
    "Food Distribution",
    "Community Outreach",
    "Technical Support"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({44
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.city.trim()) {
      setError("City is required");
      return false;
    }
    if (!formData.contact.trim()) {
      setError("Contact information is required");
      return false;
    }
    if (formData.contact.trim().length < 10) {
      setError("Please provide a valid contact number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create volunteer data
      const volunteerData: VolunteerData = {
        name: formData.name.trim(),
        email: user?.email || null,
        city: formData.city.trim(),
        contact: formData.contact.trim(),
        motivation: formData.motivation.trim() || null,
        availability: formData.availability,
        skills: formData.skills,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        user_id: user?.uid || null,
      };

      // Generate a document ID
      const docId = user?.uid ? `user_${user.uid}` : `volunteer_${Date.now()}`;
      const volunteerRef = doc(db, "volunteers", docId);
      
      await setDoc(volunteerRef, volunteerData);
      
      setSuccess(true);
      toast.success("Thank you! Your volunteer registration has been submitted successfully.");
      
      // Redirect after success
      setTimeout(() => {
        router.push("/volunteers");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error registering volunteer:", error);
      setError(error.message || "An error occurred while registering. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-ocean-50 via-cyan-50 to-teal-50 px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-ocean-500" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-ocean-50 via-cyan-50 to-teal-50 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-ocean-700 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for volunteering with WaveGuard. We'll contact you when volunteer opportunities arise in your area.
          </p>
          <Link 
            href="/volunteers"
            className="inline-flex items-center gap-2 bg-ocean-500 hover:bg-ocean-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <Users className="h-4 w-4" />
            View Volunteers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-ocean-50 via-cyan-50 to-teal-50 px-4 sm:px-6 py-8">
      <Link 
        href="/volunteers" 
        className="inline-flex items-center gap-2 bg-white/80 hover:bg-white transition-colors text-ocean-700 py-2 px-4 rounded-lg text-sm mb-8 shadow-sm"
      >
        <Home className="h-4 w-4" />
        <span>Back to Volunteers</span>
      </Link>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-ocean-600" />
            </div>
            <h1 className="text-3xl font-bold text-ocean-700 mb-2">Volunteer Registration</h1>
            <p className="text-gray-600">
              Join our community of heroes helping to protect lives during natural disasters
            </p>
          </div>

          {/* User Status Info */}
          {user && (
            <div className="bg-ocean-50 border border-ocean-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-ocean-700">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Registering as: {userProfile?.email || user.email}
                </span>
              </div>
              <p className="text-xs text-ocean-600 mt-1">
                Your name will be automatically filled from your account
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ocean-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                readOnly={!!user}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors ${
                  user ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                }`}
                placeholder="Enter your full name"
                required
              />
              {user && (
                <p className="text-xs text-gray-500 mt-1">
                  Name is automatically filled from your account and cannot be changed here
                </p>
              )}
            </div>

            {/* City Field */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-ocean-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                City *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors"
                placeholder="Enter your city"
                required
              />
            </div>

            {/* Contact Field */}
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-ocean-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Contact Number *
              </label>
              <input
                id="contact"
                name="contact"
                type="tel"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Motivation Field */}
            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-ocean-700 mb-2">
                Why do you want to volunteer?
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors resize-none"
                placeholder="Tell us what motivates you to help during emergencies..."
              />
            </div>

            {/* Availability Field */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-ocean-700 mb-2">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent transition-colors"
              >
                <option value="weekends">Weekends Only</option>
                <option value="weekdays">Weekdays Only</option>
                <option value="anytime">Anytime</option>
                <option value="emergencies">Emergency Situations Only</option>
                <option value="flexible">Flexible Schedule</option>
              </select>
            </div>

            {/* Skills Selection */}
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-3">
                Areas of Expertise (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableSkills.map((skill) => (
                  <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="rounded border-gray-300 text-ocean-500 focus:ring-ocean-500"
                    />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ocean-500 hover:bg-ocean-600 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5" />
                    <span>Register as Volunteer</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <h3 className="text-sm font-medium text-teal-800 mb-2">What happens next?</h3>
            <ul className="text-xs text-teal-700 space-y-1">
              <li>• We'll review your registration and contact you within 48 hours</li>
              <li>• You'll receive training materials and emergency response protocols</li>
              <li>• We'll notify you of volunteer opportunities in your city</li>
              <li>• You can update your availability and skills anytime</li>
            </ul>
          </div>

          {/* Login Prompt for Non-authenticated Users */}
          {!user && (
            <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
              <p className="text-sm text-cyan-800 text-center">
                Have an account?{" "}
                <Link href="/login" className="text-ocean-600 hover:text-ocean-700 font-medium underline">
                  Sign in
                </Link>
                {" "}to auto-fill your details and track your volunteer activities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VolunteerRegisterFallback() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-ocean-50 via-cyan-50 to-teal-50 px-4 sm:px-6">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-500" />
        <p className="mt-2 text-sm text-gray-500">Loading registration form...</p>
      </div>
    </div>
  );
}

export default function VolunteerRegisterPage() {
  return (
    <Suspense fallback={<VolunteerRegisterFallback />}>
      <VolunteerRegisterContent />
    </Suspense>
  );
}
