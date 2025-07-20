'use client';
import React, { useState } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectSkeleton from '../components/ProjectSkeleton';
import ProjectFilters from '../components/ProjectFilters';
import Sidebar from '../components/Sidebar';

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

interface ProjectsClientProps {
  projects: Project[];
  categories: any[];
  tags: any[];
  popularPosts: any[];
}

export default function ProjectsClient({ projects, categories, tags, popularPosts }: ProjectsClientProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredProjects.length));
  };

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

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

          {!projects || projects.length === 0 ? (
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
              {/* Project Filters */}
              <ProjectFilters 
                projects={projects} 
                onFilterChange={(filtered) => {
                  setFilteredProjects(filtered);
                  setVisibleCount(6); // Reset to show first 6 when filtering
                }} 
              />
              
              {filteredProjects.length === 0 ? (
                <div className='bg-white rounded-xl shadow p-8 text-center text-slate-500 border border-slate-200'>
                  <div className='text-slate-400 mb-4'>
                    <svg className='w-12 h-12 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                  </div>
                  <p>No projects match your current filters.</p>
                  <button
                    onClick={() => {
                      setFilteredProjects(projects);
                      setVisibleCount(6);
                    }}
                    className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                  {visibleProjects.map((project: Project) => (
                    <ProjectImage key={project.id} project={project} />
                  ))}
                </div>
              )}
              
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
                    Show More Projects ({filteredProjects.length - visibleCount} remaining)
                  </button>
                </div>
              )}
              
              {/* Projects Count */}
              <div className='text-center text-slate-600 text-sm'>
                Showing {visibleProjects.length} of {filteredProjects.length} projects
                {filteredProjects.length !== projects.length && (
                  <span className='text-blue-600'> (filtered from {projects.length} total)</span>
                )}
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