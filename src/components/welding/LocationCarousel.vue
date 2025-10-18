<template>
  <div class="carousel-wrapper">
    <div ref="carouselContainer" class="location-carousel">
      <button
        v-for="(location, index) in locations"
        :key="location.id"
        @click="handleSelect(index)"
        class="carousel-item"
        :class="{ 
          'carousel-item--active': currentIndex === index,
          [`carousel-item--${location.type}`]: true
        }"
      >
        <Icon :name="location.type === 'art' ? 'hammer' : 'briefcase'" size="sm" />
        <span class="carousel-item__name">{{ location.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import Icon from '@/components/app/Icon.vue'
import type { WeldingLocation } from '@/types/assets'


interface Props {
  locations: WeldingLocation[]
  currentIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [index: number]
}>()

const carouselContainer = ref<HTMLElement>()

const handleSelect = (index: number) => {
  emit('select', index)
}

// Auto-scroll active item into view when currentIndex changes
watch(() => props.currentIndex, async () => {
  await nextTick()
  
  if (!carouselContainer.value) return

  const activeButton = carouselContainer.value.querySelector('.carousel-item--active') as HTMLElement
  
  if (activeButton) {
    // Use scrollLeft instead of scrollIntoView to prevent page scroll
    const container = carouselContainer.value
    const buttonLeft = activeButton.offsetLeft
    const buttonWidth = activeButton.offsetWidth
    const containerWidth = container.offsetWidth
    const currentScroll = container.scrollLeft
    
    // Calculate the position to center the button
    const targetScroll = buttonLeft - (containerWidth / 2) + (buttonWidth / 2)
    
    // Smooth scroll the container only (won't affect page scroll)
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }
})
</script>

<style scoped lang="scss">
.carousel-wrapper {
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
    pointer-events: none;
    z-index: 1;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, var(--color-surface-1), transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, var(--color-surface-1), transparent);
  }
}

.location-carousel {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  padding: var(--space-4) var(--space-2);
  scroll-behavior: smooth;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @include mobile {
    gap: var(--space-2);
  }
}

.carousel-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface-2);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: var(--color-surface-3);
    border-color: var(--color-primary);
  }

  &--active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-inverse);
    transform: scale(1.05);
  }

  &--work:not(&--active) {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &--art:not(&--active) {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &__name {
    @include mobile {
      display: none;
    }
  }

  &--active &__name {
    @include mobile {
      display: inline;
    }
  }
}
</style>