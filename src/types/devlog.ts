import type { Component } from 'vue'
import type { ImageAsset } from './assets'
import type { RepoStats } from '@/stores/github'

export type ProjectType = 'project' | 'research' | 'wip' | 'web' | 'game' | 'ops'

export interface DevLogEntryConfig {
  id: string
  component: Component
  title: string
  date: string
  types: ProjectType[]
  tags: string[]
  readTime: number
  icon?: ImageAsset
  repoId?: string
  featured?: boolean // TODO ??
  defaultExpanded?: boolean
}

export interface DevLogFilter {
  value: ProjectType | 'all'
  label: string
  description: string
}