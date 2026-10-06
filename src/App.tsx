import { ReactElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Coffee, Github, Heart } from 'lucide-react';
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
                <div className="flex items-center gap-3">
                  <img
                    src="/favicon.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-9 w-9 rounded-xl shadow-sm"
                  />
                  <div>
                    <h1 className="text-xl font-semibold leading-tight text-foreground">
                      Task Prioritizer
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Compare. Decide. Move forward.
                    </p>
                  </div>
                </div>
                <ModeToggle />
              </div>
            </header>
            <ErrorBoundary>
              <main>
                <TaskPrioritizer />
              </main>
            </ErrorBoundary>
            <footer className="mx-auto max-w-md px-4 pb-6 pt-2">
              <nav
                aria-label="Project links"
                className="flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row"
              >
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  Made freely for clearer next steps
                  <Heart
                    aria-hidden="true"
                    className="h-3.5 w-3.5 fill-current text-[#c9403c]"
                  />
                </p>
                <div className="flex items-center gap-2">
                  <a
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#ff5e5b] px-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#ff7774] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    href="https://ko-fi.com/cdracars66494"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Coffee aria-hidden="true" className="h-4 w-4" />
                    Support on Ko-fi
                  </a>
                  <a
                    className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    href="https://github.com/cdracars/task-prioritizer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github aria-hidden="true" className="h-4 w-4" />
                    GitHub
                  </a>
                </div>
              </nav>
            </footer>
          </div>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
