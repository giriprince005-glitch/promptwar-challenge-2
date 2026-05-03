import React from 'react';

/**
 * Visual progress indicator bar with step count and percentage labels.
 *
 * @param {Object} props
 * @param {number} props.currentStep - Zero-based index of the current step
 * @param {number} props.totalSteps - Total number of steps
 * @param {number} props.progressPercentage - Completion percentage (0-100)
 */
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
