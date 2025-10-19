<template>
  <div class="software">
    <div class="software__container">
      <About />
      <div class="software__border-break" />
      <Experience />
      <div class="software__border-break" />
      <DevLog />
    </div>
  </div>
</template>

<script setup lang="ts">
import About from '@/components/software/About.vue';
import Experience from '@/components/software/Experience.vue';
import DevLog from '@/components/devlog/index.vue';

</script>

<style scoped lang="scss">
.software {
  &__container {
    position: relative;
    max-width: 1600px;
    margin: 0 auto;
  }

  &__border-break {
    height: 1px;
    background-image: linear-gradient(90deg, transparent, var(--color-surface-2), transparent);
    margin: var(--space-9);    
  }
}

// TODO - make scroll
.scroll {
  position: fixed;
  padding: var(--space-4);
  transform: translate(0, 500%);

  @include laptop {
  }

  @include tablet {
    position: relative;
    transform: unset;
  }

  @include mobile {
    position: relative;
    transform: unset;
    
  }
}
</style>
