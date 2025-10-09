import type { DevLogEntryConfig, DevLogFilter } from '@/types/devlog'
import { SOFTWARE_ICONS } from '@/assets/software'
import Portfolio from '@/components/devlog/entries/Portfolio.vue'
// import Alphabits from '@/components/devlog/entries/Alphabits.vue'
// import PiHole from '@/components/devlog/entries/PiHole.vue'

export const DEVLOG_ENTRIES: DevLogEntryConfig[] = [
  {
    id: 'portfolio-2025',
    component: Portfolio,
    title: 'Updating the Portfolio',
    date: '2025-10-08',
    types: ['project', 'wip', 'web'],
    tags: ['Vue', 'TypeScript', 'SCSS'],
    readTime: 2,
    icon: SOFTWARE_ICONS[0],
    repoId: 'WdRgrs/portfolio.v4',
    featured: true
  },
  // {
  //   id: 'alphabits-2024',
  //   component: Alphabits,
  //   title: 'Building Alphabits in Rust',
  //   date: '2025-04-15',
  //   types: ['game', 'project'],
  //   tags: ['Rust', 'WebAssembly', 'Game Dev'],
  //   readTime: 4,
  //   repoId: 'WdRgrs/alphabits'
  // },
  // {
  //   id: 'pihole-2024',
  //   component: PiHole,
  //   title: 'Running Pi-hole',
  //   date: '2024-12-30',
  //   types: ['ops', 'research'],
  //   tags: ['Raspberry Pi', 'Networking', 'Ad-block'],
  //   readTime: 2
  // }
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
