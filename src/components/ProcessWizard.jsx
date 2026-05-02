import { useState } from 'react';
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

      <div className="wizard-progress">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`progress-step ${index <= currentStep ? 'active' : ''}`}
            onClick={() => setCurrentStep(index)}
          >
            <div className="step-icon">{step.icon}</div>
            <span className="step-label">{step.title}</span>
          </div>
        ))}
      </div>

      <div className="wizard-content glass-panel animate-fade-in" key={currentStep}>
        <div className="content-header">
          <div className="content-icon">{steps[currentStep].icon}</div>
          <h3>{steps[currentStep].title}</h3>
        </div>
        <p>{steps[currentStep].content}</p>
        
        <div className="wizard-controls">
          <button 
            className="btn btn-secondary" 
            onClick={prevStep} 
            disabled={currentStep === 0}
          >
            Previous
          </button>
          <button 
            className="btn" 
            onClick={nextStep} 
            disabled={currentStep === steps.length - 1}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next Step"} <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
