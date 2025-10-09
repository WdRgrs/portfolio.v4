<template>
  <section class="devlog-section" :class="{ 'devlog-section--no-divider': noDivider }">
    <header v-if="$slots.heading || heading" class="devlog-section__header">
      <slot name="heading">
        <h4 class="devlog-section__title">{{ heading }}</h4>
      </slot>
    </header>
    
    <div class="devlog-section__content">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  heading?: string
  noDivider?: boolean
}

withDefaults(defineProps<Props>(), {
  heading: undefined,
  noDivider: false
})
</script>

<style scoped lang="scss">
.devlog-section {
  margin-bottom: var(--space-8);

  &__header {
    margin-bottom: var(--space-4);
    padding-top: var(--space-2);
    border-top: 1px solid var(--color-divider);
  }

  &--no-divider &__header {
    border-top: none;
    padding-top: 0;
  }

  &__title {
    font-family: var(--font-title);
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0;
  }

  &__content {
    :deep(p) {
      font-family: var(--font-body);
      font-size: var(--text-base);
      line-height: var(--leading-relaxed);
      color: var(--color-text-secondary);
      margin-bottom: var(--space-4);

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(a) {
      color: var(--color-primary);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease;

      &:hover {
        border-bottom-color: var(--color-primary);
      }
    }

    :deep(em) {
      font-style: italic;
      color: var(--color-text);
    }

    :deep(strong) {
      color: var(--color-text);
      font-weight: var(--font-semibold);
    }

    :deep(ul),
    :deep(ol) {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--space-4);

      li {
        font-family: var(--font-body);
        font-size: var(--text-base);
        line-height: var(--leading-relaxed);
        color: var(--color-text-secondary);
        padding-left: var(--space-5);
        margin-bottom: var(--space-3);
        position: relative;

        &::before {
          content: '▹';
          position: absolute;
          left: 0;
          color: var(--color-primary);
          font-weight: var(--font-bold);
        }
      }
    }

    // Nested lists
    :deep(ul ul),
    :deep(ol ol) {
      margin-top: var(--space-2);
      margin-bottom: 0;
      padding-left: var(--space-4);

      li {
        font-size: var(--text-sm);
        margin-bottom: var(--space-2);
        padding-left: var(--space-4);

        &::before {
          content: '•';
          font-weight: normal;
        }
      }
    }

    // Code blocks
    :deep(code) {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      background: var(--color-surface-2);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      color: var(--color-text);
    }

    :deep(pre) {
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      background: var(--color-surface-2);
      padding: var(--space-4);
      border-radius: var(--radius-md);
      overflow-x: auto;
      margin-bottom: var(--space-4);

      code {
        background: none;
        padding: 0;
      }
    }
  }
}
</style>