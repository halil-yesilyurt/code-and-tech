'use client';
import React, { useState, useEffect } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectSkeleton from '../components/ProjectSkeleton';
import Sidebar from '../components/Sidebar';
import { getCategories, getTags, getPosts, getPopularPosts } from '@/lib/wordpress';

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
    const res = await fetch('/api/projects', { 
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsData, categoriesData, tagsData, popularPostsData] = await Promise.all([
          getProjects(),
          getCategories(),
          getTags(),
          getPopularPosts(3)
        ]);
        
        setProjects(projectsData);
        setCategories(categoriesData);
        setTags(tagsData);
        setPopularPosts(popularPostsData);
      } catch (err) {
        setError('Failed to load projects data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, projects.length));
  };

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < projects.length;

  return (
    <>
      {/* JSON-LD Structured Data for Projects */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            projects.map((p: Project) => ({
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
      
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8'>
        <main className='lg:col-span-3 space-y-6 lg:space-y-8'>
          <div className='text-center lg:text-left'>
            <h1 className='text-3xl lg:text-4xl font-bold mb-4 text-slate-900'>Projects</h1>
            <p className='text-slate-600 text-lg'>Explore my latest web development projects and creative solutions</p>
          </div>

          {loading ? (
            <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <ProjectSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div className='bg-white rounded-xl shadow p-8 text-center text-slate-500 border border-slate-200'>
              <div className='text-red-500 mb-4'>
                <svg className='w-12 h-12 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                </svg>
              </div>
              <p className='text-red-600 font-medium mb-2'>{error}</p>
              <p className='text-sm'>Please try refreshing the page or check back later.</p>
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className='bg-white rounded-xl shadow p-8 text-center text-slate-500 border border-slate-200'>
              <div className='text-slate-400 mb-4'>
                <svg className='w-12 h-12 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33' />
                </svg>
              </div>
              <p>No projects found. Please check your portfolio API or try again later.</p>
            </div>
          ) : (
            <>
              <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                {visibleProjects.map((project: Project) => (
                  <ProjectImage key={project.id} project={project} />
                ))}
              </div>
              
              {/* Show More Button */}
              {hasMoreProjects && (
                <div className='text-center pt-6'>
                  <button
                    onClick={handleShowMore}
                    className='inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg'
                  >
                    <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                    Show More Projects ({projects.length - visibleCount} remaining)
                  </button>
                </div>
              )}
              
              {/* Projects Count */}
              <div className='text-center text-slate-600 text-sm'>
                Showing {visibleProjects.length} of {projects.length} projects
              </div>
            </>
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
