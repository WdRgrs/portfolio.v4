<template>
  <div class="story-blocks">
    <article
      v-for="(block, index) in blocks"
      :key="index"
      class="story-block"
      :class="`story-block--${block.imagePosition}`"
    >
      <div class="story-block__image">
        <BaseImage :asset="block.image" />
      </div>
      
      <div class="story-block__content">
        <h3 class="story-block__title">{{ block.title }}</h3>
        <p class="story-block__description">{{ block.description }}</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import BaseImage from '@/components/media/BaseImage.vue'
import type { ImageAsset } from '@/types/assets'

interface StoryBlock {
  title: string
  description: string
  image: ImageAsset
  imagePosition: 'left' | 'right'
}

interface Props {
  blocks: StoryBlock[]
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.story-blocks {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);

  @include mobile {
    gap: var(--space-12);
  }
}

.story-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: center;

  @include tablet {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }

  &--right {
    .story-block__image {
      order: 2;
    }
    
    @include tablet {
      .story-block__image {
        order: 1;
      }
    }
  }

  &__image {
    position: relative;
    aspect-ratio: 3 / 2;
    overflow: hidden;
    border-radius: var(--radius-lg);
    
    :deep(.base-image__img) {
      transition: transform 0.3s ease;
    }

    &:hover :deep(.base-image__img) {
      transform: scale(1.05);
    }
  }

  &__content {
    padding: var(--space-4);
  }

  &__title {
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-4);
    color: var(--color-primary);
  }

  &__description {
    font-size: var(--text-lg);
    line-height: 1.6;
    color: var(--color-text-secondary);
  }
}
</style>