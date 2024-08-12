/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import GroupsList from './../components/GroupsList';
import { JSX } from 'react/jsx-runtime';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify([
        {
          id: 1,
          name: 'Group One',
          owner: 'Owner One',
          picture: 'http://example.com/group1.jpg',
          description: 'This is Group One',
          isPrivate: false,
          createdAt: '2021-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          name: 'Group Two',
          owner: 'Owner Two',
          picture: 'http://example.com/group2.jpg',
          description: 'This is Group Two',
          isPrivate: false,
          createdAt: '2021-01-02T00:00:00.000Z',
        },
      ]), {
        headers: { 'Content-Type': 'application/json' }
      })
    )
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GroupsList', () => {
  const renderWithRouter = (ui: string | number | boolean | Iterable<React.ReactNode> | JSX.Element | null | undefined, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
      history,
    };
  };

  test('renders group items', async () => {
    renderWithRouter(<GroupsList />);

    const groupOneName = await screen.findByText('Group One');
    const groupOneDescription = await screen.findByText('This is Group One');

    expect(groupOneName).toBeInTheDocument();
    expect(groupOneDescription).toBeInTheDocument();

    const groupTwoName = await screen.findByText('Group Two');
    const groupTwoDescription = await screen.findByText('This is Group Two');

    expect(groupTwoName).toBeInTheDocument();
    expect(groupTwoDescription).toBeInTheDocument();
  });

  test('navigates to group page on item click', async () => {
    const { history } = renderWithRouter(<GroupsList />);

    const groupItem = await (await screen.findByText('Group One')).closest('div');
    if (groupItem) {
      fireEvent.click(groupItem);
    }

    expect(history.location.pathname).toBe('/group/1');
  });

});
