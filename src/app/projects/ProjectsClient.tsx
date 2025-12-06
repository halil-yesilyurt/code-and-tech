'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectFilters from '../components/ProjectFilters';
import Sidebar from '../components/Sidebar';

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

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface ProjectsClientProps {
  projects: Project[];
  categories: Category[];
  tags: Tag[];
  popularPosts: any[]; // Temporary fix for type mismatch
}

export default function ProjectsClient({ projects, categories, tags, popularPosts }: ProjectsClientProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  // Initialize visibleCount only once
  useEffect(() => {
    setVisibleCount(4);
  }, []);

  // Update filteredProjects when projects prop changes
  useEffect(() => {
    setFilteredProjects(projects);
    // Don't reset visibleCount here - let it persist
  }, [projects]);

  const handleShowMore = () => {
    const newCount = Math.min(visibleCount + 4, filteredProjects.length);
    setVisibleCount(newCount);
  };

  // Memoize the filter change handler to avoid unnecessary re-renders that reset visibleCount
  const handleFilterChange = useCallback((filtered: Project[]) => {
    setFilteredProjects(filtered);
    setVisibleCount(4); // Reset to show first 4 when filtering
  }, []);
  
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
      
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 my-10'>
        <main className='lg:col-span-2 space-y-6 lg:space-y-8'>
          {/* Header Section */}
          <div className='space-y-4'>
            <div className="space-y-2">
              <h1 className='text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight'>
                Projects
              </h1>
              <p className='text-gray-600 dark:text-gray-400 text-lg lg:text-xl'>
                Explore my latest web development projects and creative solutions
              </p>
            </div>
            {/* Removed unnecessary stats section */}
          </div>

          {!projects || projects.length === 0 ? (
            <div className='bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-8 text-center text-gray-500 dark:text-gray-400'>
              <div className='text-gray-400 dark:text-gray-500 mb-4'>
                <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33' />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No projects found</p>
              <p className="text-sm">Please check your portfolio API or try again later.</p>
            </div>
          ) : (
            <>
              {/* Project Filters */}

              <ProjectFilters 
                projects={projects} 
                onFilterChange={handleFilterChange} 
              />
              
              {filteredProjects.length === 0 ? (
                <div className='bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-8 text-center text-gray-500 dark:text-gray-400'>
                  <div className='text-gray-400 dark:text-gray-500 mb-4'>
                    <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No projects match your filters</p>
                  <p className="text-sm mb-4">Try adjusting your search criteria or clearing the filters.</p>
                  <button
                    onClick={() => {
                      setFilteredProjects(projects);
                      setVisibleCount(4);
                    }}
                    className='px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium'
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Projects Grid */}
                  {/* Grid adjusted to 2 columns on medium and larger devices for a 2x2 layout initially */}
                  <div className='grid gap-6 md:grid-cols-2'>
                    {visibleProjects.map((project: Project) => (
                      <ProjectImage key={project.id} project={project} />
                    ))}
                  </div>
                  
                  {/* Show More Button */}
                  {hasMoreProjects && (
                    <div className='text-center mt-10'>
                      <button
                        onClick={handleShowMore}
                        className='bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block cursor-pointer'
                        type='button'
                      >
                        Show More Projects ({visibleCount}/{filteredProjects.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
        
        <aside>
          <div className='sticky top-8'>
            <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
          </div>
        </aside>
      </div>
    </>
  );
} 