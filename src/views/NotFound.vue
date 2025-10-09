<template>
  <div class="not-found">
    <div class="not-found__container">
      <div class="not-found__content">
        <!-- Error Code -->
        <div class="not-found__code">404</div>

        <!-- Main Message -->
        <h1 class="not-found__title">Page Not Found</h1>

        <!-- Description -->
        <p class="not-found__description">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Navigation Options -->
        <div class="not-found__actions">
          <router-link :to="LANDING" class="not-found__button not-found__button--primary">
            Go Home
          </router-link>
          <button @click="goBack" class="not-found__button not-found__button--secondary" :disabled="!canGoBack">
            Go Back
          </button>
        </div>

        <!-- Helpful Links -->
        <div class="not-found__links">
          <p class="not-found__links-title">Or explore:</p>
          <nav class="not-found__nav">
            <router-link v-for="link in quickLinks" :key="link.path" :to="link.path" class="not-found__nav-link">
              {{ link.label }}
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SITE_LINKS, LINKS } from '@/constants'

interface QuickLink {
  path: string
  label: string
}

const router = useRouter()
const canGoBack = ref(false)
const { LANDING } = LINKS.SITE
const quickLinks: QuickLink[] = SITE_LINKS.filter(ln => ln.main)

const goBack = () => {
  if (canGoBack.value) {
    router.back()
  }
}

onMounted(() => {
  // Check if there's history to go back to
  canGoBack.value = window.history.length > 1
})
</script>

<style scoped lang="scss">
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: var(--space-5);

  &__container {
    max-width: 600px;
    width: 100%;
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-6);

    @include mobile {
      gap: var(--space-5);
    }
  }

  &__code {
    font-family: var(--font-title);
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: var(--font-bold);
    color: var(--color-primary);
    line-height: var(--leading-none);
    -webkit-text-stroke-width: .1rem;
    -webkit-text-stroke-color: var(--color-text);
    opacity: 0.8;

    @include mobile {
      -webkit-text-stroke-width: .05rem;
    }
  }

  &__title {
    font-family: var(--font-title);
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0;
    line-height: var(--leading-tight);

    @include mobile {
      font-size: var(--text-2xl);
    }
  }

  &__description {
    font-family: var(--font-body);
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    margin: 0;
    line-height: var(--leading-relaxed);
    max-width: 400px;

    @include mobile {
      font-size: var(--text-md);
    }
  }

  &__actions {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
    justify-content: center;

    @include mobile {
      flex-direction: column;
      width: 100%;
      max-width: 280px;
    }
  }

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    font-family: var(--font-ui);
    font-weight: var(--font-medium);
    font-size: var(--text-md);
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;

    @include mobile {
      padding: var(--space-4) var(--space-6);
      width: 100%;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;

      &:hover {
        transform: none;
      }
    }

    &:not(:disabled):hover {
      transform: translateY(-1px);
    }

    &--primary {
      background: var(--color-primary);
      color: var(--color-text-inverse);

      &:not(:disabled):hover {
        background: var(--color-secondary);
      }
    }

    &--secondary {
      background: var(--color-surface-2);
      color: var(--color-text);
      border: 1px solid var(--color-border);

      &:not(:disabled):hover {
        background: var(--color-surface-3);
      }
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  &__links-title {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin: 0;
  }

  &__nav {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
    justify-content: center;

    @include mobile {
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }
  }

  &__nav-link {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;

    &:hover {
      color: var(--color-primary);
      background: var(--color-surface-1);
    }
  }
}
</style>