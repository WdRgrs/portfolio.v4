<template>
  <section 
    class="section-wrapper"
    :class="[
      `section-wrapper--${variant}`,
      { 'section-wrapper--contained': contained }
    ]"
  >
    <div class="section-wrapper__container">
      <h2 
        v-if="heading" 
        class="section-wrapper__heading"
      >
        {{ heading }}
      </h2>
      
      <p
        v-if="intro"
        class="section-wrapper__intro"
      >
        {{ intro }}
      </p>
      
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  heading?: string
  intro?: string
  variant?: 'light' | 'dark' | 'accent'
  contained?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'light',
  contained: true
})
</script>

<style scoped lang="scss">
.section-wrapper {
  padding: var(--space-8) var(--space-6);
  
  @include mobile {
    padding: var(--space-8) var(--space-4);
  }

  &--light {
    background: var(--color-surface-1);
  }

  &--dark {
    background: var(--color-surface-2);
  }

  &--accent {
    background: var(--color-surface-3);
  }

  &__container {
    max-width: 1600px;
    margin: 0 auto;
  }

  &--contained &__container {
    max-width: 1400px;
  }

  &__heading {
    font-size: var(--text-4xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-8);
    text-align: center;
    font-family: var(--font-title);
  }

  &__intro {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    text-align: center;
    margin-bottom: var(--space-8);
  }
}
</style>