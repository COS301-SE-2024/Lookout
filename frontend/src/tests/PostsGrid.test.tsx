import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import PostsGridFix from './../components/PostsGridFix';
import { JSX } from 'react/jsx-runtime';

const mockPosts = [
  {
    id: 1,
    userid: 1,
    groupid: 1,
    categoryid: 1,
    picture: 'http://example.com/post1.jpg',
    latitude: 0,
    longitude: 0,
    caption: 'Caption for post 1',
    title: 'Title for post 1',
  },
  {
    id: 2,
    userid: 1,
    groupid: 2,
    categoryid: 2,
    picture: 'http://example.com/post2.jpg',
    latitude: 0,
    longitude: 0,
    caption: 'Caption for post 2',
    title: 'Title for post 2',
  },
  {
    id: 3,
    userid: 1,
    groupid: 3,
    categoryid: 3,
    picture: 'http://example.com/post3.jpg',
    latitude: 0,
    longitude: 0,
    caption: 'Caption for post 3',
    title: 'Title for post 3',
  },
];

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify({ content: mockPosts }), {
        headers: { 'Content-Type': 'application/json' },
      })
    )
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('PostsGridFix', () => {
  const renderWithRouter = (
    ui: JSX.Element,
    { route = '/' } = {}
  ) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(
        <Router location={history.location} navigator={history}>
          {ui}
        </Router>
      ),
      history,
    };
  };

  test('renders posts based on search query', async () => {
    renderWithRouter(<PostsGridFix searchQuery="" />);

    await waitFor(() => {
      mockPosts.forEach((post) => {
        expect(screen.getByAltText(post.caption)).toBeInTheDocument();
      });
    });
  });

  test('filters posts based on search query', async () => {
    renderWithRouter(<PostsGridFix searchQuery="Title for post 1" />);

    await waitFor(() => {
      expect(screen.getByAltText('Caption for post 1')).toBeInTheDocument();
      expect(screen.queryByAltText('Caption for post 2')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Caption for post 3')).not.toBeInTheDocument();
    });
  });

  test('each post links to the correct URL', async () => {
    const { history } = renderWithRouter(<PostsGridFix searchQuery="" />);

    expect(mockPosts.length).toBeGreaterThan(0);

    await waitFor(() => {
      const firstPostImg = screen.getByAltText('Caption for post 1');
      const firstPostDiv = firstPostImg.closest('div');
      expect(firstPostDiv).toHaveClass('overflow-hidden rounded-md shadow-lg cursor-pointer');
    });

    const firstPostLink = screen.getByAltText('Caption for post 1').closest('a') as HTMLAnchorElement;
    fireEvent.click(firstPostLink);
    expect(history.location.pathname).toBe(`/user_post/1`);
  });
});