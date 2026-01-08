Personal Website

A minimalistic, interactive personal website featuring dot-based ASCII art backgrounds and a chronological resume timeline.

<img width="3090" height="1614" alt="image" src="https://github.com/user-attachments/assets/85b55c8e-2745-4858-8671-9022703b2ec3" />
<img width="2951" height="1588" alt="image" src="https://github.com/user-attachments/assets/b29a971d-1ec6-4db4-8fdb-68dd1653caec" />
<img width="2844" height="1470" alt="image" src="https://github.com/user-attachments/assets/b4be783e-1e40-4244-985b-c89fd9da3bb5" />
<img width="3006" height="1622" alt="image" src="https://github.com/user-attachments/assets/03edeb95-08d9-41c8-b7d6-c9ede1f3aadb" />
<img width="1290" height="1470" alt="image" src="https://github.com/user-attachments/assets/e6d51727-5300-4eab-81d4-bfa60cbd4942" />



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
