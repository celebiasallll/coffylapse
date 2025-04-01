# CoffyLapse

CoffyLapse is a Next.js based project with blockchain integration capabilities.

## Features

- Modern React with Next.js
- State management with Zustand
- Blockchain connectivity with ethers.js
- Styling with Tailwind CSS
- Animation with Framer Motion

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- NPM or Yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/username/coffylapse.git
   cd coffylapse
   ```

2. Install dependencies
   ```bash
   # Run the custom installation script
   node install-dependencies.js

   # Or install manually
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Reset Dependencies

If you encounter any issues with dependencies, you can reset them:

```bash
node reset-dependencies.js
```

## Project Structure

```
coffylapse/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Next.js pages
├── public/         # Static assets
├── styles/         # Global styles
├── utils/          # Helper utilities
└── data/           # Data models and API functions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server

## Technologies Used

- Next.js
- React
- Zustand (State Management)
- Ethers.js (Blockchain Integration)
- Tailwind CSS
- Framer Motion

## License

This project is licensed under the MIT License.
