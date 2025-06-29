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
  let projects = [];
  try {
    projects = await getProjects();
    console.log('Fetched projects:', projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    projects = [];
  }
  const categories = await getCategories();
  const tags = await getTags();
  const posts = await getPosts(1, 10);
  const popularPosts = await getPopularPosts(3);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3 space-y-8">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Projects</h1>
        {(!projects || projects.length === 0) ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-slate-500 border border-slate-200">
            <p>No projects found. Please check your portfolio API or try again later.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project: any) => (
              <ProjectImage key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
      <aside className="lg:col-span-1">
        <div className="sticky top-8">
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </div>
      </aside>
    </div>
  );
} 