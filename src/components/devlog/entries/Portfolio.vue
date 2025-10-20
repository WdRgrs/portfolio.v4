<template>
  <DevLogEntry
    :title="config.title"
    :date="config.date"
    :types="config.types"
    :tags="config.tags"
    :read-time="config.readTime"
    :logo="config.logo"
    :default-expanded="config.defaultExpanded"
    :stats="githubStats"
  >
    <p>
      This site is a work in progress. You can still visit the previous version at 
      <a href="https://v3.waderogers.dev" target="_blank" rel="noopener noreferrer">
        v3.waderogers.dev
      </a>, but it’s time for something new.
    </p>

    <p>
      I’m rebuilding the portfolio from React to Vue 3 with a stronger foundation, cleaner styling system,
      and room to grow—projects, photography, and this devlog all in one place.
    </p>

    <h4>What Changed</h4>
    <ul>
      <li><strong>Vue 3 + TypeScript</strong> — Type safety and composition make the codebase more scalable.</li>
      <li><strong>Design System</strong> — CSS tokens and SCSS mixins ensure consistency across views.</li>
      <li><strong>Theme Switching</strong> — Light and dark modes with system preference detection.</li>
      <li><strong>Unified Sections</strong> — Software, Welding, and Photography now live under one roof.</li>
      <li><strong>DevLog</strong> — A space to document builds, experiments, and progress.</li>
    </ul>

    <h4>The Plan</h4>
    <p>
      Finish.. this time for real. Add more motion, more life, and more story.
    </p>
    <p>
      The landing page needs some spark. The Software view is nearly complete but as you might've noticed: the devlog is a bit sparse. 
      Photography yearns to evolve into a proper gallery, and Welding just might feature some projects.  
      The DevLog will grow as I keep experimenting; a living, breathing document that evolves alongside the work.
    </p>

    <h4>Tech Stack</h4>
    <ul>
      <li>Vue 3 (Composition API + TypeScript)</li>
      <li>Vite for lightning-fast builds</li>
      <li>SCSS with design tokens</li>
      <li>Pinia for state management</li>
    </ul>

    <h4>Highlights</h4>
    <ul>
      <li>Mobile-first, responsive design</li>
      <li>Light and dark theme support</li>
      <li>Optimized assets and build performance</li>
    </ul>

    <template #footer>
      <button class="portfolio-btn" @click="openLink(PORTFOLIO_V4)">
        <span>⚡</span>
        <span>View v4 on GitHub</span>
      </button>
      <button class="portfolio-btn portfolio-btn--secondary" @click="openLink(PORTFOLIO_V3)">
        <span>📦</span>
        <span>View v3 (React)</span>
      </button>
      <!-- <button class="portfolio-btn portfolio-btn--live" @click="openLink(PORTFOLIO_LIVE)">
        <span>🚀</span>
        <span>Live Site</span>
      </button> -->
    </template>
  </DevLogEntry>
</template>


<script setup lang="ts">
import { computed } from 'vue'
import { useGitHubStore } from '@/stores/github'
import DevLogEntry from '@/components/devlog/Entry.vue'
import type { DevLogEntryConfig } from '@/types/devlog'

// TODO - use links
const PORTFOLIO_V4 = 'https://github.com/WdRgrs/portfolio.v4'
const PORTFOLIO_V3 = 'https://github.com/WdRgrs/portfolio.v3'
const PORTFOLIO_LIVE = 'https://waderogers.dev'

const githubStore = useGitHubStore()

const props = defineProps<{
  config: DevLogEntryConfig
}>()

const githubStats = computed(() => {
  if (!props.config.repoId) return undefined
  return githubStore.getRepoStats(props.config.repoId) ?? undefined
})

function openLink(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped lang="scss">
p {
  margin-bottom: var(--space-4);
}

a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--color-primary);
  transition: all 0.2s ease;

  &:hover {
    color: var(--color-accent);
    border-color: var(--color-accent);
  }
}

h4 {
  font-family: var(--font-title);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin: var(--space-5) 0 var(--space-3);
}

ul {
  list-style: disc;
  margin-left: var(--space-5);
  margin-bottom: var(--space-4);

  li {
    margin-bottom: var(--space-2);
    line-height: var(--leading-relaxed);
  }
}

.portfolio-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &--secondary {
    background: var(--color-success);
  }
}
</style>