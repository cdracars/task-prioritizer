import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TaskPrioritizer from '../TaskPrioritizer';

// Mock the useLocalStorage hook
jest.mock('../../hooks/useLocalStorage', () => ({
  __esModule: true,
  default: jest.fn(), // Initialize as a basic jest function
}));

// Helper to set up mocks for a specific test
const setupMocks = (mocks: { [key: string]: [any, jest.Mock] }) => {
  const useLocalStorageMock = require('../../hooks/useLocalStorage').default;
  useLocalStorageMock.mockImplementation((key: string, initialValue: any) => {
    if (mocks[key]) {
      return mocks[key];
    }
    // Default fallback if a key isn't specifically mocked for the test
    return [initialValue, jest.fn()];
  });
};

describe('TaskPrioritizer', () => {
  beforeEach(() => {
    // Clear mocks before each test
    const useLocalStorageMock = require('../../hooks/useLocalStorage').default;
    useLocalStorageMock.mockClear();
    // Reset to a default implementation (can be overridden by setupMocks)
    useLocalStorageMock.mockImplementation((key: string, initialValue: any) => [
      initialValue,
      jest.fn(),
    ]);
  });

  it('renders the input stage initially', () => {
    // No specific mocks needed, default implementation is fine
    render(<TaskPrioritizer />);
    expect(screen.getByPlaceholderText('Enter a task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.getByText(/your tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/no tasks added yet/i)).toBeInTheDocument();
  });

  it('toggles bulk import form when clicking the button', async () => {
    // No specific mocks needed
    const user = userEvent.setup();
    render(<TaskPrioritizer />);
    await user.click(
      screen.getByRole('button', { name: /bulk import tasks/i })
    );
    expect(
      screen.getByPlaceholderText(/Enter tasks, one per line.../i)
    ).toBeInTheDocument();
  });

  it('imports tasks in bulk from textarea', async () => {
    const setTasksMock = jest.fn();
    const mocks: { [key: string]: [any, jest.Mock] } = {
      'taskPrioritizer.stage': ['input', jest.fn()],
      'taskPrioritizer.tasks': [[], setTasksMock], // Specific mock for tasks
      'taskPrioritizer.completedTasks': [[], jest.fn()],
      'taskPrioritizer.comparisons': [[], jest.fn()],
      'taskPrioritizer.prioritizedTasks': [[], jest.fn()],
      'taskPrioritizer.currentComparison': [0, jest.fn()],
    };
    setupMocks(mocks);

    const user = userEvent.setup();
    const { rerender } = render(<TaskPrioritizer />);

    // Open bulk import form
    await user.click(
      screen.getByRole('button', { name: /bulk import tasks/i })
    );

    // Enter tasks
    const textarea = screen.getByPlaceholderText(
      /Enter tasks, one per line.../i
    );
    await user.type(textarea, 'Task 1\nTask 2\nTask 3');

    // Click import button
    await act(async () => {
      await user.click(screen.getByRole('button', { name: /import tasks/i }));
    });

    // Verify the mock setter for tasks was called
    expect(setTasksMock).toHaveBeenCalled();

    // --- Prepare for re-render ---
    // Get the state that would have been passed to the mock setter
    const newStatePassedToMock = setTasksMock.mock.calls[0][0];
    expect(Array.isArray(newStatePassedToMock)).toBe(true);
    expect(newStatePassedToMock.length).toBe(3);
    expect(newStatePassedToMock[0]).toMatchObject({ text: 'Task 1' });

    // Set up mocks for the re-render, providing the new state
    const rerenderMocks: { [key: string]: [any, jest.Mock] } = {
      ...mocks, // Keep other mocks the same
      'taskPrioritizer.tasks': [newStatePassedToMock, setTasksMock],
    };
    setupMocks(rerenderMocks);

    // Re-render
    rerender(<TaskPrioritizer />);

    // Check if tasks are visible in the list
    const taskList = screen.getByRole('list');
    expect(within(taskList).getByText('Task 1')).toBeInTheDocument();
    expect(within(taskList).getByText('Task 2')).toBeInTheDocument();
    expect(within(taskList).getByText('Task 3')).toBeInTheDocument();
  });
});
