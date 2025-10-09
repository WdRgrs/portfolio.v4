import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LINKS } from '@/constants'

const GITHUB_API = LINKS.GITHUB_API
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour
const CACHE_KEY = 'github-stats-cache'
const MAX_RETRIES = 3
const RETRY_DELAY = 2000

export interface RepoStats {
  commits: number
  additions: number
  deletions: number
  files: number
  stars: number
  forks: number
  size: number // KB - TODO - format
  createdAt: string
  updatedAt: string
}

interface CachedStats {
  data: RepoStats
  timestamp: number
}

interface RepoContributions {
  [repoId: string]: CachedStats
}

export const useGitHubStore = defineStore('github', () => {
  const contributions = ref<RepoContributions>({})
  const loading = ref<Record<string, boolean>>({})
  const errors = ref<Record<string, string>>({})

  // Load from localStorage 
  function loadCache() {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        contributions.value = JSON.parse(cached)
        console.info('Loaded GitHub cache from localStorage')
      }
    } catch (error) {
      console.error('Failed to load GitHub cache:', error)
      localStorage.removeItem(CACHE_KEY)
    }
  }

  // Save to localStorage
  function saveCache() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(contributions.value))
    } catch (error) {
      console.error('Failed to save GitHub cache:', error)
    }
  }

  // Initialize cache on store creation
  loadCache()

  // Getters
  const getRepoStats = computed(() => {
    return (repoId: string): RepoStats | undefined => {
      const cached = contributions.value[repoId]
      if (!cached) return undefined
      
      const isExpired = Date.now() - cached.timestamp > CACHE_DURATION
      if (isExpired && import.meta.env.PROD) {
        console.warn(`⚠️ Cache expired for ${repoId}`)
      }
      
      return cached.data
    }
  })

  const isLoading = computed(() => {
    return (repoId: string): boolean => {
      return loading.value[repoId] || false
    }
  })

  const hasError = computed(() => {
    return (repoId: string): string | undefined => {
      return errors.value[repoId] || undefined
    }
  })

  const isCached = computed(() => {
    return (repoId: string): boolean => {
      const cached = contributions.value[repoId]
      if (!cached) return false
      
      const isExpired = Date.now() - cached.timestamp > CACHE_DURATION
      return !isExpired
    }
  })

  // Check if token is available
  const hasToken = computed(() => {
    return !!import.meta.env.VITE_GITHUB_TOKEN
  })

  // get auth headers
  function getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }

    const token = import.meta.env.VITE_GITHUB_TOKEN
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      if (import.meta.env.DEV) {
        console.info('Using GitHub token for authenticated requests')
      }
    } else if (import.meta.env.DEV) {
      console.warn('No GitHub token found - rate limited to 60 requests/hour')
      console.info('Add VITE_GITHUB_TOKEN to .env for higher limits')
      console.info('Get token: https://github.com/settings/tokens')
    }

    return headers
  }

  // Fetch repo metadata (stars, forks, size, dates)
  async function fetchRepoMetadata(owner: string, repo: string) {
    const response = await fetch(
      `${GITHUB_API}/repos/${owner}/${repo}`,
      { headers: getAuthHeaders() }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch repo metadata: ${response.status}`)
    }

    const data = await response.json()
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      size: data.size,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  // Fetch contributor stats (commits, additions, deletions, files)
  async function fetchContributorStats(
    owner: string, 
    repo: string, 
    maxRetries = MAX_RETRIES
  ): Promise<any> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const response = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/stats/contributors`,
        { headers: getAuthHeaders() }
      )

      if (response.status === 202) {
        // Stats are being computed, wait and retry
        if (attempt < maxRetries - 1) {
          console.info(`GitHub computing stats for ${owner}/${repo}, retrying...`)
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
          continue
        }
        throw new Error('GitHub stats still computing after max retries')
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch contributor stats: ${response.status}`)
      }

      return await response.json()
    }

    throw new Error('Max retries exceeded for contributor stats')
  }

  // Main fetch function
  async function fetchRepoStats(
    repoId: string, 
    owner: string, 
    repo: string,
    forceRefresh = false
  ) {
    // Check cache first
    if (!forceRefresh && isCached.value(repoId)) {
      console.info(`Using cached stats for ${repoId}`)
      return contributions.value[repoId].data
    }

    loading.value[repoId] = true
    errors.value[repoId] = ''

    try {
      console.info(`Fetching stats for ${repoId}...`)

      // Fetch both metadata and contributor stats in parallel
      const [metadata, contributorData] = await Promise.all([
        fetchRepoMetadata(owner, repo),
        fetchContributorStats(owner, repo)
      ])

      // Find the owner's contributions
      const ownerStats = contributorData.find(
        (contributor: any) => contributor.author.login === owner
      )

      if (!ownerStats) {
        throw new Error(`No contributions found for ${owner}`)
      }

      // Calculate totals from weekly data
      const totals = ownerStats.weeks.reduce(
        (acc: any, week: any) => ({
          commits: acc.commits + week.c,
          additions: acc.additions + week.a,
          deletions: acc.deletions + week.d
        }),
        { commits: 0, additions: 0, deletions: 0 }
      )

      // Count unique files changed (this is an approximation)
      // GitHub doesn't directly provide total files, estimate from weekly data
      const filesChanged = ownerStats.weeks.reduce(
        (max: number, week: any) => Math.max(max, week.a + week.d),
        0
      )

      // Create stats object
      const stats: RepoStats = {
        commits: totals.commits,
        additions: totals.additions,
        deletions: totals.deletions,
        files: Math.ceil(filesChanged / 10), // Rough estimate: changes / avg lines per file
        stars: metadata.stars,
        forks: metadata.forks,
        size: metadata.size,
        createdAt: metadata.createdAt,
        updatedAt: metadata.updatedAt
      }

      // Store with timestamp
      contributions.value[repoId] = {
        data: stats,
        timestamp: Date.now()
      }

      // Save to localStorage
      saveCache()

      console.info(`Fetched and cached stats for ${repoId}`)
      return stats
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      errors.value[repoId] = errorMessage
      console.error(`Error fetching stats for ${repoId}:`, error)
      throw error
    } finally {
      loading.value[repoId] = false
    }
  }

  // Clear specific repo stats
  function clearStats(repoId: string) {
    delete contributions.value[repoId]
    delete loading.value[repoId]
    delete errors.value[repoId]
    saveCache()
  }

  // Clear all stats
  function clearAllStats() {
    contributions.value = {}
    loading.value = {}
    errors.value = {}
    localStorage.removeItem(CACHE_KEY)
    console.info('Cleared all GitHub stats')
  }

  // Force refresh specific repo
  async function refreshRepoStats(repoId: string) {
    const [owner, repo] = repoId.split('/')
    if (!owner || !repo) {
      throw new Error(`Invalid repoId format: ${repoId}`)
    }
    return fetchRepoStats(repoId, owner, repo, true)
  }

  // Dev helpers
  if (import.meta.env.DEV) {
    (window as any).__clearGitHubCache = () => {
      clearAllStats()
      console.info('GitHub cache cleared')
    }

    (window as any).__getGitHubCache = () => {
      console.info('Current GitHub cache:')
      console.table(
        Object.entries(contributions.value).map(([repoId, cached]) => ({
          repoId,
          commits: cached.data.commits,
          stars: cached.data.stars,
          forks: cached.data.forks,
          size: `${cached.data.size}KB`,
          cachedAt: new Date(cached.timestamp).toLocaleString(),
          expiresIn: `${Math.round((CACHE_DURATION - (Date.now() - cached.timestamp)) / 1000 / 60)}m`
        }))
      )
      return contributions.value
    }

    (window as any).__refreshGitHubCache = async (repoId?: string) => {
      if (repoId) {
        console.info(`Refreshing ${repoId}...`)
        try {
          await refreshRepoStats(repoId)
          console.info(`Refreshed ${repoId}`)
        } catch (error) {
          console.error(`Failed to refresh ${repoId}:`, error)
        }
      } else {
        console.info('Refreshing all cached repos...')
        const repoIds = Object.keys(contributions.value)
        for (const id of repoIds) {
          try {
            await refreshRepoStats(id)
            console.info(`Refreshed ${id}`)
          } catch (error) {
            console.error(`Failed to refresh ${id}:`, error)
          }
        }
      }
    }

    console.info('Dev helpers available:')
    console.info('  window.__clearGitHubCache() - Clear all cached stats')
    console.info('  window.__getGitHubCache() - Inspect current cache')
    console.info('  window.__refreshGitHubCache(repoId?) - Force refresh stats')
  }

  return {
    // State
    contributions,
    loading,
    errors,

    // Getters
    getRepoStats,
    isLoading,
    hasError,
    isCached,
    hasToken,

    // Actions
    fetchRepoStats,
    refreshRepoStats,
    clearStats,
    clearAllStats
  }
})