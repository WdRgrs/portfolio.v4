<template>
  <div class="art-grid">
    <div
      v-for="(image, index) in images"
      :key="image.id"
      class="art-item"
      @click="() => openLightbox(index)"
    >
      <BaseImage
        :asset="image"
        object-fit="cover"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseImage from '@/components/media/BaseImage.vue'
import type { ImageAsset } from '@/types/assets'

interface Props {
  images: ImageAsset[]
}

defineProps<Props>()

const openLightbox = (index: number) => {
  console.log('Open lightbox at index:', index)
}
</script>

<style scoped lang="scss">
.art-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);

  @include mobile {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-3);
  }
}

.art-item {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
    
    :deep(.base-image__img) {
      transform: scale(1.05);
    }
  }
  
  :deep(.base-image__img) {
    transition: transform 0.3s ease;
  }
}
</style>