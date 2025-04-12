import React, { useState } from 'react';
import StatusBar from './components/StatusBar';
import UrlInput from './components/UrlInput';
import NoteGrid from './components/NoteGrid';
import { processPortfolio } from './services/api';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setStatus('processing');
    setError(null);

    try {
      const result = await processPortfolio(url);
      setStatus('success');
    } catch (err) {
      console.error('Error processing portfolio:', err);
      setError(err.message || 'Failed to process portfolio');
      setStatus('error');
    }
  };

  return (
    <div className="app">
      <StatusBar status={status} />
      <div className="content">
        <UrlInput 
          url={url} 
          setUrl={setUrl} 
          handleSubmit={handleSubmit} 
          isLoading={status === 'processing'} 
        />
        <NoteGrid />
      </div>
    </div>
  );
}

export default App;