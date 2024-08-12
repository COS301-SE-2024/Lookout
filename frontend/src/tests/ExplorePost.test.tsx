import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ExplorePost from "../components/ExplorePost";

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockPost = {
  id: 1,
  userId: 1,
  user: {
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
  categoryId: 1,
  picture: 'http://example.com/post1.jpg',
  latitude: 0,
  longitude: 0,
  caption: 'Caption for post 1',
  createdAt: '2021-01-01T00:00:00.000Z',
  title: 'Post 1',
  description: 'Description of the post',
};

describe("ExplorePost", () => {
  test("renders post content", () => {
    render(
      <Router>
        <ExplorePost post={mockPost} />
      </Router>
    );

    // Check if the post image, title, caption, and location are rendered
    expect(screen.getByAltText(mockPost.caption)).toBeInTheDocument();
    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.caption)).toBeInTheDocument();
    expect(screen.getByText(`${mockPost.latitude}, ${mockPost.longitude}`)).toBeInTheDocument();
  });

  test("handles post click and navigates to post detail page", () => {
    render(
      <Router>
        <ExplorePost post={mockPost} />
      </Router>
    );

    // Find the post element
    const postElement = screen.getByAltText(mockPost.caption).closest('div');
    
    // Ensure postElement is not null before interacting with it
    if (postElement) {
      fireEvent.click(postElement);
      expect(mockNavigate).toHaveBeenCalledWith(`/post/${mockPost.id}`, { state: { post: mockPost } });
    } else {
      throw new Error('Post element not found');
    }
  });
});
