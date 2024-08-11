import React from "react";
import { render, screen } from "@testing-library/react";
import ExploreScreen from "../screens/ExploreScreen";
import { BrowserRouter as Router } from "react-router-dom";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<Router>{ui}</Router>);
};

const mockPosts = [
    {
      id: 1,
      user: {
        id: 1,
        userName: 'JohnDoe',
        email: 'john@example.com',
        passcode: '1234',
        role: 'user',
        isEnabled: true,
        password: 'password',
        username: 'john',
        authorities: [{ authority: 'ROLE_USER' }],
        isAccountNonLocked: true,
        isCredentialsNonExpired: true,
        isAccountNonExpired: true,
      },
      group: {
        id: 1,
        name: 'Group One',
        description: 'Description for group one',
        isPrivate: false,
        user: null,
        picture: 'http://example.com/group1.jpg',
        createdAt: '2021-01-01T00:00:00.000Z',
      },
      category: { id: 1, description: 'Category One' },
      picture: 'http://example.com/post1.jpg',
      latitude: 0,
      longitude: 0,
      caption: 'Caption for post 1',
      createdAt: '2021-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      user: {
        id: 52,
        userName: 'JaneDoe',
        email: 'jane@example.com',
        passcode: '5678',
        role: 'user',
        isEnabled: true,
        password: 'password',
        username: 'jane',
        authorities: [{ authority: 'ROLE_USER' }],
        isAccountNonLocked: true,
        isCredentialsNonExpired: true,
        isAccountNonExpired: true,
      },
      group: {
        id: 2,
        name: 'Group Two',
        description: 'Description for group two',
        isPrivate: false,
        user: null,
        picture: 'http://example.com/group2.jpg',
        createdAt: '2021-02-01T00:00:00.000Z',
      },
      category: { id: 2, description: 'Category Two' },
      picture: 'http://example.com/post2.jpg',
      latitude: 0,
      longitude: 0,
      caption: 'Caption for post 2',
      createdAt: '2021-02-01T00:00:00.000Z',
    },
    {
      id: 3,
      user: {
        id: 3,
        userName: 'JimDoe',
        email: 'jim@example.com',
        passcode: '91011',
        role: 'user',
        isEnabled: true,
        password: 'password',
        username: 'jim',
        authorities: [{ authority: 'ROLE_USER' }],
        isAccountNonLocked: true,
        isCredentialsNonExpired: true,
        isAccountNonExpired: true,
      },
      group: {
        id: 3,
        name: 'Group Three',
        description: 'Description for group three',
        isPrivate: false,
        user: null,
        picture: 'http://example.com/group3.jpg',
        createdAt: '2021-03-01T00:00:00.000Z',
      },
      category: { id: 3, description: 'Category Three' },
      picture: 'http://example.com/post3.jpg',
      latitude: 0,
      longitude: 0,
      caption: 'Caption for post 3',
      createdAt: '2021-03-01T00:00:00.000Z',
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

describe("ExploreScreen", () => {
  test("renders the search bar", () => {
    renderWithRouter(<ExploreScreen />);
    const searchBar = screen.getByPlaceholderText(/search for posts or groups/i);
    expect(searchBar).toBeInTheDocument();
  });
});
