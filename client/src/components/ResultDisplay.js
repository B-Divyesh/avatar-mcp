// client/src/components/ResultDisplay.js
import React from 'react';
import { getDownloadUrl } from '../services/api';
import './ResultDisplay.css';

const ResultDisplay = ({ status, result, error }) => {
  if (status === 'error') {
    return (
      <div className="result-display error">
        <div className="result-card">
          <h2>Error</h2>
          <p>{error || 'An unknown error occurred'}</p>
          <div className="result-actions">
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success' && result) {
    return (
      <div className="result-display success">
        <div className="result-card">
          <h2>Presentation Created!</h2>
          <p>Your presentation has been successfully created and saved.</p>
          
          <div className="result-details">
            <div className="detail-item">
              <span className="detail-label">File Path:</span>
              <span className="detail-value">{result.path}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Presentation ID:</span>
              <span className="detail-value">{result.presentation_id}</span>
            </div>
          </div>
          
          <div className="result-actions">
            <a 
              href={getDownloadUrl(result.presentation_id)}
              download="portfolio-presentation.pptx"
              className="download-button"
            >
              Download Presentation
            </a>
            
            <button onClick={() => window.location.reload()} className="new-button">
              Create New Presentation
            </button>
          </div>
          
          <div className="result-note">
            <p>
              Note: If PowerPoint didn't open automatically, you can manually open the 
              downloaded file or check the file path above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ResultDisplay;