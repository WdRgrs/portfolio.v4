<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" @click.self="emit('close')">
        <button class="modal-close-btn" @click="emit('close')">×</button>
        
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
          @contextmenu.prevent
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
                @contextmenu.prevent
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
  seriesInfo?: Pick<PhotoSeries, 'title' | 'description'>
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
  // Note: .modal-overlay class comes from components.scss
  
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
      display: none;
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
    bottom: calc(var(--space-20) + var(--space-8));
    left: 50%;
    bottom: 10%;
    transform: translateX(-50%);
    background: var(--color-shadow);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    color: var(--color-text-muted);
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
      width: 100%;
      max-width: 90vw;
    }
  }

  &__prev,
  &__next {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: var(--color-surface-1);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-round);
    color: var(--color-primary);
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    width: 60px;
    height: 60px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--color-surface-3);
      border-color: var(--color-secondary);
      color: var(--color-secondary);
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
    background: var(--color-surface-2);
    color: var(--color-text-secondary);
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
    background: var(--color-shadow);
    border-radius: var(--radius-md);
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
      border-color: var(--color-info);
      
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
</style>