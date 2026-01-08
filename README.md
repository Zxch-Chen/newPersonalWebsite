# Personal Website

A minimalistic, interactive personal website featuring dot-based ASCII art backgrounds and a chronological resume timeline.

## Project Structure

- `index.html`: Main entry point structure
- `styles/main.css`: Core styling and animations
- `js/`: JavaScript modules
  - `main.js`: Application entry point
  - `dotArt.js`: Canvas-based dot art rendering engine
  - `navigation.js`: Tab switching and routing logic
  - `timeline.js`: Scroll animations for resume
  - `substack.js`: RSS feed integration
- `assets/`: Image assets for dot art generation

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Open a terminal in the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the local development server:

```bash
npm run dev
```

This will start the server at `http://localhost:5173/` (or another port if 5173 is busy).

### Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.
