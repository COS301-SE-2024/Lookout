import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import CreatedGroupsGridFix from '../components/CreatedGroupsGridFix';
import { JSX } from 'react/jsx-runtime';

// Mock data
const mockGroups = [
  {
    userId: 1,
    id: 1,
    name: 'Created Group One',
    owner: 'John Doe',
    picture: 'http://example.com/created-group1.jpg',
    description: 'Description for created group one',
    isPrivate: false,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    userId: 1,
    id: 2,
    name: 'Created Group Two',
    owner: 'Jane Doe',
    picture: 'http://example.com/created-group2.jpg',
    description: 'Description for created group two',
    isPrivate: false,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
];

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    return Promise.resolve(
      new Response(JSON.stringify({ content: mockGroups }), {
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CreatedGroupsGridFix', () => {
  const renderWithRouter = (ui: string | number | boolean | JSX.Element | Iterable<React.ReactNode> | null | undefined, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
      history,
    };
  };

  test('renders created groups based on search query', async () => {
    renderWithRouter(<CreatedGroupsGridFix searchQuery="" />);

    await waitFor(() => {
      mockGroups.forEach(group => {
        screen.getAllByAltText(`${group.name} logo`);
      });
    });
  });

  test('filters created groups based on search query', async () => {
    renderWithRouter(<CreatedGroupsGridFix searchQuery="One" />);
  
    await waitFor(() => {
      const groupOneImages = screen.getAllByAltText('Created Group One logo');
      expect(groupOneImages.length).toBeGreaterThan(0); 
  
      expect(screen.queryByAltText('Created Group Two logo')).toBeNull();
    });
  });

  test('each group links to the correct URL', async () => {
    const { history } = renderWithRouter(<CreatedGroupsGridFix searchQuery="" />);
  
    await waitFor(() => {
      const groupOneImages = screen.getAllByAltText('Created Group One logo');
      expect(groupOneImages.length).toBeGreaterThan(0); 
  
      fireEvent.click(groupOneImages[0]);
      
      expect(history.location.pathname).toBe('/createdGroup/1');
    });
  });
});
