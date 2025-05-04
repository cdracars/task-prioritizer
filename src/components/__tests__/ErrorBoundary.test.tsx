import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

// Create a component that throws an error when rendered
const ErrorComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // We need to silence console.error for these tests since React logs errors during rendering
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child Component</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders the fallback UI when a child component throws', () => {
    // We use jest.spyOn to verify the error was caught
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verify fallback UI is displayed
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText('The application encountered an unexpected error.')
    ).toBeInTheDocument();

    // Clean up the mock
    (console.error as jest.Mock).mockRestore();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary
        fallback={<div data-testid="custom-fallback">Custom error UI</div>}
      >
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });
});
