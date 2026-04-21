import type { Collection } from 'chromadb'
import { z } from 'zod'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { chromaClient } from '@/lib/chromadb'
import { chromaEmbeddingFunction } from '@/models/embedder'

export const MovieSchema = z.object({
  imdb_id: z.string(),
  title: z.string(),
  plot_synopsis: z.string(),
  tags: z.string(),
  split: z.string(),
  synopsis_source: z.string(),
})

export type Movie = z.infer<typeof MovieSchema>

interface MoviesState {
  moviesCollection: Collection | null
  setMoviesCollection: () => Promise<void>
  setMoviesSuggestions: (phrase: string) => Promise<void>
  movies: Movie[]
  isLoading: boolean
  hasLoaded: boolean
}

const useMoviesStore = create<MoviesState>()(
  immer((set, get) => {
    async function setMoviesCollection() {
      const movieState = get()
      if (movieState.moviesCollection) {
        console.debug('Movies collection already initialized')
        return
      }

      try {
        set(state => {
          state.isLoading = true
        })

        const moviesCollection = await chromaClient.getCollection({
          name: 'movies',
          embeddingFunction: chromaEmbeddingFunction,
        })

        set(state => {
          state.moviesCollection = moviesCollection
          state.hasLoaded = true
        })
      } catch (error) {
        throw new Error(
          `Error initializing movies collection: ${(error as Error).message}`
        )
      } finally {
        set(state => {
          state.isLoading = false
        })
      }
    }

    async function setMoviesSuggestions(phrase: string) {
      const trimmedPhrase = phrase.trim()
      if (!trimmedPhrase) {
        return
      }

      try {
        set(state => {
          state.isLoading = true
        })

        let collection = get().moviesCollection
        if (!collection) {
          await setMoviesCollection()
          collection = get().moviesCollection
        }

        if (!collection) {
          throw new Error('Movies collection not initialized')
        }

        const result = await collection.query({
          queryTexts: [trimmedPhrase],
          nResults: 5,
        })
        console.debug('Query result:', result)

        const rawDocuments = result.documents?.[0] ?? []
        const parsedMovies: Movie[] = rawDocuments
          .filter((doc): doc is string => typeof doc === 'string')
          .map(doc => {
            const parsed = MovieSchema.safeParse(JSON.parse(doc))
            return parsed.success ? parsed.data : null
          })
          .filter((movie): movie is Movie => movie !== null)

        set(state => {
          state.movies = parsedMovies
          state.hasLoaded = true
        })
      } catch (error) {
        throw new Error(
          `Error fetching movie suggestions: ${(error as Error).message}`
        )
      } finally {
        set(state => {
          state.isLoading = false
        })
      }
    }

    return {
      moviesCollection: null,
      movies: [],
      isLoading: false,
      hasLoaded: false,
      setMoviesCollection,
      setMoviesSuggestions,
    }
  })
)

export const useSetMoviesCollection = () =>
  useMoviesStore(state => state.setMoviesCollection)

export const useMovies = () => useMoviesStore(state => state.movies)

export const useMoviesLoadingState = () =>
  useMoviesStore(state => ({
    isLoading: state.isLoading,
    hasLoaded: state.hasLoaded,
  }))

export const useSetMoviesSuggestions = () =>
  useMoviesStore(state => state.setMoviesSuggestions)
