# InMood

InMood is a mood-based movie recommendation project powered by semantic search.

The app lets a user describe how they want to feel, converts that text into embeddings, queries a Chroma collection, and returns the closest movie matches.

This project is part of my post-graduation program at Rocketseat.

## Project Modules

- `front/`: React + Vite web app (UI and query flow).
- `data_loader/`: script that reads the CSV dataset, generates embeddings, and loads documents into Chroma.
- `vector_database/`: Chroma server configuration and Python project wrapper.

## How It Works

1. A movie dataset is read from `data_loader/mpst_full_data.csv`.
2. The loader generates embeddings with `Xenova/all-MiniLM-L6-v2`.
3. Documents and vectors are stored in a Chroma collection named `movies`.
4. The frontend sends the user mood phrase as a query text.
5. Chroma returns nearest matches and the UI renders recommendations.

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Zustand, Tailwind CSS
- Vector database: Chroma
- Embeddings: Hugging Face Transformers (`Xenova/all-MiniLM-L6-v2`)
- Data ingestion: Node.js stream pipeline + CSV parser
- Python tooling: taskipy (for Chroma serve task)

## Prerequisites

- Node.js 20+
- pnpm 10+
- Python 3.13+

## Quick Start

Start each module in this order.

### 1) Start Chroma server

From `vector_database/`:

~~~bash
# Option A: install project dependencies and run Chroma directly
pip install -e .
chroma run config.yaml

# Option B: if you use taskipy
# pip install taskipy
# task serve
~~~

Notes:
- Chroma config allows frontend CORS from `http://localhost:5173`.
- Server is expected at `http://localhost:8000`.

### 2) Load movie data into Chroma

From `data_loader/`:

~~~bash
pnpm install
node load_data.js
~~~

This script recreates the `movies` collection and inserts dataset rows in batches.

### 3) Run the frontend

From `front/`:

~~~bash
pnpm install
pnpm dev
~~~

Open `http://localhost:5173`.

## Frontend Scripts

From `front/`:

~~~bash
pnpm dev      # start dev server
pnpm build    # production build
pnpm preview  # preview build
pnpm lint     # lint code
~~~

## Project Structure

~~~text
inmood/
  front/
  data_loader/
  vector_database/
~~~

## Troubleshooting

- If the UI shows loading/errors when searching:
  - confirm Chroma is running on port 8000
  - confirm data has been loaded into the `movies` collection
- If embedding/model download fails:
  - verify internet access in both Node and frontend environments
- If browser requests are blocked:
  - verify `vector_database/config.yaml` CORS origins include your frontend URL

## Current Status

- Frontend is wired to query collection `movies` from `http://localhost:8000`.
- Fallback mock cards are shown in the UI when no results are loaded yet.

## License

No license file is currently defined in this repository.
