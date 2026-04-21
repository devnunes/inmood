import { generateEmbedding } from '@/models/embedder'

async function generateEmbeddingAPI(text: string) {
  return generateEmbedding(text)
}

export { generateEmbeddingAPI }
