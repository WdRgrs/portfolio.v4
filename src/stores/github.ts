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
  size: number // KB
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

// Narrow type for contributor stats
type ContributorWeek = { w: number; a: number; d: number; c: number }
type ContributorEntry = { author: { login: string }; weeks: ContributorWeek[] }

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
const isDev = import.meta.env.DEV

const log = {
  info: (...args: any[]) => { if (isDev) console.info('[github]', ...args) },
  warn: (...args: any[]) => { if (isDev) console.warn('[github]', ...args) },
  error: (...args: any[]) => { console.error('[github]', ...args) },
}

export const useGitHubStore = defineStore('github', () => {
  let warned = false // verifies github token
  const contributions = ref<RepoContributions>({})
  const loading = ref<Record<string, boolean>>({})
  const errors = ref<Record<string, string>>({})

  // Track in-flight fetches per repoId to avoid duplicate requests
  const inflight = new Map<string, Promise<RepoStats>>()

  function parseCache(raw: string | null): RepoContributions | null {
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw)

      if (parsed && typeof parsed === 'object') {
        return parsed as RepoContributions
      }
    } catch {
      // fall through to clear
    }
    return null
  }

  function loadCache() {
    if (!isBrowser) return
    const cached = parseCache(localStorage.getItem(CACHE_KEY))
    if (cached) {
      contributions.value = cached
      log.info('cache loaded')
    } else {
      // Strip bad cache if any
      try { localStorage.removeItem(CACHE_KEY) } catch {}
    }
  }

  function saveCache() {
    if (!isBrowser) return
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(contributions.value))
    } catch (error) {
      log.error('cache save failed', error)
    }
  }

  loadCache()

  const getRepoStats = computed(() => {
    return (repoId: string): RepoStats | undefined => {
      const cached = contributions.value[repoId]
      if (!cached) return undefined
      const isExpired = Date.now() - cached.timestamp > CACHE_DURATION
      if (isExpired && import.meta.env.PROD) {
        log.warn(`cache expired ${repoId}`)
      }
      return cached.data
    }
  })

  const isLoading = computed(() => {
    return (repoId: string): boolean => loading.value[repoId] || false
  })

  const hasError = computed(() => {
    return (repoId: string): string | undefined => errors.value[repoId] || undefined
  })

  const isCached = computed(() => {
    return (repoId: string): boolean => {
      const cached = contributions.value[repoId]
      if (!cached) return false
      return Date.now() - cached.timestamp <= CACHE_DURATION
    }
  })

  const hasToken = computed(() => !!import.meta.env.VITE_GITHUB_TOKEN)

  // Memo-friendly headers. Keep dynamic read of token in case env is injected at runtime.
  function getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    }
    const token = import.meta.env.VITE_GITHUB_TOKEN
    if (token) {
      headers.Authorization = `Bearer ${token}`
    } else if (isDev) {
      // One concise reminder in dev on demand from callers
      // Avoid repeating multiple lines every request
      // Consumers can inspect `hasToken` if they care
    }
    return headers
  }

  async function fetchRepoMetadata(owner: string, repo: string) {
    const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
      headers: getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error(`repo metadata ${response.status}`)
    }
    const data = await response.json()
    return {
      stars: data.stargazers_count as number,
      forks: data.forks_count as number,
      size: data.size as number,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    }
  }

  async function fetchContributorStats(
    owner: string,
    repo: string,
    maxRetries = MAX_RETRIES
  ): Promise<ContributorEntry[]> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const response = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/stats/contributors`,
        { headers: getAuthHeaders() }
      )

      if (response.status === 202) {
        if (attempt < maxRetries - 1) {
          log.info(`stats computing ${owner}/${repo}, retry ${attempt + 1}`)
          await new Promise(r => setTimeout(r, RETRY_DELAY))
          continue
        }
        throw new Error('stats computing timeout')
      }

      if (!response.ok) {
        throw new Error(`contrib stats ${response.status}`)
      }

      return (await response.json()) as ContributorEntry[]
    }
    throw new Error('max retries reached')
  }

  async function fetchRepoStats(
    repoId: string,
    owner: string,
    repo: string,
    forceRefresh = false
  ): Promise<RepoStats> {
    if (!hasToken.value && !warned) {
      log.warn('No VITE_GITHUB_TOKEN - rate limited to 60 req/hr')
      log.info('Get token: https://github.com/settings/tokens')
      warned = true
    }
    // Use cache unless forced
    if (!forceRefresh && isCached.value(repoId)) {
      log.info(`cache hit ${repoId}`)
      return contributions.value[repoId].data
    }

    // De-dupe in-flight calls per repoId
    const existing = inflight.get(repoId)
    if (existing && !forceRefresh) return existing

    loading.value[repoId] = true
    errors.value[repoId] = ''

    const task = (async (): Promise<RepoStats> => {
      try {
        log.info(`fetch start ${repoId}`)
        const [metadata, contributorData] = await Promise.all([
          fetchRepoMetadata(owner, repo),
          fetchContributorStats(owner, repo),
        ])

        const ownerStats = contributorData.find(e => e.author?.login === owner)
        if (!ownerStats) {
          throw new Error(`no contributions for ${owner}`)
        }

        const totals = ownerStats.weeks.reduce(
          (acc, w) => {
            acc.commits += w.c
            acc.additions += w.a
            acc.deletions += w.d
            return acc
          },
          { commits: 0, additions: 0, deletions: 0 }
        )

        // Keep your approximation behavior unchanged
        const filesChangedMax = ownerStats.weeks.reduce(
          (max, w) => Math.max(max, w.a + w.d),
          0
        )

        const stats: RepoStats = {
          commits: totals.commits,
          additions: totals.additions,
          deletions: totals.deletions,
          files: Math.ceil(filesChangedMax / 10),
          stars: metadata.stars,
          forks: metadata.forks,
          size: metadata.size,
          createdAt: metadata.createdAt,
          updatedAt: metadata.updatedAt,
        }

        contributions.value[repoId] = { data: stats, timestamp: Date.now() }
        saveCache()
        log.info(`fetch ok ${repoId}`)
        return stats
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown error'
        errors.value[repoId] = msg
        log.error(`fetch error ${repoId}`, err)
        throw err
      } finally {
        loading.value[repoId] = false
        inflight.delete(repoId)
      }
    })()

    inflight.set(repoId, task)
    return task
  }

  function clearStats(repoId: string) {
    delete contributions.value[repoId]
    delete loading.value[repoId]
    delete errors.value[repoId]
    saveCache()
  }

  function clearAllStats() {
    contributions.value = {}
    loading.value = {}
    errors.value = {}
    if (isBrowser) {
      try { localStorage.removeItem(CACHE_KEY) } catch {}
    }
    log.info('cache cleared')
  }

  async function refreshRepoStats(repoId: string) {
    const [owner, repo] = repoId.split('/')
    if (!owner || !repo) throw new Error(`invalid repoId ${repoId}`)
    return fetchRepoStats(repoId, owner, repo, true)
  }

  // Dev helpers - silent until used
  if (isDev) {
    ;(window as any).__clearGitHubCache = () => clearAllStats()
    ;(window as any).__getGitHubCache = () => {
      try {
        console.table(
          Object.entries(contributions.value).map(([id, cached]) => ({
            repoId: id,
            commits: cached.data.commits,
            stars: cached.data.stars,
            forks: cached.data.forks,
            size: `${cached.data.size}KB`,
            cachedAt: new Date(cached.timestamp).toLocaleString(),
            expiresIn: `${Math.max(
              0,
              Math.round((CACHE_DURATION - (Date.now() - cached.timestamp)) / 1000 / 60)
            )}m`,
          }))
        )
      } catch {}
      return contributions.value
    }
    ;(window as any).__refreshGitHubCache = async (repoId?: string) => {
      if (repoId) {
        log.info(`refresh ${repoId}`)
        try { await refreshRepoStats(repoId); log.info(`refresh ok ${repoId}`) }
        catch (e) { log.error(`refresh error ${repoId}`, e) }
        return
      }
      const ids = Object.keys(contributions.value)
      for (const id of ids) {
        log.info(`refresh ${id}`)
        try { await refreshRepoStats(id); log.info(`refresh ok ${id}`) }
        catch (e) { log.error(`refresh error ${id}`, e) }
      }
    }
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
    clearAllStats,
  }
})
