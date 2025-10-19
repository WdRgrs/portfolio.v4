<template>
  <div>
    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter"
        class="filter-button"
        :class="{ 'filter-button--active': activeFilter === filter }"
        @click="() => activeFilter = filter"
      >
        {{ filter }}
      </button>
    </div>
    
    <div class="gallery-grid">
      <div
        v-for="(image, idx) in filteredImages"
        :key="image.id"
        class="gallery-item"
        @click="() => openLightbox(idx)"
      >
        <BaseImage
          :asset="image"
          object-fit="cover"
        />
        
        <div class="gallery-item__overlay">
          <div class="gallery-item__tags">
            <span
              v-for="tag in image.tags"
              :key="tag"
              class="gallery-item__tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Lightbox
      v-if="lightboxIndex !== null"
      :images="filteredImages"
      :current-index="lightboxIndex"
      @close="closeLightbox"
      @navigate="lightboxIndex = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseImage from '@/components/media/BaseImage.vue'
import Lightbox from '@/components/media/Lightbox.vue'
import type { ImageAsset } from '@/types/assets'

interface Props {
  images: ImageAsset[]
}

const props = defineProps<Props>()

const activeFilter = ref<string>('All')
const lightboxIndex = ref<number | null>(null)

const filters = computed(() => {
  const tags = new Set<string>(['All'])
  props.images.forEach(image => {
    image.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

const filteredImages = computed(() => {
  if (activeFilter.value === 'All') {
    return props.images
  }
  return props.images.filter(image => 
    image.tags?.includes(activeFilter.value)
  )
})

function openLightbox(index: number) {
  lightboxIndex.value = index
}

function closeLightbox() {
  lightboxIndex.value = null
}
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: center;
  margin-bottom: var(--space-8);
}

.filter-button {
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface-1);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: capitalize;

  &:hover {
    background: var(--color-surface-2);
    border-color: var(--color-primary);
  }

  &--active {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border-color: var(--color-primary);
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 280px;
  gap: var(--space-2);
  
  @include tablet {
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: 200px;
  }
  
  @include mobile {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 240px;
  }
}

.gallery-item {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // Varied column spans for visual interest
  &:nth-child(9n + 1) {
    grid-column: span 4;
  }
  
  &:nth-child(9n + 2) {
    grid-column: span 5;
  }
  
  &:nth-child(9n + 3) {
    grid-column: span 3;
  }
  
  &:nth-child(9n + 4) {
    grid-column: span 3;
  }
  
  &:nth-child(9n + 5) {
    grid-column: span 4;
  }
  
  &:nth-child(9n + 6) {
    grid-column: span 5;
  }
  
  &:nth-child(9n + 7) {
    grid-column: span 5;
  }
  
  &:nth-child(9n + 8) {
    grid-column: span 3;
  }
  
  &:nth-child(9n + 9) {
    grid-column: span 4;
  }

  @include tablet {
    &:nth-child(6n + 1) {
      grid-column: span 4;
    }
    
    &:nth-child(6n + 2) {
      grid-column: span 2;
    }
    
    &:nth-child(6n + 3) {
      grid-column: span 3;
    }
    
    &:nth-child(6n + 4) {
      grid-column: span 3;
    }
    
    &:nth-child(6n + 5) {
      grid-column: span 2;
    }
    
    &:nth-child(6n + 6) {
      grid-column: span 4;
    }
  }

  @include mobile {
    grid-column: span 2 !important;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    z-index: 10;

    :deep(.base-image__img) {
      transform: scale(1.05);
    }

    .gallery-item__overlay {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }
  
  :deep(.base-image) {
    width: 100%;
    height: 100%;
  }
  
  :deep(.base-image__img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      transparent 100%
    );
    display: flex;
    align-items: flex-end;
    padding: var(--space-4);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  &__tag {
    padding: var(--space-1) var(--space-2);
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    color: white;
    text-transform: capitalize;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-item {
    transition: none;
    
    &:hover {
      transform: none;
      
      :deep(.base-image__img) {
        transform: none;
      }
    }
  }
}
</style>