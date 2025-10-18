import type { Component } from 'vue'

import { 
  // Navigation & UI
  List,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  
  // Theme
  Lightbulb,
  Sun,
  Moon,
  SunMoon,
  
  // Layout
  Grip,
  LayoutGrid,
  Maximize2,
  
  // Media Controls
  Play,
  Pause,
  RotateCcw,
  
  // Social
  Github,
  Linkedin,
  Instagram,
  
  // Work & Projects
  Briefcase,
  Hammer,
  Palette,
  Wrench,
  
  // Map & Location
  Map,
  MapPin,
  Home,
  
  // Misc
  Mail,
  Calendar,
  Clock,
  Star,
  Heart,
  Camera
} from 'lucide-vue-next'

/**
 * Icon Registry
 * Maps icon names to their Lucide components
 */
export const ICON_REGISTRY: Record<string, Component> = {
  // Navigation & UI
  'list': List,
  'link': ExternalLink,
  'external-link': ExternalLink,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  
  // Theme
  'lightbulb': Lightbulb,
  'sun': Sun,
  'moon': Moon,
  'sun-moon': SunMoon,
  
  // Layout
  'grip': Grip,
  'grid': LayoutGrid,
  'expand': Maximize2,
  
  // Media Controls
  'play': Play,
  'pause': Pause,
  'rotate-ccw': RotateCcw,
  'replay': RotateCcw,
  
  // Social
  'github': Github,
  'linkedin': Linkedin,
  'instagram': Instagram,
  
  // Work & Projects
  'briefcase': Briefcase,
  'hammer': Hammer,
  'palette': Palette,
  'wrench': Wrench,
  
  // Map & Location
  'map': Map,
  'map-pin': MapPin,
  'home': Home,
  
  // Misc
  'mail': Mail,
  'calendar': Calendar,
  'clock': Clock,
  'star': Star,
  'heart': Heart,
  'camera': Camera,
}

/**
 * Icon name type - auto-generated from registry keys
 */
export type IconName = keyof typeof ICON_REGISTRY

/**
 * Icon categories for organization
 */
export const ICON_CATEGORIES = {
  navigation: ['list', 'link', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up'],
  theme: ['lightbulb', 'sun', 'moon', 'sun-moon'],
  layout: ['grip', 'grid', 'expand'],
  media: ['play', 'pause', 'rotate-ccw'],
  social: ['github', 'linkedin', 'instagram'],
  work: ['briefcase', 'hammer', 'palette', 'wrench'],
  location: ['map', 'map-pin', 'home'],
  misc: ['mail', 'calendar', 'clock', 'star', 'heart', 'camera'],
} as const

/**
 * Get icon component by name
 * Returns undefined if icon not found
 */
export function getIcon(name: string): Component | undefined {
  return ICON_REGISTRY[name]
}

/**
 * Check if icon exists in registry
 */
export function hasIcon(name: string): boolean {
  return name in ICON_REGISTRY
}

/**
 * Get all available icon names
 */
export function getAvailableIcons(): IconName[] {
  return Object.keys(ICON_REGISTRY) as IconName[]
}