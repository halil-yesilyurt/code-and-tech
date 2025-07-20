export default function ProjectSkeleton() {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-md border border-slate-100 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 sm:h-56 bg-slate-200"></div>
      
      {/* Content skeleton */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
        
        {/* Tech stack skeleton */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-slate-200 rounded-full w-16"></div>
          <div className="h-6 bg-slate-200 rounded-full w-20"></div>
          <div className="h-6 bg-slate-200 rounded-full w-14"></div>
        </div>
        
        {/* Buttons skeleton */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
          <div className="flex-1 h-10 bg-slate-200 rounded-lg"></div>
          <div className="flex-1 h-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
} 