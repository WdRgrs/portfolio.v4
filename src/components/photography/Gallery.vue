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
        <div class="photo-gallery__image">
          {{ idx + 1 }}
        </div>
        <BaseImage
          :asset="series.data.coverImage"
          object-fit="fill"
          lazy-load
          aspect-ratio="auto"
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
import { ref, computed, onMounted } from 'vue'
import BaseImage from '@/components/media/BaseImage.vue'
import Lightbox from '@/components/media/Lightbox.vue'
import type { ImageAsset, PhotoSeries } from '@/types/assets'
import { PHOTOGRAPHY_SERIES } from '@/assets/photography'

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
    border: 1px solid rgba(255, 0, 0, 0.234);
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
    gap: var(--space-2);
    max-width: 1400px;
    aspect-ratio: 1 / 1;
    width: 100%;

    @include laptop {
      // max-width: 1200px;
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
    position: absolute;
    z-index: 23 ;
    text-align: center;
    align-items: center;
    font-size: 4rem;
    color: red;
    width: 100%;
    height: 100%;
    // display: block;
    // object-fit: cover;
    margin: 0;
    padding: 0;
    // border: none;
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