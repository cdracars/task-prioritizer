#!/bin/bash

# Create directories
mkdir -p src/components/ui
mkdir -p src/lib

# Create files
touch src/components/ui/button.js
touch src/components/ui/dropdown-menu.js
touch src/components/theme-provider.js
touch src/components/mode-toggle.js
touch src/components/TaskPrioritizer.js
touch src/lib/utils.js
touch src/App.js
touch src/index.css
touch tailwind.config.js

# Install required dependencies
npm install clsx tailwind-merge lucide-react

echo "File structure created! Now copy and paste the content into each file."
