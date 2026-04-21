import {
  env,
  type FeatureExtractionPipeline,
  pipeline,
} from '@huggingface/transformers'

// Configurações para evitar o erro de 'data location'
env.allowLocalModels = false
env.useBrowserCache = true

// Se você estiver usando Vite, às vezes é necessário desativar o proxy de threads
if (env.backends.onnx.wasm) {
  env.backends.onnx.wasm.proxy = false
}

const initializeEmbedder = (() => {
  console.debug('Initializing embedder pipeline...')
  let pipelineInstance: Promise<FeatureExtractionPipeline> | null = null
  return async () => {
    if (!pipelineInstance) {
      pipelineInstance = pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        {
          dtype: 'q8',
        }
      )
    }
    return pipelineInstance
  }
})()

const generateEmbedding = async (text: string) => {
  const embedder = await initializeEmbedder()
  return embedder(text, {
    pooling: 'mean',
    normalize: true,
  }).then(t => t.tolist())
}

const generateEmbeddings = async (texts: string[]) => {
  const embedder = await initializeEmbedder()
  return embedder(texts, {
    pooling: 'mean',
    normalize: true,
  }).then(t => t.tolist())
}

const chromaEmbeddingFunction = {
  generate: generateEmbeddings,
}

export { chromaEmbeddingFunction, generateEmbedding, generateEmbeddings }
