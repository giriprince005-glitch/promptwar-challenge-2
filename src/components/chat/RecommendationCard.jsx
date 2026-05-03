import React from 'react';
import { FaLightbulb, FaTimes } from 'react-icons/fa';

/**
 * Proactive recommendation card.
 * @param {Object} props
 * @param {Object} props.recommendation - Recommendation data
 * @param {function(): void} props.onClose - Close handler
 * @param {function(string): void} props.onNavigate - Navigation handler
 */
const RecommendationCard = ({ recommendation, onClose, onNavigate }) => {
  if (!recommendation) return null;

  return (
    <div className="recommendation-overlay animate-fade-in" role="alert" aria-labelledby="rec-title">
      <div className="recommendation-card glass-panel">
        <button 
          className="close-recommendation" 
          onClick={onClose}
          aria-label="Dismiss smart suggestion"
        >
          <FaTimes aria-hidden="true" />
        </button>
        <div className="recommendation-header">
          <FaLightbulb className="recommendation-icon" aria-hidden="true" />
          <h4 id="rec-title">Smart Suggestion</h4>
        </div>
        <div className="recommendation-content">
          <h5>{recommendation.title}</h5>
          <p>{recommendation.message}</p>
          <button 
            className="btn recommendation-btn"
            onClick={() => onNavigate(recommendation.component)}
            aria-label={`Action: ${recommendation.actionLabel}`}
          >
            {recommendation.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
