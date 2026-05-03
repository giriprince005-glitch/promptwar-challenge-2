import React from 'react';
import { FaCheckCircle, FaIdCard, FaMapMarkerAlt, FaVoteYea } from 'react-icons/fa';

export const cardData = [
  {
    id: 1,
    term: "EVM",
    definition: "Electronic Voting Machine. Used in Indian elections to record votes securely without paper ballots. It consists of a Control Unit and a Ballot Unit."
  },
  {
    id: 2,
    term: "VVPAT",
    definition: "Voter Verifiable Paper Audit Trail. A machine attached to the EVM that prints a paper slip allowing voters to verify their vote was cast correctly."
  },
  {
    id: 3,
    term: "NOTA",
    definition: "None Of The Above. A ballot option allowing voters to express dissatisfaction with all the candidates listed in the election."
  },
  {
    id: 4,
    term: "Model Code of Conduct (MCC)",
    definition: "A set of guidelines issued by the Election Commission of India to regulate political parties and candidates prior to elections to ensure free and fair elections."
  },
  {
    id: 5,
    term: "Lok Sabha",
    definition: "The lower house of India's bicameral Parliament. Members are elected by direct adult suffrage. Also known as the House of the People."
  },
  {
    id: 6,
    term: "Election Commission of India (ECI)",
    definition: "An autonomous constitutional authority responsible for administering election processes in India at national, state, and district levels."
  }
];

export const steps = [
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

export const timelineData = [
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

export const learningFlow = [
  {
    id: 'intro',
    title: 'What is an Election?',
    icon: '🏛️',
    summary: 'The heartbeat of democracy.',
    content: 'In a democracy like India, an election is a formal group decision-making process by which a population chooses an individual to hold public office. It is the method by which citizens exercise their sovereignty and participate in the governance of the country.',
    keyPoints: [
      'India is the world\\'s largest democracy.',
      'Elections happen at National (Lok Sabha) and State (Vidhan Sabha) levels.',
      'Universal Adult Suffrage: Every citizen aged 18+ has one vote, regardless of background.'
    ]
  },
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: '📋',
    summary: 'Getting your name on the list.',
    content: 'Before you can vote, you must be \\'enrolled\\' in the Electoral Roll (voter list) of your constituency. This is a crucial step to ensure that only eligible citizens participate in the process.',
    keyPoints: [
      'Use Form 6 to register as a new voter.',
      'You need proof of age and proof of residence.',
      'The ECI issues a Voter ID card (EPIC) upon successful registration.'
    ]
  },
  {
    id: 'voting',
    title: 'The Voting Process',
    icon: '🗳️',
    summary: 'Inside the polling booth.',
    content: 'Voting in India is a highly structured and secure process. On election day, voters visit their assigned polling booth to cast their vote using Electronic Voting Machines (EVMs).',
    keyPoints: [
      'Identity is verified using the Voter ID or other approved IDs.',
      'Indelible ink is applied to the left forefinger.',
      'The VVPAT machine shows a slip for 7 seconds to confirm your vote.'
    ]
  },
  {
    id: 'results',
    title: 'Results & Timeline',
    icon: '📅',
    summary: 'From counting to celebration.',
    content: 'After all phases of voting are complete, the counting of votes takes place on a designated day. The entire process is strictly monitored by the Election Commission to ensure total transparency.',
    keyPoints: [
      'Counting is done in the presence of candidates\\' representatives.',
      'The Returning Officer officially declares the winner.',
      'The Model Code of Conduct ends once the results are declared.'
    ]
  }
];
