/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import GroupsList from './../components/GroupsList';

describe('GroupsList', () => {
  const groups = [
    {
      id: 1,
      name: 'Group One',
      owner: 'Owner One',
      imageUrl: 'http://example.com/group1.jpg',
      description: 'This is Group One',
    },
    {
      id: 2,
      name: 'Group Two',
      owner: 'Owner Two',
      imageUrl: 'http://example.com/group2.jpg',
      description: 'This is Group Two',
    },
  ];

  const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
      history,
    };
  };

  test('renders group items', () => {
    renderWithRouter(<GroupsList groups={groups} />);

    expect(screen.getByText('Group One')).toBeInTheDocument();
    expect(screen.getByText('Owner One')).toBeInTheDocument();
    expect(screen.getByText('This is Group One')).toBeInTheDocument();

    expect(screen.getByText('Group Two')).toBeInTheDocument();
    expect(screen.getByText('Owner Two')).toBeInTheDocument();
    expect(screen.getByText('This is Group Two')).toBeInTheDocument();
  });

  test('navigates to group page on item click', () => {
    const { history } = renderWithRouter(<GroupsList groups={groups} />);

    const groupItem = screen.getByText('Group One').closest('div');
    if (groupItem) {
      fireEvent.click(groupItem);
    }

    expect(history.location.pathname).toBe('/group/1');
  });

  test('navigates to group page on arrow button click', () => {
    const { history } = renderWithRouter(<GroupsList groups={groups} />);

    const arrowButton = screen.getAllByRole('button')[0];
    fireEvent.click(arrowButton);

    expect(history.location.pathname).toBe('/group/1');
  });
});
