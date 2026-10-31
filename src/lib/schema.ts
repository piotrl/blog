import { AUTHOR_FULL_NAME, EMPLOYER, JOB_TITLE, SOCIAL_LINKS } from '../consts';

export const person = (site: URL) => ({
  '@type': 'Person',
  name: AUTHOR_FULL_NAME,
  url: new URL('/about/', site).href,
  jobTitle: JOB_TITLE,
  worksFor: { '@type': 'Organization', ...EMPLOYER },
  address: { '@type': 'PostalAddress', addressLocality: 'Gdańsk', addressCountry: 'PL' },
  sameAs: SOCIAL_LINKS.map(link => link.url),
});

export const withContext = (node: Record<string, unknown>) => ({
  '@context': 'https://schema.org',
  ...node,
});
