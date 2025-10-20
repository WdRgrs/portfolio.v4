<template>
  <div ref="containerRef" class="particles-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let animationId: number

interface ParticleData {
  velocity: THREE.Vector3
  life: number
  maxLife: number
  initialOpacity: number
}

const particleData: ParticleData[] = []

const config = {
  particleCount: 120,
  spaceSize: 100,
  minLife: 180,
  maxLife: 420,
  driftSpeed: 0.02,
}

function init() {
  const container = containerRef.value
  if (!container) return

  // Scene
  scene = new THREE.Scene()
  // scene.background = new THREE.Color(0x0a1f33)

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.position.z = 50

  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    alpha: true,
    antialias: true 
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  // Create particle system
  createParticles()

  // Handle resize
  window.addEventListener('resize', handleResize)
}

function createParticles() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(config.particleCount * 3)
  const colors = new Float32Array(config.particleCount * 3)
  const sizes = new Float32Array(config.particleCount)
  const opacities = new Float32Array(config.particleCount)

  // Color palette (cyan/blue bioluminescent)
 const colorPalette = [
    new THREE.Color(0x4a7fa8),
    new THREE.Color(0x5d8fb5),
    new THREE.Color(0x6ba8d6),
    new THREE.Color(0x85bce3),
    new THREE.Color(0x7fc9e8),
    new THREE.Color(0xe8a999),
    new THREE.Color(0xbd738a),
    new THREE.Color(0xd699bd),
    new THREE.Color(0x8a7db5),
    new THREE.Color(0x93b589),
  ]

  for (let i = 0; i < config.particleCount; i++) {
    const i3 = i * 3

    // Position
    positions[i3] = (Math.random() - 0.5) * config.spaceSize
    positions[i3 + 1] = (Math.random() - 0.5) * config.spaceSize
    positions[i3 + 2] = (Math.random() - 0.5) * config.spaceSize

    // Color
    const color = i % 5 == 0 ? colorPalette[Math.floor(Math.random() * colorPalette.length)] : colorPalette[Math.floor(Math.random() * 5)];
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    // Size
    sizes[i] = Math.random() * 15 + 1

    // Initial opacity
    opacities[i] = 0

    // Particle data
    const maxLife = config.minLife + Math.random() * (config.maxLife - config.minLife)
    particleData.push({
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * config.driftSpeed,
        (Math.random() - 0.5) * config.driftSpeed * 0.5 + 0.01,
        (Math.random() - 0.5) * config.driftSpeed
      ),
      life: Math.random() * maxLife,
      maxLife,
      initialOpacity: 0.6 + Math.random() * 0.4
    })
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
  geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))

  // Custom shader material for proper glow
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      attribute float opacity;
      
      varying vec3 vColor;
      varying float vOpacity;
      
      void main() {
        vColor = color;
        vOpacity = opacity;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vOpacity;
      
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        // Multi-layer glow for depth
        // Bright core
        float core = 1.0 - smoothstep(0.0, 0.15, dist);
        // Mid glow
        float midGlow = 1.0 - smoothstep(0.15, 0.25, dist);
        // Outer halo
        float halo = 1.0 - smoothstep(0., 0.5, dist);
        
        // Combine layers with different intensities
        float intensity = core * 2.0 + midGlow * 1.2 + halo * 0.6;
        
        // More luminous color mixing
        vec3 glowColor = vColor * (1.0 + core * 1.5);
        glowColor = mix(glowColor, vec3(1.0), core * 0.3); // white hot center
        
        float alpha = intensity * vOpacity;
        
        gl_FragColor = vec4(glowColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

function animate() {
  const positions = particles.geometry.attributes.position.array as Float32Array
  const opacities = particles.geometry.attributes.opacity.array as Float32Array
  const time = Date.now() * 0.001

  for (let i = 0; i < config.particleCount; i++) {
    const i3 = i * 3
    const data = particleData[i]

    // Update position
    positions[i3] += data.velocity.x
    positions[i3 + 1] += data.velocity.y
    positions[i3 + 2] -= data.velocity.z - .04

    // Add organic wave motion
    positions[i3] += Math.sin(time + i * 0.1) * 0.01
    positions[i3 + 1] += Math.cos(time + i * 0.15) * 0.008

    // Update life
    data.life++

    // Calculate opacity based on lifecycle
    const lifeProgress = (data.life % data.maxLife) / data.maxLife
    let opacity = 0

    if (lifeProgress < 0.2) {
      opacity = (lifeProgress / 0.2) * data.initialOpacity
    } else if (lifeProgress > 0.8) {
      opacity = ((1 - lifeProgress) / 0.2) * data.initialOpacity
    } else {
      opacity = data.initialOpacity * (0.9 + Math.sin(time * 2 + i) * 0.1)
    }

    opacities[i] = opacity

    // Wrap around boundaries
    const halfSize = config.spaceSize / 2
    if (Math.abs(positions[i3]) > halfSize) {
      positions[i3] = -Math.sign(positions[i3]) * halfSize
    }
    if (Math.abs(positions[i3 + 1]) > halfSize) {
      positions[i3 + 1] = -Math.sign(positions[i3 + 1]) * halfSize
    }
    if (Math.abs(positions[i3 + 2]) > halfSize) {
      positions[i3 + 2] = -Math.sign(positions[i3 + 2]) * halfSize
    }

    // Reset life if exceeded
    if (data.life >= data.maxLife) {
      data.life = 0
    }
  }

  particles.geometry.attributes.position.needsUpdate = true
  particles.geometry.attributes.opacity.needsUpdate = true

  // Slow camera rotation for depth
  camera.position.x = Math.sin(time * 0.05) * 5
  camera.position.y = Math.cos(time * 0.08) * 3
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

function handleResize() {
  const container = containerRef.value
  if (!container) return

  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

onMounted(() => {
  init()
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
  
  if (renderer) {
    renderer.dispose()
  }
  if (particles) {
    particles.geometry.dispose()
    if (particles.material instanceof THREE.Material) {
      particles.material.dispose()
    }
  }
})
</script>

<style scoped lang="scss">
.particles-container {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}
</style>