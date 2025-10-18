<template>
  <div 
    class="theme-group" 
    :class="{ 
      'theme-group--expanded': isExpanded,
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    role="radiogroup" 
    aria-label="Theme selection"
  >
    <button
      v-for="(opt, i) in options"
      :key="opt.value"
      class="theme-group__btn"
      :class="{ 
        'theme-group__btn--active': theme === opt.value,
        'theme-group__btn--visible': isExpanded || theme === opt.value,
      }"
      role="radio"
      type="button"
      :aria-checked="theme === opt.value"
      :tabindex="(isExpanded || theme === opt.value) ? 0 : -1"
      @click.stop="handleOptionClick(opt.value)"
      @keydown="onKeydown($event, i)"
      :ref="el => btnRefs[i] = (el as HTMLButtonElement | null)"
      :title="opt.label"
    > 
      <Icon 
        :name="opt.icon" 
        size="md"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/components/app/Icon.vue'
// import type 

type Theme = 'light' | 'auto' | 'dark'
interface ThemeOpts {
  value: Theme
  label: Theme
  icon: string
}

const STORAGE_KEY = 'theme'

const theme = ref<Theme>('auto')
const btnRefs = ref<(HTMLButtonElement | null)[]>([])
const isExpanded = ref(false)

let hoverTimeout: number | null = null

const options: ThemeOpts[] = [
  { value: 'light' as const, label: 'light', icon: 'sun' },
  { value: 'auto'  as const, label: 'auto' , icon: 'sun-moon' },
  { value: 'dark'  as const, label: 'dark' , icon: 'moon' },
]

function applyTheme(value: Theme) {
  const root = document.documentElement
  if (value === 'auto') {
    root.removeAttribute('data-theme') 
  } else {
    root.dataset.theme = value
  }
}

function persist(value: Theme) {
  localStorage.setItem(STORAGE_KEY, value)
}

function setTheme(value: Theme, save: boolean) {
  theme.value = value
  applyTheme(value)
  
  if (save) {
    persist(value)
  }
}

function handleMouseEnter() {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout) 
  }
  
  isExpanded.value = true
}

function handleMouseLeave() {
  hoverTimeout = window.setTimeout(() => {
    isExpanded.value = false
  }, 200)
}

function handleOptionClick(value: Theme) {
  if (!isExpanded.value) {
    isExpanded.value = true
    return
  }

  setTheme(value, true)
  
  isExpanded.value = false
}

function onKeydown(e: KeyboardEvent, index: number) {
  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' ']
 
  if (!keys.includes(e.key)) {
    return
  }
  e.preventDefault()

  // Expand on Enter/Space if collapsed
  if ((e.key === 'Enter' || e.key === ' ') && !isExpanded.value) {
    isExpanded.value = true
    return
  }

  const last = options.length - 1
  let nextIndex = index

  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = index === 0 ? last : index - 1
      break
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = index === last ? 0 : index + 1
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = last
      break
    case 'Enter':
    default:
      break
  }

  const next = options[nextIndex].value
  setTheme(next, true)
  btnRefs.value[nextIndex]?.focus()
}

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved === 'light' || saved === 'auto' || saved === 'dark') {
    setTheme(saved, false)
  } else {
    setTheme('auto', false)
  }
})

onBeforeUnmount(() => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
  }
})
</script>

<style scoped lang="scss">
.theme-group {
  position: relative;
  display: inline-flex;
  align-items: stretch;
  border: 1px solid var(--color-border);
  border-radius: 0.625rem;
  overflow: hidden;
  background: var(--color-surface-1);
  transition: all 0.2s ease;

  // Desktop: show only active button, expand on hover
  @media (min-width: 769px) and (hover: hover) {
    width: 2.5rem;
    cursor: pointer;

    &:hover,
    &--expanded {
      width: auto;
    }
  }

  // Tablet: show only active button, expand on click
  @include tablet {
    width: 2.5rem;
    cursor: pointer;

    &--expanded {
      width: auto;
    }
  }

  // Mobile: always show all buttons
  @include mobile {
    width: auto;
  }

  &__btn {
    appearance: none;
    border: 0;
    padding: var(--space-2) var(--space-3);
    background: transparent;
    color: var(--color-text);
    font: inherit;
    line-height: 1;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    flex-shrink: 0;
    
    // Desktop/Tablet: hide inactive buttons when collapsed
    @media (min-width: 481px) {
      opacity: 0;
      width: 0;
      padding: 0;
      pointer-events: none;

      &--visible {
        opacity: 1;
        width: auto;
        padding: var(--space-2) var(--space-3);
        pointer-events: auto;
      }
    }

    // Mobile: always show all buttons
    @include mobile {
      opacity: 1;
      width: auto;
      padding: var(--space-2) var(--space-3);
      pointer-events: auto;
    }
    
    &--active {
      background: var(--color-surface-2);
      opacity: 1;
      width: auto;
      padding: var(--space-2) var(--space-3);
      pointer-events: auto;
    }

    &:focus-visible {
      outline: 2px solid var(--color-accent);
      outline-offset: -2px;
      z-index: 1;
    }

    &:hover:not(&--active) {
      background: var(--color-surface-1);
      filter: brightness(1.1);
    }

  }

  &__btn + &__btn {
    border-left: 1px solid var(--color-border);

    // Hide border when button is hidden
    @media (min-width: 481px) {
      border-left-color: transparent;
      
      &.theme-group__btn--visible {
        border-left-color: var(--color-border);
      }
    }

    @include mobile {
      border-left-color: var(--color-border);
    }
  }
}
</style>