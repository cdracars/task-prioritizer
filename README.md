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

- Node.js (v20 or higher)
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
- `yarn preview` - Build and serve the production app with Wrangler
- `yarn deploy` - Build and deploy to Cloudflare Workers
- `yarn test` - Run tests
- `yarn format` - Format code using Prettier
- `yarn lint:check` - Check for linting issues

## Deployment

The app deploys to Cloudflare Workers with Wrangler. The generated React build is served as static assets, with single-page-app fallbacks enabled.

1. Authenticate Wrangler with the Cloudflare account that owns the target zone:

   ```bash
   yarn wrangler login
   ```

2. Deploy the app:

   ```bash
   yarn deploy
   ```

3. To attach `task-prioritizer.dracars.com`, add the custom domain to the deployed Worker in Cloudflare's dashboard. Then keep the canonical URL in `src/components/MetaTags.tsx` pointed at that domain.

## License

MIT
