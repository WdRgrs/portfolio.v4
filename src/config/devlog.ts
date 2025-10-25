import type { DevLogEntryConfig, DevLogFilter } from '@/types/devlog'
import { ALPHABITS_LOGO, PIHOLE_LOGO, PORTFOLIO_LOGO } from '@/assets/software'
import Portfolio from '@/components/devlog/entries/Portfolio.vue'
import Alphabits from '@/components/devlog/entries/Alphabits.vue'
import PiHole from '@/components/devlog/entries/PiHole.vue'
import n8n from '@/components/devlog/entries/n8n.vue'

export const DEVLOG_ENTRIES: DevLogEntryConfig[] = [
  {
    id: 'portfolio-2025',
    component: Portfolio,
    title: 'Updating the Portfolio',
    date: '2025-10-08',
    types: ['project', 'wip', 'web'],
    tags: ['Vue', 'TypeScript', 'SCSS'],
    readTime: 2,
    logo: PORTFOLIO_LOGO,
    repoId: 'WdRgrs/portfolio.v4',
    featured: true
  },
  {
    id: 'portfolio-2025',
    component: n8n,
    title: 'n8n Job Aggregation Workflow',
    date: '2025-10-23',
    types: ['project', 'research', 'ops'],
    tags: ["n8n","docker", "automation", "home lab"],
    readTime: 2,
    // logo: PORTFOLIO_LOGO,
    featured: true
  },
  {
    id: 'alphabits-2025',
    component: Alphabits,
    title: 'Building Alphabits in Rust',
    date: '2025-04-15',
    types: ['game', 'project', 'research'],
    tags: ['Rust', 'WebAssembly', 'Game Dev'],
    readTime: 6,
    logo: ALPHABITS_LOGO,
    defaultExpanded: false,
    repoId: 'WdRgrs/alphabits'
  },
  {
    id: 'pihole-2025',
    component: PiHole,
    title: 'Exploring the Home Network with Pi-hole',
    date: '2024-12-30',
    types: ['research', 'project', 'ops'],
    tags: ['Raspberry Pi', 'Networking', 'DNS', 'Linux'],
    readTime: 4,
    logo: PIHOLE_LOGO,
    defaultExpanded: false,
    repoId: undefined,
  }
]

export const DEVLOG_FILTERS: DevLogFilter[] = [
  { value: 'all', label: 'All', description: 'Show all devlog entries' },
  { value: 'project', label: 'Projects', description: 'Finished or mostly finished projects' },
  { value: 'research', label: 'Research', description: 'Learning experiments and explorations' },
  { value: 'wip', label: 'WIP', description: 'Active projects under development' },
  { value: 'web', label: 'WebDev', description: 'Web applications and sites' },
  { value: 'game', label: 'GameDev', description: 'Game development and related tools' },
  { value: 'ops', label: 'DevOps', description: 'System administration and DevOps' },
]

// sort by date (newest first)
export function getSortedEntries() {
  return [...DEVLOG_ENTRIES].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
