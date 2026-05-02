# InMood Data Loader

Data ingestion module for InMood.

This script reads the movie dataset CSV, generates embeddings, and writes documents + vectors to the Chroma collection `movies`.

This project is part of my post-graduation program at Rocketseat.

## Stack

- Node.js
- Chroma JavaScript client
- Hugging Face Transformers (`Xenova/all-MiniLM-L6-v2`)
- CSV stream processing (`csv-parser`)

## Files

- `load_data.js`: ingestion pipeline
- `mpst_full_data.csv`: source dataset used by the loader

## Prerequisites

- Node.js 20+
- pnpm 10+
- Chroma server running (default expected at `http://localhost:8000`)

## Install

From this folder:

```bash
pnpm install
```

## Run

```bash
node load_data.js
```

## What The Script Does

1. Connects to Chroma.
2. Deletes collection `movies` (if it exists).
3. Recreates/gets collection `movies`.
4. Reads `mpst_full_data.csv` as a stream.
5. Creates embeddings in batches (`BATCH_SIZE = 100`).
6. Inserts batched ids, documents, metadata, and embeddings into Chroma.

## Important Notes

- Running this script overwrites previous data in collection `movies`.
- Model files may be downloaded on first run.
- Keep this process running until the final total rows log is printed.

## Troubleshooting

- If Chroma connection fails, start `../vector_database` first.
- If ingestion is slow, reduce concurrency pressure or batch size.
- If model download fails, verify internet access and retry.
