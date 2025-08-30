'use client';

import React, { useState } from 'react';
import { X, MapPin, AlertTriangle, Camera, Send } from 'lucide-react';

interface ReportThreatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const threatTypes = [
  { id: 'tsunami', label: 'Tsunami Warning', icon: '🌊', color: 'bg-blue-600', borderColor: 'border-blue-600' },
  { id: 'cyclone', label: 'Cyclone/Hurricane', icon: '🌪️', color: 'bg-purple-600', borderColor: 'border-purple-600' },
  { id: 'erosion', label: 'Coastal Erosion', icon: '🏔️', color: 'bg-orange-600', borderColor: 'border-orange-600' },
  { id: 'pollution', label: 'Ocean Pollution', icon: '🛢️', color: 'bg-red-600', borderColor: 'border-red-600' },
  { id: 'wildlife', label: 'Wildlife Disturbance', icon: '🐟', color: 'bg-emerald-600', borderColor: 'border-emerald-600' },
  { id: 'other', label: 'Other Threat', icon: '⚠️', color: 'bg-slate-600', borderColor: 'border-slate-600' }
];

const urgencyLevels = [
  { id: 'low', label: 'Low', color: 'bg-emerald-600 text-white border-emerald-600' },
  { id: 'medium', label: 'Medium', color: 'bg-amber-600 text-white border-amber-600' },
  { id: 'high', label: 'High', color: 'bg-orange-600 text-white border-orange-600' },
  { id: 'critical', label: 'Critical', color: 'bg-red-600 text-white border-red-600' }
];

export function ReportThreatModal({ isOpen, onClose }: ReportThreatModalProps) {
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    location: '',
    urgency: 'medium',
    coordinates: '',
    images: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form and close modal
    setFormData({
      type: '',
      title: '',
      description: '',
      location: '',
      urgency: 'medium',
      coordinates: '',
      images: []
    });
    setIsSubmitting(false);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files || [])]
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-24 pb-5 bg-transparent">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[calc(100vh-140px)] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="bg-slate-900 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
                          <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  🚨 Report Coastal Threat
                </h2>
                <p className="text-slate-300 mt-1">Help protect our coastal communities</p>
              </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Threat Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Type of Threat *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {threatTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.type === type.id
                      ? `${type.color} text-white ${type.borderColor} shadow-lg scale-105`
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className={`text-xs font-medium ${
                      formData.type === type.id ? 'text-white' : 'text-gray-700'
                    }`}>
                      {type.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Threat Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
              placeholder="Brief title describing the threat"
              required
            />
          </div>

          {/* Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                  placeholder="Beach, harbor, coastal area"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Coordinates (Optional)
              </label>
              <input
                type="text"
                value={formData.coordinates}
                onChange={(e) => setFormData(prev => ({ ...prev, coordinates: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                placeholder="Lat, Long (e.g., 34.052, -118.244)"
              />
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Urgency Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {urgencyLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, urgency: level.id }))}
                  className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                    formData.urgency === level.id
                      ? `${level.color} shadow-lg scale-105`
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors resize-none"
              placeholder="Detailed description of the threat, including what you observed and when"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload photos of the threat</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors"
              >
                Choose Files
              </label>
              {formData.images.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  {formData.images.length} file(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.type || !formData.title || !formData.location || !formData.description}
              className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
