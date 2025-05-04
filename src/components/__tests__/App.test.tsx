import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Mock our component dependencies to simplify testing
jest.mock('react-helmet-async', () => ({
  HelmetProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Helmet: () => <div data-testid="helmet-mock" />,
}));

jest.mock('../MetaTags', () => () => <div data-testid="meta-tags-mock" />);
jest.mock('../TaskPrioritizer', () => () => (
  <div data-testid="task-prioritizer-mock">Task Prioritizer Mocked</div>
));
jest.mock('../mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle-mock">Mode Toggle</div>,
}));
jest.mock('../theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider-mock">{children}</div>
  ),
}));

describe('App', () => {
  it('renders the application structure correctly', () => {
    render(<App />);

    // Check main heading
    expect(
      screen.getByRole('heading', { name: /task prioritizer/i })
    ).toBeInTheDocument();

    // Check that our mocked components are rendered
    expect(screen.getByTestId('meta-tags-mock')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider-mock')).toBeInTheDocument();
    expect(screen.getByTestId('mode-toggle-mock')).toBeInTheDocument();
    expect(screen.getByTestId('task-prioritizer-mock')).toBeInTheDocument();

    // Check semantic HTML structure
    expect(screen.getByRole('banner')).toBeInTheDocument(); // <header>
    expect(screen.getByRole('main')).toBeInTheDocument(); // <main>
  });
});
