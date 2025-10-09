<template>
  <div
    class="devlog-entry"
    :class="{ 
      'devlog-entry--expanded': isExpanded,
      [`devlog-entry--${primaryType}`]: true
    }"
  >
    <!-- Header -->
    <div 
      class="devlog-entry__header"
      @click="toggleExpand"
    >
      <div class="devlog-entry__left">
        <img 
          v-if="icon"
          class="devlog-entry__icon"
          :src="getAssetUrl(icon.path)"
          :alt="icon.alt"
          :width="32"
          :height="32"
        />
        <div class="devlog-entry__meta">
          <h3 class="devlog-entry__title">{{ title }}</h3>
          <div class="devlog-entry__info">
            <span class="devlog-entry__date">{{ formattedDate }}</span>
            <span class="devlog-entry__separator">•</span>
            <span class="devlog-entry__readtime">{{ readTime }} min read</span>
          </div>
        </div>
      </div>
      
      <div class="devlog-entry__right">
        <div class="devlog-entry__tags">
          <span 
            v-for="tag in displayTags" 
            :key="tag"
            class="devlog-entry__tag"
          >
            {{ tag }}
          </span>
        </div>
        <button 
          class="devlog-entry__toggle" 
          :aria-label="isExpanded ? 'Collapse entry' : 'Expand entry'"
        >
          <span class="devlog-entry__arrow"></span>
        </button>
      </div>
    </div>

    <!-- Content (Expandable) -->
    <Transition name="accordion">
      <div v-if="isExpanded" class="devlog-entry__content">
        <div class="devlog-entry__body">
          <slot />
        </div>

        <!-- Footer -->
        <div v-if="hasFooter" class="devlog-entry__footer">
          <div class="devlog-entry__actions">
            <slot name="footer" />
          </div>

          <!-- GitHub Stats -->
          <div v-if="stats" class="devlog-entry__stats">
            <span v-if="stats.commits">{{ stats.commits }} commits</span>
            <span v-if="stats.additions" class="stat-additions">
              +{{ stats.additions.toLocaleString() }}
            </span>
            <span v-if="stats.deletions" class="stat-deletions">
              -{{ stats.deletions.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getAssetUrl } from '@/utils/assets'
import type { ImageAsset } from '@/types/assets'
import type { ProjectType } from '@/types/devlog'
import type { RepoStats } from '@/stores/github'

interface Stats {
  commits?: number
  additions?: number
  deletions?: number
}

interface Props {
  title: string
  date: string
  type?: ProjectType
  types?: ProjectType[]
  tags?: string[]
  readTime?: number
  icon?: ImageAsset
  stats?: Stats | RepoStats
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  readTime: 1,
  defaultExpanded: false
})

const slots = defineSlots<{
  default(): any
  footer(): any
}>()

const isExpanded = ref(props.defaultExpanded)

const primaryType = computed(() => {
  if (props.types && props.types.length > 0) {
    return props.types[0]
  }
  return props.type
})

const displayTags = computed(() => props.tags.slice(0, 3))

const hasFooter = computed(() => {
  return !!slots.footer || !!props.stats
})

// TODO - move to utils
const formattedDate = computed(() => {
  const date = new Date(props.date)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
})

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

defineExpose({
  expand: () => isExpanded.value = true,
  collapse: () => isExpanded.value = false,
  toggle: toggleExpand
})
</script>

<style scoped lang="scss">
.devlog-entry {
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;

  &--expanded {
    box-shadow: 0 4px 12px var(--color-shadow);
    
    .devlog-entry__arrow {
      transform: rotate(180deg);
    }
  }

  &--project { border-left: 3px solid var(--color-warning); }
  &--research { border-left: 3px solid var(--color-info); }
  &--wip { border-left: 3px solid var(--color-accent); }
  &--web { border-left: 3px solid var(--color-success); }
  &--game { border-left: 3px solid var(--color-violet); }
  &--ops { border-left: 3px solid var(--color-error); }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    cursor: pointer;
    user-select: none;

    @include mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
    }
  }

  &__left {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex: 1;
  }

  &__icon {
    font-size: var(--text-2xl);
    
    @include mobile {
      font-size: var(--text-xl);
    }
  }

  &__meta {
    flex: 1;
  }

  &__title {
    font-family: var(--font-title);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    margin: 0 0 var(--space-2);
    color: var(--color-text);
  }

  &__info {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  &__separator {
    opacity: 0.5;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: var(--space-3);

    @include mobile {
      width: 100%;
      justify-content: space-between;
    }
  }

  &__tags {
    display: flex;
    gap: var(--space-2);
  }

  &__tag {
    background: var(--color-surface-2);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-secondary);

    @include mobile {
      display: none;
      
      &:first-child {
        display: inline-block;
      }
    }
  }

  &__toggle {
    background: transparent;
    border: none;
    padding: var(--space-2);
    cursor: pointer;
  }

  &__arrow {
    display: inline-block;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 8px solid var(--color-text-secondary);
    transition: transform 0.3s ease;
  }

  &__content {
    border-top: 1px solid var(--color-border);
  }

  &__body {
    padding: var(--space-5);
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    
    @include mobile {
      padding: var(--space-4);
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    background: var(--color-surface-2);
    border-top: 1px solid var(--color-border);

    @include mobile {
      flex-direction: column;
      gap: var(--space-3);
      align-items: flex-start;
    }
  }

  &__actions {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  &__stats {
    display: flex;
    gap: var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);

    span {
      white-space: nowrap;
    }

    .stat-additions {
      color: var(--color-success);
    }

    .stat-deletions {
      color: var(--color-error);
    }
  }
}

// Accordion anim
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>