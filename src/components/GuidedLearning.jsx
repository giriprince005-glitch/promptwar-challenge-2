import React, { useState } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { learningFlow } from '../utils/constants';
import ProgressBar from './common/ProgressBar';
import StepCard from './common/StepCard';
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
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        progressPercentage={progressPercentage} 
      />

      {/* Step Content */}
      <StepCard 
        key={currentStep}
        step={step}
        currentStep={currentStep}
        totalSteps={totalSteps}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />

      {/* Educational Footer */}
      <footer className="learning-footer-info">
        <p>This module follows the official guidelines of the Election Commission of India (ECI).</p>
      </footer>
    </div>
  );
}
