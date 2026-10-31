export const SITE_TITLE = 'Piotr Lewandowski';
export const SITE_DESCRIPTION =
  'Piotr Lewandowski, Product Architect at Dynatrace, on frontend architecture, TypeScript, observability and working with people and AI agents.';
export const AUTHOR = 'Piotr';
export const AUTHOR_FULL_NAME = 'Piotr Lewandowski';
export const JOB_TITLE = 'Product Architect';
export const EMPLOYER = { name: 'Dynatrace', url: 'https://www.dynatrace.com/' };
export const ABOUT =
  'Product Architect at Dynatrace. Frontend architecture, observability, and working with people and AI agents.';
export const POSTS_PER_PAGE = 10;

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/piotr--lewandowski/' },
  { label: 'GitHub', url: 'https://github.com/piotrl' },
];

export const FOCUS_AREAS = [
  {
    title: 'Frontend architecture',
    summary: 'Large TypeScript codebases, monorepos, build tooling and their trade-offs.',
  },
  {
    title: 'Observability',
    summary: 'What happens to an application after release, and what incidents teach.',
  },
  {
    title: 'Working with people and agents',
    summary: 'Clear specs, context and feedback loops that teams and AI agents can act on.',
  },
];

export const CONTACT_EMAIL = 'mail@piotrl.net';

// Career path on the home page; `years` is shown only when set.
// Career path on the home page: short on purpose, details live on LinkedIn.
export const CAREER: { stage: string; detail: string }[] = [
  { stage: 'Java backends', detail: 'Java and Spring services' },
  { stage: 'Angular monorepos', detail: 'Frontend at scale' },
  { stage: 'Teaching', detail: 'Bootcamps and workshops' },
  { stage: 'React micro apps', detail: 'Apps and platform libraries' },
  { stage: 'Leadership', detail: 'Team captain and mentor' },
  { stage: 'Product architecture', detail: 'Product Architect at Dynatrace' },
];
export const CAREER_SINCE = 2013;
export const CAREER_NOTE =
  'Along the way: products shipped as SaaS and on-premise, and long-term migrations.';

// Random seed (`openssl rand -hex 16`). Drives the accent hue and the home page topology; change it to reroll.
export const DESIGN_SEED = '6f58704967446e7e004939d7df2e35ad';
