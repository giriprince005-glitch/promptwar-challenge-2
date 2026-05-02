import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/common/Header';

describe('Header Component', () => {
  it('renders the application title', () => {
    render(<Header activeComponent="assistant" setActiveComponent={() => {}} />);
    expect(screen.getByText('India Elects')).toBeInTheDocument();
  });

  it('highlights the active navigation button', () => {
    render(<Header activeComponent="assistant" setActiveComponent={() => {}} />);
    const assistantBtn = screen.getByText('AI Assistant');
    expect(assistantBtn).toHaveClass('active');
  });

  it('calls setActiveComponent when a nav button is clicked', () => {
    const setActiveMock = vi.fn();
    render(<Header activeComponent="assistant" setActiveComponent={setActiveMock} />);
    
    const timelineBtn = screen.getByText('Timeline');
    fireEvent.click(timelineBtn);
    
    expect(setActiveMock).toHaveBeenCalledWith('timeline');
  });
});
