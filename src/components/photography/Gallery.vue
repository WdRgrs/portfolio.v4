<template>
  <div class="photo-gallery">
    <!-- View Toggle -->
    <div class="photo-gallery__controls">
      <button 
        class="photo-gallery__toggle"
        :class="{ 'photo-gallery__toggle--active': viewMode === 'masonry' }"
        @click="viewMode = 'masonry'"
        aria-label="Masonry view"
      >
        <Icon 
          style="transform: rotate(45deg);"
          name='grip'
          size="lg"
        />
      </button>
      
      <button 
        class="photo-gallery__toggle"
        :class="{ 'photo-gallery__toggle--active': viewMode === 'grid' }"
        @click="viewMode = 'grid'"
        aria-label="Grid view"
      >
        <Icon 
          name='grip'
          size="xl"
        />
      </button>
    </div>

    <!-- Masonry View (Original - showing cover images) -->
    <div 
      v-if="viewMode === 'masonry'"
      class="photo-gallery__grid photo-gallery__grid--masonry"
    >
      <div
        v-for="(series, idx) in gallerySeries"
        :key="series.id"
        class="photo-gallery__frame"
        :class="`photo-gallery__frame--${series.layout.size}`"
        :style="{
          gridColumn: `${series.layout.col} / span ${series.layout.colSpan}`,
          gridRow: `${series.layout.row} / span ${series.layout.rowSpan}`,
        }"
        @click="openLightbox(idx)"
      > 
        <BaseImage
          :asset="series.data.coverImage"
          object-fit="fill"
          lazy-load
          aspect-ratio="auto"
        />
        
        <div v-if="series.data.images.length > 1" class="photo-gallery__series-badge">
          <span>{{ series.data.images.length }}</span>
        </div>
      </div>
    </div>

    <!-- Simple Grid View (All Images) -->
    <div 
      v-else
      class="photo-gallery__grid photo-gallery__grid--simple"
    >
      <div
        v-for="(image, idx) in allImages"
        :key="`image-${idx}`"
        class="photo-gallery__grid-item"
        @click="openImageLightbox(idx)"
      >
        <BaseImage
          :asset="image"
          object-fit="cover"
          lazy-load
          aspect-ratio="1:1"
        />
      </div>
    </div>
    
    <!-- Lightbox for Series (Masonry view) -->
    <Lightbox
      v-if="activeSeries !== null && viewMode === 'masonry'"
      :images="gallerySeries[activeSeries].data.images"
      :current-index="lightboxIndex"
      :series-info="gallerySeries[activeSeries].data"
      @close="closeLightbox"
      @navigate="lightboxIndex = $event"
    />
    
    <!-- Lightbox for Individual Images (Grid view) -->
    <Lightbox
      v-if="activeImageIndex !== null && viewMode === 'grid'"
      :images="allImages"
      :current-index="activeImageIndex"
      @close="closeImageLightbox"
      @navigate="activeImageIndex = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BaseImage from '@/components/media/BaseImage.vue'
import Lightbox from '@/components/media/Lightbox.vue'
import type { ImageAsset, PhotoSeries } from '@/types/assets'
import { PHOTOGRAPHY_SERIES } from '@/assets/photography'
import Icon from '../app/Icon.vue'

interface LayoutConfig {
  id: number
  row: number
  col: number
  rowSpan: number
  colSpan: number
  size: 'sm' | 'md' | 'lg'
}

interface GallerySeries {
  id: string
  layout: LayoutConfig
  data: PhotoSeries
}

const viewMode = ref<'masonry' | 'grid'>('masonry')

const TABLET_BREAKPOINT = 768
const MOBILE_BREAKPOINT = 480

const isMobileOrTablet = () => {
  return window.innerWidth <= TABLET_BREAKPOINT
}

const handleResize = () => {
  if (isMobileOrTablet()) {
    viewMode.value = 'grid'
  }
}

onMounted(() => {
  if (isMobileOrTablet()) {
    viewMode.value = 'grid'
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const GALLERY_LAYOUT: LayoutConfig[] = [
  { id: 1, row: 1, col: 6, rowSpan: 1, colSpan: 2, size: 'sm' },
  { id: 2, row: 2, col: 5, rowSpan: 3, colSpan: 2, size: 'md' },
  { id: 3, row: 2, col: 7, rowSpan: 1, colSpan: 2, size: 'sm' },
  { id: 4, row: 3, col: 7, rowSpan: 3, colSpan: 4, size: 'lg' },
  { id: 5, row: 4, col: 11, rowSpan: 2, colSpan: 2, size: 'md' },
  { id: 6, row: 3, col: 3, rowSpan: 2, colSpan: 2, size: 'md' },
  { id: 7, row: 5, col: 1, rowSpan: 2, colSpan: 3, size: 'md' },
  { id: 8, row: 5, col: 4, rowSpan: 3, colSpan: 3, size: 'lg' },
  { id: 9, row: 7, col: 2, rowSpan: 2, colSpan: 2, size: 'md' },
  { id: 10, row: 6, col: 7, rowSpan: 2, colSpan: 3, size: 'md' },
  { id: 11, row: 8, col: 4, rowSpan: 2, colSpan: 4, size: 'lg' },
  { id: 12, row: 6, col: 10, rowSpan: 2, colSpan: 3, size: 'md' },
  { id: 13, row: 8, col: 8, rowSpan: 2, colSpan: 3, size: 'md' },
  { id: 14, row: 10, col: 5, rowSpan: 1, colSpan: 3, size: 'md' },
  { id: 15, row: 10, col: 8, rowSpan: 2, colSpan: 1, size: 'md' },
  { id: 16, row: 11, col: 6, rowSpan: 2, colSpan: 2, size: 'md' },
]

const SERIES_MAP: Record<number, PhotoSeries> = {
  1: PHOTOGRAPHY_SERIES[0],
  2: PHOTOGRAPHY_SERIES[8],
  3: PHOTOGRAPHY_SERIES[7],
  4: PHOTOGRAPHY_SERIES[3],
  5: PHOTOGRAPHY_SERIES[13],
  6: PHOTOGRAPHY_SERIES[1],
  7: PHOTOGRAPHY_SERIES[6],
  8: PHOTOGRAPHY_SERIES[4],
  9: PHOTOGRAPHY_SERIES[5],
  10: PHOTOGRAPHY_SERIES[9],
  11: PHOTOGRAPHY_SERIES[10],
  12: PHOTOGRAPHY_SERIES[11],
  13: PHOTOGRAPHY_SERIES[12],
  15: PHOTOGRAPHY_SERIES[14],
  14: PHOTOGRAPHY_SERIES[2],
  16: PHOTOGRAPHY_SERIES[15],
}

const gallerySeries = computed<GallerySeries[]>(() => {
  return GALLERY_LAYOUT.map(layout => ({
    id: `series-${layout.id}`,
    layout,
    data: SERIES_MAP[layout.id]
  }))
})

// Flatten all images from all series
const allImages = computed<ImageAsset[]>(() => {
  const images: ImageAsset[] = []
  PHOTOGRAPHY_SERIES.forEach(series => {
    images.push(...series.images)
  })
  return images
})

// Lightbox state for series view
const activeSeries = ref<number | null>(null)
const lightboxIndex = ref(0)

// Lightbox state for grid view (individual images)
const activeImageIndex = ref<number | null>(null)

function openLightbox(seriesIndex: number) {
  activeSeries.value = seriesIndex
  lightboxIndex.value = 0 
}

function closeLightbox() {
  activeSeries.value = null
  lightboxIndex.value = 0
}

function openImageLightbox(imageIndex: number) {
  activeImageIndex.value = imageIndex
}

function closeImageLightbox() {
  activeImageIndex.value = null
}
</script>

<style scoped lang="scss">
.photo-gallery {
  width: 100%;
  padding: var(--space-8) var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @include mobile {
    padding: var(--space-5) var(--space-3);
  }

  &__controls {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
    padding: var(--space-2);
    background: var(--color-surface-1);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);

    @include tablet {
      display: none;
    }

    @include mobile {
      display: none;
    }
  }

  &__toggle {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--color-surface-2);
      color: var(--color-text);
    }

    &--active {
      background: var(--color-primary);
      color: var(--color-text-inverse);

      &:hover {
        background: var(--color-primary);
        filter: brightness(1.1);
      }
    }
  }
  
  &__grid {
    width: 100%;
    max-width: 1400px;

    &--masonry {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: repeat(12, 1fr);
      gap: var(--space-2);
      aspect-ratio: 1 / 1;

      @include tablet {
        display: none;
      }

      @include mobile {
        display: none;
      }
    }

    &--simple {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-4);
      padding: var(--space-2);

      @include tablet {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--space-3);
        max-height: none;
      }

      @include mobile {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-2);
        max-height: none;
      }

      /* Custom scrollbar */
      &::-webkit-scrollbar {
        // width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: var(--color-surface-1);
        border-radius: var(--radius-sm);
      }

      &::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: var(--radius-sm);

        &:hover {
          background: var(--color-text-muted);
        }
      }
    }
  }

  &__grid-item {
    position: relative;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: var(--color-surface-1);
    box-shadow: 0 2px 8px var(--color-shadow);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: var(--space-1);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    &:active {
      transform: translateY(-2px);
    }

    @include mobile {
      /* Ensure consistent sizing in landscape */
      min-height: 0;
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

    &:hover {
      transform: scale(1.02) rotate(0.3deg);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      z-index: 10;
    }

    &:active {
      transform: scale(1.01);
    }
    
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

  &__series-badge {
    position: absolute;
    bottom: var(--space-3);
    right: var(--space-3);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    display: flex;
    align-items: center;
    gap: var(--space-1);
    pointer-events: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .photo-gallery {
    &__frame,
    &__grid-item,
    &__toggle {
      transition: none;
      
      &:hover {
        transform: none;
      }
    }
  }
}
</style>