import React, { act } from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const server = setupServer(
  // GET /api/items handler
  rest.get('/api/items', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Test Item 1', created_at: '2023-01-01T00:00:00.000Z' },
        { id: 2, name: 'Test Item 2', created_at: '2023-01-02T00:00:00.000Z' },
      ])
    );
  }),

  // POST /api/items handler
  rest.post('/api/items', (req, res, ctx) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        name,
        created_at: new Date().toISOString(),
      })
    );
  }),

  // DELETE /api/items/:id handler
  rest.delete('/api/items/:id', (req, res, ctx) => {
    const { id } = req.params;

    if (id === '999') {
      return res(ctx.status(404), ctx.json({ error: 'Item not found' }));
    }

    return res(ctx.status(200), ctx.json({ message: 'Item deleted successfully' }));
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Connected to in-memory database')).toBeInTheDocument();
  });

  test('should load items from the API', async () => {
    await act(async () => {
      render(<App />);
    });

    // Initially shows loading state (CircularProgress)
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('fetches items from API on initial load', async () => {
    // Create a spy for fetch
    const mockFetch = jest.spyOn(global, 'fetch');

    await act(async () => {
      render(<App />);
    });

    // Check that fetch was called with the correct URL
    expect(mockFetch).toHaveBeenCalledWith('/api/items');

    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Clean up
    mockFetch.mockRestore();
  });

  test('display items in a table format', async () => {
    await act(async () => {
      render(<App />);
    });

    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check for table headers
    expect(screen.getByText('Item Name')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check for table rows
    const tableRows = screen.getAllByRole('row');
    expect(tableRows.length).toBeGreaterThan(1); // Header + at least one data row
  });

  test('adds a new item', async () => {
    const user = userEvent.setup();
    const mockFetch = jest.spyOn(global, 'fetch');

    await act(async () => {
      render(<App />);
    });

    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Fill in the form and submit
    const input = screen.getByPlaceholderText('Enter item name');
    await act(async () => {
      await user.type(input, 'New Test Item');
    });

    const submitButton = screen.getByText('Add Item');
    await act(async () => {
      await user.click(submitButton);
    });

    // Check that the fetch was called with POST method
    expect(mockFetch).toHaveBeenCalledWith('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'New Test Item' }),
    });

    // Check that the new item appears
    await waitFor(() => {
      expect(screen.getByText('New Test Item')).toBeInTheDocument();
    });

    // Clean up
    mockFetch.mockRestore();
  });

  test('submit button is disabled for empty input', async () => {
    await act(async () => {
      render(<App />);
    });

    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check that the submit button is disabled
    const submitButton = screen.getByText('Add Item');
    expect(submitButton).toBeDisabled();

    // Get input field and type something to enable the button
    const input = screen.getByPlaceholderText('Enter item name');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test' } });
    });

    // Button should now be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear the input
    await act(async () => {
      fireEvent.change(input, { target: { value: '' } });
    });

    // Button should be disabled again
    expect(submitButton).toBeDisabled();
  });

  test('handles API error', async () => {
    // Spy on console.error to suppress the output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await act(async () => {
      render(<App />);
    });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  test('shows empty state message when no items', async () => {
    // Override the default handler to return empty array
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    await act(async () => {
      render(<App />);
    });

    // Wait for the table to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Check for the empty state message
    expect(screen.getByText('No items found. Add some!')).toBeInTheDocument();
  });

  test('deletes an item when delete button is clicked', async () => {
    const user = userEvent.setup();

    await act(async () => {
      render(<App />);
    });

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });

    // Find and click the delete button for Test Item 1
    const deleteButton = screen.getByLabelText('Delete Test Item 1');
    await act(async () => {
      await user.click(deleteButton);
    });

    // Check that the item was removed from the UI
    await waitFor(() => {
      expect(screen.queryByText('Test Item 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
    });
  });

  test('shows error when delete fails', async () => {
    const user = userEvent.setup();

    // Spy on console.error to suppress the output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    // Override the default delete handler to simulate an error
    server.use(
      rest.delete('/api/items/:id', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    await act(async () => {
      render(<App />);
    });

    // Wait for items to load
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
    });

    // Find and click a delete button
    const deleteButton = screen.getByLabelText('Delete Test Item 1');
    await act(async () => {
      await user.click(deleteButton);
    });

    // Check that the error message appears
    await waitFor(() => {
      expect(screen.getByText(/Error deleting item/)).toBeInTheDocument();
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
