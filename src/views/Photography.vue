<template>
  <div class="photography-page">
    <PhotoHero :quote="heroQuote" />

    <Gallery />
    
    <div class="photography-page__placeholder">
      <p>Thanks for stopping by :)</p>
      <p>This gallery is a work in progress, check back soon!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PhotoHero from '@/components/photography/Hero.vue'
import Gallery from '@/components/photography/Gallery.vue'

const heroQuote = {
  text: 'Photography is the story I fail to put into words.',
  author: 'Destin Sparks'
}
</script>

<style scoped lang="scss">
.photography-page {
  &__placeholder {
    min-height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    // justify-content: center;
    font-family: var(--font-body);
    font-size: var(--text-xl);
    color: var(--color-text-muted);
  }
}
</style>