<template>
  <div class="photo-gallery">
    <div class="photo-gallery__grid">
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
          :lazy-load="true"
          aspect-ratio="auto"
          class="photo-gallery__image"
        />
        
        <!-- Series indicator badge -->
        <div v-if="series.data.images.length > 1" class="photo-gallery__series-badge">
          <span>{{ series.data.images.length }}</span>
        </div>
      </div>
    </div>
    
    <!-- Lightbox shows images from selected series -->
    <Lightbox
      v-if="activeSeries !== null"
      :images="gallerySeries[activeSeries].data.images"
      :current-index="lightboxIndex"
      :series-info="gallerySeries[activeSeries].data"
      @close="closeLightbox"
      @navigate="lightboxIndex = $event"
    />  
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseImage from '@/components/media/BaseImage.vue'
import Lightbox from '@/components/media/Lightbox.vue'
import type { ImageAsset, PhotoSeries } from '@/types/assets'
import { TEMP_PHOTOGRAPHY_SERIES } from '@/assets/photography'

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

const SERIES_MAP: Record<number, PhotoSeries> = {
  1: TEMP_PHOTOGRAPHY_SERIES[0],
  2: TEMP_PHOTOGRAPHY_SERIES[1],
  3: TEMP_PHOTOGRAPHY_SERIES[2],
  4: TEMP_PHOTOGRAPHY_SERIES[3],
  5: TEMP_PHOTOGRAPHY_SERIES[4],
  6: TEMP_PHOTOGRAPHY_SERIES[0],
  7: TEMP_PHOTOGRAPHY_SERIES[1],
  8: TEMP_PHOTOGRAPHY_SERIES[2],
  9: TEMP_PHOTOGRAPHY_SERIES[3],
  10: TEMP_PHOTOGRAPHY_SERIES[4],
  11: TEMP_PHOTOGRAPHY_SERIES[0],
  12: TEMP_PHOTOGRAPHY_SERIES[1],
  13: TEMP_PHOTOGRAPHY_SERIES[2],
  14: TEMP_PHOTOGRAPHY_SERIES[3],
  15: TEMP_PHOTOGRAPHY_SERIES[4],
  16: TEMP_PHOTOGRAPHY_SERIES[0],
}

// Combine layout with series data
const gallerySeries = computed<GallerySeries[]>(() => {
  return GALLERY_LAYOUT.map(layout => ({
    id: `series-${layout.id}`,
    layout,
    data: SERIES_MAP[layout.id]
  }))
})

// Lightbox state
const activeSeries = ref<number | null>(null)
const lightboxIndex = ref(0)

function openLightbox(seriesIndex: number) {
  activeSeries.value = seriesIndex
  lightboxIndex.value = 0 
}

function closeLightbox() {
  activeSeries.value = null
  lightboxIndex.value = 0
}
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
}
.photo-gallery__series-badge {
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
</style>