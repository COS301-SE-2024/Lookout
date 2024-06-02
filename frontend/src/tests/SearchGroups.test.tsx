import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchGroups from './../components/SearchGroups';
//import { useNavigate } from 'react-router-dom';


describe('SearchGroups', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  test('renders search input and groups', () => {
    renderWithRouter(<SearchGroups />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Hidden Gems')).toBeInTheDocument();
    expect(screen.getByText('For the Love of Trees')).toBeInTheDocument();
  });

  test('filters groups based on search query', () => {
    renderWithRouter(<SearchGroups />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Sunset' } });
    expect(screen.getByText('Sunset Moments')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Gems')).not.toBeInTheDocument();
    expect(screen.queryByText('For the Love of Trees')).not.toBeInTheDocument();
  });

  test('displays no groups found message if no match', () => {
    renderWithRouter(<SearchGroups />);
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'NonExistentGroup' } });
    expect(screen.getByText('No groups found.')).toBeInTheDocument();
  });

});
