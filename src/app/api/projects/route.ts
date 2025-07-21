import { NextResponse } from 'next/server';

// Fallback projects data in case external API is not available
const fallbackProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform built with Next.js, featuring product management, user authentication, payment integration, and responsive design.",
    image: "/screenshot-1.png",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "MongoDB"],
    github: "https://github.com/halil-yesilyurt/ecommerce-platform",
    demo: "https://ecommerce-demo.vercel.app",
    isNew: true
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
    image: "/screenshot-2.png",
    techStack: ["React", "Node.js", "Socket.io", "PostgreSQL", "Redis"],
    github: "https://github.com/halil-yesilyurt/task-manager",
    demo: "https://task-manager-demo.vercel.app"
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description: "A beautiful weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
    image: "/screenshot-3.png",
    techStack: ["Vue.js", "OpenWeather API", "Chart.js", "PWA"],
    github: "https://github.com/halil-yesilyurt/weather-dashboard",
    demo: "https://weather-dashboard.vercel.app"
  },
  {
    id: 4,
    title: "Blog Platform",
    description: "A full-featured blog platform with markdown support, SEO optimization, and content management system.",
    image: "/screenshot-1.png",
    techStack: ["Next.js", "MDX", "Prisma", "PostgreSQL", "Vercel"],
    github: "https://github.com/halil-yesilyurt/blog-platform",
    demo: "https://blog-platform-demo.vercel.app"
  },
  {
    id: 5,
    title: "Portfolio Website",
    description: "A modern portfolio website with smooth animations, dark mode support, and optimized performance.",
    image: "/screenshot-2.png",
    techStack: ["React", "Framer Motion", "Tailwind CSS", "Vite"],
    github: "https://github.com/halil-yesilyurt/portfolio",
    demo: "https://portfolio-demo.vercel.app"
  },
  {
    id: 6,
    title: "Chat Application",
    description: "A real-time chat application with user authentication, message history, and file sharing capabilities.",
    image: "/screenshot-3.png",
    techStack: ["React", "Firebase", "Socket.io", "Tailwind CSS"],
    github: "https://github.com/halil-yesilyurt/chat-app",
    demo: "https://chat-app-demo.vercel.app"
  }
];

export async function GET() {
  try {
    // Try to fetch from external API first
    const externalResponse = await fetch('https://halilyesilyurt.com/api/projects', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CodeAndTech/1.0'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (externalResponse.ok) {
      const externalData = await externalResponse.json();
      if (Array.isArray(externalData) && externalData.length > 0) {
        return NextResponse.json(externalData);
      }
    }

    // If external API fails or returns empty data, use fallback
    return NextResponse.json(fallbackProjects);
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Return fallback data on error
    return NextResponse.json(fallbackProjects);
  }
} 