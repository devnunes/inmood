import { Search, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Movie } from '@/stores/moviesStore'
import {
  useMovies,
  useMoviesLoadingState,
  useSetMoviesCollection,
  useSetMoviesSuggestions,
} from '@/stores/moviesStore'

const mockMovies: Movie[] = [
  {
    imdb_id: 'tt0057603',
    title: 'I tre volti della paura',
    plot_synopsis:
      'Boris Karloff introduces three horror tales of the macabre and the supernatural known as the Three Faces of Fear.',
    tags: 'cult, horror, gothic, murder, atmospheric',
    split: 'train',
    synopsis_source: 'imdb',
  },
  {
    imdb_id: 'tt0167404',
    title: 'The Sixth Sense',
    plot_synopsis:
      'A child psychologist helps a young boy who claims to see and speak with the dead.',
    tags: 'thriller, mystery, supernatural, suspense',
    split: 'train',
    synopsis_source: 'imdb',
  },
  {
    imdb_id: 'tt1375666',
    title: 'Inception',
    plot_synopsis:
      'A skilled thief enters dreams to steal secrets and is given a chance at redemption through an impossible heist.',
    tags: 'science-fiction, heist, mind-bending, action',
    split: 'train',
    synopsis_source: 'imdb',
  },
  {
    imdb_id: 'tt0816692',
    title: 'Interstellar',
    plot_synopsis:
      'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survives.',
    tags: 'space, emotional, epic, science-fiction',
    split: 'train',
    synopsis_source: 'imdb',
  },
  {
    imdb_id: 'tt0110912',
    title: 'Pulp Fiction',
    plot_synopsis:
      'The lives of two mob hitmen, a boxer, and others intertwine in tales of crime and redemption.',
    tags: 'crime, dark-comedy, nonlinear, cult',
    split: 'train',
    synopsis_source: 'imdb',
  },
  {
    imdb_id: 'tt6751668',
    title: 'Parasite',
    plot_synopsis:
      'A poor family schemes to become employed by a wealthy household, leading to unexpected consequences.',
    tags: 'thriller, social-commentary, dark, drama',
    split: 'train',
    synopsis_source: 'imdb',
  },
]

function getPosterUrl(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/400/600`
}

const moodOverlayClasses = [
  'bg-linear-to-t from-violet-500/90 via-violet-500/40 to-transparent',
  'bg-linear-to-t from-pink-500/90 via-pink-500/40 to-transparent',
  'bg-linear-to-t from-amber-500/90 via-amber-500/40 to-transparent',
  'bg-linear-to-t from-emerald-500/90 via-emerald-500/40 to-transparent',
  'bg-linear-to-t from-blue-500/90 via-blue-500/40 to-transparent',
  'bg-linear-to-t from-orange-500/90 via-orange-500/40 to-transparent',
]

export default function App() {
  const setMoviesCollection = useSetMoviesCollection()
  const [searchQuery, setSearchQuery] = useState('')
  const movies = useMovies()
  const setMoviesSuggestions = useSetMoviesSuggestions()
  const [isInputFocused, setIsInputFocused] = useState(false)
  const { isLoading, hasLoaded } = useMoviesLoadingState()
  const [error, setError] = useState<string | null>(null)
  const visibleMovies = movies.length > 0 ? movies : mockMovies

  useEffect(() => {
    setMoviesCollection()
      .then(() => {})
      .catch(err => {
        console.error('Error initializing collection:', err)
        setError(
          `An error occurred while initializing the movie collection: ${err.message}`
        )
      })
  }, [setMoviesCollection])

  function handleSearch() {
    const trimmedQuery = searchQuery.trim()
    if (!trimmedQuery) {
      setError('Please type how you want to feel before searching.')
      return
    }
    setError(null)
    setMoviesSuggestions(trimmedQuery).catch(err => {
      console.error('Error during search:', err)
      setError('An error occurred while fetching movie suggestions.')
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2">
            <Sparkles className="size-6 text-purple" />
            <h1 className="text-5xl tracking-tight text-white sm:text-6xl">
              InMood
            </h1>
            <Sparkles className="size-6 text-pink" />
          </div>
          <p className="text-xl italic text-white/60">In the mood for...</p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-20"
        >
          <div className="relative mx-auto max-w-2xl">
            <Search
              className={`absolute left-5 top-1/2 size-5 -translate-y-1/2 transition-colors ${
                isInputFocused ? 'text-purple' : 'text-white/40'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Como você quer se sentir?"
              className={`w-full rounded-2xl border-2 bg-white/5 py-5 pl-14 pr-5 text-white backdrop-blur-[10px] transition-all placeholder:italic placeholder:text-white/40 focus:outline-none focus:ring-0 ${
                isInputFocused ? 'border-purple' : 'border-white/10'
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSearch()}
              disabled={isLoading || !hasLoaded}
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-linear-to-br from-violet-500 to-pink-500 px-6 py-3 text-white transition-all ${
                isLoading || !hasLoaded
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer opacity-100'
              }`}
            >
              {isLoading ? 'Carregando...' : 'Buscar'}
            </motion.button>
          </div>
          {error && (
            <p className="mt-3 text-center text-sm text-red-300">{error}</p>
          )}
        </motion.div>

        {/* Recommendations */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-purple/30 to-transparent" />
            <h2 className="text-sm uppercase tracking-wider text-white/50">
              Para você
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-transparent via-purple/30 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {visibleMovies.map((movie, index) => (
              <motion.div
                key={movie.imdb_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.06 }}
                className="group cursor-pointer"
              >
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  <motion.img
                    src={getPosterUrl(movie.imdb_id)}
                    alt={movie.title}
                    className="aspect-2/3 w-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 ${moodOverlayClasses[index % moodOverlayClasses.length]}`}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs italic text-white backdrop-blur-sm">
                        {movie.tags.split(',')[0]?.trim() || 'movie'}
                      </div>
                      <div className="mb-1 text-xs text-white/90">
                        {movie.split} • {movie.synopsis_source}
                      </div>
                      <div className="text-sm text-white line-clamp-2">
                        {movie.plot_synopsis}
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="line-clamp-2 text-sm text-white/80">
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {movie.title}
                  </a>
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
