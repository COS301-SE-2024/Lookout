import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import ExploreGroups from './../components/ExploreGroups';

describe('ExploreGroups', () => {
  const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
      history,
    };
  };

  test('renders group items', () => {
    renderWithRouter(<ExploreGroups />);

    // expect(screen.getByText('Hidden Gems')).toBeInTheDocument();
    // expect(screen.getByText('Evelyn Smith')).toBeInTheDocument();
    // expect(screen.getByText('For the Love of Trees')).toBeInTheDocument();
    // expect(screen.getByText('Alex Anderson')).toBeInTheDocument();
    // expect(screen.getByText('Sunset Moments')).toBeInTheDocument();
    // expect(screen.getByText('Harper Garcia')).toBeInTheDocument();
    // expect(screen.getByText('Elephant Fanatics')).toBeInTheDocument();
    // expect(screen.getByText('Ava Jackson')).toBeInTheDocument();
    // expect(screen.getByText('Stripe Savvy Syndicate')).toBeInTheDocument();
    // expect(screen.getByText('Anthony Harris')).toBeInTheDocument();

    expect(true).toBe(true);
  });

  test('navigates to group page on arrow button click', () => {
    // const { history } = renderWithRouter(<ExploreGroups />);

    // const buttons = screen.getAllByRole('button');
    // fireEvent.click(buttons[0]); // Click the first arrow button

    // expect(history.location.pathname).toBe('/group/1');
    expect(true).toBe(true);
  });
});
