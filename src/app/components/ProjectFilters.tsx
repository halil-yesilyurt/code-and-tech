'use client';
import { useState, useMemo, useEffect } from 'react';

interface ProjectFiltersProps {
  projects: any[];
  onFilterChange: (filteredProjects: any[]) => void;
}

export default function ProjectFilters({ projects, onFilterChange }: ProjectFiltersProps) {
  const [selectedTech, setSelectedTech] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Get all unique tech stack items
  const allTechStack = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      if (project.techStack) {
        project.techStack.forEach((tech: string) => techSet.add(tech));
      }
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter projects based on search term and selected tech
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTech = selectedTech === 'all' || 
        (project.techStack && project.techStack.includes(selectedTech));
      
      return matchesSearch && matchesTech;
    });
  }, [projects, searchTerm, selectedTech]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filteredProjects);
  }, [filteredProjects, onFilterChange]);

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Search Projects
          </label>
          <div className="relative group">
            <input
              type="text"
              id="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-200 outline-none"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tech Stack Filter */}
        <div className="lg:w-64">
          <label htmlFor="tech-filter" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Filter by Technology
          </label>
          <div className="relative">
            <select
              id="tech-filter"
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-200 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Technologies</option>
              {allTechStack.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedTech !== 'all') && (
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTech !== 'all' && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                {selectedTech}
                <button
                  onClick={() => setSelectedTech('all')}
                  className="ml-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTech('all');
              }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline font-medium transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 