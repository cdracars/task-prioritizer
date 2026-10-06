import { ReactElement } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Coffee, Heart } from 'lucide-react';
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
          <a
            className="github-corner"
            href="https://github.com/cdracars/task-prioritizer"
            target="_blank"
            rel="noreferrer"
            aria-label="View Task Prioritizer source on GitHub"
          >
            <svg viewBox="0 0 250 250" aria-hidden="true">
              <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
              <path className="octo-arm" d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" />
              <path className="octo-body" d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.6 C171.4,40.6 176.1,42.5 178.8,56.2 C183.8,58.6 187.2,61.8 189.8,65.4 C203.1,64.1 206.7,69.9 206.7,69.9 C203.7,78.2 197.8,81.0 196.1,81.4 C196.4,87.8 194.4,93.4 189.8,98.1 C173.7,114.2 159.5,107.5 149.9,99.4 C150.1,101.8 149.3,104.9 146.9,108.1 L133.0,121.9 C131.9,123.0 133.3,126.8 133.4,126.8 Z" />
            </svg>
          </a>
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
