import { CRAFT_PHOTOS } from "./photos"

// Map configuration for animated location display
export const MAP_CONFIG = {
  locationDuration: 3000,
  transitionDuration: 1000,
  autoPlay: true,
  loop: true,
  pauseOnHover: false,
  showProgress: false,
  
  // Map view settings
  defaultZoom: 5,
  usZoom: 4,
  locationZoom: 8,
  
  // Style settings
  mapStyle: 'terrain',
  showMarkers: true,
  clusterMarkers: true,
}

export const CRAFT_CARDS = [
  {
    title: 'Stick',
    image: CRAFT_PHOTOS[4],
    description: 'SMAW for structural and industrial applications',
  },
  {
    title: 'TIG',
    image: CRAFT_PHOTOS[5],
    description: 'Precision GTAW for clean, controlled welds',
  },
  {
    title: 'Carbon Steel',
    image: CRAFT_PHOTOS[0],
    description: 'Structural and pipeline grade carbon steel',
  },
  {
    title: 'Stainless',
    image: CRAFT_PHOTOS[3],
    description: 'Corrosion-resistant alloys for demanding environments',
  },
]