import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="error-alert" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>⚠️ {message}</span>
      {onClose && (
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', fontWeight: 'bold' }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
