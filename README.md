# ISS Mission Control Dashboard

A beginner-friendly React + JSX + CSS dashboard for tracking the International Space Station in real time.

## What It Includes

- Live ISS position updates every 15 seconds
- Manual refresh button
- Auto-refresh on/off toggle
- Interactive Leaflet map with OpenStreetMap tiles
- ISS marker popup with latitude, longitude, speed, and timestamp
- Last 15 ISS positions drawn as a trajectory path
- Haversine speed calculation in km/h
- Live speed chart using Recharts
- People currently in space section
- Reverse geocoded location name with fallback text
- Dark/light mode using CSS variables and localStorage
- Responsive mission-control style layout
- Loading, error, retry, and toast notification states
- News dashboard with search, sorting, localStorage caching, and load more
- Floating AI chatbot that only answers using ISS and news dashboard data

## Required Install Commands

These are the main packages used by the dashboard:

```bash
npm install react-leaflet leaflet
npm install recharts
npm install react-toastify
```

For this project, install everything with:

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5175/
```

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the project root:

```bash
VITE_NEWS_API_KEY=your_news_api_key_here
VITE_HF_API_KEY=your_huggingface_api_key_here
```

The app reads these values with `import.meta.env`, which is the Vite-friendly way to use frontend environment variables. Do not hardcode API keys inside React components.

## Vercel Deployment

This project is frontend-only and Vercel-ready. It uses no Express server, no Node backend, no filesystem access, and no server-side rendering.

Build settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Add environment variables in Vercel:

1. Open Vercel Dashboard
2. Open Project Settings
3. Go to Environment Variables
4. Add `VITE_NEWS_API_KEY`
5. Add `VITE_HF_API_KEY`
6. Redeploy the project

## Folder Structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── ISSMap.jsx
│   ├── ISSInfoCards.jsx
│   ├── SpeedChart.jsx
│   ├── Astronauts.jsx
│   ├── Loader.jsx
│   ├── ErrorMessage.jsx
│   ├── ThemeToggle.jsx
│   ├── RefreshControls.jsx
│   ├── ToastMessage.jsx
│   ├── NewsSection.jsx
│   ├── NewsCard.jsx
│   ├── NewsSearch.jsx
│   ├── NewsSort.jsx
│   ├── NewsLoader.jsx
│   ├── NewsError.jsx
│   ├── LoadMoreButton.jsx
│   ├── ChatbotButton.jsx
│   ├── ChatbotWindow.jsx
│   ├── ChatMessage.jsx
│   ├── TypingIndicator.jsx
│   ├── ChatInput.jsx
│   └── ClearChatButton.jsx
│
├── services/
│   ├── issService.js
│   ├── astronautService.js
│   ├── reverseGeoService.js
│   ├── newsService.js
│   └── chatbotService.js
│
├── utils/
│   ├── calculateSpeed.js
│   ├── formatTime.js
│   ├── buildPrompt.js
│   └── saveChatHistory.js
│
├── styles/
│   ├── dashboard.css
│   ├── themes.css
│   ├── responsive.css
│   ├── news.css
│   └── chatbot.css
│
├── App.jsx
└── main.jsx
```

## Notes

The app uses the real Open Notify ISS and astronaut APIs requested in the prompt. If a public API is blocked or temporarily unavailable, the dashboard shows a safe fallback instead of a blank screen.
