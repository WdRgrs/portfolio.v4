export type AspectRatio = '16:9' | '3:4' | '1:1' | '21:9' | 'auto'
export type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

export interface BaseAsset {
  id: string
  path: string // preview
  alt: string
  omit?: boolean
  title?: string
  description?: string
  date?: string | Date
  tags?: string[]
  region?: string
  location?: string
}

export interface ImageAsset extends BaseAsset {
  type: 'image'
  width?: number
  height?: number
  aspectRatio?: AspectRatio
  placeholder?: string
  full?: string
}

export interface PixelAsset extends BaseAsset {
  type: 'sprite'
  sheetWidth: number;  
  sheetHeight: number;   
  frameWidth: number;
  frameHeight: number;  
  columns: number;
  rows: number;  
  animations?: {
    [key: string]: {
      frames: number[];
      frameDuration: number;
      loop: boolean;
    };
  };  
  scale?: number;
  defaultAnimation?: string;
}

export interface VideoAsset extends BaseAsset {
  type: 'video'
  poster?: string // ph
  duration?: number
  width?: number
  height?: number
  aspectRatio?: AspectRatio
}

export interface LogoAsset extends BaseAsset {
  type: 'logo'
  format: 'svg' | 'webp' | 'png'
  width?: number
  height?: number
}

export interface PhotoSeries {
  id: string
  coverImage: ImageAsset
  images: ImageAsset[]
  title?: string
  description?: string
  tags?: string[]
  date?: string | Date
}

export type Asset = ImageAsset | VideoAsset | LogoAsset

export interface AssetCollection {
  section: 'software' | 'welding' | 'photography'
  images: ImageAsset[]
  videos: VideoAsset[]
  logos: LogoAsset[]
}

export interface WeldingLocation {
  id: string
  name: string
  company: string
  type: string
  category: string
  assetId?: string
  city: string
  state: string
  lat: number
  lng: number
  image?: ImageAsset
  additionalImages?: ImageAsset[]
  dateRange?: string
  description?: string
  tags: string[]
  order: number
}