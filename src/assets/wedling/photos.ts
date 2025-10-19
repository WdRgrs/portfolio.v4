import type { ImageAsset } from '@/types/assets'

// ============================================================================
// HERO
// ============================================================================

export const HERO_PHOTOS: ImageAsset[] = [
    {
    id: 'atx-courthouse',
    type: 'image',
    path: 'welding/photos/welding-hero.webp',
    alt: 'Welding work at Hoover Dam',
    title: '',
    description: 'Welding a flange on the end of small diameter pipe',
    region: 'Nevada',
    location: 'Hoover Dam',
    tags: ['commercial', 'government', 'Hoover Dam']
  },
]

// ============================================================================
// CRAFT
// ============================================================================

export const CRAFT_PHOTOS: ImageAsset[] = [
  {
    id: 'flange-weld',
    type: 'image',
    path: 'welding/photos/prev/flange_weld.webp',
    full: 'welding/photos/full/flange_weld.webp',
    alt: 'Welded flange, 6010 hot pass',
    title: '6010 Hot Pass',
    description: '6010 hot pass on flange weld, 2 1/2" diameter carbon sleet pipe',
    region: 'TX',
    location: 'Taylor',
    tags: ['industrial', 'pipe', 'government', '6010']
  },
  {
    id: 'flanges',
    type: 'image',
    path: 'welding/photos/prev/flanges.webp',
    full: 'welding/photos/full/flanges.webp',
    alt: 'Stack of prefabricated flanges welded to pipe',
    title: 'Flanges',
    description: 'Large stack of prefabricated carbon steel flanges',
    region: 'TX',
    location: 'Taylor',
    tags: ['industrial', 'pipe', 'government', 'flange']
  },
  {
    id: 'hoover_dam-shaft',
    type: 'image',
    path: 'welding/photos/prev/hd_shaft.webp',
    full: 'welding/photos/full/hd_shaft.webp',
    alt: 'Pipe assemblies around the shaft of a generator at the Hoover Dam',
    title: 'Generator Shaft Piping',
    description: 'Eductor piping assemblies installed around the shaft of a generator at the Hoover Dam',
    region: 'NV',
    location: 'Hoover Dam',
    tags: ['industrial', 'pipe', 'government', 'eductor']
  },
  {
    id: 'ss-pipe',
    type: 'image',
    path: 'welding/photos/prev/ss_pipefit.webp',
    full: 'welding/photos/full/ss_pipefit.webp',
    alt: 'Oil & gas prefabricated stainless steel pipe assembly',
    title: 'Stainless pipe assembly',
    description: 'Prefabricated stainless steel pipe assembly, Oil & Gas',
    region: 'TX',
    location: 'Austin',
    tags: ['industrial', 'pipe', 'stainless steel', 'prefabrication']
  },
  {
    id: 'stick-welding',
    type: 'image',
    path: 'welding/photos/prev/stick_welding.webp',
    full: 'welding/photos/full/stick_welding.webp',
    alt: 'Stick welding carbon steel pipe',
    title: 'Stick Weld',
    description: 'Fixed position, stick welding bottom of carbon pipe',
    region: 'TX',
    location: 'Marble Falls',
    tags: ['industrial', 'pipe', 'carbon steel', 'field']
  },
  {
    id: 'tig-welding',
    type: 'image',
    path: 'welding/photos/prev/tig_welding.webp',
    full: 'welding/photos/full/tig_welding.webp',
    alt: 'Tig welding stainless steel pipe',
    title: 'TIG Weld',
    description: 'Fixed position, tig welding bottom of stainless pipe',
    region: 'TX',
    location: 'Austin',
    tags: ['industrial', 'pipe', 'stainless steel', 'field']
  },
]

// ============================================================================
// TYPICAL
// ============================================================================

// ============================================================================
// LOCATION
// ============================================================================

export const LOCATION_PHOTOS: ImageAsset[] = [
  {
    id: 'atx-courthouse',
    type: 'image',
    path: 'welding/location/prev/atx_courthouse.webp',
    full: 'welding/location/full/atx_courthouse.webp',
    alt: 'Welding work at Austin Courthouse construction site',
    title: 'Austin Courthouse',
    description: 'Mechanical carbon steel welding and fabrication for the Austin Courthouse',
    region: 'TX',
    location: 'Austin',
    tags: ['commercial', 'structural', 'government', 'austin']
  },
  {
    id: 'dms-semiconductor',
    type: 'image',
    path: 'welding/location/prev/DMS.webp',
    full: 'welding/location/full/DMS.webp',
    alt: 'Industrial welding at DMS facility',
    title: 'DMS Facility',
    description: 'Heavy industrial welding and equipment fabrication at the DMS manufacturing plant',
    region: 'TX',
    location: 'Austin',
    tags: ['industrial', 'manufacturing']
  },
  {
    id: 'dyess-afb',
    type: 'image',
    path: 'welding/location/prev/dyess-afb.webp',
    full: 'welding/location/full/dyess-afb.webp',
    alt: 'Military base welding at Dyess Air Force Base',
    title: 'Dyess Air Force Base',
    description: 'Stick welding (6010) and structural repairs for base support facilities',
    region: 'TX',
    location: 'Abilene',
    tags: ['military', 'government', 'structural', 'aerospace']
  },
  {
    id: 'ft_hood-gdls',
    type: 'image',
    path: 'welding/location/prev/ft_hood.webp',
    full: 'welding/location/full/ft_hood.webp',
    alt: 'Welding operations at Fort Hood military installation',
    title: 'Fort Hood',
    description: 'Abrams Tank yard',
    region: 'TX',
    location: 'Fort Hood',
    tags: ['military', 'government', 'structural', 'defense']
  },
  {
    id: 'irs-gilroy',
    type: 'image',
    path: 'welding/location/prev/gilroy.webp',
    full: 'welding/location/full/gilroy.webp',
    alt: 'Welding project in Gilroy',
    title: 'Gilroy Project',
    description: 'Custom fabrication and welding work in Gilroy',
    region: 'CA',
    location: 'Gilroy',
    tags: ['commercial', 'fabrication']
  },
  {
    id: 'hoover_dam-1',
    type: 'image',
    path: 'welding/location/prev/hoover_dam-1.webp',
    full: 'welding/location/full/hoover_dam-1.webp',
    alt: 'Structural welding at Hoover Dam hydroelectric facility',
    title: 'Hoover Dam - Phase 1',
    description: 'Infrastructure welding and repairs at one of America\'s iconic hydroelectric dams',
    region: 'NV',
    location: 'Boulder City',
    tags: ['infrastructure', 'hydroelectric', 'landmark', 'government']
  },
  {
    id: 'hoover_dam-2',
    type: 'image',
    path: 'welding/location/prev/hoover_dam-2.webp',
    full: 'welding/location/full/hoover_dam-2.webp',
    alt: 'Additional welding work at Hoover Dam facility',
    title: 'Hoover Dam - Phase 2',
    description: 'Continued structural welding and maintenance work at Hoover Dam',
    region: 'NV',
    location: 'Boulder City',
    tags: ['infrastructure', 'hydroelectric', 'landmark', 'government']
  },
  {
    id: 'penstock',
    type: 'image',
    path: 'photography/prev/penstock.webp',
    full: 'photography/full/penstock.webp',
    alt: 'Additional welding work at Hoover Dam facility',
    title: 'Hoover Dam - Phase 2',
    description: 'Continued structural welding and maintenance work at Hoover Dam',
    region: 'NV',
    location: 'Boulder City',
    tags: ['infrastructure', 'hydroelectric', 'landmark', 'government']
  },
  {
    id: 'irs-jacksonville',
    type: 'image',
    path: 'welding/location/prev/jacksonville.webp',
    full: 'welding/location/full/jacksonville.webp',
    alt: 'Welding operations in Jacksonville',
    title: 'Jacksonville Project',
    description: 'Commercial welding and fabrication work in Jacksonville',
    region: 'FL',
    location: 'Jacksonville',
    tags: ['commercial', 'structural']
  },
  {
    id: 'irs-lafayette',
    type: 'image',
    path: 'welding/location/prev/lafayette.webp',
    full: 'welding/location/full/lafayette.webp',
    alt: 'Industrial welding in Lafayette',
    title: 'Lafayette Facility',
    description: 'Industrial fabrication and welding services in Lafayette',
    region: 'LA',
    location: 'Lafayette',
    tags: ['industrial', 'oil-gas', 'fabrication']
  },
  {
    id: 'mtech-leander',
    type: 'image',
    path: 'welding/location/prev/leander.webp',
    full: 'welding/location/full/leander.webp',
    alt: 'welding work in Leander workshop',
    title: 'Leander Workshop',
    description: 'fabrication and welding at Leander school',
    region: 'TX',
    location: 'Leander',
    tags: ['fabrication', 'workshop']
  },
  {
    id: 'mtech-marble_falls',
    type: 'image',
    path: 'welding/location/prev/mtech-marble_falls.webp',
    full: 'welding/location/full/mtech-marble_falls.webp',
    alt: 'Welding instruction and training at MTech Marble Falls',
    title: 'MTech Marble Falls',
    description: 'Fabrication and installation of mechanical piping systems for a new hostpital',
    region: 'TX',
    location: 'Marble Falls',
    tags: ['stick', 'tig', 'mechanical', 'technical']
  },
  {
    id: 'irs-nassau',
    type: 'image',
    path: 'welding/location/prev/nassau.webp',
    full: 'welding/location/full/nassau.webp',
    alt: 'Marine welding work in Nassau',
    title: 'Nassau Sunset',
    description: 'Sunset - TIG stainless commercial welding & pipefitting.',
    region: 'Bahamas',
    location: 'Nassau',
    tags: ['mechanical', 'pipefitting', 'stainless', 'international']
  },
  {
    id: 'irs-new-brunswick',
    type: 'image',
    path: 'welding/location/prev/new-brunswick.webp',
    full: 'welding/location/full/new-brunswick.webp',
    alt: 'Welding operations in New Brunswick',
    title: 'New Brunswick Project',
    description: 'Industrial welding and fabrication in New Brunswick',
    region: 'NJ',
    location: 'New Brunswick',
    tags: ['industrial', 'commercial', 'udpate']
  },
  {
    id: 'irs-ocala',
    type: 'image',
    path: 'welding/location/prev/ocala.webp',
    full: 'welding/location/full/ocala.webp',
    alt: 'Local wildlife, Ocala',
    title: 'Ocala Friend',
    description: 'Local wildlife of Ocala',
    region: 'FL',
    location: 'Ocala',
    tags: ['commercial', 'install', 'new']
  },
  {
    id: 'ows-fab-atx',
    type: 'image',
    path: 'welding/location/prev/ows-fab.webp',
    full: 'welding/location/full/ows-fab.webp',
    alt: 'Welding operations at OWS Fabrication shop',
    title: 'OWS Fabrication Shop',
    description: 'Prefabricated stainless steel weld assembly of Victaulic fitting',
    region: 'TX',
    location: 'Austin',
    tags: ['fabrication', 'stainless',  'Victaulic', 'industrial']
  },
  {
    id: 'ows-field-gonzales',
    type: 'image',
    path: 'welding/location/prev/ows-field.webp',
    full: 'welding/location/full/ows-field.webp',
    alt: 'Field welding work at OWS site',
    title: 'OWS Field Operations',
    description: 'On-site field welding and repair of stainless steel vessel',
    region: 'TX',
    location: 'Gonzales',
    tags: ['field-work', 'on-site', 'repair', 'mobile']
  },
  {
    id: 'ph-1',
    type: 'image',
    path: 'welding/location/prev/ph_1.webp',
    full: 'welding/location/full/ph_1.webp',
    alt: 'Custom welding hood and leather gauntlets',
    title: 'PPE',
    description: 'Tools of the trade - Texas flag welding hood & leather gauntlets',
    region: 'Texas',
    location: 'Texas',
    tags: ['industrial', 'construction']
  },
  {
    id: 'ph-2',
    type: 'image',
    path: 'welding/location/prev/ph_2.webp',
    full: 'welding/location/full/ph_2.webp',
    alt: 'Stacked socket TIG welds',
    title: 'Sockets',
    description: 'Stacked TIG socket welds, reducing',
    region: 'Texas',
    location: 'Texas',
    tags: ['industrial', 'construction']
  },
  {
    id: 'ph-3',
    type: 'image',
    path: 'welding/location/prev/ph_3.webp',
    full: 'welding/location/full/ph_3.webp',
    alt: 'Fixed position pipe weld, low profile',
    title: 'Stick welding',
    description: 'Limited access, fixed position pipe weld on carbon steel',
    region: 'Texas',
    location: 'Texas',
    tags: ['industrial', 'construction']
  },
  {
    id: 'ph-4',
    type: 'image',
    path: 'welding/location/prev/ph_4.webp',
    full: 'welding/location/full/ph_4.webp',
    alt: 'Construction selfie with crane background',
    title: 'Crane selfie',
    description: 'Selfie on rooftop of bahamas while waiting for a crane pick',
    region: 'BS',
    location: 'Nassau',
    tags: ['industrial', 'construction']
  },
  {
    id: 'ph-5',
    type: 'image',
    path: 'welding/location/prev/ph_5.webp',
    full: 'welding/location/full/ph_5.webp',
    alt: 'Electrical warning sign',
    title: 'High Voltage',
    description: 'Spray-painted high voltage warning sign - Hoover Dam',
    region: 'AZ',
    location: 'Hoover Dam',
    tags: ['industrial', 'danger', 'high-voltage']
  },
  {
    id: 'irs-pottsville',
    type: 'image',
    path: 'welding/location/prev/pottsville.webp',
    full: 'welding/location/full/pottsville.webp',
    alt: 'Welding operations in Pottsville',
    title: 'Pottsville Project',
    description: 'Industrial welding and repair work in Pottsville',
    region: 'PA',
    location: 'Pottsville',
    tags: ['industrial', 'repair', 'skyline']
  },
  {
    id: 'irs-ridgefield',
    type: 'image',
    path: 'welding/location/prev/ridgefield.webp',
    full: 'welding/location/full/ridgefield.webp',
    alt: 'Commercial welding in Ridgefield',
    title: 'Ridgefield Sunrise',
    description: 'Sunrise view from jobsite in Ridgefield',
    region: 'WA',
    location: 'Ridgefield',
    tags: ['commercial', 'fabrication', 'skyline']
  },
  {
    id: 'journey-taylor',
    type: 'image',
    path: 'welding/location/prev/taylor.webp',
    full: 'welding/location/full/taylor.webp',
    alt: 'Welding work in Taylor',
    title: 'Taylor Facility',
    description: 'Rig welding and pipefitting work in Taylor',
    region: 'TX',
    location: 'Taylor',
    tags: ['industrial', 'structural', 'rig']
  },
  {
    id: 'irs-washington',
    type: 'image',
    path: 'welding/location/prev/wa.webp',
    full: 'welding/location/full/wa.webp',
    alt: 'Welding operations in Washington State',
    title: 'Washington Warehouse',
    description: 'Commercial and industrial jobsite work in Washington',
    region: 'WA',
    location: 'Ridgefield',
    tags: ['commercial', 'industrial']
  }
]
