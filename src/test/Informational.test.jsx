import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ElectionTimeline from '../components/ElectionTimeline';
import Flashcards from '../components/Flashcards';
import ProcessWizard from '../components/ProcessWizard';

// Mock common dependencies
vi.mock('react-icons/fa', () => ({
  FaCalendarAlt: () => <div />,
  FaClock: () => <div />,
  FaCheckCircle: () => <div />,
  FaQuestionCircle: () => <div />,
  FaArrowLeft: () => <div />,
  FaArrowRight: () => <div />,
  FaLightbulb: () => <div />,
  FaClipboardList: () => <div />,
  FaFingerprint: () => <div />,
  FaIdCard: () => <div />,
  FaMapMarkerAlt: () => <div />,
  FaVoteYea: () => <div />,
  FaGraduationCap: () => <div />,
  FaChevronLeft: () => <div />,
  FaChevronRight: () => <div />,
  FaSync: () => <div />,
  FaSyncAlt: () => <div />,
}));

describe('Informational Components', () => {
  describe('ElectionTimeline', () => {
    it('renders the timeline title', () => {
      render(<ElectionTimeline />);
      expect(screen.getByText(/The Election Cycle/i)).toBeInTheDocument();
    });
  });

  describe('Flashcards', () => {
    it('renders the learning cards title', () => {
      render(<Flashcards />);
      expect(screen.getByText(/Key Election Terms/i)).toBeInTheDocument();
    });
  });

  describe('ProcessWizard', () => {
    it('renders the registration guide title', () => {
      render(<ProcessWizard />);
      expect(screen.getByText(/Your Voting Journey/i)).toBeInTheDocument();
    });
  });
});
