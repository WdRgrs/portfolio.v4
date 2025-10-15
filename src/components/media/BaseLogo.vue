<template>
  <div 
    class="base-logo"
    :class="[
      `base-logo--${size}`,
      { 'base-logo--clickable': clickable }
    ]"
    @click="handleClick"
  >
    <img
      class="base-logo__img"
      :src="logoSrc"
      :alt="asset.alt"
      :width="computedWidth"
      :height="computedHeight"
      loading="eager"
      @contextmenu.prevent
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getAssetUrl } from '@/utils/assets'
import type { LogoAsset } from '@/types/assets'

type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  asset: LogoAsset
  size?: LogoSize
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()

const logoSrc = computed(() => getAssetUrl(props.asset.path))

const sizeMap: Record<LogoSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96
}

const computedWidth = computed(() => {
  return props.asset.width || sizeMap[props.size]
})

const computedHeight = computed(() => {
  return props.asset.height || sizeMap[props.size]
})

function handleClick() {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped lang="scss">
.base-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &--xs {
    width: 24px;
    height: 24px;
  }

  &--sm {
    width: 32px;
    height: 32px;
  }

  &--md {
    width: 48px;
    height: 48px;
  }

  &--lg {
    width: 64px;
    height: 64px;
  }

  &--xl {
    width: 96px;
    height: 96px;
  }

  &--clickable {
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;

    &:hover {
      transform: scale(1.05);
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

// Respect reduced motion
@media (prefers-reduced-motion: reduce) {
  .base-logo--clickable {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
  }
}
</style>