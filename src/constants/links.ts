import type { LocalLink, ExternalLink } from "@/types"

export const LINKS = {
  SITE: {
    LANDING: '/',
    SOFTWARE: '/software',
    WELDING: '/welding',
    PHOTOGRAPHY: '/photography',
    NOT_FOUND: 'na',
  },

  SOCIAL: {
    LINKEDIN: 'https://www.linkedin.com/in/WdRgrs/',
    GITHUB: 'https://github.com/WdRgrs',
    INSTAGRAM: 'https://www.instagram.com/wdrgrs/',
  },

  COMPANIES: {
    RHDM: 'https://www.rhdm.com',
    NEXTIQ: 'https://www.nextiq.com/',
    HINKLE: 'http://www.hinketesting.com',
    DEVMOUNTAIN: 'https://strayer.smartcatalogiq.com/en/2023-2024/catalog/nondegree-noncredit-offerings/devmountain-offerings',
  },

  PROJECTS: {
    ALPHABITS: 'https://wdrgrs.itch.io/alphabits',
    PORTFOLIO_V3: 'https://v3.waderogers.dev/',
    MELODIENT_VIDEO: 'https://youtu.be/Y8CmFLRZMSY',
    PORTFOLIO_V2_VIDEO: 'https://www.youtube.com/watch?v=TyiiZmUncbA',
  },

  REPOS: {
    PORTFOLIO_V3: 'https://github.com/WdRgrs/portfolio.v3',
    PORTFOLIO_V4: 'https://github.com/WdRgrs/portfolio.v4',
    MELODIENT: 'https://github.com/WdRgrs/Melodient',
  },

  PERSONAL: {
    PORTFOLIO: 'https://waderogers.dev',
  },
} as const;


export const SITE_LINKS: ReadonlyArray<LocalLink> = [
  { key: 'landing', label: 'Landing', path: LINKS.SITE.LANDING },
  { key: 'software', label: 'Software', path: LINKS.SITE.SOFTWARE, main: true },
  { key: 'welding', label: 'Welding', path: LINKS.SITE.WELDING, main: true },
  { key: 'photography', label: 'Photography', path: LINKS.SITE.PHOTOGRAPHY, main: true },
  { key: 'not_found', label: 'Not Found', path: LINKS.SITE.NOT_FOUND },
] as const;

export const SOCIAL_LINKS: ReadonlyArray<ExternalLink> = [
  // { key: 'github', label: 'GitHub', href: LINKS.SOCIAL.GITHUB, icon: 'github' },
  { key: 'linkedin', label: 'LinkedIn', href: LINKS.SOCIAL.LINKEDIN, icon: 'linkedin' },
  { key: 'instagram', label: 'Instagram', href: LINKS.SOCIAL.INSTAGRAM, icon: 'instagram' },
] as const;

export const PROJECT_LINKS: ReadonlyArray<ExternalLink> = [
  { key: 'alphabits', label: 'Alphabits', href: LINKS.PROJECTS.ALPHABITS, icon: 'external' },
  { key: 'melodient', label: 'Melodient', href: LINKS.PROJECTS.MELODIENT_VIDEO, icon: 'external' },
  { key: 'melodient-repo', label: 'Melodient Repo', href: LINKS.REPOS.MELODIENT, icon: 'github' },
] as const;


