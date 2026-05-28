import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.15)' }}>
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
