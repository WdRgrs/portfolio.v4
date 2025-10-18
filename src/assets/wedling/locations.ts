import type { ImageAsset, WeldingLocation } from '@/types/assets'
import { LOCATION_PHOTOS } from './photos'

// ============================================================================
// LOCATIONS
// ============================================================================

const LOCATIONS: WeldingLocation[] = [
  {
    id: 'samsung-atx',
    name: 'Samsung Semiconductor',
    company: 'Brandt',
    type: 'mechanical',
    category: 'mechanical/field',
    image: findPhoto('ph-5'),
    city: 'Austin',
    state: 'TX',
    lat: 30.2672,
    lng: -97.7431,
    description: 'Field installation of large diameter carbon steel pipe for semiconductor chip fabrication facility. Work included mechanical piping systems for process equipment and facility infrastructure.',
    tags: ['semiconductor', 'mechanical'],
    order: 1
  },
  {
    id: 'datacenter-atx',
    name: 'Data Center HW45',
    company: 'Brandt',
    type: 'mechanical',
    category: 'mechanical/field',
    city: 'Austin',
    image: findPhoto('ph-2'),
    state: 'TX',
    lat: 30.2672,
    lng: -97.7431,
    description: 'Installation of mechanical piping systems for data center cooling infrastructure. Work included chilled water lines and process piping to support server room environmental controls.',
    tags: ['datacenter', 'mechanical'],
    order: 2
  },
  {
    id: 'dps-atx',
    name: 'Department of Public Safety',
    company: 'Brandt',
    type: 'mechanical',
    category: 'mechanical/field',
    image: findPhoto('ph-3'),
    city: 'Austin',
    state: 'TX',
    lat: 30.2672,
    lng: -97.7431,
    description: 'Replacement of aging piping infrastructure including pipes, pumps, valves, and mechanical equipment. Work restored operational capacity of facility mechanical systems.',
    tags: ['government', 'mechanical'],
    order: 3
  },
  {
    id: 'porter-manchaca',
    name: 'Porter Fabrication',
    company: 'Porter',
    type: 'fab',
    category: 'fab/mechanical',
    image: findPhoto('ph-1'),
    city: 'Manchaca',
    state: 'TX',
    lat: 30.1374,
    lng: -97.8331,
    description: 'Shop prefabrication of pipe assemblies for welded and Victaulic grooved mechanical connections. Materials supplied to Circuit of the Americas, Dell-Gates Hospital, W Hotel, and Austin VA Hospital projects.',
    tags: ['fabrication', 'mechanical'],
    order: 4
  },
  {
    id: 'ows-fab-atx',
    name: 'OWS Fabrication',
    company: 'OWS',
    type: 'fab',
    category: 'fab/r&d',
    city: 'Austin',
    state: 'TX',
    lat: 30.2672,
    lng: -97.7431,
    description: 'Shop fabrication of custom piping assemblies and skids for oil and gas applications. Work included TIG and SMAW welding of stainless steel, duplex, and carbon steel piping systems with precision fit-up and blueprint interpretation.',
    tags: ['fabrication', 'r&d'],
    order: 5
  },
  {
    id: 'ows-field-gonzales',
    name: 'OWS Eagle Ford Shale',
    company: 'OWS',
    type: 'field',
    category: 'r&d/field',
    city: 'Gonzales',
    state: 'TX',
    lat: 29.5016,
    lng: -97.4522,
    description: 'Field installation and maintenance of oil and gas production equipment in the Eagle Ford Shale play. Work included welding and fitting of process piping systems under oilfield conditions.',
    tags: ['oil-gas', 'field', 'r&d'],
    order: 6
  },
  {
    id: 'mtech-leander',
    name: 'MTech Mechanical',
    company: 'MTech',
    type: 'mechanical',
    category: 'mechanical/field',
    city: 'Leander',
    state: 'TX',
    lat: 30.5788,
    lng: -97.8531,
    description: 'Installation of mechanical piping systems including steam lines and support structures. SMAW welding of schedule 40/80 carbon steel pipe with 6010 root passes and 7018 fill/cap.',
    tags: ['mechanical', 'field'],
    order: 7
  },
  {
    id: 'mtech-marble_falls',
    name: 'MTech Marble Falls',
    company: 'MTech',    
    type: 'mechanical',
    category: 'mechanical/field',
    city: 'Marble Falls',
    state: 'TX',
    lat: 30.5782,
    lng: -98.2729,
    description: 'Field installation of mechanical piping systems for commercial and industrial facilities. Work included cutting, fitting, welding, and installation of schedule 40/80 carbon steel pipe.',
    tags: ['mechanical', 'field'],
    order: 8
  },
  {
    id: 'hoover_dam-1',
    name: 'Hoover Dam (NV)',
    company: 'Journey',
    type: 'mechanical',
    category: 'mechanical/field',
    city: 'Boulder City',
    state: 'NV',
    lat: 36.0156,
    lng: -114.7377,
    description: 'Replaced and simplified eductor process piping systems feeding Hoover Dam (NV) generators during scheduled shutdowns. Work included layout, fabrication, and installation of new process lines with demolition of existing systems under close supervision of Bureau of Reclamation inspectors and engineers.',
    tags: ['infrastructure', 'dam', 'mechanical'],
    order: 9
  },
  {
    id: 'dyess-afb',
    name: 'Dyess Air Force Base',
    company: 'Journey',
    type: 'mechanical',
    category: 'mechanical/field',
    city: 'Abilene',
    state: 'TX',
    lat: 32.4204,
    lng: -99.8465,
    description: 'Mechanical piping and structural fabrication and installation for Air Force facility infrastructure. SMAW welding of schedule 40/80 carbon steel pipe and A36 structural steel.',
    tags: ['military', 'mechanical'],
    order: 10
  },
  {
    id: 'hoover_dam-2',
    name: 'Hoover Dam (AZ) - 2nd Tour',
    company: 'Journey',
    type: 'mechanical',
    category: 'mechanical/field',
    city: 'Boulder City',
    state: 'NV',
    lat: 36.0156,
    lng: -114.7377,
    description: 'Replaced and simplified eductor process piping systems feeding Hoover Dam (AZ) generators during scheduled shutdowns. Work included layout, fabrication, and installation of new process lines with demolition of existing systems under close supervision of Bureau of Reclamation inspectors and engineers.',
    tags: ['infrastructure', 'dam', 'mechanical'],
    order: 11
  },
  {
    id: 'atx-courthouse',
    name: 'Austin Courthouse',
    company: 'Contract',
    type: 'mechanical',
    category: 'mechanical/field',
    city: 'Austin',
    state: 'TX',
    lat: 30.2672,
    lng: -97.7431,
    description: 'Mechanical piping installation for government facility infrastructure upgrades.',
    tags: ['government', 'mechanical'],
    order: 12
  },
  {
    id: 'journey-taylor',
    name: 'Taylor Fabrication',
    company: 'Journey',
    type: 'fab',
    category: 'mechanical/fab',
    city: 'Taylor',
    state: 'TX',
    lat: 30.5708,
    lng: -97.4094,
    description: 'Shop prefabrication of piping assemblies and structural components for mechanical and infrastructure projects including Hoover Dam penstock systems.',
    tags: ['fabrication', 'mechanical'],
    order: 13
  },
  {
    id: 'hoover_dam-3',
    name: 'Hoover Dam 3rd Tour',
    company: 'Journey',
    type: 'mechanical',
    category: 'mechanical/field',
    image: findPhoto('penstock'),
    city: 'Boulder City',
    state: 'NV',
    lat: 36.0156,
    lng: -114.7377,
    description: 'Replaced and simplified penstock process piping systems feeding Hoover Dam generators during scheduled shutdowns. Work included layout, fabrication, and installation of new process lines with demolition of existing systems under close supervision of Bureau of Reclamation inspectors and engineers.',
    tags: ['infrastructure', 'dam', 'mechanical'],
    order: 14
  },
  {
    id: 'dms-semiconductor',
    name: 'DMS Semiconductor',
    company: 'DMS',
    type: 'semiconductor',
    category: 'semiconductor/fab',
    city: 'Austin',
    state: 'TX',
    lat: 30.2672,
    lng: -97.7431,
    description: 'Fabricated piping assemblies, skids up to 140 feet in length, and process systems for semiconductor manufacturing. TIG and SMAW welding of carbon steel, stainless steel, and aluminum pipe and tubing ranging from 1/4" to 21" diameter. Served as mechanical fitter coordinating multiple welders on complex assemblies.',
    tags: ['semiconductor', 'fabrication', 'cleanroom'],
    order: 15
  },
  {
    id: 'ft_hood-gdls',
    name: 'Fort Hood GDLS',
    company: 'GDLS',
    type: 'fab',
    category: 'fab/mechanical',
    city: 'Killeen',
    state: 'TX',
    lat: 31.1171,
    lng: -97.7278,
    description: 'Fabrication and welding for military vehicle maintenance facility under government contract.',
    tags: ['military', 'fabrication'],
    order: 16
  },
  {
    id: 'irs-lyndhurst',
    name: 'IRS Lyndhurst',
    company: 'IRS',
    type: 'fab',
    image: findPhoto('irs-washington'),
    category: 'fab/mechanical',
    city: 'Lyndhurst',
    state: 'VA',
    lat: 37.9335,
    lng: -78.9453,
    description: 'Shop fabrication and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'fabrication'],
    order: 17
  },
  {
    id: 'irs-gilroy',
    name: 'IRS Gilroy',
    company: 'IRS',
    type: 'field',
    category: 'field/mechanical',
    city: 'Gilroy',
    state: 'CA',
    lat: 37.0058,
    lng: -121.5683,
    description: 'Field installation and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'field'],
    order: 18
  },
  {
    id: 'irs-ridgefield',
    name: 'IRS Ridgefield',
    company: 'IRS',
    type: 'field',
    category: 'field/mechanical',
    city: 'Ridgefield',
    state: 'WA',
    lat: 45.8151,
    lng: -122.7445,
    description: 'Field installation and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'field'],
    order: 19
  },
  {
    id: 'irs-jacksonville',
    name: 'IRS Jacksonville',
    company: 'IRS',
    type: 'field',
    category: 'field/mechanical',
    city: 'Jacksonville',
    state: 'FL',
    lat: 30.3322,
    lng: -81.6557,
    description: 'Field installation and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'field'],
    order: 20
  },
  {
    id: 'irs-new-brunswick',
    name: 'IRS New Brunswick',
    company: 'IRS',
    type: 'field',
    category: 'field/mechanical',
    city: 'New Brunswick',
    state: 'NJ',
    lat: 40.4862,
    lng: -74.4518,
    description: 'Field installation and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'field'],
    order: 21
  },
  {
    id: 'irs-pottsville',
    name: 'IRS Pottsville',
    company: 'IRS',
    type: 'field',
    category: 'field/mechanical',
    city: 'Pottsville',
    state: 'PA',
    lat: 40.6859,
    lng: -76.1955,
    description: 'Field installation and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'field'],
    order: 22
  },
  {
    id: 'irs-lafayette',
    name: 'IRS Lafayette',
    company: 'IRS',
    type: 'field',
    category: 'field/mechanical',
    city: 'Lafayette',
    state: 'LA',
    lat: 30.2241,
    lng: -92.0198,
    description: 'Field installation and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'field'],
    order: 23
  },
  {
    id: 'irs-nassau',
    name: 'IRS Nassau',
    company: 'IRS',
    type: 'field',
    category: 'field/mechanical',
    city: 'Nassau',
    state: 'Bahamas',
    lat: 25.0343,
    lng: -77.3963,
    description: 'Field installation and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'field', 'travel', 'marine'],
    order: 24
  },
  {
    id: 'irs-ocala',
    name: 'IRS Ocala',
    company: 'IRS',
    type: 'field',
    category: 'field/mechanical',
    city: 'Ocala',
    state: 'FL',
    lat: 29.1872,
    lng: -82.1401,
    description: 'Field installation and modification of mechanical piping systems for various commercial sites.',
    tags: ['government', 'field'],
    order: 25
  }
] as const

// ============================================================================
// EXPORTS
// ============================================================================

export const WELDING_LOCATIONS: WeldingLocation[] = LOCATIONS.map(loc => {
  let img = loc.image === undefined ? findPhoto(loc.id) : loc.image

  return {
    ...loc,
    image: img
  }
})

// ============================================================================
// HELPERS
// ============================================================================

function findPhoto(locationId: string): ImageAsset | undefined {
  return LOCATION_PHOTOS.find(photo => photo.id === locationId)
}

// filters(?)
export const getLocationsByCompany = (company: string): WeldingLocation[] => {
  return WELDING_LOCATIONS.filter(loc => loc.company === company)
}

export const getLocationsByState = (state: string): WeldingLocation[] => {
  return WELDING_LOCATIONS.filter(loc => loc.state === state)
}

export const getLocationsByType = (type: WeldingLocation['type']): WeldingLocation[] => {
  return WELDING_LOCATIONS.filter(loc => loc.type === type)
}

export const getUniqueCompanies = (): string[] => {
  return [...new Set(WELDING_LOCATIONS.map(loc => loc.company))]
}

export const getUniqueStates = (): string[] => {
  return [...new Set(WELDING_LOCATIONS.map(loc => loc.state))].sort()
}

export type WeldingTypes = 'mechanical' | 'fab' | 'field' | 'semiconductor' | 'r&d'
export type WeldingCategories = 'mechanical/field' | 'mechanical/fab' | 'fab/mechanical' | 'fab/r&d' | 'r&d/field' | 'semiconductor/fab' | 'field/mechanical'