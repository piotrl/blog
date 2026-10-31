export const SITE_TITLE = 'Piotr Lewandowski';
export const SITE_DESCRIPTION =
  'Piotr Lewandowski, Product Architect at Dynatrace, on frontend architecture, TypeScript, observability and practical automation.';
export const AUTHOR = 'Piotr';
export const AUTHOR_FULL_NAME = 'Piotr Lewandowski';
export const JOB_TITLE = 'Product Architect';
export const EMPLOYER = { name: 'Dynatrace', url: 'https://www.dynatrace.com/' };
export const ABOUT =
  'Product Architect at Dynatrace. Frontend architecture, observability and practical automation.';
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
    title: 'Automation and AI workflows',
    summary: 'Small tools built like production code; agents where they save real time.',
  },
];

export const CONTACT_EMAIL = 'mail@piotrl.net';

// Career path on the home page; `years` is shown only when set.
export const CAREER: { stage: string; detail: string; years?: string }[] = [
  { stage: 'Backend', detail: 'Java ecosystem' },
  { stage: 'Frontend', detail: 'JavaScript and TypeScript' },
  { stage: 'Architecture', detail: 'Product Architect at Dynatrace' },
];
export const CAREER_NOTE =
  'Along the way: products shipped as SaaS and on-premise, and long-term migrations.';

// Random seed (`openssl rand -hex 16`). Drives the accent hue and the home page topology; change it to reroll.
export const DESIGN_SEED = '6f58704967446e7e004939d7df2e35ad';
