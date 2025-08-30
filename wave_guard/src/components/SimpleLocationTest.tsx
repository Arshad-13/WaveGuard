'use client';

import React, { useEffect, useRef, useState } from 'react';

const SimpleLocationTest: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>('Starting...');

  useEffect(() => {
    const testElement = () => {
      console.log('🧪 [SimpleTest] Component effect triggered');
      
      // Test 1: Check if element exists immediately
      if (mapRef.current) {
        console.log('✅ [SimpleTest] Element found immediately');
        setStatus('Element found immediately!');
        return;
      }

      // Test 2: Try after timeout
      setTimeout(() => {
        if (mapRef.current) {
          console.log('✅ [SimpleTest] Element found after timeout');
          setStatus('Element found after timeout!');
          console.log('Element details:', {
            tagName: mapRef.current.tagName,
            className: mapRef.current.className,
            offsetWidth: mapRef.current.offsetWidth,
            offsetHeight: mapRef.current.offsetHeight,
            clientWidth: mapRef.current.clientWidth,
            clientHeight: mapRef.current.clientHeight
          });
        } else {
          console.error('❌ [SimpleTest] Element still not found');
          setStatus('❌ Element not found even after timeout');
        }
      }, 1000);
    };

    testElement();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">🧪 DOM Element Test</h2>
      <p className="mb-4">Status: {status}</p>
      
      {/* Test div with fixed size */}
      <div 
        ref={mapRef}
        className="w-full h-64 bg-blue-100 border-2 border-blue-300 rounded-lg flex items-center justify-center"
        style={{ minHeight: '256px' }}
      >
        <p className="text-blue-700 font-medium">Test Map Container</p>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>This is a simple test to verify DOM element mounting works correctly.</p>
        <p>Check the browser console for detailed logs.</p>
      </div>
    </div>
  );
};

export default SimpleLocationTest;
