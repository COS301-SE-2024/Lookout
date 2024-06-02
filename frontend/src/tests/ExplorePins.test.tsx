import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ExplorePins from './../components/ExplorePins';

describe('ExplorePins', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test('renders pin items', () => {
    renderWithRouter(<ExplorePins />);

    const pins = [
      { id: 1, imageUrl: 'https://i.pinimg.com/originals/2e/c0/77/2ec0773a1fcd847a5bd258ea4bba668e.jpg' },
      { id: 2, imageUrl: 'https://i.pinimg.com/originals/37/b4/63/37b463a42a437b19e5b8a7117fca473c.jpg' },
      { id: 3, imageUrl: 'https://i.pinimg.com/originals/d7/45/a0/d745a0938efa00a33aef6f73135fe3ee.jpg' },
      { id: 4, imageUrl: 'https://i.pinimg.com/originals/af/b6/9b/afb69b39eccdf0900aea9827c4d72e97.jpg' },
      { id: 5, imageUrl: 'https://i.pinimg.com/originals/bf/d9/ad/bfd9ad5453ee46784f071cafb68c02b4.jpg' },
      { id: 6, imageUrl: 'https://i.pinimg.com/originals/12/9d/5f/129d5f467b48f214224e155d4fa153b8.jpg' },
    ];

    pins.forEach(pin => {
      expect(screen.getByAltText(`Pin ${pin.id}`)).toBeInTheDocument();
    });
  });

  test('each pin links to the correct URL', () => {
    renderWithRouter(<ExplorePins />);

    const pins = [
      { id: 1, imageUrl: 'https://i.pinimg.com/originals/2e/c0/77/2ec0773a1fcd847a5bd258ea4bba668e.jpg' },
      { id: 2, imageUrl: 'https://i.pinimg.com/originals/37/b4/63/37b463a42a437b19e5b8a7117fca473c.jpg' },
      { id: 3, imageUrl: 'https://i.pinimg.com/originals/d7/45/a0/d745a0938efa00a33aef6f73135fe3ee.jpg' },
      { id: 4, imageUrl: 'https://i.pinimg.com/originals/af/b6/9b/afb69b39eccdf0900aea9827c4d72e97.jpg' },
      { id: 5, imageUrl: 'https://i.pinimg.com/originals/bf/d9/ad/bfd9ad5453ee46784f071cafb68c02b4.jpg' },
      { id: 6, imageUrl: 'https://i.pinimg.com/originals/12/9d/5f/129d5f467b48f214224e155d4fa153b8.jpg' },
    ];

    pins.forEach(pin => {
      const linkElement = screen.getByAltText(`Pin ${pin.id}`).closest('a');
      expect(linkElement).toHaveAttribute('href', `/pin/${pin.id}`);
    });
  });
});
