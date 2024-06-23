/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import PostsGrid from './../components/postsGrid';
import { JSX } from 'react/jsx-runtime';

// Mock data
const mockPosts = [
  {
    id: 1,
    userid: 52,
    groupid: 1,
    categoryid: 1,
    picture: 'http://example.com/post1.jpg',
    latitude: 0,
    longitude: 0,
    caption: 'Description for post 1',
  },
  {
    id: 2,
    userid: 52,
    groupid: 2,
    categoryid: 2,
    picture: 'http://example.com/post2.jpg',
    latitude: 0,
    longitude: 0,
    caption: 'Description for post 2',
  },
  {
    id: 3,
    userid: 52,
    groupid: 3,
    categoryid: 3,
    picture: 'http://example.com/post3.jpg',
    latitude: 0,
    longitude: 0,
    caption: 'Description for post 3',
  },
];

// Mocking the fetch API
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify({ content: mockPosts }), {
        headers: { 'Content-Type': 'application/json' }
      })
    )
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('PostsGrid', () => {
  const renderWithRouter = (ui: string | number | boolean | Iterable<React.ReactNode> | JSX.Element | null | undefined, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
      history,
    };
  };

  test('renders posts', async () => {
    renderWithRouter(<PostsGrid />);

    // Wait for the posts to be loaded and displayed
    await waitFor(() => {
      mockPosts.forEach(post => {
        expect(screen.getByAltText(`Post ${post.id}`)).toBeInTheDocument();
        expect(screen.getByText(post.caption)).toBeInTheDocument();
      });
    });
  });

  test('each post links to the correct URL', async () => {
    const { history } = renderWithRouter(<PostsGrid />);

    // Wait for the posts to be loaded and displayed
    await waitFor(() => {
      mockPosts.forEach(post => {
        const linkElement = screen.getByAltText(`Post ${post.id}`).closest('a');
        expect(linkElement).toHaveAttribute('href', `/post/${post.id}`);
      });
    });

    // Simulate click and verify navigation
    const firstPostLink = screen.getByAltText('Post 1').closest('a') as HTMLAnchorElement;
    fireEvent.click(firstPostLink);
    expect(history.location.pathname).toBe('/user_post/1');
  });
});
