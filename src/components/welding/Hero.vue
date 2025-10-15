<template>
  <section class="weld-hero">
    <div class="weld-hero__image-container">
      <img
        class="weld-hero__image"
        :src="getAssetUrl(heroImage.path)"
        :alt="heroImage.alt"
        :width="heroImage.width"
        :height="heroImage.height"
        @load="handleImageLoad"
        @contextmenu.prevent
      />
      
      <!-- <div class="weld-hero__overlay"></div> -->
      
      <div class="weld-hero__sparks" >
        <span 
          v-for="n in 24" 
          :key="`spark-${n}`" 
          class="weld-hero__spark"
          :style="{ animationDelay: `${n * 0.15}s` }"
        ></span>
      </div>
    </div>

    <div class="weld-hero__content">
      <h1 class="weld-hero__title">{{ heroImage.title }}</h1>
      
      <!-- <blockquote v-if="quote" class="weld-hero__quote">
        <p class="weld-hero__quote-text">{{ quote.text }}</p>
        <cite v-if="quote.author" class="weld-hero__quote-author">
          — {{ quote.author }}
        </cite>
      </blockquote>

      <p v-if="heroImage.description" class="weld-hero__description">
        {{ heroImage.description }}
      </p> -->
    </div>

    <!-- Scroll indicator -->
    <div class="weld-hero__scroll-indicator">
      <span class="weld-hero__scroll-text">Explore</span>
      <svg class="weld-hero__scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 5v14M19 12l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getAssetUrl } from '@/utils/assets'
import { WELDING_IMAGES } from '@/assets/welding'

interface Quote {
  text: string
  author?: string
}

const props = defineProps<{ quote?: Quote }>()

const isImageLoaded = ref(false)

// Use first image as hero - can be made configurable
const heroImage = WELDING_IMAGES[0]

const handleImageLoad = () => {
  isImageLoaded.value = true
}
</script>

<style scoped lang="scss">
@use "sass:math";

.weld-hero {
  color-scheme: light;

  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: calc(var(--nav-bar-height) * -1);  // ? Temp

  &__image-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    // Subtle zoom on load for impact
    animation: subtleZoom 0.8s ease-out;
  }

  @keyframes subtleZoom {
    from {
      transform: scale(1.05);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // Darker overlay for welding aesthetic
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 1;
  }

  // Animated spark particles
  &__sparks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  &__spark {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #ff9500;
    border-radius: 50%;
    box-shadow: 
      0 0 4px #ff9500,
      0 0 8px #ff6b00;
    opacity: 0;
    animation: sparkFly 3s ease-out infinite;

    // Random starting positions
    @for $i from 1 through 24 {
      &:nth-child(#{$i}) {
        left: math.random(100) * 1%;
        top: math.random(100) * 1%;
      }
    }
  }

  @keyframes sparkFly {
    0% {
      opacity: 0;
      transform: translate(0, 0) scale(0);
    }
    10% {
      opacity: 1;
      transform: translate(0, 0) scale(1.3);
    }
    100% {
      opacity: 0;
      transform: translate(
        #{math.random(100) + 50}px, 
        #{math.random(100) + 100}px
      ) scale(0);
    }
  }

  &__content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: var(--space-8);
    text-align: center;
    color: var(--color-text-inverse);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);

    @include mobile {
      padding: var(--space-5);
      max-width: 90%;
    }
  }

  &__title {
    font-family: var(--font-title);
    font-size: var(--text-5xl);
    font-weight: var(--font-bold);
    margin-bottom: var(--space-6);
    letter-spacing: -0.02em;
    // Metallic text effect
    background: linear-gradient(
      135deg,
      #ffffff 0%,
      #d4d4d4 50%,
      #ffffff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @include mobile {
      font-size: var(--text-3xl);
      margin-bottom: var(--space-4);
    }
  }

  &__quote {
    margin: var(--space-6) 0;
    padding: var(--space-4);
    border-left: 3px solid #ff9500;
    font-style: italic;

    @include mobile {
      margin: var(--space-4) 0;
    }
  }

  &__quote-text {
    font-family: var(--font-body);
    font-size: var(--text-xl);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-3);

    @include mobile {
      font-size: var(--text-lg);
    }
  }

  &__quote-author {
    display: block;
    font-family: var(--font-ui);
    font-size: var(--text-base);
    font-style: normal;
    opacity: 0.9;
  }

  &__description {
    font-family: var(--font-body);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    opacity: 0.95;
    margin-top: var(--space-4);

    @include mobile {
      font-size: var(--text-base);
    }
  }

  &__scroll-indicator {
    position: absolute;
    bottom: var(--space-8);
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-text-inverse);
    animation: bounce 2s infinite;
    cursor: pointer;

    @include mobile {
      bottom: var(--space-5);
    }
  }

  &__scroll-text {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.8;
  }

  &__scroll-arrow {
    width: 24px;
    height: 24px;
    opacity: 0.8;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }
}

// Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .weld-hero {
    &__image,
    &__scroll-indicator {
      animation: none;
    }

    &__sparks {
      display: none;
    }
  }
}
</style>