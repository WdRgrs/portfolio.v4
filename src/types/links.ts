export type LocalLink = Readonly<{
  key: string
  label: string
  path: string
  main?: boolean
}>;

export type ExternalLink = Readonly<{
  key: string;
  label: string;
  href: string;
  icon?: 'github' | 'linkedin' | 'instagram' | 'external';
  rel?: string;
}>;