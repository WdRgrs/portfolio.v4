<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container">
      <!-- Controls Overlay -->
      <div class="map-controls">
        <button
          @click.prevent="emit('navigate', 'prev')"
          @mousedown.prevent
          class="control-btn"
          aria-label="Previous location"
          type="button"
        >
          <Icon name="chevron-left" size="md" variant="default" />
        </button>
        
        <button
          @click.prevent="emit('toggle-play')"
          @mousedown.prevent
          class="control-btn control-btn--play"
          :aria-label="isPlaying ? 'Pause' : 'Play'"
          type="button"
        >
          <Icon :name="isPlaying ? 'pause' : 'play'" size="md" variant="default" />
        </button>
        
        <button
          @click.prevent="emit('navigate', 'next')"
          @mousedown.prevent
          class="control-btn"
          aria-label="Next location"
          type="button"
        >
          <Icon name="chevron-right" size="md" variant="default" />
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress && isPlaying" class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Icon from '@/components/app/Icon.vue'
import {  MAP_CONFIG } from '@/assets/wedling/config'
import type { WeldingLocation } from '@/types/assets'

interface Props {
  locations: WeldingLocation[]
  currentIndex: number
  isPlaying: boolean
  progress: number
  showProgress: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  navigate: ['prev' | 'next']
  'toggle-play': []
}>()

const mapContainer = ref<HTMLElement>()

let map: L.Map | null = null
let currentMarker: L.Marker | null = null
let pathLine: L.Polyline | null = null

// Create marker icon
const createMarkerIcon = (type: 'work' | 'art', isActive = false) => {
  return L.divIcon({
    className: 'journey-marker',
    html: `<div class="marker-pin marker-pin--${type} ${isActive ? 'marker-pin--active' : ''}">
             <div class="marker-dot"></div>
           </div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 40]
  })
}

// Update map when currentIndex changes
watch(() => props.currentIndex, (newIndex, oldIndex) => {
  if (!map || newIndex < 0 || newIndex >= props.locations.length) return

  const location = props.locations[newIndex]
  const prevLocation = oldIndex >= 0 ? props.locations[oldIndex] : null

  // Remove old marker
  if (currentMarker) {
    currentMarker.remove()
  }

  // Add new marker with fade-in
  currentMarker = L.marker([location.lat, location.lng], {
    icon: createMarkerIcon('work', true),
    opacity: 0,
    keyboard: false,
    interactive: false
  }).addTo(map)

  setTimeout(() => {
    if (currentMarker) {
      currentMarker.setOpacity(1)
    }
  }, 300)

  // Draw animated path from previous location
  if (prevLocation) {
    const coords: [number, number][] = [
      [prevLocation.lat, prevLocation.lng],
      [location.lat, location.lng]
    ]

    if (pathLine) pathLine.remove()

    pathLine = L.polyline(coords, {
      color: location.type === 'work' ? 'var(--color-primary)' : 'var(--color-burgundy)',
      weight: 2.5,
      opacity: 0.7,
      dashArray: '8, 12',
      className: 'journey-path'
    }).addTo(map)
  }

  // Animate camera to new location
  map.flyTo([location.lat, location.lng], 5.5, {
    duration: MAP_CONFIG.transitionDuration / 1000,
    easeLinearity: 0.25,
    animate: true
  })
})

// Initialize map
onMounted(async () => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    center: [39.8283, -98.5795],
    zoom: 4,
    minZoom: 3,
    maxZoom: 7,
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: false,
    attributionControl: false,
    keyboard: false,
    boxZoom: false,
    touchZoom: false,
  })
  
  const mapStyle = {
    color: 'var(--color-secondary)',
    weight: 3,
    fillColor: 'var(--color-bg)',
    fillOpacity: 1,
  }

  const maps = [
    { id: 'us', path:'/maps/us-states.geojson', mapStyle },
    { id: 'bahamas', path:'/maps/bahamas.geojson', mapStyle: { ...mapStyle, color: 'var(--color-bg)' }},
  ]

  for (const loc of maps) {
    try {
      const res = await fetch(loc.path)
  
      if (!res.ok) {
        throw new Error(`Failed to fetch ${loc.id}: ${res.status}`)
      }
      
      const data = await res.json()
      
      L.geoJSON(data, {style: loc.mapStyle}).addTo(map!)
    } catch (error) {
      
      console.error(`Failed to load ${loc.id} GeoJSON:`, error)
    }
  }

  // Set initial location
  if (props.locations.length > 0) {
    const location = props.locations[props.currentIndex]
    
    currentMarker = L.marker([location.lat, location.lng], {
      icon: createMarkerIcon('work', true),
      keyboard: false,
      interactive: false
    }).addTo(map)

    map.setView([location.lat, location.lng], 5, { animate: false })
  }
})

// Cleanup
onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped lang="scss">
.map-wrapper {
  position: relative;
}

.map-container {
  background: transparent;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  min-height: 550px;
  position: relative;
  isolation: isolate;

  @include mobile {
    min-height: 400px;
  }

  &:deep(.leaflet-container) {
    outline: none;
    background: var(--color-surface-1);
  }

  :deep(.leaflet-map-pane) {
    pointer-events: none;
  }
}

.map-controls {
  position: absolute;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-fixed);
  display: flex;
  gap: var(--space-2);
  background: var(--color-bg);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px var(--color-shadow);
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }

  &:hover {
    background: var(--color-surface-3);
    border-color: var(--color-primary);
  }

  &--play {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border-color: var(--color-primary);

    &:hover {
      background: var(--color-secondary);
    }
  }
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.05s linear;
}
</style>

<style lang="scss">
// Global marker styles
.journey-marker {
  background: transparent;
  border: none;
  transition: opacity 0.3s ease;
}

.marker-pin {
  position: relative;
  width: 30px;
  height: 40px;
  animation: markerDrop 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 25px solid var(--color-accent);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }

  &--work::before {
    border-top-color: var(--color-primary);
  }

  &--active::before {
    animation: pulse 2s ease-in-out infinite;
  }
}

.marker-dot {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  border: 2px solid var(--color-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@keyframes markerDrop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  50% {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
  }
}

.journey-path {
  stroke-dasharray: 8, 12;
  stroke-dashoffset: 500;
  animation: drawPath 2s ease forwards;
}

@keyframes drawPath {
  to {
    stroke-dashoffset: 0;
  }
}
</style>