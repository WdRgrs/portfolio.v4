<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="lightbox" @click.self="emit('close')">
        <button class="lightbox__close" @click="emit('close')">×</button>
        
        <!-- Series title (optional) -->
        <div v-if="seriesInfo?.title" class="lightbox__series-info">
          <h3>{{ seriesInfo.title }}</h3>
          <p v-if="seriesInfo.description">{{ seriesInfo.description }}</p>
        </div>

        <!-- Main image -->
        <img 
          :src="getAssetUrl(currentImage.full || currentImage.path)"
          :alt="currentImage.alt"
          class="lightbox__image"
        />

        <!-- Image caption -->
        <div v-if="currentImage.title || currentImage.description" class="lightbox__caption">
          <strong v-if="currentImage.title">{{ currentImage.title }}</strong>
          <span v-if="currentImage.description">{{ currentImage.description }}</span>
        </div>

        <!-- Navigation (only show if multiple images) -->
        <template v-if="images.length > 1">
          <button 
            v-if="currentIndex > 0"
            class="lightbox__prev" 
            @click="navigate(-1)"
            aria-label="Previous image"
          >
            ‹
          </button>
          
          <button 
            v-if="currentIndex < images.length - 1"
            class="lightbox__next" 
            @click="navigate(1)"
            aria-label="Next image"
          >
            ›
          </button>

          <!-- Counter -->
          <div class="lightbox__counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>

          <!-- Thumbnail strip -->
          <div class="lightbox__thumbnails">
            <button
              v-for="(img, idx) in images"
              :key="img.id"
              class="lightbox__thumbnail"
              :class="{ 'lightbox__thumbnail--active': idx === currentIndex }"
              @click="emit('navigate', idx)"
            >
              <img 
                :src="getAssetUrl(img.path)"
                :alt="img.alt"
              />
            </button>
          </div>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { getAssetUrl } from '@/utils/assets'
import type { ImageAsset, PhotoSeries } from '@/types/assets'

interface Props {
  images: ImageAsset[]
  currentIndex: number
  seriesInfo?: Pick<PhotoSeries, 'title' | 'description'>  // Optional series metadata
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  navigate: [index: number]
}>()

const currentImage = computed(() => props.images[props.currentIndex])

function navigate(direction: -1 | 1) {
  const newIndex = props.currentIndex + direction
  if (newIndex >= 0 && newIndex < props.images.length) {
    emit('navigate', newIndex)
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') navigate(-1)
  if (e.key === 'ArrowRight') navigate(1)
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped lang="scss">
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: var(--z-modal);
  display: grid;
  place-items: center;
  padding: var(--space-8);
  overflow-y: auto;

  @include mobile {
    padding: var(--space-4);
  }

  &__close {
    position: fixed;
    top: var(--space-6);
    right: var(--space-6);
    z-index: calc(var(--z-modal) + 1);
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-md);
    color: white;
    font-size: var(--text-3xl);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  &__series-info {
    position: absolute;
    top: var(--space-8);
    left: var(--space-8);
    max-width: 400px;
    color: white;
    
    h3 {
      font-family: var(--font-title);
      font-size: var(--text-xl);
      margin-bottom: var(--space-2);
    }
    
    p {
      font-family: var(--font-body);
      font-size: var(--text-sm);
      opacity: 0.8;
    }

    @include mobile {
      display: none;  // Hide on mobile to save space
    }
  }

  &__image {
    max-width: 90vw;
    max-height: 70vh;
    object-fit: contain;
    border-radius: var(--radius-lg);
  }

  &__caption {
    position: absolute;
    bottom: calc(var(--space-20) + var(--space-8));  // Above thumbnails
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    color: white;
    text-align: center;
    max-width: 600px;

    strong {
      display: block;
      font-family: var(--font-title);
      font-size: var(--text-lg);
      margin-bottom: var(--space-2);
    }

    span {
      font-family: var(--font-body);
      font-size: var(--text-sm);
      opacity: 0.9;
    }

    @include mobile {
      bottom: var(--space-8);
      max-width: 90vw;
    }
  }

  &__prev,
  &__next {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    font-size: var(--text-4xl);
    width: 60px;
    height: 60px;
    border-radius: var(--radius-round);
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }

    @include mobile {
      width: 48px;
      height: 48px;
      font-size: var(--text-2xl);
    }
  }

  &__prev {
    left: var(--space-8);

    @include mobile {
      left: var(--space-4);
    }
  }

  &__next {
    right: var(--space-8);

    @include mobile {
      right: var(--space-4);
    }
  }

  &__counter {
    position: fixed;
    top: var(--space-8);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  &__thumbnails {
    position: fixed;
    bottom: var(--space-8);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--space-2);
    max-width: 90vw;
    overflow-x: auto;
    padding: var(--space-2);
    background: rgba(0, 0, 0, 0.5);
    border-radius: var(--radius-md);

    @include mobile {
      bottom: var(--space-4);
    }
  }

  &__thumbnail {
    flex-shrink: 0;
    width: 80px;
    height: 60px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    padding: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    }

    &:hover img {
      opacity: 0.9;
    }

    &--active {
      border-color: white;
      
      img {
        opacity: 1;
      }
    }

    @include mobile {
      width: 60px;
      height: 45px;
    }
  }
}

// Modal transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>