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

// Fallback projects data
const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform built with Next.js, featuring product management, user authentication, payment integration, and responsive design.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "MongoDB"],
    github: "https://github.com/halil-yesilyurt/ecommerce-platform",
    demo: "https://ecommerce-demo.vercel.app",
    isNew: true
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop&crop=center",
    techStack: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis"],
    github: "https://github.com/halil-yesilyurt/task-manager",
    demo: "https://task-manager-demo.vercel.app"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&h=600&fit=crop&crop=center",
    techStack: ["Vue.js", "OpenWeather API", "Chart.js", "PWA"],
    github: "https://github.com/halil-yesilyurt/weather-dashboard",
    demo: "https://weather-dashboard.vercel.app"
  },
  {
    id: 4,
    title: "Blog Platform",
    description: "A full-featured blog platform with markdown support, SEO optimization, and content management system.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop&crop=center",
    techStack: ["Next.js", "MDX", "Prisma", "PostgreSQL", "Vercel"],
    github: "https://github.com/halil-yesilyurt/blog-platform",
    demo: "https://blog-platform-demo.vercel.app"
  },
  {
    id: 5,
    title: "Portfolio Website",
    description: "A modern portfolio website with smooth animations, dark mode support, and optimized performance.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop&crop=center",
    techStack: ["React", "Framer Motion", "Tailwind CSS", "Vite"],
    github: "https://github.com/halil-yesilyurt/portfolio",
    demo: "https://portfolio-demo.vercel.app"
  },
  {
    id: 6,
    title: "Chat Application",
    description: "A real-time chat application with user authentication, message history, and file sharing capabilities.",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop&crop=center",
    techStack: ["React", "Firebase", "Socket.io", "Tailwind CSS"],
    github: "https://github.com/halil-yesilyurt/chat-app",
    demo: "https://chat-app-demo.vercel.app"
  }
];

async function getProjects(): Promise<Project[]> {
  try {
    // Try external API first
    const res = await fetch('https://halilyesilyurt.com/api/projects', { 
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
    // Return fallback data if external API fails
    return fallbackProjects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return fallbackProjects;
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
    // Try external API first, fallback to local data
    const res = await fetch('https://halilyesilyurt.com/api/projects');
    const projects = res.ok ? await res.json() : fallbackProjects;
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
