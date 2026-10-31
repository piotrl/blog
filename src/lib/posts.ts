import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export const getPosts = async (): Promise<Post[]> =>
  (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

export const postUrl = (post: Post) => `/${post.id}/`;

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const relatedPosts = (post: Post, posts: Post[], limit = 3) =>
  posts
    .filter(p => p.id !== post.id && p.data.tags.some(tag => post.data.tags.includes(tag)))
    .slice(0, limit);
