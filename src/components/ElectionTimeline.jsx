import React from 'react';
import { timelineData } from '../utils/constants';
import '../styles/ElectionTimeline.css';

export default function ElectionTimeline() {
  return (
    <div className="timeline-container">
      <h2>The Election Cycle</h2>
      <p className="subtitle">Understanding the step-by-step process of Indian elections.</p>
      
      <ol className="timeline" aria-label="Election Cycle Phases">
        {timelineData.map((item, index) => (
          <li 
            key={index} 
            className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <article className="timeline-content glass-panel">
              <span className="phase-badge">{item.phase}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
