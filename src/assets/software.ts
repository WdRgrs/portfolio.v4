import type { ImageAsset, VideoAsset, LogoAsset, PixelAsset } from '@/types/assets'

// PORTFOLIO
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

export const SPRITES: PixelAsset[] = [
   {
     id: 'tree-anim',
     type: 'sprite',
     path: 'sprites/tree-anim.webp',
     title: 'Bon-sigh tree',
     description: 'Animated pixel art tree with wind sway effect',
     date: '2025-10-28',
     sheetWidth: 640,
     sheetHeight: 64,
     frameWidth: 64,
     frameHeight: 64,
     columns: 10,
     rows: 1,
     animations: {
       sway: {
         frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
         frameDuration: 400,
         loop: true
       }
     },
     scale: 5,
     defaultAnimation: 'sway',
     tags: ['pixel', 'tree', 'animation', 'wind'],
     alt: ''
   },
]

// N8N
export const N8N_VIDEOS: VideoAsset[] = [
  {
    id: 'discord-n8n',
    type: 'video',
    path: 'n8n/videos/discord-n8n.mp4',
    poster: 'n8n/prev/discord-n8n_prev.webp',
    alt: 'Automated messages populating discord channel',
    title: 'Automated posts',
    description: 'Automated messages (n8n workflow) populating a Discord channel',
    date: '2025-10-23',
    duration: 4,
    width: 1280,
    height: 708,
    aspectRatio: '16:9',
    tags: ['automation', 'n8n', 'discord', 'ui']
  }
]

export const N8N_IMAGES: ImageAsset[] = [
  {
    id: 'n8n-canvas',
    type: 'image',
    path: 'n8n/prev/n8n-canvas.webp',
    full: 'n8n/full/n8n-canvas.webp',
    alt: 'Screenshot of n8n canvas/ui',
    title: 'n8n Canvas',
    description: 'Screenshot - n8n canvas, automated workflow for aggregating & filtering posted jobs from various resources',
    date: '2025-10-23',
    width: 1600,
    height: 902,
    aspectRatio: '16:9',
    tags: ['n8n', 'screenshot', 'ui', 'automation']
  },
]

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

// PIHOLE
export const PIHOLE_LOGO: LogoAsset = {
  id: 'pihole-logo',
  type: 'logo',
  format: 'webp',
  path: 'software/Pi-hole_Logo.webp',
  alt: 'Pi-hole logo',
  title: 'Pi-hole Logo',
  width: 487,
  height: 512
}

export const PIHOLE_IMAGES: ImageAsset[] = [
  {
    id: 'pi-hole-dashboard-portrait',
    type: 'image',
    path: 'software/Pi-hole_dashboard_portrait.webp',
    alt: 'Pi-hole browser dashboard showing recent network traffic (portait)',
    title: 'Pi-hole dashboard (portrait)',
    description: 'PI-hole browser dashboard showing statistics for previous 24h (portrait)',
    date: '2025-04-15',
    width: 1255,
    height: 1320,
    aspectRatio: '3:4',
    tags: ['dashboard', 'screenshot', 'DNS', 'pi-hole']
  },
  {
    id: 'pi-hole-dashboard',
    type: 'image',
    path: 'software/Pi-hole_dashboard_query.webp',
    alt: 'Pi-hole browser dashboard showing recent network traffic',
    title: 'Pi-hole dashboard',
    description: 'Pi-hole browser dashboard showing statistics for previous 24h',
    date: '2025-04-15',
    width: 1600,
    height: 900,
    aspectRatio: '16:9',
    tags: ['dashboard', 'screenshot', 'DNS', 'pi-hole']
  },
]