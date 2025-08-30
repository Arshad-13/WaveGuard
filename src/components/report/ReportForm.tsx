'use client';

import { useState } from 'react';
import { Upload, MapPin, Calendar, AlertTriangle, CheckCircle, X } from 'lucide-react';
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

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-3/50 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Report Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for helping protect our coastal environment. Your report has been received and will be reviewed by our team.
          </p>
          <div className="bg-gray-50 dark:bg-dark-3/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Report ID:</strong> WG-{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Status:</strong> Under Review
            </p>
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
            className="bg-ocean-500 hover:bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-3/50 p-8">
        
        {/* Location */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Santa Monica Beach, near Pier, or coordinates"
            className={clsx(
              'w-full px-4 py-3 bg-white dark:bg-dark-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500',
              errors.location ? 'border-red-500' : 'border-gray-200 dark:border-dark-4'
            )}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
          )}
        </div>

        {/* Issue Type */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Type of Issue *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {issueTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('issueType', type.value)}
                className={clsx(
                  'p-3 border rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105',
                  formData.issueType === type.value
                    ? 'border-ocean-500 bg-ocean-50 text-ocean-700 dark:bg-ocean-900/30 dark:text-ocean-300'
                    : 'border-gray-200 dark:border-dark-4 bg-white dark:bg-dark-3 text-gray-700 dark:text-gray-300 hover:border-ocean-300'
                )}
              >
                <div className="text-lg mb-1">{type.icon}</div>
                {type.label}
              </button>
            ))}
          </div>
          {errors.issueType && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.issueType}</p>
          )}
        </div>

        {/* Urgency */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Urgency Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'low', label: 'Low', color: 'green' },
              { value: 'medium', label: 'Medium', color: 'yellow' },
              { value: 'high', label: 'High', color: 'red' }
            ].map((urgency) => (
              <button
                key={urgency.value}
                type="button"
                onClick={() => handleInputChange('urgency', urgency.value)}
                className={clsx(
                  'p-3 border rounded-lg text-sm font-medium transition-all duration-200',
                  formData.urgency === urgency.value
                    ? `border-${urgency.color}-500 bg-${urgency.color}-50 text-${urgency.color}-700 dark:bg-${urgency.color}-900/30 dark:text-${urgency.color}-300`
                    : 'border-gray-200 dark:border-dark-4 bg-white dark:bg-dark-3 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                )}
              >
                {urgency.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            placeholder="Please provide detailed information about what you observed, when it occurred, and any other relevant details..."
            className={clsx(
              'w-full px-4 py-3 bg-white dark:bg-dark-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500 resize-none',
              errors.description ? 'border-red-500' : 'border-gray-200 dark:border-dark-4'
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Upload Images (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-dark-4 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Drag & drop images here or click to browse
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
              className="cursor-pointer bg-ocean-500 hover:bg-ocean-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Choose Files
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Max 5 images, 5MB each. JPG, PNG formats only.
            </p>
          </div>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.images.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-dark-4"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reporter Information */}
        <div className="border-t border-gray-200 dark:border-dark-4 pt-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.reporterName}
                onChange={(e) => handleInputChange('reporterName', e.target.value)}
                className={clsx(
                  'w-full px-4 py-3 bg-white dark:bg-dark-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500',
                  errors.reporterName ? 'border-red-500' : 'border-gray-200 dark:border-dark-4'
                )}
              />
              {errors.reporterName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reporterName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={formData.reporterPhone}
                onChange={(e) => handleInputChange('reporterPhone', e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-dark-3 border border-gray-200 dark:border-dark-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.reporterEmail}
              onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
              className={clsx(
                'w-full px-4 py-3 bg-white dark:bg-dark-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500',
                errors.reporterEmail ? 'border-red-500' : 'border-gray-200 dark:border-dark-4'
              )}
            />
            {errors.reporterEmail && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.reporterEmail}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-ocean-500 to-cyan-500 hover:from-ocean-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              <span>Submitting Report...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Submit Report</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
