<template>
  <component 
    v-if="iconComponent"
    :is="iconComponent"
    class="icon"
    :color="computedColor"
    :size="parseSize"
    :stroke-width="strokeWidth"
  />
  <span v-else class="icon icon--missing" :title="`Icon '${name}' not found`">
    ?
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIcon, type IconName } from '@/constants/icons'

interface Props {
  name: IconName
  color?: string
  size?: string | number
  variant?: 'default' | 'muted' | 'accent' | 'primary'
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  name: 'link',
  size: 'md',
  variant: 'default',
  strokeWidth: 2.5
})

const iconComponent = computed(() => getIcon(props.name))

const parseSize = computed(() => {
  if (typeof props.size === 'number') {
    return props.size
  }

  switch (props.size) {
    case 'xl':
      return 28
    case 'lg':
      return 22
    case 'md':
      return 18
    case 'sm':
      return 14
    case 'xs':
      return 10
    default:
      return parseInt(props.size) || 18
  }
})

const computedColor = computed(() => {
  if (props.color) {
    return props.color
  }

  switch (props.variant) {
    case 'primary':
      return 'var(--color-primary)'
    case 'accent':
      return 'var(--color-accent)'
    case 'muted':
      return 'var(--color-text-muted)'
    case 'default':
    default:
      return 'var(--color-text)'
  }
})
</script>

<style scoped lang="scss">
.icon {
  display: inline-flex;
  flex-shrink: 0;
  
  @include mobile {
    transform: scale(0.9);
  }

  &--missing {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-error);
    color: var(--color-text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }
}
</style>