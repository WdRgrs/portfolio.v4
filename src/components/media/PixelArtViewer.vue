
<template>
  <figure class="pixel-art-viewer">
    <canvas
      ref="canvasRef"
      :width="displayWidth"
      :height="displayHeight"
      :aria-label="asset.alt"
    />

    <figcaption v-if="caption && (asset.title || asset.description)">
      <h3 v-if="asset.title">{{ asset.title }}</h3>
      <p v-if="asset.description">{{ asset.description }}</p>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import type { PixelAsset } from '@/types/assets'
import { getAssetUrl } from '@/utils/assets';

const props = defineProps<{
  asset: PixelAsset
  playing?: boolean
  caption?: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const currentFrame = ref(0)
let animationTimer: number | null = null
const spriteSheet = new Image()

const animation = computed(() => {
  if (!props.asset.defaultAnimation || !props.asset.animations) return null
  return props.asset.animations[props.asset.defaultAnimation]
})

const displayWidth = computed(() => props.asset.frameWidth * (props.asset.scale || 1))
const displayHeight = computed(() => props.asset.frameHeight * (props.asset.scale || 1))

onMounted(() => {
  spriteSheet.src = getAssetUrl(props.asset.path)
  spriteSheet.onload = () => {
    drawFrame(0)
    if (props.playing !== false && animation.value) {
      startAnimation()
    }
  }
})

onBeforeUnmount(() => {
  stopAnimation()
})

function drawFrame(frameIndex: number) {
  if (!canvasRef.value) return
  
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return
  
  // Calculate source position on sprite sheet
  const col = frameIndex % props.asset.columns
  const row = Math.floor(frameIndex / props.asset.columns)
  const sx = col * props.asset.frameWidth
  const sy = row * props.asset.frameHeight
  
  // Clear and draw
  ctx.clearRect(0, 0, displayWidth.value, displayHeight.value)
  ctx.imageSmoothingEnabled = false // Critical for pixel art
  ctx.drawImage(
    spriteSheet,
    sx, sy, props.asset.frameWidth, props.asset.frameHeight,
    0, 0, displayWidth.value, displayHeight.value
  )
}

function startAnimation() {
  if (!animation.value) return
  
  let frameIdx = 0
  animationTimer = window.setInterval(() => {
    const frame = animation.value!.frames[frameIdx]
    drawFrame(frame)
    currentFrame.value = frame
    
    frameIdx++
    if (frameIdx >= animation.value!.frames.length) {
      if (animation.value!.loop) {
        frameIdx = 0
      } else {
        stopAnimation()
      }
    }
  }, animation.value.frameDuration)
}

function stopAnimation() {
  if (animationTimer !== null) {
    clearInterval(animationTimer)
    animationTimer = null
  }
}
</script>

<style scoped lang="scss">
.pixel-art-viewer {
  display: inline-block;
}

canvas {
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  background: transparent;
}

figcaption {
  margin-top: 0.5rem;
}
</style>