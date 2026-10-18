import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
export async function getStaticPaths() {
  return (await getCollection('lernen')).map(entry => ({ params: { slug: entry.data.slug }, props: { entry } }));
}
export const GET: APIRoute = ({ props }) => {
  const { entry } = props;
  return new Response(`# ${entry.data.title}\n\n${entry.data.lead}\n\n${entry.body}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
