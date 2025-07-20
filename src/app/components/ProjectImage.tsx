"use client";
import { useState } from "react";

const GitHubIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" />
  </svg>
);

export default function ProjectImage({ project }: { project: unknown }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const { image, title, description, techStack, github, demo, isNew } = project as any;

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-slate-100 group">
      {/* Image */}
      <div className="relative w-full h-48 sm:h-56 bg-slate-100 flex items-center justify-center overflow-hidden">
        {isNew && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-md">
            NEW
          </span>
        )}
        
        {image && !imgError ? (
          <>
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <img
              src={image}
              alt={title || 'Project image'}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imgLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImgLoading(false)}
              onError={() => {
                setImgError(true);
                setImgLoading(false);
              }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs sm:text-sm">No Image</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-slate-700 mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>
        
        {/* Tech Stack Tags */}
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            {techStack.slice(0, 4).map((tag: string) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {tag}
              </span>
            ))}
            {techStack.length > 4 && (
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100">
                +{techStack.length - 4} more
              </span>
            )}
          </div>
        )}
        
        {/* Buttons */}
        <div className="mt-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
          {github && (
            <a 
              href={github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg bg-slate-100 text-slate-800 font-medium text-sm sm:text-base text-center hover:bg-slate-200 transition-colors duration-200 border border-slate-200"
            >
              <GitHubIcon /> 
              <span className="hidden sm:inline">Source Code</span>
              <span className="sm:hidden">Code</span>
            </a>
          )}
          {demo && (
            <a 
              href={demo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm sm:text-base text-center hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <ExternalLinkIcon /> 
              <span className="hidden sm:inline">Live Demo</span>
              <span className="sm:hidden">Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 