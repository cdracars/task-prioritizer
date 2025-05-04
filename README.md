# Task Prioritizer

A comparison-based task prioritization web app built with React and TypeScript.

## Overview

Task Prioritizer helps you organize your to-do list by using a simple comparison approach. Instead of trying to prioritize everything at once, the app asks you to compare tasks one pair at a time.

## Features

- Add multiple tasks to be prioritized
- Bulk import tasks from text or files
- Simple "this or that" comparison interface
- Skip comparisons for tasks of equal importance
- View final prioritized list
- Mark tasks as complete
- Restore completed tasks if needed
- Export your tasks as text or JSON
- Import tasks from JSON backups
- Light/dark/system theme support
- Works on mobile and desktop devices
- Fully accessible with keyboard navigation and screen reader support
- State persists between browser sessions

## Technologies

- **React**: UI library for building component-based interfaces
- **TypeScript**: Static typing for improved code quality and developer experience
- **TailwindCSS**: Utility-first CSS framework for styling
- **ESLint/Prettier**: Code quality and formatting tools

## How It Works

1. **Input Stage**: Add your tasks one by one or bulk import them
2. **Compare Stage**: For each pair of tasks, select which one is more important
3. **Results Stage**: View your prioritized list, mark tasks as complete, or export for later use

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/task-prioritizer.git
   cd task-prioritizer
   ```

2. Install dependencies
   ```bash
   yarn install
   ```

3. Start the development server
   ```bash
   yarn dev
   ```

4. Open your browser to http://localhost:3000

### Available Scripts

- `yarn dev` or `yarn start` - Start development server
- `yarn build` - Build for production
- `yarn test` - Run tests
- `yarn format` - Format code using Prettier
- `yarn lint:check` - Check for linting issues

## Deployment

The app can be deployed to any static site hosting service:

1. Build the production version
   ```bash
   yarn build
   ```

2. Deploy the contents of the `build` directory

## License

MIT
