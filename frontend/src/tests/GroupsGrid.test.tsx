import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import GroupsGridFix from '../components/GroupsGridFix';
import { JSX } from 'react/jsx-runtime';

const mockGroups = [
  {
    userId: 1,
    id: 1,
    name: 'Group One',
    owner: 'John Doe',
    picture: 'http://example.com/group1.jpg',
    description: 'Description for group one',
    isPrivate: false,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    userId: 1,
    id: 2,
    name: 'Group Two',
    owner: 'Jane Doe',
    picture: 'http://example.com/group2.jpg',
    description: 'Description for group two',
    isPrivate: false,
    createdAt: '2024-02-01T00:00:00.000Z',
  },
];

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (typeof url === 'string' && url.includes('/user/1')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockGroups.filter(group => group.userId === 1)), {
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
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

describe('GroupsGridFix', () => {
  const renderWithRouter = (ui: string | number | boolean | JSX.Element | Iterable<React.ReactNode> | null | undefined, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
      history,
    };
  };

  test('renders groups based on search query', async () => {
    renderWithRouter(<GroupsGridFix searchQuery="" />);

    await waitFor(() => {
      mockGroups.forEach(group => {
        screen.getAllByAltText(`${group.name} logo`);
      });
    });
  });

  test('filters groups based on search query', async () => {
    renderWithRouter(<GroupsGridFix searchQuery="One" />);
  
    await waitFor(() => {
      const groupOneImages = screen.getAllByAltText('Group One logo');
      expect(groupOneImages.length).toBeGreaterThan(0); 
  
      expect(screen.queryByAltText('Group Two logo')).toBeNull();
    });
  });

  test('each group links to the correct URL', async () => {
    const { history } = renderWithRouter(<GroupsGridFix searchQuery="" />);
  
    await waitFor(() => {
      const groupOneImages = screen.getAllByAltText('Group One logo');
      expect(groupOneImages.length).toBeGreaterThan(0); 
  
      fireEvent.click(groupOneImages[0]);
      
      expect(history.location.pathname).toBe('/group/1');
    });
  });
  
});
