import React, { useState } from 'react';
import { FaChevronRight, FaChevronLeft, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';
import { learningFlow } from '../utils/constants';
import '../styles/GuidedLearning.css';

/**
 * GuidedLearning Component
 * Provides an interactive educational walkthrough of the election process.
 * Aligns with the "Election Process Education" problem statement.
 */
export default function GuidedLearning() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = learningFlow.length;
  const step = learningFlow[currentStep];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="learning-container animate-fade-in">
      <header className="learning-header">
        <div className="learning-badge">
          <FaGraduationCap aria-hidden="true" />
          <span>Guided Learning Mode</span>
        </div>
        <h2>Election Education Center</h2>
        <p>Master the mechanics of Indian democracy in 4 simple steps.</p>
      </header>

      {/* Progress Bar */}
      <div className="learning-progress-bar-wrapper">
        <div 
          className="learning-progress-bar-fill" 
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin="1"
          aria-valuemax={totalSteps}
        ></div>
        <div className="progress-labels">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="learning-content-card glass-panel" key={currentStep}>
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

      {/* Educational Footer */}
      <footer className="learning-footer-info">
        <p>This module follows the official guidelines of the Election Commission of India (ECI).</p>
      </footer>
    </div>
  );
}
