import type { ImageAsset, VideoAsset, LogoAsset } from '@/types/assets'

export const SOFTWARE_ICONS: ImageAsset[] = [
  {
    id: 'portfolio-icon-01',
    type: 'image',
    path: 'icons/WRLogo.png',
    alt: 'Base portfolio logo - initials of W and R',
    title: '',
    description: 'Portfolio Logo',
    width: 320,
    height: 320,
    tags: ['logo', 'portfolio', 'initials']
  },
]

export const PORTFOLIO_LOGO: LogoAsset = {
  id: 'portfolio-logo-v4',
  type: 'logo',
  format: 'webp',
  path: 'software/Portfolio_Logo_v4.webp',
  alt: 'Portfolio v4 logo',
  title: 'WR Portfolio',
  width: 512,
  height: 269
}

// ALPHABITS
export const ALPHABITS_LOGO: LogoAsset = {
  id: 'alphabits-logo',
  type: 'logo',
  format: 'webp',
  path: 'alphabits/Alphabits_Logo.webp',
  alt: 'Alphabits game logo',
  title: 'Alphabits',
  width: 512,
  height: 288
}

export const ALPHABITS_VIDEOS: VideoAsset[] = [
  {
    id: 'alphabits-demo',
    type: 'video',
    path: 'alphabits/Alphabits_Demo.mp4',
    poster: 'alphabits/Alphabits_Gameplay.webp', // Use gameplay as poster
    alt: 'Alphabits gameplay demonstration',
    title: 'Alphabits Demo',
    description: 'Cross-platform word puzzle game built with Rust and Macroquad',
    date: '2025-04-15',
    duration: 15,
    width: 960,
    height: 538,
    aspectRatio: '16:9',
    tags: ['gameplay', 'demo', 'rust', 'webassembly']
  }
]

export const ALPHABITS_IMAGES: ImageAsset[] = [
  {
    id: 'alphabits-gameplay',
    type: 'image',
    path: 'alphabits/Alphabits_Gameplay.webp',
    alt: 'Alphabits gameplay showing word grid and score',
    title: 'Gameplay View',
    description: 'Main game interface with procedurally generated letter grid',
    date: '2025-04-15',
    width: 1600,
    height: 900,
    aspectRatio: '16:9',
    tags: ['gameplay', 'screenshot', 'ui']
  },
  {
    id: 'alphabits-menu',
    type: 'image',
    path: 'alphabits/Alphabits_Menu.webp',
    alt: 'Alphabits main menu with difficulty selection',
    title: 'Main Menu',
    description: 'Game menu showing Easy, Medium, and Hardcade difficulty options',
    date: '2025-04-15',
    width: 1600,
    height: 900,
    aspectRatio: '16:9',
    tags: ['menu', 'screenshot', 'ui']
  },
  {
    id: 'alphabits-menu2',
    type: 'image',
    path: 'alphabits/Alphabits_Menu2.webp',
    alt: 'Alphabits secondary menu screen',
    title: 'Settings Menu',
    date: '2025-04-15',
    width: 1600,
    height: 900,
    aspectRatio: '16:9',
    tags: ['menu', 'screenshot', 'ui']
  },
  {
    id: 'alphabits-pause',
    type: 'image',
    path: 'alphabits/Alphabits_Pause.webp',
    alt: 'Alphabits pause menu overlay',
    title: 'Pause Screen',
    description: 'In-game pause menu with options',
    date: '2025-04-15',
    width: 1600,
    height: 900,
    aspectRatio: '16:9',
    tags: ['pause', 'screenshot', 'ui']
  }
]