# TaskMate – Frontend

A React + Vite frontend for a Student Task & Assignment Manager.

## Requirements
- Node.js 18 or newer
- npm

## Run locally
1. Extract this ZIP.
2. Open the extracted `taskmate-frontend` folder in VS Code.
3. Open the VS Code terminal in that folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually http://localhost:5173).

## Configuration

Copy `.env.example` to `.env.local` when using the backend:

```env
VITE_API_URL=http://localhost:5000
```

Without `VITE_API_URL`, the app runs in localStorage-only mode. When configured, it loads and writes assignments through the API and keeps a browser cache as a fallback if the API is temporarily unavailable.

## Included
- Dashboard with summary cards and upcoming deadlines
- Add, edit, delete and complete assignments
- Search and status filters
- Calendar-style upcoming assignment list
- Completed tasks view
- Settings page
- Responsive sidebar navigation
- Browser localStorage persistence

## Production build

```bash
npm run build
npm run preview
```

Deploy the generated `dist` directory to a static host. Configure SPA fallback rewrites to serve `index.html` for `/assignments`, `/calendar`, `/completed`, and `/settings`.
