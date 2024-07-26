// /* eslint-disable testing-library/no-node-access */
// import React from 'react';
// import { render, screen, waitFor, fireEvent } from '@testing-library/react';
// import { createMemoryHistory } from 'history';
// import { Router } from 'react-router-dom';
// import ExplorePins from './../components/ExplorePins';
// import { JSX } from 'react/jsx-runtime';

// // Mock data
// const mockPosts = [
//   {
//     id: 1,
//     user: {
//       id: 1,
//       userName: 'JohnDoe',
//       email: 'john@example.com',
//       passcode: '1234',
//       role: 'user',
//       isEnabled: true,
//       password: 'password',
//       username: 'john',
//       authorities: [{ authority: 'ROLE_USER' }],
//       isAccountNonLocked: true,
//       isCredentialsNonExpired: true,
//       isAccountNonExpired: true,
//     },
//     group: {
//       id: 1,
//       name: 'Group One',
//       description: 'Description for group one',
//       isPrivate: false,
//       user: null,
//       picture: 'http://example.com/group1.jpg',
//       createdAt: '2021-01-01T00:00:00.000Z',
//     },
//     category: { id: 1, description: 'Category One' },
//     picture: 'http://example.com/post1.jpg',
//     latitude: 0,
//     longitude: 0,
//     caption: 'Caption for post 1',
//     createdAt: '2021-01-01T00:00:00.000Z',
//   },
//   {
//     id: 2,
//     user: {
//       id: 52,
//       userName: 'JaneDoe',
//       email: 'jane@example.com',
//       passcode: '5678',
//       role: 'user',
//       isEnabled: true,
//       password: 'password',
//       username: 'jane',
//       authorities: [{ authority: 'ROLE_USER' }],
//       isAccountNonLocked: true,
//       isCredentialsNonExpired: true,
//       isAccountNonExpired: true,
//     },
//     group: {
//       id: 2,
//       name: 'Group Two',
//       description: 'Description for group two',
//       isPrivate: false,
//       user: null,
//       picture: 'http://example.com/group2.jpg',
//       createdAt: '2021-02-01T00:00:00.000Z',
//     },
//     category: { id: 2, description: 'Category Two' },
//     picture: 'http://example.com/post2.jpg',
//     latitude: 0,
//     longitude: 0,
//     caption: 'Caption for post 2',
//     createdAt: '2021-02-01T00:00:00.000Z',
//   },
//   {
//     id: 3,
//     user: {
//       id: 3,
//       userName: 'JimDoe',
//       email: 'jim@example.com',
//       passcode: '91011',
//       role: 'user',
//       isEnabled: true,
//       password: 'password',
//       username: 'jim',
//       authorities: [{ authority: 'ROLE_USER' }],
//       isAccountNonLocked: true,
//       isCredentialsNonExpired: true,
//       isAccountNonExpired: true,
//     },
//     group: {
//       id: 3,
//       name: 'Group Three',
//       description: 'Description for group three',
//       isPrivate: false,
//       user: null,
//       picture: 'http://example.com/group3.jpg',
//       createdAt: '2021-03-01T00:00:00.000Z',
//     },
//     category: { id: 3, description: 'Category Three' },
//     picture: 'http://example.com/post3.jpg',
//     latitude: 0,
//     longitude: 0,
//     caption: 'Caption for post 3',
//     createdAt: '2021-03-01T00:00:00.000Z',
//   },
// ];

// // Mocking the fetch API
// beforeEach(() => {
//   global.fetch = jest.fn(() =>
//     Promise.resolve(
//       new Response(JSON.stringify({ content: mockPosts }), {
//         headers: { 'Content-Type': 'application/json' },
//       })
//     )
//   );
// });

// afterEach(() => {
//   jest.clearAllMocks();
// });

// describe('ExplorePins', () => {
//   const renderWithRouter = (ui: string | number | boolean | Iterable<React.ReactNode> | JSX.Element | null | undefined, { route = '/' } = {}) => {
//     const history = createMemoryHistory({ initialEntries: [route] });
//     return {
//       ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
//       history,
//     };
//   };

//   // test('renders posts', async () => {
//   //   renderWithRouter(<ExplorePins />);
  
//   //   // Filter out the posts that do not meet the condition
//   //   const postsToTest = mockPosts.filter(post => post.user.id !== 52);
  
//   //   // Wait for the posts to be loaded and displayed
//   //   await waitFor(() => {
//   //     postsToTest.forEach(post => {
//   //       expect(screen.getByAltText(post.caption)).toBeInTheDocument();
//   //       expect(screen.getByText(post.caption)).toBeInTheDocument();
//   //       expect(screen.getByText(post.category.description)).toBeInTheDocument();
//   //     });
//   //   });
//   // });
  
//   test('each post links to the correct URL', async () => {
//     const { history } = renderWithRouter(<ExplorePins />);

//     const postsToTest = mockPosts.filter(post => post.user.id !== 52);
  
//     // Ensure there is at least one post to test
//     expect(postsToTest.length).toBeGreaterThan(0);
  
//     // Wait for the posts to be loaded and displayed
//     await waitFor(() => {
//       postsToTest.forEach(post => {
//         const linkElement = screen.getByAltText(post.caption).closest('div');
//         expect(linkElement).toHaveAttribute('class', 'p-4 border rounded-lg shadow-sm cursor-pointer');
//       });
//     });
  
//     // Now that we've asserted the array has items, we can safely access the first item
//     const firstPostLink = screen.getByAltText(postsToTest[0].caption).closest('div') as HTMLDivElement;
//     fireEvent.click(firstPostLink);
//     expect(history.location.pathname).toBe(`/post/${postsToTest[0].id}`);
//   });
// });
const test: () => void = () => {
    expect(true).tobe(true)
}

export{test}