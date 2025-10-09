<template>
  <figure 
    ref="containerRef"
    class="base-video"
    :class="[
      `base-video--${aspectRatio}`,
      { 'base-video--loading': !isLoaded }
    ]"
  >
    <video
      v-show="shouldLoad"
      ref="videoRef"
      class="base-video__player"
      :src="videoSrc"
      :poster="posterSrc"
      :controls="controls"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :playsinline="playsinline"
      :preload="preload"
      @loadeddata="handleLoad"
      @error="handleError"
    >
      Your browser does not support the video tag.
    </video>

    <!-- Loading placeholder -->
    <div v-if="!isLoaded" class="base-video__placeholder">
      <div class="base-video__spinner"></div>
    </div>

    <!-- Optional caption -->
    <figcaption v-if="showCaption && (asset.title || asset.description)" class="base-video__caption">
      <strong v-if="asset.title">{{ asset.title }}</strong>
      <span v-if="asset.description">{{ asset.description }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { getAssetUrl } from '@/utils/assets'
import type { VideoAsset, AspectRatio } from '@/types/assets'

interface Props {
  asset: VideoAsset
  aspectRatio?: AspectRatio
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  playsinline?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  lazyLoad?: boolean
  showCaption?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: '16:9',
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
  playsinline: true,
  preload: 'metadata',
  lazyLoad: true,
  showCaption: false
})

const emit = defineEmits<{
  load: []
  error: [error: Event]
}>()

const containerRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const isLoaded = ref(false)
const shouldLoad = ref(!props.lazyLoad)

const videoSrc = computed(() => getAssetUrl(props.asset.path))
const posterSrc = computed(() => 
  props.asset.poster ? getAssetUrl(props.asset.poster) : undefined
)

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
      rootMargin: '100px' // Start loading earlier for videos
    }
  )
}

function handleLoad() {
  isLoaded.value = true
  emit('load')
}

function handleError(error: Event) {
  console.error('Failed to load video:', props.asset.path)
  emit('error', error)
}

// Pause video on reduced motion preference
onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion && videoRef.value && props.autoplay) {
    videoRef.value.pause()
  }

  if (!props.lazyLoad) {
    shouldLoad.value = true
  }
})

// Cleanup
onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.src = ''
  }
})
</script>

<style scoped lang="scss">
.base-video {
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

  &__player {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: opacity 0.3s ease;
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
  &--loading &__player {
    opacity: 0;
  }
}

// Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .base-video {
    &__player,
    &__spinner {
      animation: none;
      transition: none;
    }
  }
}
</style>