<template>
  <figure 
    ref="containerRef"
    class="base-image"
    :class="[
      `base-image--${parsedAspectRatio}`,
      `base-image--${objectFit}`,
      { 
        'base-image--loading': !isLoaded,
        'base-image--expandable': expandable
      }
    ]"
    @click="handleImageClick"
  >
    <img
      v-show="shouldLoad"
      ref="imgRef"
      class="base-image__img"
      :src="imageSrc"
      :alt="asset.alt"
      :width="asset.width"
      :height="asset.height"
      :loading="lazyLoad ? 'lazy' : 'eager'"
      @load="handleLoad"
      @error="handleError"
    />
    
    <!-- Loading placeholder -->
    <div v-if="!isLoaded" class="base-image__placeholder">
      <div class="base-image__spinner"></div>
    </div>

    <!-- Expand indicator -->
    <div v-if="expandable" class="base-image__expand-indicator">
      <svg class="base-image__expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Optional caption -->
    <figcaption v-if="showCaption && (asset.title || asset.description)" class="base-image__caption">
      <strong v-if="asset.title">{{ asset.title }}</strong>
      <span v-if="asset.description">{{ asset.description }}</span>
    </figcaption>
  </figure>

  <!-- Expanded Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isExpanded" 
        class="base-image__modal"
        @click.self="closeModal"
      >
        <div class="base-image__modal-container">
          <button 
            class="base-image__modal-close" 
            @click="closeModal"
            aria-label="Close image modal"
          >
            ×
          </button>

          <div class="base-image__modal-content">
            <img
              class="base-image__modal-image"
              :src="imageSrc"
              :alt="asset.alt"
            />

            <div v-if="asset.title || asset.description" class="base-image__modal-info">
              <h3 v-if="asset.title" class="base-image__modal-title">
                {{ asset.title }}
              </h3>
              <p v-if="asset.description" class="base-image__modal-description">
                {{ asset.description }}
              </p>
              <div v-if="asset.date" class="base-image__modal-meta">
                <span class="base-image__modal-date">
                  {{ formatDate(asset.date) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { getAssetUrl } from '@/utils/assets'
import { formatAssetDate } from '@/utils/format'
import type { ImageAsset, AspectRatio, ObjectFit } from '@/types/assets'

interface Props {
  asset: ImageAsset
  aspectRatio?: AspectRatio
  objectFit?: ObjectFit
  lazyLoad?: boolean
  showCaption?: boolean
  expandable?: boolean  // NEW: Enable click-to-expand
}

const props = withDefaults(defineProps<Props>(), {
  objectFit: 'cover',
  lazyLoad: true,
  showCaption: false,
  expandable: false
})

const emit = defineEmits<{
  load: []
  error: [error: Event]
  expand: []  // NEW: Emit when expanded
  collapse: []  // NEW: Emit when collapsed
}>()

const containerRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const shouldLoad = ref(!props.lazyLoad)
const isExpanded = ref(false)  // NEW: Track modal state

const imageSrc = computed(() => getAssetUrl(props.asset.path))

const parsedAspectRatio = computed(() => {
  return props.aspectRatio ?? props.asset?.aspectRatio ?? '16:9'
})

// Lazy loading with Intersection Observer
if (props.lazyLoad) {
  const { stop } = useIntersectionObserver(
    containerRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        shouldLoad.value = true
        stop()
      }
    },
    {
      rootMargin: '50px'
    }
  )
}

function handleLoad() {
  isLoaded.value = true
  emit('load')
}

function handleError(error: Event) {
  console.error('Failed to load image:', props.asset.path)
  emit('error', error)
}

// NEW: Modal handlers
function handleImageClick() {
  if (props.expandable && isLoaded.value) {
    isExpanded.value = true
    document.body.style.overflow = 'hidden'
    emit('expand')
  }
}

function closeModal() {
  isExpanded.value = false
  document.body.style.overflow = ''
  emit('collapse')
}

// NEW: Keyboard handler for modal
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isExpanded.value) {
    closeModal()
  }
}

// NEW: Format date helper
function formatDate(date: string | Date | undefined) {
  if (!date) return ''
  return formatAssetDate(date)
}

onMounted(() => {
  if (!props.lazyLoad) {
    shouldLoad.value = true
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped lang="scss">
.base-image {
  position: relative;
  width: 100%;
  margin: 0;
  overflow: hidden;
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  // Expandable state
  &--expandable {
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px var(--color-shadow);
      
      .base-image__expand-indicator {
        opacity: 1;
      }
    }
  }

  // Aspect ratio enforcement
  &--16\:9 {
    aspect-ratio: 16 / 9;
  }

  &--3\:4 {
    aspect-ratio: 3 / 4;
  }

  &--1\:1 {
    aspect-ratio: 1 / 1;
  }

  &--21\:9 {
    aspect-ratio: 21 / 9;
  }

  &--auto {
    aspect-ratio: auto;
  }

  &__img {
    width: 100%;
    height: 100%;
    display: block;
    transition: opacity 0.3s ease;
  }

  // Object-fit variants
  &--cover &__img {
    object-fit: cover;
  }

  &--contain &__img {
    object-fit: contain;
  }

  &--fill &__img {
    object-fit: fill;
  }

  &--none &__img {
    object-fit: none;
  }

  &--scale-down &__img {
    object-fit: scale-down;
  }

  &__placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    background: var(--color-surface-2);
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--color-surface-3);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  // Expand indicator
  &__expand-indicator {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    width: 32px;
    height: 32px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: var(--radius-sm);
    display: grid;
    place-items: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: 1;
  }

  &__expand-icon {
    width: 20px;
    height: 20px;
    color: white;
  }

  &__caption {
    padding: var(--space-3) var(--space-4);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    background: var(--color-surface-1);

    strong {
      display: block;
      margin-bottom: var(--space-1);
      font-weight: var(--font-semibold);
      color: var(--color-text);
    }

    span {
      display: block;
      line-height: var(--leading-relaxed);
    }
  }

  // Loading state
  &--loading &__img {
    opacity: 0;
  }

  // Modal styles
  &__modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(4px);
    z-index: var(--z-modal);
    display: grid;
    place-items: center;
    padding: var(--space-6);
    overflow-y: auto;
  }

  &__modal-container {
    position: relative;
    max-width: 1400px;
    max-height: 90vh;
    width: 100%;
  }

  &__modal-close {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    z-index: calc(var(--z-modal) + 1);
    width: 48px;
    height: 48px;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-sm);
    color: white;
    font-size: var(--text-3xl);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.95);
      border-color: rgba(255, 255, 255, 0.4);
    }
  }

  &__modal-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  &__modal-image {
    width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: var(--radius-lg);
  }

  &__modal-info {
    padding: var(--space-5);
    background: rgba(0, 0, 0, 0.6);
    border-radius: var(--radius-md);
  }

  &__modal-title {
    font-family: var(--font-title);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: white;
    margin: 0 0 var(--space-3);
  }

  &__modal-description {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }

  &__modal-meta {
    margin-top: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  &__modal-date {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: rgba(255, 255, 255, 0.7);
  }
}

// Modal transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
  
  .base-image__modal-container {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  
  .base-image__modal-container {
    transform: scale(0.9);
    opacity: 0;
  }
}

// Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .base-image {
    &__img,
    &__spinner,
    &__expand-indicator {
      animation: none;
      transition: none;
    }
  }
  
  .modal-enter-active,
  .modal-leave-active {
    transition: none;
    
    .base-image__modal-container {
      transition: none;
      transform: none;
    }
  }
}
</style>