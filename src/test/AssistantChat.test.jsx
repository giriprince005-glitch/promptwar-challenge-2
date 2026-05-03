import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AssistantChat from '../components/AssistantChat';
import AIFactory from '../services/ai/AIFactory';

// Mock the AI Factory and Provider
vi.mock('../services/ai/AIFactory');

describe('AssistantChat Component Integration', () => {
  const mockGenerateResponse = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    AIFactory.getProvider.mockReturnValue({
      generateResponse: mockGenerateResponse
    });
  });

  it('should render the initial greeting message', () => {
    render(<AssistantChat onNavigate={() => {}} />);
    expect(screen.getByText(/Namaste!/i)).toBeInTheDocument();
  });

  it('should send a message and display the AI response', async () => {
    mockGenerateResponse.mockResolvedValue({
      text: 'Registration is easy through the VSP portal.',
      intent: 'registration',
      navigation: null
    });

    render(<AssistantChat onNavigate={() => {}} />);
    
    const input = screen.getByLabelText(/Ask a question/i);
    const sendBtn = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: 'How do I register?' } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('Registration is easy through the VSP portal.')).toBeInTheDocument();
    });
  });

  it('should handle API failures gracefully', async () => {
    mockGenerateResponse.mockRejectedValue(new Error('API Failure'));

    render(<AssistantChat onNavigate={() => {}} />);
    
    const input = screen.getByLabelText(/Ask a question/i);
    const sendBtn = screen.getByLabelText(/Send message/i);

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
    });
  });

  it('should prevent sending empty messages', () => {
    render(<AssistantChat onNavigate={() => {}} />);
    const sendBtn = screen.getByLabelText(/Send message/i);
    expect(sendBtn).toBeDisabled();
  });
});
