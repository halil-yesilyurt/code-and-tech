import React from 'react';
import ProjectImage from '../components/ProjectImage';

async function getProjects() {
  const res = await fetch('https://halilyesilyurt.com/api/projects', { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Projects</h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {projects && projects.length > 0 ? (
          projects.map((project: any, idx: number) => (
            <div
              key={project.id || project.url || idx}
              className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden card-hover hover:shadow-lg transition-shadow duration-300"
            >
              <ProjectImage src={project.image} alt={project.title} />
              <div className="flex flex-col flex-1 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {project.title}
                </h2>
                <p className="text-slate-600 mb-4 line-clamp-3">{project.description}</p>
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tag: string, tagIdx: number) => (
                      <span key={tag + '-' + tagIdx} className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto flex flex-wrap gap-3 pt-4">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow focus-ring"
                    >
                      View Project
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-slate-100 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 border border-blue-200 focus-ring"
                    >
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 col-span-full">No projects found.</p>
        )}
      </div>
    </main>
  );
} 