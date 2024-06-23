import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import ExploreGroups from '../components/ExploreGroups';
import { JSX } from 'react/jsx-runtime';

// Mocking the useNavigate hook from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const mockGroups = [
  {
    id: 1,
    name: 'Group One',
    description: 'This is Group One',
    user: { userName: 'Owner One' },
    picture: 'http://example.com/group1.jpg',
  },
  {
    id: 2,
    name: 'Group Two',
    description: 'This is Group Two',
    user: { userName: 'Owner Two' },
    picture: 'http://example.com/group2.jpg',
  },
];

// Mocking fetch calls for groups and joined groups
beforeEach(() => {
  global.fetch = jest.fn().mockImplementation((url: RequestInfo) => {
    const mockResponse = {
      id: 1,
      name: 'Group One',
      description: 'This is Group One',
      user: { userName: 'Owner One' },
      picture: 'http://example.com/group1.jpg',
    };
    
    if (url === '/api/groups/user/1') {
      return Promise.resolve({
        json: () => Promise.resolve([mockResponse]),
      });
    } else if (url === '/api/groups') {
      return Promise.resolve({
        json: () => Promise.resolve({ content: [mockResponse] }),
      });
    } else {
      throw new Error(`Unhandled fetch mock for URL: ${url}`);
    }
  });
});


afterEach(() => {
  jest.clearAllMocks();
});

describe('ExploreGroups', () => {
  const renderWithRouter = (ui: string | number | boolean | Iterable<React.ReactNode> | JSX.Element | null | undefined, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
      history,
    };
  };

  test('renders group items', async () => {
    renderWithRouter(<ExploreGroups />);

    await waitFor(() => {
      mockGroups.forEach((group) => {
        expect(screen.getByText(group.name)).toBeInTheDocument();
        expect(screen.getByText(`Owner: ${group.user.userName}`)).toBeInTheDocument(); // Example assertion for user name
      });
    });
  });

  test('navigates to group page on item click', async () => {
    const { history } = renderWithRouter(<ExploreGroups />);

    await waitFor(() => {
      const groupItem = screen.getByText('Group One').closest('div');
      if (groupItem) fireEvent.click(groupItem);
    });

    expect(history.location.pathname).toBe('/group/1');
  });
});
