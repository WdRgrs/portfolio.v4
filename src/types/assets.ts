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
}

export interface ImageAsset extends BaseAsset {
  type: 'image'
  width?: number
  height?: number
  aspectRatio?: AspectRatio
  placeholder?: string
  full?: string
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