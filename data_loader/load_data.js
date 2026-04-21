import fs from 'node:fs'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { pipeline as pipe } from '@huggingface/transformers'
import { ChromaClient } from 'chromadb'
import csv from 'csv-parser'

const BATCH_SIZE = 100 // Tune for your needs

const embedder = await pipe('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
  dtype: 'q8',
})

async function embedText(texts) {
  if (!Array.isArray(texts)) texts = [texts]
  return embedder(texts, { pooling: 'mean', normalize: true }).then(t =>
    t.tolist()
  )
}

async function generateEmbedding(row) {
  try {
    const embeddings = await embedText(row)
    console.log('Embeddings generated with shape:', embeddings.length)
    return embeddings // <-- return the embedding
  } catch (err) {
    console.error('Error generating embeddings:', err)
    throw err
  }
}

async function main() {
  const chromaClient = new ChromaClient()
  await chromaClient.deleteCollection({ name: 'movies' })
  const collection = await chromaClient.getOrCreateCollection({
    name: 'movies',
  })

  let batch = {
    ids: [],
    documents: [],
    metadatas: [],
    embeddings: [],
  }
  let rowCount = 0

  const csvStream = fs.createReadStream('mpst_full_data.csv').pipe(csv())

  const embeddingTransform = new Transform({
    objectMode: true,
    async transform(row, _encoding, callback) {
      try {
        const id = row.id || String(rowCount)
        const document = JSON.stringify(row)
        const metadata = { ...row }

        batch.ids.push(id)
        batch.documents.push(document)
        batch.metadatas.push(metadata)
        rowCount++

        if (batch.ids.length >= BATCH_SIZE) {
          this.pause()
          console.info(`Processing batch of ${batch.ids.length} rows...`)
          const values = await generateEmbedding(batch.documents)
          console.debug(
            'Embeddings generated for batch. Adding to batch object...',
            values[0].length
          )
          batch.embeddings.push(...values)

          console.debug('Loading to ChromaDB...')
          await collection.add({
            ids: batch.ids,
            documents: batch.documents,
            metadatas: batch.metadatas,
            embeddings: batch.embeddings,
          })
          console.debug('Batch loaded. Resetting batch and resuming stream...')
          batch = { ids: [], documents: [], metadatas: [], embeddings: [] }
          console.log(`Inserted ${rowCount} rows...`)
          this.resume()
        }
        callback()
      } catch (err) {
        callback(err)
      }
    },
    flush: async callback => {
      try {
        if (batch.ids.length > 0) {
          const values = await generateEmbedding(batch.documents)
          batch.embeddings.push(...values)

          await collection.add({
            ids: batch.ids,
            documents: batch.documents,
            metadatas: batch.metadatas,
            embeddings: batch.embeddings,
          })
          console.log(`Inserted final ${batch.ids.length} rows.`)
        }
        callback()
      } catch (err) {
        callback(err)
      }
    },
  })

  await pipeline(csvStream, embeddingTransform)
  console.log(`CSV file successfully processed. Total rows: ${rowCount}`)
}

main().catch(err => {
  console.error('Error processing CSV:', err)
})
