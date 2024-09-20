import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateGroups from './../components/CreateGroups';

const mockOnCreateGroup = jest.fn();

const mockCreateObjectURL = jest.fn();
(global as any).URL.createObjectURL = mockCreateObjectURL;

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        name: 'Test Group',
        description: 'Test Description',
        picture: 'https://animalmicrochips.co.uk/images/default_no_animal.jpg',
        isPrivate: false,
        createdAt: '2021-01-01T00:00:00.000Z',
      }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('CreateGroups', () => {
  test('renders CreateGroups component', () => {
    render(<CreateGroups onCreateGroup={mockOnCreateGroup} />);
    const createElements = screen.getAllByText('Create');
    expect(createElements.length).toBeGreaterThan(0);
  });

  test('handles form input', () => {
    render(<CreateGroups onCreateGroup={mockOnCreateGroup} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    fireEvent.change(titleInput, { target: { value: 'Test Group' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    expect(titleInput).toHaveValue('Test Group');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  test('submits form and calls API', async () => {
    render(<CreateGroups onCreateGroup={mockOnCreateGroup} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const createButton = screen.getByRole('button', { name: /create/i });

    fireEvent.change(titleInput, { target: { value: 'Test Group' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    fireEvent.click(createButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const fetchCallArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(fetchCallArgs[0]).toBe('/api/groups');
    expect(fetchCallArgs[1].method).toBe('POST');
    expect(fetchCallArgs[1].headers).toEqual({ 'Content-Type': 'application/json' });

    const body = JSON.parse(fetchCallArgs[1].body);
    expect(body.name).toBe('Test Group');
    expect(body.description).toBe('Test Description');
    expect(body.picture).toBe('https://animalmicrochips.co.uk/images/default_no_animal.jpg');
    expect(body.isPrivate).toBe(false);

    await waitFor(() => expect(mockOnCreateGroup).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      name: 'Test Group',
      description: 'Test Description',
    })));
  });
});
export{}