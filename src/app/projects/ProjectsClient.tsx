'use client';

import { useState, useEffect, useCallback } from 'react';
import ProjectImage from '../components/ProjectImage';
import ProjectFilters from '../components/ProjectFilters';
import Sidebar from '../components/Sidebar';
import EditorialPageShell from '../components/EditorialPageShell';

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

interface Category { id: number; name: string; slug: string }
interface Tag { id: number; name: string; slug: string }

interface ProjectsClientProps {
  projects: Project[];
  categories: Category[];
  tags: Tag[];
  popularPosts: any[];
}

export default function ProjectsClient({ projects, categories, tags, popularPosts }: ProjectsClientProps) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [filtersKey, setFiltersKey] = useState(0);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  useEffect(() => { setFilteredProjects(projects); }, [projects]);

  const handleFilterChange = useCallback((filtered: Project[]) => {
    setFilteredProjects(filtered);
    setVisibleCount(4);
  }, []);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

  return (
    <>
      {/* Preserve the existing schema.org project data. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projects.map((project) => ({
            '@context': 'https://schema.org',
            '@type': 'Project',
            name: project.title,
            description: project.description,
            image: project.image ? [project.image] : undefined,
            keywords: project.techStack?.join(', '),
            url: project.demo || undefined,
            codeRepository: project.github || undefined,
          }))),
        }}
      />
      <EditorialPageShell
        kind="projects"
        eyebrow="THE CODE & TECH JOURNAL / PROJECTS"
        title="Built to explore"
        description="A selection of software projects, experiments and useful tools."
      >
        <section className="ct-p3-section" aria-label="Browse projects">
          {projects.length ? (
            <>
              <div className="ct-p3-filter-panel"><ProjectFilters key={filtersKey} projects={projects} onFilterChange={handleFilterChange} /></div>
              <div className="ct-p3-section-line">
                <h2>Project archive<span className="ct-sage-period">.</span></h2>
                <span>{filteredProjects.length} projects</span>
              </div>
              {filteredProjects.length ? (
                <>
                  <div className="ct-p3-project-grid">
                    {visibleProjects.map((project) => <ProjectImage key={project.id} project={project} />)}
                  </div>
                  {hasMoreProjects && (
                    <div className="ct-p3-more">
                      <button type="button" onClick={() => setVisibleCount((count) => Math.min(count + 4, filteredProjects.length))}>
                        Show more projects ({visibleCount}/{filteredProjects.length}) <span aria-hidden="true">↓</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="ct-p3-empty">
                  <h3>No projects match your filters</h3>
                  <p>Adjust the search or technology to explore other projects.</p>
                  <button type="button" onClick={() => { setFiltersKey((key) => key + 1); setFilteredProjects(projects); setVisibleCount(4); }}>
                    Show all projects
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="ct-p3-empty"><h2>No projects found</h2><p>Please check back later.</p></div>
          )}
        </section>
        <section className="ct-p3-discovery" aria-label="Explore more from Code & Tech">
          <div className="ct-p3-section-line"><h2>More to discover<span className="ct-sage-period">.</span></h2></div>
          <Sidebar popularPosts={popularPosts} tags={tags} categories={categories} />
        </section>
      </EditorialPageShell>
    </>
  );
}
