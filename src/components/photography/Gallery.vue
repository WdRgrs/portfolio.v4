<template>
  <div class="photo-gallery">
    <div class="photo-gallery__grid">
      <div
        v-for="photo in galleryPhotos"
        :key="photo.id"
        class="photo-gallery__frame"
        :class="`photo-gallery__frame--${photo.size}`"
        :style="{
          gridColumn: `${photo.col} / span ${photo.colSpan}`,
          gridRow: `${photo.row} / span ${photo.rowSpan}`,
        }"
        @click="expandPhoto(photo)"
      > 
      <!-- {{ photo.id }} -->
        <BaseImage
          :asset="photo.asset"
          object-fit="fill"
          :lazy-load="true"
          aspect-ratio="auto"
          class="photo-gallery__image"
        />
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="expandedPhoto" 
          class="photo-gallery__modal"
          @click.self="closeModal"
        >
          <button 
            class="photo-gallery__modal-close" 
            @click="closeModal"
            aria-label="Close image modal"
          >
            ×
          </button>

          <div class="photo-gallery__modal-content" @click.stop>
            <BaseImage
              :asset="expandedPhoto.asset"
              :lazy-load="false"
              :show-caption="true"
              class="photo-gallery__modal-image"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseImage from '@/components/media/BaseImage.vue'
import { getAssetUrl } from '@/utils/assets'
import { ALPHABITS_IMAGES } from '@/assets/software'
import type { ImageAsset } from '@/types/assets'
import { TEMP_PHOTOGRAPHY_IMAGES as PHOTOGRAPHY_IMAGES } from '@/assets/photography'

interface LayoutConfig {
  id: number
  row: number
  col: number
  rowSpan: number
  colSpan: number
  size: 'sm' | 'md' | 'lg'
}

interface GalleryPhoto extends LayoutConfig {
  asset: ImageAsset
}

// Separate layout configuration
const GALLERY_LAYOUT: LayoutConfig[] = [
  { id: 1, row: 1, col: 6, rowSpan: 1, colSpan: 2, size: 'sm' },
  { id: 2, row: 2, col: 5, rowSpan: 2, colSpan: 2, size: 'md' },
  { id: 3, row: 2, col: 7, rowSpan: 1, colSpan: 2, size: 'sm' },
  { id: 4, row: 3, col: 7, rowSpan: 3, colSpan: 4, size: 'lg' },
  { id: 5, row: 3, col: 11, rowSpan: 1, colSpan: 1, size: 'sm' },
  { id: 6, row: 4, col: 4, rowSpan: 1, colSpan: 2, size: 'sm' },
  { id: 7, row: 5, col: 3, rowSpan: 1, colSpan: 1, size: 'sm' },
  { id: 8, row: 5, col: 4, rowSpan: 4, colSpan: 3, size: 'lg' },
  { id: 9, row: 6, col: 2, rowSpan: 2, colSpan: 2, size: 'sm' },
  { id: 10, row: 6, col: 7, rowSpan: 2, colSpan: 3, size: 'md' },
  { id: 11, row: 6, col: 10, rowSpan: 1, colSpan: 2, size: 'sm' },
  { id: 12, row: 7, col: 10, rowSpan: 1, colSpan: 1, size: 'sm' },
  { id: 13, row: 8, col: 8, rowSpan: 2, colSpan: 2, size: 'md' },
  { id: 14, row: 9, col: 6, rowSpan: 1, colSpan: 2, size: 'sm' },
  { id: 15, row: 10, col: 7, rowSpan: 1, colSpan: 1, size: 'sm' },
  { id: 16, row: 4, col: 11, rowSpan: 2, colSpan: 2, size: 'sm' },
]

// Asset assignments - map layout IDs to specific images
const ASSET_MAP: Record<number, ImageAsset> = {
  1: PHOTOGRAPHY_IMAGES[0],
  2: PHOTOGRAPHY_IMAGES[9],
  3: PHOTOGRAPHY_IMAGES[5],
  4: PHOTOGRAPHY_IMAGES[1],
  5: PHOTOGRAPHY_IMAGES[8],
  6: PHOTOGRAPHY_IMAGES[2],
  7: PHOTOGRAPHY_IMAGES[6],
  8: PHOTOGRAPHY_IMAGES[14],
  9: PHOTOGRAPHY_IMAGES[3],
  10: PHOTOGRAPHY_IMAGES[4],
  11: PHOTOGRAPHY_IMAGES[10],
  12: PHOTOGRAPHY_IMAGES[12],
  13: PHOTOGRAPHY_IMAGES[11],
  14: PHOTOGRAPHY_IMAGES[13],
  15: PHOTOGRAPHY_IMAGES[7],
  16: PHOTOGRAPHY_IMAGES[16],
}

// Placeholder creator for development
function createPlaceholder(id: number): ImageAsset {
  return {
    id: `placeholder-${id}`,
    type: 'image',
    path: 'photography/videos/drone_hero_poster.jpg',
    alt: `Gallery photo ${id}`,
    title: `Photo ${id}`,
    width: 1920,
    height: 1080,
    tags: ['placeholder']
  }
}

// Combine layout with assets
const galleryPhotos = computed<GalleryPhoto[]>(() => {
  return GALLERY_LAYOUT.map(layout => ({
    ...layout,
    asset: ASSET_MAP[layout.id] || createPlaceholder(layout.id)
  }))
})

const expandedPhoto = ref<GalleryPhoto | null>(null)

function expandPhoto(photo: GalleryPhoto) {
  expandedPhoto.value = photo
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  expandedPhoto.value = null
  document.body.style.overflow = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && expandedPhoto.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
.photo-gallery {
  width: 100%;
  padding: var(--space-8) var(--space-6);
  display: flex;
  justify-content: center;
  
  @include mobile {
    padding: var(--space-5) var(--space-3);
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
    gap: var(--space-2);
    max-width: 1400px;
    aspect-ratio: 1 / 1;
    width: 100%;

    @include laptop {
      max-width: 1200px;
    }

    @include tablet {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto;
      gap: var(--space-3);
      aspect-ratio: auto;
    }

    @include mobile {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto;
      gap: var(--space-2);
      aspect-ratio: auto;
      
      .photo-gallery__frame {
        grid-column: auto !important;
        grid-row: auto !important;
        
        &--sm {
          grid-column: span 1 !important;
        }
        
        &--md,
        &--lg {
          grid-column: span 2 !important;
        }
      }
    }
  }

  &__frame {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: var(--color-surface-1);
    box-shadow: 0 2px 8px var(--color-shadow);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    padding: var(--space-1);
    margin: var(--space-1);
    background-color: var(--color-surface-1);

    @include mobile {
      aspect-ratio: 1 / 1;
    }

    &:hover {
      transform: scale(1.02) rotate(0.3deg);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    &:active {
      transform: scale(1.01);
    }
    
    // Size-specific shadows for depth
    &--sm {
      box-shadow: 0 1px 4px var(--color-shadow);
    }
    
    &--md {
      box-shadow: 0 2px 8px var(--color-shadow);
    }
    
    &--lg {
      box-shadow: 0 3px 12px var(--color-shadow);
      
      &:hover {
        transform: scale(1.015) rotate(0.2deg);
      }
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    margin: 0;
    padding: 0;
    border: none;
  }

  // Modal styles
  &__modal {
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
  }

  &__modal-close {
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

    @include mobile {
      top: var(--space-4);
      right: var(--space-4);
      width: 40px;
      height: 40px;
    }
  }

  &__modal-content {
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
  }

  &__modal-image {
    border-radius: var(--radius-lg);
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }
}

// Modal transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
  
  .photo-gallery__modal-content {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  
  .photo-gallery__modal-content {
    transform: scale(0.9);
    opacity: 0;
  }
}

// Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .photo-gallery {
    &__frame {
      transition: none;
      
      &:hover {
        transform: none;
      }
    }
  }
  
  .modal-enter-active,
  .modal-leave-active {
    transition: none;
    
    .photo-gallery__modal-content {
      transition: none;
      transform: none;
    }
  }
}
</style>