// /* eslint-disable testing-library/no-node-access */
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import { createMemoryHistory } from 'history';
// import { Router } from 'react-router-dom';
// import SearchGroups from './../components/SearchGroups';

// // Mocking the API response with some test data
// const mockGroups = [
//   {
//     id: 1,
//     name: 'Mountain Climbers',
//     description: 'A group for mountain climbing enthusiasts',
//     isPrivate: false,
//     user: { userName: 'JohnDoe', email: 'john@example.com' },
//     picture: 'https://via.placeholder.com/150',
//     createdAt: '2021-01-01T00:00:00.000Z',
//   },
//   {
//     id: 2,
//     name: 'Ocean Explorers',
//     description: 'Explore the ocean with us',
//     isPrivate: false,
//     user: { userName: 'JaneDoe', email: 'jane@example.com' },
//     picture: 'https://via.placeholder.com/150',
//     createdAt: '2021-02-01T00:00:00.000Z',
//   },
//   {
//     id: 3,
//     name: 'Bird Watchers',
//     description: 'Bird watching group',
//     isPrivate: false,
//     user: { userName: 'BirdMan', email: 'bird@example.com' },
//     picture: 'https://via.placeholder.com/150',
//     createdAt: '2021-03-01T00:00:00.000Z',
//   },
// ];

// beforeEach(() => {
//   global.fetch = jest.fn(() =>
//     Promise.resolve(
//       new Response(JSON.stringify({
//         totalElements: 3,
//         totalPages: 1,
//         size: 3,
//         content: mockGroups,
//       }), {
//         headers: { 'Content-Type': 'application/json' }
//       })
//     )
//   );
// });

// afterEach(() => {
//   jest.clearAllMocks();
// });

// describe('SearchGroups', () => {
//   const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
//     const history = createMemoryHistory({ initialEntries: [route] });
//     return {
//       ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
//       history,
//     };
//   };

//   test('renders search input and groups', async () => {
//     renderWithRouter(<SearchGroups />);
//     expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();

//     await screen.findByText('Mountain Climbers');
//     await screen.findByText('Ocean Explorers');
//     await screen.findByText('Bird Watchers');
//   });

//   // test('filters groups based on search query', async () => {
//   //   renderWithRouter(<SearchGroups />);
//   //   fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'Mountain' } });

//   //   await screen.findByText('Mountain Climbers');
//   //   expect(screen.queryByText('Ocean Explorers')).not.toBeInTheDocument();
//   //   expect(screen.queryByText('Bird Watchers')).not.toBeInTheDocument();
//   // });

//   // test('displays no groups found message if no match', async () => {
//   //   renderWithRouter(<SearchGroups />);
//   //   fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'NonExistentGroup' } });

//   //   await screen.findByText('No groups found.');
//   // });

// });