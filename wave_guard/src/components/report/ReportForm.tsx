'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, MapPin, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

interface FormData {
  location: string;
  issueType: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  urgency: 'low' | 'medium' | 'high';
  images: File[];
}

const issueTypes = [
  { value: 'garbage', label: 'Garbage Dumping', icon: '🗑️' },
  { value: 'fishing', label: 'Illegal Fishing', icon: '🎣' },
  { value: 'pollution', label: 'Water Pollution', icon: '💧' },
  { value: 'construction', label: 'Illegal Construction', icon: '🏗️' },
  { value: 'wildlife', label: 'Wildlife Disturbance', icon: '🐢' },
  { value: 'erosion', label: 'Coastal Erosion', icon: '🏖️' },
  { value: 'other', label: 'Other Activity', icon: '⚠️' }
];

export function ReportForm() {
  const [formData, setFormData] = useState<FormData>({
    location: '',
    issueType: '',
    description: '',
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    urgency: 'medium',
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.issueType) {
      newErrors.issueType = 'Please select an issue type';
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.reporterName.trim()) {
      newErrors.reporterName = 'Your name is required';
    }

    if (!formData.reporterEmail.trim()) {
      newErrors.reporterEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reporterEmail)) {
      newErrors.reporterEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 5) // Max 5 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Report Submitted Successfully!
          </h2>
          <p className="text-gray-700 mb-8 text-lg leading-relaxed">
            Thank you for being a coastal guardian. Your report has been received and will be reviewed by our environmental protection team within 24 hours.
          </p>
          <div className="bg-white rounded-xl p-6 mb-8 shadow-inner border border-green-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Report ID</p>
                <p className="text-lg font-bold text-gray-900">WG-{Date.now().toString().slice(-6)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <p className="text-lg font-bold text-gray-900">Under Review</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                location: '',
                issueType: '',
                description: '',
                reporterName: '',
                reporterEmail: '',
                reporterPhone: '',
                urgency: 'medium',
                images: []
              });
            }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Location */}
        <div>
          <label className="flex items-center text-lg font-bold text-gray-900 mb-3">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Santa Monica Beach, Pier Area, GPS coordinates"
            className={clsx(
              'w-full px-6 py-4 bg-white border-2 rounded-xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300',
              errors.location ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300'
            )}
          />
          {errors.location && (
            <p className="mt-2 text-red-600 font-semibold flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors.location}
            </p>
          )}
        </div>

        {/* Issue Type */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4">
            Type of Coastal Issue *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {issueTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('issueType', type.value)}
                className={clsx(
                  'p-4 border-2 rounded-xl text-center font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg',
                  formData.issueType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                )}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm">{type.label}</div>
              </button>
            ))}
          </div>
          {errors.issueType && (
            <p className="mt-3 text-red-600 font-semibold flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors.issueType}
            </p>
          )}
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-4">
            Urgency Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'low' as const, label: 'Low Priority', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-500', textColor: 'text-green-700' },
              { value: 'medium' as const, label: 'Medium Priority', color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-500', textColor: 'text-yellow-700' },
              { value: 'high' as const, label: 'High Priority', color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-500', textColor: 'text-red-700' }
            ].map((urgency) => (
              <button
                key={urgency.value}
                type="button"
                onClick={() => handleInputChange('urgency', urgency.value)}
                className={clsx(
                  'p-4 border-2 rounded-xl font-bold text-center transition-all duration-300 transform hover:scale-105',
                  formData.urgency === urgency.value
                    ? `${urgency.borderColor} ${urgency.bgColor} ${urgency.textColor} shadow-lg scale-105`
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                )}
              >
                {urgency.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Detailed Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={5}
            placeholder="Provide detailed information: What did you observe? When did it occur? Location specifics? People involved? Environmental impact? Any immediate dangers?"
            className={clsx(
              'w-full px-6 py-4 bg-white border-2 rounded-xl text-lg resize-none focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300',
              errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300'
            )}
          />
          {errors.description && (
            <p className="mt-2 text-red-600 font-semibold flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-lg font-bold text-gray-900 mb-3">
            Upload Evidence Photos (Optional)
          </label>
          <div className="border-3 border-dashed border-blue-300 bg-blue-50 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-100 transition-all duration-300">
            <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Drag & drop photos here or click to select
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
            >
              Choose Photos
            </label>
            <p className="text-sm font-semibold text-gray-600 mt-3">
              Maximum 5 photos, 5MB each. JPG, PNG formats accepted.
            </p>
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                    width={100}
                    height={96}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-xs font-medium text-gray-600 mt-1 truncate text-center">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reporter Information */}
        <div className="border-t-4 border-gray-200 pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">i</span>
            </div>
            Your Contact Information
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.reporterName}
                onChange={(e) => handleInputChange('reporterName', e.target.value)}
                placeholder="Enter your full name"
                className={clsx(
                  'w-full px-6 py-4 bg-white border-2 rounded-xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300',
                  errors.reporterName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300'
                )}
              />
              {errors.reporterName && (
                <p className="mt-2 text-red-600 font-semibold flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors.reporterName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.reporterPhone}
                onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                placeholder="Your phone number"
                className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 hover:border-blue-300 transition-all duration-300"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-lg font-bold text-gray-900 mb-3">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.reporterEmail}
              onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
              placeholder="your.email@example.com"
              className={clsx(
                'w-full px-6 py-4 bg-white border-2 rounded-xl text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300',
                errors.reporterEmail ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-blue-300'
              )}
            />
            {errors.reporterEmail && (
              <p className="mt-2 text-red-600 font-semibold flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {errors.reporterEmail}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-slate-800 via-blue-700 to-cyan-600 hover:from-slate-900 hover:via-blue-800 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-6 px-8 rounded-2xl text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-t-3 border-white rounded-full animate-spin" />
                <span>🌊 Submitting Your Coastal Report...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <AlertTriangle className="h-6 w-6" />
                <span>🚨 Submit Coastal Activity Report</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
