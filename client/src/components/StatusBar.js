import React from 'react';
import './StatusBar.css';

const StatusBar = ({ status }) => {
  const getStatusText = () => {
    switch(status) {
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Completed!';
      case 'error':
        return 'Error';
      case 'idle':
      default:
        return 'Ready';
    }
  };

  return (
    <div className="status-bar">
      <div className="logo">avatar</div>
      <div className="progress">
        <div className={`progress-dot ${status !== 'idle' ? 'active' : ''}`}></div>
        <div className={`progress-dot ${status === 'processing' || status === 'success' ? 'active' : ''}`}></div>
        <div className={`progress-dot ${status === 'processing' || status === 'success' ? 'active' : ''}`}></div>
        <div className={`progress-dot ${status === 'success' ? 'active' : ''}`}></div>
        <div className="progress-circle"></div>
      </div>
      <div className="status-text">{getStatusText()}</div>
    </div>
  );
};

export default StatusBar;