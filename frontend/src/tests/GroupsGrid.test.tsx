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
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      type: 'basic',
      url: url.toString(),
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
      json: () => Promise.resolve(mockGroups),
    } as Response)
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GroupsGridFix', () => {
  const renderWithRouter = (ui: string | number | boolean | Iterable<React.ReactNode> | JSX.Element | null | undefined, { route = '/' } = {}) => {
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
        expect(screen.getByText(group.name)).toBeInTheDocument();
        expect(screen.getByAltText(`${group.name} logo`)).toBeInTheDocument();
      });
    });
  });

  test('filters groups based on search query', async () => {
    renderWithRouter(<GroupsGridFix searchQuery="One" />);
  
    await waitFor(() => {
      expect(screen.getByText('Group One')).toBeInTheDocument();
      expect(screen.queryByText('Group Two')).not.toBeInTheDocument();
    });
  });

  test('each group links to the correct URL', async () => {
    const { history } = renderWithRouter(<GroupsGridFix searchQuery="" />);
  
    await waitFor(() => {
      expect(screen.getByText('Group One')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Group One'));
    
    expect(history.location.pathname).toBe('/group/1');
  });
});