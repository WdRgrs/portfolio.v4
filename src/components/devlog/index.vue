<template>
  <PageSection class="devlog">
    <template #header>
      <div class="devlog__header">
        <h2 class="devlog__title">
          Dev<span>.</span>Log<span>(<strong v-show="filterType !== 'all'">{{ filterType }}</strong>)</span>
        </h2>
        
        <div class="devlog__controls">
          <button 
            v-for="filter in DEVLOG_FILTERS" 
            :key="filter.value" 
            class="devlog__filter-btn"
            :class="{ 'devlog__filter-btn--active': filterType === filter.value }" 
            :title="filter.description"
            @click="filterType = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </template>

    <div class="devlog__container">
      <TransitionGroup name="accordion-list">
        <component
          v-for="entry in filteredEntries"
          :key="entry.id"
          :is="entry.component"
          :config="entry"
        />
      </TransitionGroup>

      <div v-if="filteredEntries.length === 0" class="devlog__empty">
        <p>No entries found</p>
      </div>
    </div>
  </PageSection>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageSection from '@/components/page/Section.vue'
import { DEVLOG_FILTERS, getSortedEntries } from '@/config/devlog'
import type { ProjectType } from '@/types/devlog'

const filterType = ref<ProjectType | 'all'>('all')

const sortedEntries = getSortedEntries()

const filteredEntries = computed(() => {
  if (filterType.value === 'all') {
    return sortedEntries
  }
  return sortedEntries.filter(entry => 
    entry.types.includes(filterType.value as ProjectType)
  )
})
</script>

<style scoped lang="scss">
.devlog {
  &__header {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
  
  &__title {
    @include tablet { 
      font-size: calc(var(--text-3xl) * 1.5);
    }
    @include mobile { 
      font-size: calc(var(--text-2xl) * 1.5);
    }

    span {
      letter-spacing: var(--space-3);
      color: var(--color-warning);
    }
    
    strong {
      margin-left: var(--space-neg-3); // offset letter spacing from span
      letter-spacing: var(--space-0); 
      color: var(--color-olive);
    }
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    justify-content: flex-end;
    
    @include tablet {
      justify-content: center;
    }
    
    @include mobile {
      justify-content: center;
    }
  }

  &__filter-btn {
    padding: var(--space-2) var(--space-4);
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-surface-3);
      color: var(--color-text);
    }

    &--active {
      background: var(--color-primary);
      color: var(--color-text-inverse);
      border-color: var(--color-primary);   
    }
  }

  &__container {
    max-width: var(--max-content-width);
    margin: 0 auto;
    padding: 0 var(--space-6);
    
    @include mobile {
      padding: 0;
    }
  }

  &__empty {
    text-align: center;
    padding: var(--space-8);
    color: var(--color-text-muted);
    
    &-icon {
      font-size: 48px;
      margin-bottom: var(--space-4);
      opacity: 0.5;
    }
    
    p {
      font-family: var(--font-mono);
    }
  }
}

.accordion-list-move,
.accordion-list-enter-active,
.accordion-list-leave-active {
  transition: all 0.3s ease;
}

.accordion-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.accordion-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.accordion-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>