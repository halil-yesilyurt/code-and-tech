import React from 'react';
import { getCategories, getTags, getPopularPosts } from '@/lib/wordpress';
import ProjectsClient from './ProjectsClient';

interface Project {
  id: number | string;
  title: string;
  description: string;
  image?: string;
  techStack?: string[];
  github?: string;
  demo?: string;
  url?: string;
  isNew?: boolean;
}

// Fallback projects data (no images - will show proper fallback state)
const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform built with Next.js, featuring product management, user authentication, payment integration, and responsive design.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "MongoDB"],
    github: "https://github.com/halil-yesilyurt/ecommerce-platform",
    demo: "https://ecommerce-demo.vercel.app",
    isNew: true
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    techStack: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis"],
    github: "https://github.com/halil-yesilyurt/task-manager",
    demo: "https://task-manager-demo.vercel.app"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
    techStack: ["Vue.js", "OpenWeather API", "Chart.js", "PWA"],
    github: "https://github.com/halil-yesilyurt/weather-dashboard",
    demo: "https://weather-dashboard.vercel.app"
  },
  {
    id: 4,
    title: "Blog Platform",
    description: "A full-featured blog platform with markdown support, SEO optimization, and content management system.",
    techStack: ["Next.js", "MDX", "Prisma", "PostgreSQL", "Vercel"],
    github: "https://github.com/halil-yesilyurt/blog-platform",
    demo: "https://blog-platform-demo.vercel.app"
  },
  {
    id: 5,
    title: "Portfolio Website",
    description: "A modern portfolio website with smooth animations, dark mode support, and optimized performance.",
    techStack: ["React", "Framer Motion", "Tailwind CSS", "Vite"],
    github: "https://github.com/halil-yesilyurt/portfolio",
    demo: "https://portfolio-demo.vercel.app"
  },
  {
    id: 6,
    title: "Chat Application",
    description: "A real-time chat application with user authentication, message history, and file sharing capabilities.",
    techStack: ["React", "Firebase", "Socket.io", "Tailwind CSS"],
    github: "https://github.com/halil-yesilyurt/chat-app",
    demo: "https://chat-app-demo.vercel.app"
  },
  {
    id: 7,
    title: "Code & Tech",
    description: "A modern, high-performance tech blog that leverages a headless WordPress backend with Next.js frontend for optimal performance and SEO.",
    techStack: ["Next.js", "React", "WordPress", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/halil-yesilyurt/code-and-tech",
    demo: "https://code-and-tech.halilyesilyurt.com",
    isNew: true
  },
  {
    id: 8,
    title: "Github Mutuals",
    description: "A powerful tool for developers to analyze their professional network on GitHub. This web application helps users discover mutual connections and potential collaborators.",
    techStack: ["React", "TypeScript", "GitHub API", "Chart.js", "Tailwind CSS"],
    github: "https://github.com/halil-yesilyurt/github-mutuals",
    demo: "https://github-mutuals.vercel.app"
  },
  {
    id: 9,
    title: "Personal Finance Tracker",
    description: "A comprehensive personal finance management application with expense tracking, budget planning, and financial analytics.",
    techStack: ["Vue.js", "Node.js", "MongoDB", "Chart.js", "PWA"],
    github: "https://github.com/halil-yesilyurt/finance-tracker",
    demo: "https://finance-tracker.vercel.app"
  },
  {
    id: 10,
    title: "QR Code Generator",
    description: "A versatile QR code generator with customization options, analytics tracking, and bulk generation capabilities.",
    techStack: ["React", "QR Code API", "Tailwind CSS", "Local Storage"],
    github: "https://github.com/halil-yesilyurt/qr-generator",
    demo: "https://qr-generator.vercel.app"
  },
  {
    id: 11,
    title: "Tactical RPG Game",
    description: "A browser-based tactical role-playing game with turn-based combat, character progression, and strategic gameplay.",
    techStack: ["JavaScript", "Canvas API", "Web Audio API", "Local Storage"],
    github: "https://github.com/halil-yesilyurt/tactical-rpg",
    demo: "https://tactical-rpg.vercel.app"
  }
];

async function getProjects(): Promise<Project[]> {
  try {
    // Attempt to fetch projects from external API
    const res = await fetch('https://halilyesilyurt.com/api/projects', { 
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CodeAndTech/1.0'
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      } else {
        console.error('External API returned empty or invalid data, using fallback');
      }
    } else {
      console.error('External API failed with status:', res.status);
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://code-and-tech.halilyesilyurt.com';
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
        canonical: `${baseUrl}/projects`,
      },
      openGraph: {
        title,
        description,
        images,
        type: 'website',
        url: `${baseUrl}/projects`,
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
