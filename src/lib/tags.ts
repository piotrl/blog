// Mirrors lodash `kebabCase`, which the Gatsby site used for tag URLs: it splits on
// letter/digit boundaries, so `i18n` became `/tags/i-18-n/`. Keep it to preserve URLs.
const WORDS = /[A-Z]{2,}(?=[A-Z][a-z]|[^A-Za-z]|$)|[A-Z]?[a-z]+|[A-Z]+|\d+/g;

export const tagSlug = (tag: string) => (tag.match(WORDS) ?? []).join('-').toLowerCase();

export const tagUrl = (tag: string) => `/tags/${tagSlug(tag)}/`;
