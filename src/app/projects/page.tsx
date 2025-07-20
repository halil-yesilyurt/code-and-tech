import React from 'react';
import ProjectsClient from './ProjectsClient';
import { getCategories, getTags, getPopularPosts } from '@/lib/wordpress';

interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  techStack?: string[];
  github?: string;
  demo?: string;
  isNew?: boolean;
}

async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch('https://code-and-tech.vercel.app/api/projects', { 
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });
    if (!res.ok) {
      console.error('Projects API error:', res.status, res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const [projects, categories, tags, popularPosts] = await Promise.all([
    getProjects(),
    getCategories(),
    getTags(),
    getPopularPosts(3)
  ]);

  return <ProjectsClient projects={projects} categories={categories} tags={tags} popularPosts={popularPosts} />;
}

export async function generateMetadata() {
  try {
    const res = await fetch('https://code-and-tech.vercel.app/api/projects');
    const projects = res.ok ? await res.json() : [];
    const keywords = Array.from(new Set(projects.flatMap((p: any) => p.techStack || [])));
    const title = 'Projects | Code & Tech | Modern Tech Blog';
    const description = 'Explore a curated portfolio of innovative web development projects, creative software solutions, and cutting-edge technology builds by Halil Yesilyurt. Discover real-world applications of modern frameworks, tools, and programming best practices.';
    const images = projects.filter((p: any) => p.image).slice(0, 3).map((p: any) => ({ url: p.image, alt: p.title }));
    
    return {
      title,
      description,
      keywords: keywords.join(', '),
      alternates: {
        canonical: 'https://code-and-tech.vercel.app/projects',
      },
      openGraph: {
        title,
        description,
        images,
        type: 'website',
        url: 'https://code-and-tech.vercel.app/projects',
      },
      twitter: {
        card: images.length > 0 ? 'summary_large_image' : 'summary',
        title,
        description,
        images: images.map((img: any) => img.url),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Projects | Code & Tech',
      description: 'Explore web development projects and creative software solutions.',
    };
  }
}
