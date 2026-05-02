import '../styles/ElectionTimeline.css';

const timelineData = [
  {
    phase: "Phase 1: Announcement",
    title: "Notification of Election",
    description: "The Election Commission of India (ECI) announces the election schedule, and the Model Code of Conduct comes into effect immediately."
  },
  {
    phase: "Phase 2: Nominations",
    title: "Filing & Scrutiny",
    description: "Candidates file their nomination papers. The ECI scrutinizes them for validity, followed by a window for withdrawal of candidatures."
  },
  {
    phase: "Phase 3: Campaigning",
    title: "Public Outreach",
    description: "Candidates and parties campaign. This period strictly ends 48 hours before the polling begins (the 'silence period')."
  },
  {
    phase: "Phase 4: Polling Day",
    title: "Casting Votes",
    description: "Voters cast their votes using Electronic Voting Machines (EVMs) under strict security and ECI observation."
  },
  {
    phase: "Phase 5: Counting",
    title: "Results Declaration",
    description: "Votes are counted under heavy security. The results are officially declared by the Returning Officer."
  }
];

export default function ElectionTimeline() {
  return (
    <div className="timeline-container">
      <h2>The Election Cycle</h2>
      <p className="subtitle">Understanding the step-by-step process of Indian elections.</p>
      
      <div className="timeline">
        {timelineData.map((item, index) => (
          <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="timeline-content glass-panel">
              <span className="phase-badge">{item.phase}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
