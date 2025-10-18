<template>
  <div class="welding-page">
    <WeldHero />

    <div class="welding-page__content">
      <!-- <CraftSection :cards="CRAFT_CARDS" /> -->
      <!-- <StorySection :blocks="STORY_BLOCKS" /> -->
      <Map />
      <!-- <ArtSection :images="LOCATION_PHOTOS" /> -->
      <GallerySection :images="LOCATION_PHOTOS" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import WeldHero from '@/components/welding/Hero.vue'
import Map from '@/components/welding/Map.vue'

// import StorySection from '@/components/welding/StorySection.vue'
// import CraftSection from '@/components/welding/CraftSection.vue'
// import ArtSection from '@/components/welding/ArtSection.vue'
import GallerySection from '@/components/welding/GallerySection.vue'
import { LOCATION_PHOTOS} from '@/assets/wedling/photos'

</script>

<style scoped lang="scss">
.welding-page {
  width: 100%;
  min-height: 100vh;

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-16);
    padding: var(--space-16) 0;

    @include mobile {
      gap: var(--space-12);
      padding: var(--space-12) 0;
    }
  }
}
</style>