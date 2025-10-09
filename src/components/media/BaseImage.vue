<template>
  <figure 
    ref="containerRef"
    class="base-image"
    :class="[
      `base-image--${aspectRatio}`,
      `base-image--${objectFit}`,
      { 'base-image--loading': !isLoaded }
    ]"
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

    <!-- Optional caption -->
    <figcaption v-if="showCaption && (asset.title || asset.description)" class="base-image__caption">
      <strong v-if="asset.title">{{ asset.title }}</strong>
      <span v-if="asset.description">{{ asset.description }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { getAssetUrl } from '@/utils/assets'
import type { ImageAsset, AspectRatio, ObjectFit } from '@/types/assets'

interface Props {
  asset: ImageAsset
  aspectRatio?: AspectRatio
  objectFit?: ObjectFit
  lazyLoad?: boolean
  showCaption?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: '16:9',
  objectFit: 'cover',
  lazyLoad: true,
  showCaption: false
})

const emit = defineEmits<{
  load: []
  error: [error: Event]
}>()

const containerRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const shouldLoad = ref(!props.lazyLoad) // Load immediately if not lazy

const imageSrc = computed(() => getAssetUrl(props.asset.path))

// Lazy loading with Intersection Observer
if (props.lazyLoad) {
  const { stop } = useIntersectionObserver(
    containerRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        shouldLoad.value = true
        stop() // Stop observing once loaded
      }
    },
    {
      rootMargin: '50px' // Start loading 50px before entering viewport
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

// Preload on mount if not lazy
onMounted(() => {
  if (!props.lazyLoad) {
    shouldLoad.value = true
  }
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
}

// Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .base-image {
    &__img,
    &__spinner {
      animation: none;
      transition: none;
    }
  }
}
</style>