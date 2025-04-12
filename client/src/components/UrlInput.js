import React from 'react';
import './UrlInput.css';

const UrlInput = ({ url, setUrl, handleSubmit, isLoading }) => {
  return (
    <div className="url-input-container">
      <h1>Create AI Presentations from Portfolio Websites</h1>
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter portfolio website URL"
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !url.trim()}>
          {isLoading ? 'Processing...' : 'Generate Presentation'}
        </button>
      </form>
    </div>
  );
};

export default UrlInput;