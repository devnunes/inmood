# InMood Vector Database

This module provides the ChromaDB server used by InMood.

It is responsible for storing movie documents and embeddings and serving similarity search queries from the frontend.

This project is part of my post-graduation program at Rocketseat.

## Stack

- Python 3.13+
- ChromaDB
- taskipy

## Files

- `config.yaml`: Chroma server configuration (CORS + embedding model)
- `pyproject.toml`: project dependencies and task aliases
- `main.py`: thin launcher for `chroma run config.yaml`

## Prerequisites

- Python 3.13+
- uv

## Install

From this folder:

```bash
uv sync
```

## Run Server

Option A (direct):

```bash
uv run chroma run config.yaml
```

Option B (taskipy):

```bash
uv run task serve
```

Default endpoint: `http://localhost:8000`

## CORS

The current config allows requests from:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

If your frontend runs on another origin, update `config.yaml` accordingly.

## Data Notes

- Data is ingested by `../data_loader/load_data.js`.
- The collection name used by the project is `movies`.
- Local Chroma state in `chroma/` is generated data and should not be committed.

## Common Flow

1. Start this Chroma server.
2. Run the data loader to populate vectors.
3. Start the frontend app.
