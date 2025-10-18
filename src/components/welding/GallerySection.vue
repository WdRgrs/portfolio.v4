<template>
  <section class="gallery-section">
    <div class="container">
      <h2 class="gallery-section__heading">Gallery</h2>
      
      <!-- Filter buttons -->
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
      
      <!-- Masonry grid -->
      <div class="gallery-grid">
        <div
          v-for="image in filteredImages"
          :key="image.id"
          class="gallery-item"
          @click="() => openLightbox(image)"
        >
          <BaseImage
            :asset="image"
            objectFit="fill"
            />
            <!-- :width="image.width"
            :height="image.height"
            class="gallery-item__image" -->
          
          <!-- Tags overlay on hover -->
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseImage from '@/components/media/BaseImage.vue'
import type { ImageAsset } from '@/types/assets'

interface Props {
  images: ImageAsset[]
}

const props = defineProps<Props>()

const activeFilter = ref<string>('All')

// Extract unique tags from all images
const filters = computed(() => {
  const tags = new Set<string>(['All'])
  props.images.forEach(image => {
    image.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

// Filter images based on active filter
const filteredImages = computed(() => {
  if (activeFilter.value === 'All') {
    return props.images
  }
  return props.images.filter(image => 
    image.tags?.includes(activeFilter.value)
  )
})

const openLightbox = (image: ImageAsset) => {
  // Lightbox implementation would go here
  console.log('Open lightbox for:', image.id)
}
</script>

<style scoped lang="scss">
.gallery-section {
  padding: var(--space-8) var(--space-6);
  
  @include mobile {
    padding: var(--space-6) var(--space-4);
  }

  &__heading {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-8);
    text-align: center;
  }
}

.container {
  max-width: 1600px;
  margin: 0 auto;
}

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
  
  @include mobile {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-3);
  }
}

.gallery-item {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-md);
  cursor: pointer;
  background: var(--color-surface-2);

  &:hover {
    .gallery-item__image {
      transform: scale(1.05);
    }

    .gallery-item__overlay {
      opacity: 1;
    }
  }

  &__image {
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
</style>