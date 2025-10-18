<template>
  <section class="map-section">
    <div class="container">
      <h2 class="map-section__heading">The Journey</h2>
      <!-- <p class="map-section__intro">on the road again</p> -->
        
      <div class="map-layout">
        <!-- Map with Controls -->
        <MapContainer
          :locations="locations"
          :current-index="currentIndex"
          :is-playing="isPlaying"
          :progress="progress"
          :show-progress="showProgress"
          @navigate="handleNavigate"
          @toggle-play="togglePlay"
        />

        <!-- Location Details Card -->
        <LocationCard
          v-if="currentLocation"
          :location="currentLocation"
          @photo-change="handlePhotoChange"
        />
      </div>

      <!-- Location Navigation Carousel -->
      <LocationCarousel
        :locations="locations"
        :current-index="currentIndex"
        @select="jumpToLocation"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue'
import MapContainer from '@/components/welding/MapContainer.vue'
import LocationCard from '@/components/welding/LocationCard.vue'
import LocationCarousel from '@/components/welding/LocationCarousel.vue'
import { WELDING_LOCATIONS } from '@/assets/wedling/locations'
import {  MAP_CONFIG } from '@/assets/wedling/config'

const currentIndex = ref(0)
const isPlaying = ref(MAP_CONFIG.autoPlay)
const progress = ref(0)

let animationTimer: number | null = null
let progressTimer: number | null = null

const locations = WELDING_LOCATIONS
const showProgress = MAP_CONFIG.showProgress

const currentLocation = computed(() => locations[currentIndex.value])

// Navigation handlers
const handleNavigate = (direction: 'prev' | 'next') => {
  pauseAnimation()
  
  if (direction === 'next') {
    currentIndex.value = (currentIndex.value + 1) % locations.length
  } else {
    currentIndex.value = currentIndex.value === 0 
      ? locations.length - 1 
      : currentIndex.value - 1
  }
}

const jumpToLocation = (index: number) => {
  pauseAnimation()
  currentIndex.value = index
}

const togglePlay = () => {
  if (isPlaying.value) {
    pauseAnimation()
  } else {
    startAnimation()
  }
}

// Animation logic
const startAnimation = () => {
  isPlaying.value = true
  progress.value = 0
  scheduleNextLocation()
  startProgressBar()
}

const pauseAnimation = () => {
  isPlaying.value = false
  
  if (animationTimer) {
    clearTimeout(animationTimer)
    animationTimer = null
  }
  
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  
  progress.value = 0
}

const scheduleNextLocation = () => {
  if (!isPlaying.value) return
  animationTimer = window.setTimeout(() => {
    if (isPlaying.value) {
      handleNavigate('next')
      
      // Continue looping or stop at end
      if (MAP_CONFIG.loop || currentIndex.value < locations.length - 1) {
        startAnimation()
      } else {
        isPlaying.value = false
      }
    }
  }, MAP_CONFIG.locationDuration)
}

const startProgressBar = () => {
  if (!showProgress) return

  const interval = 50 // Update every 50ms
  const increment = (interval / MAP_CONFIG.locationDuration) * 100

  progressTimer = window.setInterval(() => {
    if (progress.value >= 100) {
      progress.value = 0
    } else {
      progress.value += increment
    }
  }, interval)
}

// When user manually changes photos, pause animation
const handlePhotoChange = () => {
  if (isPlaying.value) {
    pauseAnimation()
  }
}

onMounted(() => {
  startAnimation()
})
// Cleanup
onUnmounted(() => {
  pauseAnimation()
})
</script>

<style scoped lang="scss">
.map-section {
  padding: var(--space-8) var(--space-6);
  background: var(--color-surface-2);
  
  @include mobile {
    padding: var(--space-6) var(--space-4);
  }

  &__heading {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-4);
    text-align: center;
  }

  &__intro {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    text-align: center;
    margin-bottom: var(--space-12);
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.map-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  order: 2;
  @include tablet {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: var(--space-4);
    // order: 1;
  }
  
  @include mobile {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: var(--space-3);
    // order: 1;
  }
}

</style>