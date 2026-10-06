import { ReactElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/theme-provider';
import { ModeToggle } from './components/mode-toggle';
import TaskPrioritizer from './components/TaskPrioritizer';
import ErrorBoundary from './components/ErrorBoundary';
import MetaTags from './components/MetaTags';

/**
 * The root component of the Task Prioritizer application.
 * It sets up the theme provider and renders the main layout.
 */
function App(): ReactElement {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider
          defaultTheme="system"
          storageKey="task-prioritizer-theme"
        >
          <MetaTags />
          <div className="min-h-screen bg-background">
            <header className="border-b border-border p-4">
              <div className="flex justify-between items-center max-w-md mx-auto">
                <h1 className="text-xl font-semibold text-foreground">
                  Task Prioritizer
                </h1>
                <ModeToggle />
              </div>
            </header>
            <ErrorBoundary>
              <main>
                <TaskPrioritizer />
              </main>
            </ErrorBoundary>
            <footer className="mx-auto max-w-md px-4 pb-6 text-center text-sm text-muted-foreground">
              <a
                className="inline-flex items-center gap-2 underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                href="https://ko-fi.com/cdracars66494"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="https://storage.ko-fi.com/cdn/cup-border.png"
                  alt=""
                  width="24"
                  height="16"
                />
                Support this free tool on Ko-fi
              </a>
            </footer>
          </div>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
