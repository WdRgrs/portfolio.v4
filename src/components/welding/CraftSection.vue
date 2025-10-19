<template>
  <div class="craft-grid">
    <article
      v-for="(card, index) in cards"
      :key="index"
      class="craft-card"
    >
      <div class="craft-card__image-wrapper">
        <BaseImage
          :asset="card.image"
          object-fit="cover"
          expandable
        />
        <div class="craft-card__overlay"></div>
      </div>
      
      <div class="craft-card__content">
        <h3 class="craft-card__title">{{ card.title }}</h3>
        <p class="craft-card__description">{{ card.description }}</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import BaseImage from '@/components/media/BaseImage.vue'
import type { ImageAsset } from '@/types/assets'

interface CraftCard {
  title: string
  image: ImageAsset
  description: string
}

interface Props {
  cards: CraftCard[]
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.craft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.craft-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);

    :deep(.base-image__img) {
      transform: scale(1.1);
    }

    .craft-card__overlay {
      background: rgba(0, 0, 0, 0.6);
    }
  }

  &__image-wrapper {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: var(--radius-lg);
    overflow: hidden;
    
    :deep(.base-image) {
      width: 100%;
      height: 100%;
    }
    
    :deep(.base-image__img) {
      transition: transform 0.5s ease;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: var(--color-overlay);
    transition: background 0.3s ease;
    pointer-events: none;
  }

  &__content {
    color-scheme: dark;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-6);
    z-index: 1;
    pointer-events: none;
  }

  &__title {
    font-size: var(--text-2xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-2);
    font-family: var(--font-title);
    color: var(--color-text);
    text-shadow: 0 2px 4px var(--color-shadow);
  }
  
  &__description {
    font-family: var(--font-title);
    font-size: var(--text-md);
    color: var(--color-text);
    text-shadow: 0 1px 2px var(--color-shadow);
  }
}
</style>