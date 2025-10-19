<template>
  <div class="map-layout">
    <MapContainer
      :locations="locations"
      :current-index="currentIndex"
      :is-playing="isPlaying"
      :progress="progress"
      :show-progress="showProgress"
      @navigate="handleNavigate"
      @toggle-play="togglePlay"
    />

    <LocationCard
      v-if="currentLocation"
      :location="currentLocation"
      @photo-change="handlePhotoChange"
    />
  </div>

  <LocationCarousel
    :locations="locations"
    :current-index="currentIndex"
    @select="jumpToLocation"
  />
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted } from 'vue'
import MapContainer from '@/components/welding/MapContainer.vue'
import LocationCard from '@/components/welding/LocationCard.vue'
import LocationCarousel from '@/components/welding/LocationCarousel.vue'
import { WELDING_LOCATIONS } from '@/assets/wedling/locations'
import { MAP_CONFIG } from '@/assets/wedling/config'

const currentIndex = ref(0)
const isPlaying = ref(MAP_CONFIG.autoPlay)
const progress = ref(0)

let animationTimer: number | null = null
let progressTimer: number | null = null

const locations = WELDING_LOCATIONS
const showProgress = MAP_CONFIG.showProgress

const currentLocation = computed(() => locations[currentIndex.value])

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

  const interval = 50
  const increment = (interval / MAP_CONFIG.locationDuration) * 100

  progressTimer = window.setInterval(() => {
    if (progress.value >= 100) {
      progress.value = 0
    } else {
      progress.value += increment
    }
  }, interval)
}

const handlePhotoChange = () => {
  if (isPlaying.value) {
    pauseAnimation()
  }
}

onMounted(() => {
  startAnimation()
})

onUnmounted(() => {
  pauseAnimation()
})
</script>

<style scoped lang="scss">
.map-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  
  @include tablet {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  @include mobile {
    gap: var(--space-3);
  }
}
</style>