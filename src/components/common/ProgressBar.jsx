import React from 'react';

export default function ProgressBar({ currentStep, totalSteps, progressPercentage }) {
  return (
    <div className="learning-progress-bar-wrapper">
      <div 
        className="learning-progress-bar-fill" 
        style={{ width: `${progressPercentage}%` }}
      ></div>
      <div className="progress-labels">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
    </div>
  );
}
