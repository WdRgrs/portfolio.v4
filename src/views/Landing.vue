<template>
  <div class="landing">
    <!-- Background effects container -->
    <div class="landing__background">
      <!-- <LightRays 
        :ray-count="16"
        :rotation-speed="0.0003"
        color="100, 200, 255"
        :opacity="0.6"
        :center-x="0.5"
        :center-y="0.3"
      /> -->

      <!-- <Particles :count="100" color="100, 200, 255" /> -->

    </div>

    <div class="landing__container">
      <!-- Title Section -->
      <div class="landing__title-wrapper">
        <div class="landing__name">
          <span class="landing__name-first">
            <span class="landing__name-initial">W</span>ade
          </span>
          <span class="landing__name-last">
            <span class="landing__name-initial">R</span>ogers
          </span>
        </div>

        <div class="landing__border-break"></div>

        <!-- Job titles navigation -->
        <nav class="landing__jobs">
          <template v-for="(link, idx) in navLinks" :key="link.path" >
            <span v-if="idx > 0" class="landing__divider"></span>
            <router-link  :to="link.path" class="landing__job-link">
              {{ link.label }}
            </router-link>
          </template>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SITE_LINKS } from '@/constants'
// import LightRays from '@/components/test/LightRays.vue'
// import Particles from '@/components/test/Particles.vue'

const navLinks = SITE_LINKS.filter(ln => ln.main)
</script>

<style scoped lang="scss">
.landing {
  position: relative;
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  top: calc(-1 * var(--nav-bar-height));

  background: radial-gradient(ellipse at bottom,
    var(--color-surface-1) 0%,
    var(--color-bg) 60%);

  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  &__container {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  &__title-wrapper {
    height: fit-content;
    user-select: none;
    margin: auto;
    // Reflection effect for non-mobile
    -webkit-box-reflect:
      below -.3rem linear-gradient(transparent,
        rgba(255, 255, 255, 0.01),
        rgba(255, 255, 255, 0.2));

    @include mobile {
      -webkit-box-reflect: unset;
    }

    @include tablet {
      -webkit-box-reflect: unset;
    }
  }

  &__name {
    font-family: var(--font-cinzel);
    font-size: var(--text-landing);
    color: var(--color-bg);

    // Stroke effect
    -webkit-text-stroke-width: 0.08rem;
    -webkit-text-stroke-color: var(--color-secondary);
    transition: color 0.3s ease;

    @include mobile {
      margin: 0 var(--space-5);
    }
  }

  &__name-first,
  &__name-last {
    display: inline-block;
    margin: 0 1rem;

    @include mobile {
      display: block;
    }

    @include tablet {
      margin: 0 .5rem;
    }

    @include laptop {
      margin: 0 .75rem;
    }
  }

  &__name-first {
    @include mobile {
      transform: translate(-5%, -100%);
    }
  }

  &__name-last {
    @include mobile {
      transform: translate(10%, -118%);
    }
  }

  &__name-initial {
    font-size: calc(var(--text-landing) * 1.5);
    letter-spacing: calc(var(--text-landing) * .25 * -1);
  }

  &__name-last &__name-initial {
    letter-spacing: calc(var(--text-landing) * .1 * -1);
  }

  &__border-break {
    position: relative;
    bottom: calc(var(--text-landing) * .2);
    margin-left: calc(var(--text-landing)* .65);
    margin-right: calc(var(--text-landing) * .275);
    border-bottom: 2px solid var(--color-primary);
    opacity: .7;
    z-index: -1;

    @include mobile {
      display: none;
    }

    @include tablet {
      display: none;
    }
  }

  &__jobs {
    position: relative;
    height: 2rem;
    bottom: calc(var(--text-landing) * .15);
    left: calc(var(--text-landing) * .65);
    -webkit-text-stroke-width: 0.025rem;
    -webkit-text-stroke-color: var(--color-peach);

    @include mobile {
      display: flex;
      bottom: unset;
      left: unset;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    @include tablet {
      bottom: -2rem;
      left: unset;
      text-align: center;
    }
  }

  &__job-link {
    display: inline-block;
    position: relative;
    font-family: var(--font-fredericka);
    font-size: calc(var(--text-landing) * .235);
    color: var(--color-accent);
    color: var(--color-bg);
    text-decoration: none;
    transition: all 0.35s ease;

    @include mobile {
      margin-bottom: 0.5rem;
      font-size: calc(var(--text-landing) * .5);
    }

    @include tablet {
      font-size: calc(var(--text-landing) * .45);
    }

    &:hover {
      color: var(--color-warning);
    }

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      transform: scaleX(0);
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: var(--color-warning);
      opacity: 0.5;
      transform-origin: bottom right;
      transition: transform 0.35s ease-out;
    }

    &:hover::after {
      transform: scaleX(1);
      background-color: var(--color-warning);
      transform-origin: bottom left;
    }
  }

  &__divider {
    &::before {
      content: '|';
      color: var(--color-accent);
      font-size: 1.5rem;
      font-weight: var(--font-bold);
      opacity: 0.5;
      position: relative;
      top: 0.05rem;
      margin: 0 var(--space-4);

      @include mobile {
        content: '';
      }
    }
  }
}
</style>