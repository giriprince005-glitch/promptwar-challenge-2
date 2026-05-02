import { useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { cardData } from '../utils/constants';
import '../styles/Flashcards.css';

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
            <div className="flashcard-inner">
              <div className="flashcard-front flashcard-face-style">
                <h3>{card.term}</h3>
                <div className="flip-icon"><FaSyncAlt /></div>
              </div>
              <div className="flashcard-back flashcard-face-style">
                <p>{card.definition}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
