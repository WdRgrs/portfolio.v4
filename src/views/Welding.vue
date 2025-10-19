<template>
  <div class="welding-page">
    <WeldHero />

    <SectionWrapper heading="The Craft" variant="light">
      <CraftSection :cards="CRAFT_CARDS" />
    </SectionWrapper>

    <SectionWrapper heading="The Journey" variant="dark">
      <MapSection />
    </SectionWrapper>

    <!-- <SectionWrapper 
      heading="Blacksmithing & Art Metals" 
      intro="Rejoice in the hands"
      variant="light"
    >
      <ArtSection :images="LOCATION_PHOTOS" />
    </SectionWrapper> -->

    <SectionWrapper heading="Gallery" variant="light">
      <GallerySection :images="galleryImages" />
    </SectionWrapper>
  </div>
</template>

<script setup lang="ts">
import WeldHero from '@/components/welding/Hero.vue'
import SectionWrapper from '@/components/page/Section.2.vue'
import MapSection from '@/components/welding/Map.vue'
import CraftSection from '@/components/welding/CraftSection.vue'
import GallerySection from '@/components/welding/GallerySection.vue'
// import ArtSection from '@/components/welding/ArtSection.vue'
import { CRAFT_PHOTOS, LOCATION_PHOTOS } from '@/assets/wedling/photos'
import { CRAFT_CARDS } from '@/assets/wedling/config'

const galleryImages = [ ...CRAFT_PHOTOS, ...LOCATION_PHOTOS, ]
</script>

<style scoped lang="scss">
.welding-page {
  width: 100%;
  min-height: 100vh;
}
</style>