// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock the local storage
class LocalStorageMock {
    private store: Record<string, string> = {};

    clear() {
        this.store = {};
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    setItem(key: string, value: string) {
        this.store[key] = String(value);
    }

    removeItem(key: string) {
        delete this.store[key];
    }
}

// Set up a mock for localStorage before tests run
Object.defineProperty(window, 'localStorage', {
    value: new LocalStorageMock(),
});

// Mock IntersectionObserver which isn't available in test environment
global.IntersectionObserver = class IntersectionObserverMock {
    constructor() { }
    disconnect() {
        return null;
    }
    observe() {
        return null;
    }
    takeRecords() {
        return [];
    }
    unobserve() {
        return null;
    }
} as any;

// Suppress console errors during tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
    if (
        args[0]?.includes?.('Warning: ReactDOM.render is no longer supported') ||
        args[0]?.includes?.('React does not recognize the') ||
        args[0]?.includes?.('Error caught by ErrorBoundary')
    ) {
        return;
    }
    originalConsoleError(...args);
};
