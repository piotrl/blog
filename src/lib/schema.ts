import { AUTHOR_FULL_NAME, SOCIAL_LINKS } from '../consts';

export const person = (site: URL) => ({
  '@type': 'Person',
  name: AUTHOR_FULL_NAME,
  url: new URL('/about/', site).href,
  sameAs: [...SOCIAL_LINKS.map(link => link.url), 'https://speakerdeck.com/piotrl'],
});

export const withContext = (node: Record<string, unknown>) => ({
  '@context': 'https://schema.org',
  ...node,
});
