import { useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import '../styles/Flashcards.css';

const cardData = [
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

export default function Flashcards() {
  const [flippedCards, setFlippedCards] = useState(new Set());

  const handleFlip = (id) => {
    setFlippedCards(prev => {
      const newFlipped = new Set(prev);
      if (newFlipped.has(id)) {
        newFlipped.delete(id);
      } else {
        newFlipped.add(id);
      }
      return newFlipped;
    });
  };

  return (
    <div className="flashcards-container">
      <h2>Key Election Terms</h2>
      <p className="subtitle">Click on a card to reveal its meaning.</p>
      
      <div className="cards-grid">
        {cardData.map((card) => (
          <div 
            key={card.id} 
            className={`flashcard ${flippedCards.has(card.id) ? 'flipped' : ''}`}
            onClick={() => handleFlip(card.id)}
          >
            <div className="flashcard-inner glass-panel">
              <div className="flashcard-front">
                <h3>{card.term}</h3>
                <div className="flip-icon"><FaSyncAlt /></div>
              </div>
              <div className="flashcard-back">
                <p>{card.definition}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
