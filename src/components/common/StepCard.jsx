import React from 'react';
import { FaChevronRight, FaChevronLeft, FaCheckCircle } from 'react-icons/fa';

/**
 * Displays the content for a single learning step with navigation controls.
 *
 * @param {Object} props
 * @param {Object} props.step - Step data object (icon, title, summary, content, keyPoints)
 * @param {number} props.currentStep - Zero-based index of the current step
 * @param {number} props.totalSteps - Total number of steps
 * @param {function(): void} props.handlePrev - Callback to go to the previous step
 * @param {function(): void} props.handleNext - Callback to go to the next step
 */
export default function StepCard({ step, currentStep, totalSteps, handlePrev, handleNext }) {
  return (
    <div className="learning-content-card glass-panel">
      <div className="step-hero">
        <span className="step-emoji" aria-hidden="true">{step.icon}</span>
        <div className="step-title-group">
          <span className="step-category">Module {currentStep + 1}</span>
          <h3>{step.title}</h3>
          <p className="step-summary">{step.summary}</p>
        </div>
      </div>

      <div className="step-body">
        <div className="main-explanation">
          <p>{step.content}</p>
        </div>

        <div className="key-points-box">
          <h4><FaCheckCircle className="points-icon" aria-hidden="true" /> Key Takeaways</h4>
          <ul>
            {step.keyPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="learning-controls">
        <button 
          className="btn btn-secondary" 
          onClick={handlePrev}
          disabled={currentStep === 0}
          aria-label="Previous Module"
        >
          <FaChevronLeft aria-hidden="true" /> Previous
        </button>
        
        {currentStep === totalSteps - 1 ? (
          <div className="completion-badge">
            🎉 Learning Complete!
          </div>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
            aria-label="Next Module"
          >
            Next Step <FaChevronRight aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
