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
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
            Search Projects
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            <svg className="absolute right-3 top-2.5 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tech Stack Filter */}
        <div className="sm:w-48">
          <label htmlFor="tech-filter" className="block text-sm font-medium text-slate-700 mb-2">
            Filter by Tech
          </label>
          <select
            id="tech-filter"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Technologies</option>
            {allTechStack.map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedTech !== 'all') && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-600">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTech !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Tech: {selectedTech}
                <button
                  onClick={() => setSelectedTech('all')}
                  className="ml-1 text-green-600 hover:text-green-800"
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
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 