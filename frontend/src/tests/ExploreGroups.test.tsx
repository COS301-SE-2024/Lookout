import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import ExploreGroups from './../components/ExploreGroups';

// Mocking fetch call to return predefined groups
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        content: [
          { id: 1, name: 'Hidden Gems', description: 'Discover hidden gems around the world.', picture: 'http://example.com/pic1.jpg', user: { userName: 'Evelyn Smith' } },
          { id: 2, name: 'For the Love of Trees', description: 'A group for tree lovers.', picture: 'http://example.com/pic2.jpg', user: { userName: 'Alex Anderson' } },
        ],
        length: 2,
      }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ExploreGroups', () => {
  const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
      history,
    };
  };

  test('renders group items', async () => {
    renderWithRouter(<ExploreGroups />);

    // Use waitFor to wait for the groups to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText('Hidden Gems')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Evelyn Smith')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('For the Love of Trees')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Alex Anderson')).toBeInTheDocument();
    });
  });

  test('navigates to group page on group click', async () => {
    const { history } = renderWithRouter(<ExploreGroups />);
    
    const hiddenGems = await screen.findByText('Hidden Gems', {}, { timeout: 10000 });
  
    fireEvent.click(hiddenGems);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/group/1');
    });
  });
});
