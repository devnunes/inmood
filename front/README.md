# InMood Frontend

Frontend application for InMood, a mood-based movie recommendation experience.

This app captures a mood phrase (for example, "I want something nostalgic and emotional"), queries ChromaDB, and displays the closest movie recommendations.

This project is part of my post-graduation program at Rocketseat.

## Stack

- React 19 + TypeScript
- Vite 8
- Zustand for state management
- Tailwind CSS 4
- Chroma JS client
- Hugging Face Transformers (browser embedding pipeline)

## Prerequisites

- Node.js 20+
- pnpm 10+
- Chroma server running on `http://localhost:8000`
- Collection `movies` loaded (via `../data_loader`)

## Install

```bash
pnpm install
```

## Run

```bash
pnpm dev
```

Open `http://localhost:5173`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

## How It Connects To Chroma

- Chroma endpoint is configured in `src/lib/chromadb.ts`.
- The app gets collection `movies` and runs similarity queries in `src/stores/moviesStore.ts`.
- Embeddings are generated with `Xenova/all-MiniLM-L6-v2` in `src/models/embedder.ts`.

## Troubleshooting

- If the app cannot load suggestions, verify Chroma is running on port 8000.
- If results are empty, confirm the data loader has already populated collection `movies`.
- If model downloads fail, confirm internet access in the browser environment.
