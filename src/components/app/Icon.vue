<template>
  <component 
    :is="parseComponent"
    class="icon"
    :stroke="color"
    :size="parseSize"
    :stroke-width="3"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  List,
  ExternalLink,
  ChevronDown,
  Lightbulb,
  Sun,
  Moon,
  SunMoon,
  Grip,
  LayoutGrid,
} from 'lucide-vue-next';

type BtnIcons = 'link' | 'list' | 'lightbulb' | 'chevron-down' | 'moon' | 'sun' | 'sun-moon' | 'grip' | 'grid'
type CompanyIcons = 'github' | 'linkedin' | 'instagram'

export type IconType = BtnIcons | CompanyIcons

interface Props {
  name: IconType
  color?: string
  size?: string | number
  variant?: 'default' | 'muted' | 'accent' | 'primary'
}

const props = withDefaults(defineProps<Props>(), {
  name: 'link',
  color: 'red',
  size: 'md'
})

const parseSize = computed(() => {
  // If it's already a number, return it directly
  if (typeof props.size === 'number') {
    return props.size
  }

  // Otherwise parse the size token
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
      // If it's a string like '20px', strip units and convert to number
      return parseInt(props.size) || 18
  }
})
    
const parseComponent = computed(() => {
  switch (props.name) { 
    case 'grid':
      return LayoutGrid
    case 'grip':
      return Grip
    case 'sun-moon':
      return SunMoon
    case 'sun':
      return Sun
    case 'moon':
      return Moon
    case 'list':
      return List
    case 'lightbulb':
      return Lightbulb
    case 'chevron-down':
      return ChevronDown
    case 'link':
    default:
      return ExternalLink
    
  }
})
</script>

<style scoped lang="scss">
.icon {
  @include mobile {
    transform: scale(.6);
  }
}
</style>