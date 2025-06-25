import { getPageBySlug } from '@/lib/wordpress';

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  if (!page) return <div>Page not found</div>;
  return (
    <main className='max-w-3xl mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-4'>{page.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
    </main>
  );
}
