import { useState } from 'react';
import { FaCheckCircle, FaArrowRight, FaIdCard, FaMapMarkerAlt, FaVoteYea } from 'react-icons/fa';
import '../styles/ProcessWizard.css';

const steps = [
  {
    id: 1,
    title: "Check Eligibility",
    icon: <FaCheckCircle />,
    content: "To vote in India, you must be a citizen of India and at least 18 years old on the qualifying date (usually January 1st of the revision year). You must be an ordinary resident of the polling area and not disqualified from voting due to any legal reasons."
  },
  {
    id: 2,
    title: "Enroll as a Voter",
    icon: <FaIdCard />,
    content: "If eligible, you need to register to vote. You can do this by filling out Form 6. This can be done online via the Voter Service Portal (voters.eci.gov.in) or offline by submitting the form to the Electoral Registration Officer (ERO) of your assembly constituency."
  },
  {
    id: 3,
    title: "Find Your Polling Booth",
    icon: <FaMapMarkerAlt />,
    content: "Before election day, find your name in the electoral roll and identify your designated polling booth. You can search for your name on the ECI website or use the Voter Helpline App. You will also receive a Voter Information Slip."
  },
  {
    id: 4,
    title: "Cast Your Vote",
    icon: <FaVoteYea />,
    content: "On polling day, go to your booth with your Voter ID (EPIC) or any other approved identity document. Inside the booth, press the blue button on the Electronic Voting Machine (EVM) next to your chosen option. Verify your vote via the printed VVPAT slip."
  }
];

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
