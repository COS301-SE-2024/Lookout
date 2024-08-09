import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import GroupsPost from '../components/PinDetailPost';

// Mock the navigate function
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('GroupsPost', () => {
  const mockPost = {
    id: 1,
    username: 'user1',
    description: 'Description of post',
    groupName: 'Group Name',
    groupDescription: 'Group Description',
    categoryId: 1,
    groupId: 1,
    title: 'Post Title',
    groupPicture: 'http://example.com/group.jpg',
    admin: 'Admin User',
    userId: 1,
    user: {
      userId: 1,
      userName: 'user1',
      email: 'user1@example.com',
      passcode: 'password',
      role: 'user',
      username: 'user1',
      authorities: [{ authority: 'USER' }],
      isCredentialsNonExpired: true,
      isAccountNonExpired: true,
      isAccountNonLocked: true,
      password: 'password',
      isEnabled: true,
    },
    group: {
      id: 1,
      name: 'Group Name',
      description: 'Group Description',
      isPrivate: false,
      userId: 1,
      username: 'user1',
      user: {
        email: 'user1@example.com',
        passcode: 'password',
        role: 'user',
        username: 'user1',
        authorities: [{ authority: 'USER' }],
        isCredentialsNonExpired: true,
        isAccountNonExpired: true,
        isAccountNonLocked: true,
        password: 'password',
        isEnabled: true,
      },
      picture: 'http://example.com/group.jpg',
      createdAt: '2024-01-01T00:00:00Z',
    },
    category: { id: 1, description: 'Category Description' },
    picture: 'http://example.com/post.jpg',
    latitude: 12.34,
    longitude: 56.78,
    caption: 'Caption of the post',
    createdAt: '2024-01-01T00:00:00Z',
  };

  test('renders the post image correctly', () => {
    render(
      <MemoryRouter>
        <GroupsPost post={mockPost} />
      </MemoryRouter>
    );

    const imgElement = screen.getByAltText(mockPost.caption);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', mockPost.picture);
  });

  test('navigates to the correct post page on click', () => {
    render(
      <MemoryRouter>
        <GroupsPost post={mockPost} />
      </MemoryRouter>
    );

    const postElement = screen.getByAltText(mockPost.caption).closest('div');
     if (postElement) {
        fireEvent.click(postElement);
        expect(mockNavigate).toHaveBeenCalledWith(`/post/${mockPost.id}`, { state: { post: mockPost } });
      } else {
        throw new Error('Post element not found');
      }

    expect(mockNavigate).toHaveBeenCalledWith(`/post/${mockPost.id}`, { state: { post: mockPost } });
  });
});
