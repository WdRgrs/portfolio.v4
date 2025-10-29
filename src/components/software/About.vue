<template>
  <PageSection class="about" variant="default" spacing="normal">
    <template #header>
      <h2 id="about-title" class="about__title">
        <Transition name="slide-fade" mode="out-in">
          <span :key="isTldr.toString()">{{ isTldr ? 'I am ..' : 'About' }}</span>
        </Transition>
        <button 
          class="btn" 
          :class="{ 'btn--active': isTldr }" 
          @click="toggleTldr"
          aria-label="Toggle summary view"
        >
          <span>TL;DR</span>
          <span>:</span>
        </button>
      </h2>
    </template>

    <div class="about__content" :class="{ 'about__content--active': isTldr }">
      <p v-for="(text, idx) in displayContent" :key="idx">
        <span v-html="text" />
      </p>

      <Transition name="sprite-pop" appear>
        <div
          class="about__animation"
          v-show="isTldr"
          aria-hidden="true"
          :style="`filter: hue-rotate(${hueDeg}deg)`"
        >
          <PixelArtViewer :asset="treeAsset" :playing="true"  />
        </div>
      </Transition>
    </div>
  </PageSection>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import PageSection from '@/components/page/Section.vue'
import { SPRITES } from '@/assets/software'
import PixelArtViewer from '@/components/media/PixelArtViewer.vue'

const ANIMATION_DURATION_MS = 1500
const STEP_INTERVAL_MS = 200

const isTldr = ref(false)
const showTldr = ref(false)
const paragraphWords = ref<string[][]>([])
const shrinkTimers = ref<number[]>([])
const cycleInterval = ref<number | null>(null)
const cleanupTimers = ref<number[]>([])
const currentIndex = ref<number>(-1)
const totalHighlights = ref<number>(0)
let tokenEls: HTMLElement[] = []

const treeAsset = {...SPRITES[0]}

const paragraphSources = [
  `Hi! I'm Wade, [passionate] about building |things| and fueled by a [curious] tic to understand how and why they work.`,
  `My tech story begins as a [PC enthusiast] in the 56k dial-up era, when 128MB of RAM was luxurious and "your system is running low on virtual memory" was a daily notification. This early fascination led me to build PCs and eventually to code, turning curiosity into a career.`,
  `Professionally, I work full-stack but gravitate toward the frontend, a medium for expression as much as a technology. The mentor side of me enjoys [crafting] [experiences] that connect people to [ideas] in clear and engaging ways.`,
  `I'm energized by [innovation] in every form, and especially [inspired] by spatial computing. I dream of one day stepping into the metaverse, as imagined by Neal Stephenson; we're laying the groundwork today for tomorrow's technologies.`
]

const tldrPhrases = [
  `[pa][ssion][ate] & [cur][i][ous] ..`,
  `a [PC] [en][thu][si][ast] ..`,
  `crafting [ex][per][i][en][ces] & [i][dea][s] ..`,
  `[in][spi][red] by [i][n][n][o][v][a][t][i][o][n] ..`,
  `(and sometimes [making] [pixel] [art] ..)`
]

onMounted(() => {
  resetContent()
})

const hueDeg = ref(0)
function updateAnimHue() {
  hueDeg.value++
}

onUnmounted(() => {
  clearAllTimers()
})

function toggleTldr() {
  if (!isTldr.value) {
    isTldr.value = true
    startTldrAnimation()
  } else {
    isTldr.value = false
    showTldr.value = false
    stopGlowCycle()
    currentIndex.value = -1
    startExpandAnimation()
  }
}

function resetContent() {
  clearAllTimers()
  
  setInterval(updateAnimHue, 100)
  paragraphWords.value = paragraphSources.map(src => src.split(' '))
  currentIndex.value = -1
  tokenEls = []
}

function clearAllTimers() {
  shrinkTimers.value.forEach(clearInterval)
  shrinkTimers.value = []
  if (cycleInterval.value) {
    clearInterval(cycleInterval.value)
    cycleInterval.value = null
  }
  cleanupTimers.value.forEach(clearTimeout)
  cleanupTimers.value = []
}

function isBracketed(word: string): boolean {
  return word.includes('[') || word.includes(']')
}

function startTldrAnimation() {
  clearAllTimers()

  // Shrink away non-highlighted words over the duration
  paragraphWords.value.forEach((words, paragraphIndex) => {
    const wordsToRemove = words.filter(w => !isBracketed(w)).length
    if (wordsToRemove === 0) return
    const interval = ANIMATION_DURATION_MS / wordsToRemove
    const timer = window.setInterval(() => {
      removeNextNonHighlightedWord(paragraphIndex)
    }, interval)
    shrinkTimers.value.push(timer)
  })

  // After shrink completes, show TL;DR and kick off glow cycle
  window.setTimeout(async () => {
    showTldr.value = true
    await nextTick()
    indexTokensAndStart()
  }, ANIMATION_DURATION_MS)
}

function startExpandAnimation() {
  clearAllTimers()
  const fullSources = paragraphSources.map(src => src.split(' '))
  fullSources.forEach((fullWords, paragraphIndex) => {
    const wordsToAdd = fullWords.filter(w => !isBracketed(w))
    if (wordsToAdd.length === 0) {
      paragraphWords.value[paragraphIndex] = fullWords
      return
    }
    const interval = ANIMATION_DURATION_MS / wordsToAdd.length
    let progress = 0
    const timer = window.setInterval(() => {
      const result: string[] = []
      let nonHighlightedAdded = 0
      fullWords.forEach(word => {
        if (isBracketed(word)) {
          result.push(word)
        } else if (nonHighlightedAdded < progress) {
          result.push(word)
          nonHighlightedAdded++
        }
      })
      paragraphWords.value = fullSources
      paragraphWords.value[paragraphIndex] = result
      progress++
      if (progress > wordsToAdd.length) {
        clearInterval(timer)
        paragraphWords.value[paragraphIndex] = fullWords
      }
    }, interval)
    shrinkTimers.value.push(timer)
  })
}

function removeNextNonHighlightedWord(paragraphIndex: number) {
  const words = paragraphWords.value[paragraphIndex]
  const idx = words.findIndex(word => !isBracketed(word))
  if (idx !== -1) {
    const next = [...words]
    next.splice(idx, 1)
    paragraphWords.value[paragraphIndex] = next
  }
}

function indexTokensAndStart() {
  // Build global list of token elements by data-gi
  tokenEls = Array.from(document.querySelectorAll<HTMLElement>('[data-gi]'))
    .sort((a, b) => Number(a.dataset.gi) - Number(b.dataset.gi))

  totalHighlights.value = tokenEls.length
  if (totalHighlights.value === 0) return

  // Start from -1 so first step targets 0
  currentIndex.value = -1
  startGlowCycle()
}

function startGlowCycle() {
  stopGlowCycle() // safety

  cycleInterval.value = window.setInterval(() => {
    // next token in the global sequence
    currentIndex.value = (currentIndex.value + 1) % totalHighlights.value
    const el = tokenEls[currentIndex.value]
    if (!el) return

    // Add glow for full duration, then remove
    el.classList.add('highlight--glow')
    const t = window.setTimeout(() => {
      el.classList.remove('highlight--glow')
    }, ANIMATION_DURATION_MS)
    cleanupTimers.value.push(t)
  }, STEP_INTERVAL_MS)
}

function stopGlowCycle() {
  if (cycleInterval.value) {
    clearInterval(cycleInterval.value)
    cycleInterval.value = null
  }
}

function processWordsForDisplay(words: string[]): string {
  return words.map(word => {
    if (isBracketed(word)) {
      const clean = word.replace(/[\[\]]/g, '')
      return `<span class="highlight">${clean}</span>`
    }
    if (word.includes('|')) {
      const clean = word.replace(/\|/g, '')
      return `<span style="font-style: italic;">${clean}</span>`
    }
    return word
  }).join(' ')
}

function processTldrForDisplay(phrase: string, paragraphIndex: number): string {
  let localIndex = 0
  let globalOffset = 0
  for (let i = 0; i < paragraphIndex; i++) {
    const m = tldrPhrases[i].match(/\[([^\]]+)\]/g)
    globalOffset += m?.length ?? 0
  }

  return phrase.replace(/\[([^\]]+)\]/g, (match, word) => {
    const gi = globalOffset + localIndex++
    const clean = word.replace(/[\[\]]/g, '')
    return `<span class="highlight" data-gi="${gi}">${clean}</span>`
  })
}

const displayContent = computed(() => {
  if (showTldr.value) {
    return tldrPhrases.map((phrase, idx) => processTldrForDisplay(phrase, idx))
  }
  return paragraphWords.value.map(words => processWordsForDisplay(words))
})
</script>

<style scoped lang="scss">
.about {
  position: relative;
  --glow-duration: 1500ms;
  --glow-punch-scale: 1.08;
  --glow-punch-brightness: 1.25;
  --glow-contrast: 220%;
  --glow-blur: 14px;
  --glow-color: var(--color-accent);

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    span { display: inline-block; }

    .slide-fade-enter-active,
    .slide-fade-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

    .slide-fade-enter-from { opacity: 0; transform: translateY(-10px); }
    .slide-fade-leave-to   { opacity: 0; transform: translateY(10px); }
  }

  &__content {
    user-select: none;
    margin: 0 auto;
    max-width: var(--max-content-width);
    padding: 0 var(--space-8);

    @include mobile { padding: 0 var(--space-4); }

    &--active {
      @include tablet { text-align: center; }
      @include mobile {
        width: fit-content;
        margin: auto;
        & p { font-size: var(--text-xl) !important; }
      }
    }

    p {
      font-family: var(--font-body);
      font-size: var(--text-lg);
      line-height: var(--leading-body);
      color: var(--color-text-muted);
      font-weight: var(--font-light);
      margin-bottom: var(--space-4);
      min-height: 1.5em;
      transition: opacity 0.3s ease;
      @include mobile { font-size: var(--text-lg); }
    }

    :deep(.highlight) {
      font-weight: var(--font-semibold);
      color: var(--color-info);
    }

    :deep(.highlight--glow) {
      animation: glow var(--glow-duration) cubic-bezier(.2,.7,.2,1) 1 both;
      will-change: transform, filter;
      transform-origin: 50% 60%;
      text-shadow: 0 0 0 var(--glow-color);
    }
  }

  &__animation {
    position: absolute;
    right: 20%;
    bottom: -25%;

    @include laptop {
      right: 20%;
    }
    @include tablet {
      right: 0%;
      bottom: 0%;
    }
    @include mobile {
      right: 0%;
      bottom: 0%;
      z-index: -1;
    }
  }

  .btn {
    perspective: 100cm;
    display: inline;
    background-color: transparent;
    border: transparent;
    width: 100px;
    height: 40px;
    user-select: none;
    font-family: var(--font-fira);
    font-size: var(--text-lg);

    @include mobile { transform: scale(var(--scale)); font-size: var(--text-xl); }

    span {
      position: absolute;
      display: flex; align-items: center; justify-content: center;
      top: 0; bottom: 0; left: 0; right: 0; 
      color: var(--color-text-secondary);
      background-color: transparent;
      box-shadow: inset 0 0 0 2px var(--color-info);
      border-radius: var(--radius-md);
      transform-origin: 50% 50% -20px;
      transition: all .4s;
    }

    span:nth-child(1) { transform: rotateX(0deg); }

    span:nth-child(2) {
      transform: rotateX(90deg);
      box-shadow: inset 0 0 0 2px var(--color-text-secondary);
      background-color: var(--color-surface-1);

      &::after { content: (")"); }
      &:hover  { &::after { content: ("P"); } }
    }

    &.btn--active span:nth-child(1) { transform: rotateX(-90deg); }
    &.btn--active span:nth-child(2) { transform: rotateX(0deg); }
  }
}

@keyframes glow {
  0% {
    transform: scale(1);
    filter: brightness(1) contrast(100%) drop-shadow(0 0 0 var(--glow-color));
  }

  8% {
    transform: scale(var(--glow-punch-scale));
    filter: brightness(var(--glow-punch-brightness)) contrast(var(--glow-contrast)) drop-shadow(0 0 var(--glow-blur) var(--glow-color));
  }

  14% {
    transform: scale(calc(var(--glow-punch-scale) - 0.01));
    filter: brightness(calc(var(--glow-punch-brightness) - 0.05)) contrast(calc(var(--glow-contrast) - 10%)) drop-shadow(0 0 calc(var(--glow-blur) - 2px) var(--glow-color));
  }

  100% {
    transform: scale(1);
    filter: brightness(1) contrast(100%) drop-shadow(0 0 0 var(--glow-color));
  }
}
:deep(.about__animation) {
  transform-origin: 50% 80%;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.sprite-pop-enter-from,
.sprite-pop-leave-to {
  transform: scale(0.001);  /* near-zero avoids Safari aliasing issues */
  opacity: 0;
}

.sprite-pop-enter-active,
.sprite-pop-leave-active {
  transition:
    transform 2720ms cubic-bezier(.2,.8,.2,1),
    opacity   1560ms ease-out;
}

.sprite-pop-enter-to,
.sprite-pop-leave-from {
  transform: scale(1);
  opacity: 1;
}

/* a11y */
@media (prefers-reduced-motion: reduce) {
  :deep(.highlight--glow) { animation: none !important; }
}
</style>
