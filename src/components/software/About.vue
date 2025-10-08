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
          <span>:)</span>
        </button>
      </h2>
    </template>

    <div class="about__content" :class="{ 'about__content--active': isTldr }">
      <p v-for="(text, idx) in displayContent" :key="idx">
        <span v-html="text" />
      </p>
    </div>
  </PageSection>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import PageSection from '@/components/page/Section.vue'

const isTldr = ref(false)
const showTldr = ref(false)
const activeGlowIndex = ref(-1)
const paragraphWords = ref<string[][]>([])
const animationTimers = ref<number[]>([])
const glowSequenceTimer = ref<number | null>(null)

const ANIMATION_DURATION = 1000
const GLOW_INTERVAL = 1200

const paragraphSources = [
  `Hi! I'm Wade, [passionate] about building |things| and fueled by a [curious] tic to understand how and why they work.`,
  `My tech story begins as a [PC enthusiast] in the 56k dial-up era, when 128MB of RAM was luxurious and "your system is running low on virtual memory" was a daily notification. This early fascination led me to build PCs and eventually to code, turning curiosity into a career.`,
  `Professionally, I work full-stack but gravitate toward the frontend, a medium for expression as much as a technology. The mentor side of me enjoys [crafting] [experiences] that connect people to [ideas] in clear and engaging ways.`,
  `I'm energized by [innovation] in every form, and especially [inspired] by spatial computing. I dream of one day stepping into the metaverse, as imagined by Neal Stephenson; we're laying the groundwork today for tomorrow's technologies.`
]

const tldrPhrases = [
  `[passionate] & [curious] ..`,
  `a [PC enthusiast] ..`,
  `crafting [experiences] & [ideas] ..`,
  `[inspired] by [innovation] ..`
]

onMounted(() => {
  resetContent()
})

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
    activeGlowIndex.value = -1
    startExpandAnimation()
  }
}

function resetContent() {
  clearAllTimers()
  paragraphWords.value = paragraphSources.map(src => src.split(' '))
}

function clearAllTimers() {
  animationTimers.value.forEach(clearInterval)
  animationTimers.value = []
  
  if (glowSequenceTimer.value) {
    clearInterval(glowSequenceTimer.value)
    glowSequenceTimer.value = null
  }
}

function isHighlighted(word: string): boolean {
  return word.includes('[') || word.includes(']')
}

function startTldrAnimation() {
  clearAllTimers()

  paragraphWords.value.forEach((words, paragraphIndex) => {
    const wordsToRemove = words.filter(w => !isHighlighted(w)).length
    if (wordsToRemove === 0) return

    const interval = ANIMATION_DURATION / wordsToRemove
    const timer = window.setInterval(() => {
      removeNextNonHighlightedWord(paragraphIndex)
    }, interval)

    animationTimers.value.push(timer)
  })

  setTimeout(() => {
    showTldr.value = true
    startGlowSequence()
  }, ANIMATION_DURATION)
}

function startExpandAnimation() {
  clearAllTimers()
  
  const fullSources = paragraphSources.map(src => src.split(' '))
  
  fullSources.forEach((fullWords, paragraphIndex) => {
    const wordsToAdd = fullWords.filter(w => !isHighlighted(w))
    
    if (wordsToAdd.length === 0) {
      paragraphWords.value[paragraphIndex] = fullWords
      return
    }
    
    const interval = ANIMATION_DURATION / wordsToAdd.length
    let progress = 0
    
    const timer = window.setInterval(() => {
      const result: string[] = []
      let nonHighlightedAdded = 0
      
      fullWords.forEach(word => {
        if (isHighlighted(word)) {
          result.push(word)
        } else if (nonHighlightedAdded < progress) {
          result.push(word)
          nonHighlightedAdded++
        }
      })
      
      paragraphWords.value[paragraphIndex] = result
      progress++
      
      if (progress > wordsToAdd.length) {
        clearInterval(timer)
        paragraphWords.value[paragraphIndex] = fullWords
      }
    }, interval)
    
    animationTimers.value.push(timer)
  })
}

function removeNextNonHighlightedWord(paragraphIndex: number) {
  const words = paragraphWords.value[paragraphIndex]
  const indexToRemove = words.findIndex(word => !isHighlighted(word))

  if (indexToRemove !== -1) {
    const newWords = [...words]
    newWords.splice(indexToRemove, 1)
    paragraphWords.value[paragraphIndex] = newWords
  } else if (animationTimers.value[paragraphIndex]) {
    clearInterval(animationTimers.value[paragraphIndex])
  }
}

function startGlowSequence() {
  const totalHighlights = tldrPhrases.reduce((count, phrase) => {
    const matches = phrase.match(/\[([^\]]+)\]/g)
    return count + (matches?.length ?? 0)
  }, 0)

  if (totalHighlights === 0) return

  let currentHighlight = 0

  const cycleGlow = () => {
    activeGlowIndex.value = currentHighlight
    currentHighlight = (currentHighlight + 1) % totalHighlights
  }

  cycleGlow()
  glowSequenceTimer.value = window.setInterval(cycleGlow, GLOW_INTERVAL)
}

function processWordsForDisplay(words: string[]): string {
  return words.map(word => {
    if (word.includes('[') || word.includes(']')) {
      const cleanWord = word.replace(/[\[\]]/g, '')
      return `<span class="highlight">${cleanWord}</span>`
    }
    if (word.includes('|')) {
      const cleanWord = word.replace(/\|/g, '')
      return `<span style="font-style: italic;">${cleanWord}</span>`
    }
    return word
  }).join(' ')
}

function processTldrForDisplay(phrase: string, paragraphIndex: number): string {
  let localIndex = 0
  let globalOffset = 0
  
  for (let i = 0; i < paragraphIndex; i++) {
    const matches = tldrPhrases[i].match(/\[([^\]]+)\]/g)
    globalOffset += matches?.length ?? 0
  }

  return phrase.replace(/\[([^\]]+)\]/g, (match, word) => {
    const globalIndex = globalOffset + localIndex
    const isGlowing = globalIndex === activeGlowIndex.value
    localIndex++
    return `<span class="highlight ${isGlowing ? 'highlight--glow' : ''}">${word}</span>`
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
  &__title {
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    span {
      display: inline-block;
    }

    .slide-fade-enter-active,
    .slide-fade-leave-active {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slide-fade-enter-from {
      opacity: 0;
      transform: translateY(-10px);
    }

    .slide-fade-leave-to {
      opacity: 0;
      transform: translateY(10px);
    }
  }

  &__content {
    user-select: none;
    margin: 0 auto;
    max-width: var(--max-content-width);
    padding: 0 var(--space-8);
    
    @include mobile {
      padding: 0 var(--space-4);
    }

    &--active {
      @include tablet {
        text-align: center;
      }

      @include mobile {
        width: fit-content;
        margin: auto;
        & p {
          font-size: var(--text-xl) !important;
        }
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

      @include mobile {
        font-size: var(--text-lg);
      }
    }

    :deep(.highlight) {
      font-weight: var(--font-semibold);
      color: var(--color-info);
      transition: all 0.3s ease;

      &.highlight--glow {
        animation: glow 1.2s ease-in;
      }
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
    
    @include mobile {
      transform: scale(var(--scale));
      font-size: var(--text-xl);
    }

    span {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0; 
      color: var(--color-text-secondary);
      background-color: transparent;
      box-shadow: inset 0px 0px 0px 2px var(--color-info);
      border-radius: var(--radius-md);
      transform-origin: 50% 50% -20px;
      transition: all .4s;
    }
    
    span:nth-child(1) {
      transform: rotateX(0deg);
    }
    
    span:nth-child(2) {
      transform: rotateX(90deg);
      box-shadow: inset 0px 0px 0px 2px var(--color-text-secondary);
      background-color: var(--color-surface-1);
    }

    &.btn--active span:nth-child(1) {
      transform: rotateX(-90deg);
    }

    &.btn--active span:nth-child(2) {
      transform: rotateX(0deg);
    }
  }
}

@keyframes glow {
  0%,
  100% {
    transform: scale(1);
    filter: brightness(1);
  }

  50% {
    transform: scale(1.05);
    filter: brightness(1.1) contrast(200%) drop-shadow(0 0 12px var(--color-accent));
  }
}
</style>