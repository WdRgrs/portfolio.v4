<template>
  <div 
    class="location-card"
    :class="`location-card--${location.type}`"
  >
    <!-- Photo Section -->
    <div class="photo-viewer">
      <BaseImage v-if="location.image"
        :asset="location.image"
        object-fit="fill"
      />
        <!-- :width="currentPhoto.width"
        :height="currentPhoto.height"
        class="photo-main" -->
    </div>



    <div class="card-content">
      <div class="card-badge">
        <Icon name="wrench" size="sm" />
        <span>Stick</span>
      </div>

      <!-- Location Name -->
      <h3 class="card-title">{{ location.name }}</h3>


      <!-- Project Name -->
      <!-- <p v-if="location.project" class="card-project">
        {{ location.project }}
      </p> -->

      <!-- Details -->
      <p class="card-details">{{ location.description }}</p>

      <!-- Tags -->
      <div v-if="location.tags && location.tags.length" class="card-tags">
        <span
          v-for="tag in location.tags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseImage from '@/components/media/BaseImage.vue'
import Icon from '@/components/app/Icon.vue'
// import type { MapLocation } from '@/assets/welding'
import type { WeldingLocation } from '@/types/assets'


interface Props {
  location: WeldingLocation
}

const props = defineProps<Props>()
const emit = defineEmits<{
  photoChange: []
}>()

const currentPhotoIndex = ref(0)

// const currentPhoto = computed(() => props.location.photos[currentPhotoIndex.value])

const selectPhoto = (index: number) => {
  currentPhotoIndex.value = index
  emit('photoChange')
}

// Reset photo index when location changes
watch(() => props.location.id, () => {
  currentPhotoIndex.value = 0
})
</script>

<style scoped lang="scss">
.location-card {
  background: var(--color-surface-2);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;

  &--work {
    border-color: var(--color-primary);
  }

  &--art {
    border-color: var(--color-accent);
  }
}

.card-photos {
  position: relative;
  width: 100%;
}

.photo-viewer {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-surface-3);
}

.photo-main {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-nav {
  position: absolute;
  bottom: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-2);
  padding: var(--space-2);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  border-radius: var(--radius-full);
}

.photo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: scale(1.2);
  }

  &--active {
    background: white;
    transform: scale(1.3);
  }
}

.card-content {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  width: fit-content;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  .location-card--work & {
    background: color-mix(in oklab, var(--color-primary) 15%, transparent);
    color: var(--color-primary);
  }

  .location-card--art & {
    background: color-mix(in oklab, var(--color-accent) 15%, transparent);
    color: var(--color-accent);
  }
}

.card-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text);
  line-height: 1.2;
}

.card-dates {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  font-weight: var(--font-medium);
}

.card-project {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text);
}

.card-details {
  font-size: var(--text-md);
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.tag {
  padding: var(--space-1) var(--space-3);
  background: var(--color-surface-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: lowercase;
}
</style>