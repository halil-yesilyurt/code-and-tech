import React from 'react';
import ProjectImage from '../components/ProjectImage';
import Sidebar from '../components/Sidebar';
import { getCategories, getTags, getPosts } from '@/lib/wordpress';

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
  const popularPosts = posts.slice(0, 3);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3 space-y-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Projects</h1>
        <div className="grid gap-8">
          {projects.map((project: any) => (
            <ProjectImage key={project.id} project={project} />
          ))}
        </div>
      </main>
      <aside className="lg:col-span-1">
        <div className="sticky top-8">
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
} 