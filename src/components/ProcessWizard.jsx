import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { steps } from '../utils/constants';
import '../styles/ProcessWizard.css';

export default function ProcessWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="wizard-container">
      <h2>Your Voting Journey</h2>
      <p className="subtitle">A step-by-step guide to exercising your democratic right.</p>

      <div className="wizard-progress" role="tablist" aria-label="Registration Steps">
        {steps.map((step, index) => (
          <button 
            key={step.id} 
            className={`progress-step ${index <= currentStep ? 'active' : ''}`}
            onClick={() => setCurrentStep(index)}
            role="tab"
            aria-selected={index === currentStep}
            aria-controls={`step-panel-${index}`}
            id={`step-tab-${index}`}
            aria-label={`Step ${index + 1}: ${step.title}`}
          >
            <div className="step-icon" aria-hidden="true">{step.icon}</div>
            <span className="step-label">{step.title}</span>
          </button>
        ))}
      </div>

      <div 
        className="wizard-content glass-panel animate-fade-in" 
        key={currentStep}
        role="tabpanel"
        id={`step-panel-${currentStep}`}
        aria-labelledby={`step-tab-${currentStep}`}
        aria-live="polite"
      >
        <div className="content-header">
          <div className="content-icon" aria-hidden="true">{steps[currentStep].icon}</div>
          <h3>{steps[currentStep].title}</h3>
        </div>
        <p>{steps[currentStep].content}</p>
        
        <div className="wizard-controls">
          <button 
            className="btn btn-secondary" 
            onClick={prevStep} 
            disabled={currentStep === 0}
            aria-label="Go to previous step"
          >
            Previous
          </button>
          <button 
            className="btn" 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1}
            aria-label={currentStep === steps.length - 1 ? "Finish guide" : "Go to next step"}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next Step"} <FaArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
