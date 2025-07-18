import React from 'react';
import ProjectImage from '../components/ProjectImage';
import Sidebar from '../components/Sidebar';
import { getCategories, getTags, getPosts, getPopularPosts } from '@/lib/wordpress';

async function getProjects() {
  const res = await fetch('https://halilyesilyurt.com/api/projects', { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const categories = await getCategories();
  const tags = await getTags();
  const posts = await getPosts(1, 10);
  const popularPosts = await getPopularPosts(3);
  return (
    <>
      {/* JSON-LD Structured Data for Projects */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            projects.map((p: any) => ({
              '@context': 'https://schema.org',
              '@type': 'Project',
              name: p.title,
              description: p.description,
              image: p.image ? [p.image] : undefined,
              keywords: p.techStack ? p.techStack.join(', ') : undefined,
              url: p.demo || undefined,
              codeRepository: p.github || undefined,
            }))
          ),
        }}
      />
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        <main className='lg:col-span-3 space-y-8'>
          <h1 className='text-3xl font-bold mb-8 text-slate-900'>Projects</h1>
          {!projects || projects.length === 0 ? (
            <div className='bg-white rounded-xl shadow p-8 text-center text-slate-500 border border-slate-200'>
              <p>No projects found. Please check your portfolio API or try again later.</p>
            </div>
          ) : (
            <div className='grid gap-8 md:grid-cols-2'>
              {projects.map((project: unknown) => {
                const p = project as { id: number };
                return <ProjectImage key={p.id} project={p} />;
              })}
            </div>
          )}
        </main>
        <aside className='lg:col-span-1'>
          <div className='sticky top-8'>
            <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
          </div>
        </aside>
      </div>
    </>
  );
}

export async function generateMetadata() {
  const res = await fetch('https://halilyesilyurt.com/api/projects');
  const projects = res.ok ? await res.json() : [];
  const keywords = Array.from(new Set(projects.flatMap((p: any) => p.techStack || [])));
  const title = 'Projects | Code & Tech | Modern Tech Blog';
  const description = 'Explore a curated portfolio of innovative web development projects, creative software solutions, and cutting-edge technology builds by Halil Yesilyurt. Discover real-world applications of modern frameworks, tools, and programming best practices.';
  const images = projects.filter((p: any) => p.image).slice(0, 3).map((p: any) => ({ url: p.image, alt: p.title }));
  return {
    title,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title,
      description,
      images,
      type: 'website',
      url: 'https://halilyesilyurt.com/projects',
    },
    twitter: {
      card: images.length > 0 ? 'summary_large_image' : 'summary',
      title,
      description,
      images: images.map((img: any) => img.url),
    },
  };
}
