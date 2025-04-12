import React from 'react';
import './NoteGrid.css';

const notes = [
  {
    id: 1,
    title: 'Website Analysis',
    description: 'AI analyzes the portfolio website content and structure.'
  },
  {
    id: 2,
    title: 'Content Extraction',
    description: 'Important information is extracted from the portfolio.'
  },
  {
    id: 3,
    title: 'Slide Generation',
    description: 'AI designs appropriate slides based on the content.'
  },
  {
    id: 4,
    title: 'PowerPoint Integration',
    description: 'Directly creates the presentation in PowerPoint on Windows.'
  },
  {
    id: 5,
    title: 'LibreOffice Support',
    description: 'Works with LibreOffice Impress on Linux systems.'
  },
  {
    id: 6,
    title: 'Complete Automation',
    description: 'The entire process runs automatically with minimal input.'
  }
];

const NoteGrid = () => {
  return (
    <div className="note-grid-container">
      <div className="note-grid">
        {notes.map(note => (
          <div className="note-card" key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteGrid;