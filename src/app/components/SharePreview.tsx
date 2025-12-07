'use client';
import { useState } from 'react';
import { getFeaturedImageUrl, decodeHtmlEntities, stripHtml } from '@/lib/wordpress';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://code-and-tech.halilyesilyurt.com';

interface SharePreviewProps {
  url: string;
  title: string;
  description?: string;
  featuredImage?: string;
  siteName?: string;
  platform?: 'facebook' | 'twitter' | 'linkedin';
}

export default function SharePreview({ 
  url, 
  title, 
  description, 
  featuredImage,
  siteName = 'Code & Tech',
  platform = 'facebook'
}: SharePreviewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState(platform);

  const platforms = [
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter/X', color: 'bg-black' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700' }
  ];

  const renderPreview = () => {
    const decodedTitle = decodeHtmlEntities(title);
    const decodedDescription = description ? stripHtml(decodeHtmlEntities(description)) : '';
    const imageUrl = featuredImage || '/screenshot-1.png';

    switch (selectedPlatform) {
      case 'facebook':
        return (
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm max-w-md">
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
              <img 
                src={imageUrl} 
                alt={decodedTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/screenshot-1.png';
                }}
              />
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {siteName}
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                {decodedTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {decodedDescription.length > 120 ? `${decodedDescription.substring(0, 120)}...` : decodedDescription}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                {url.replace(/https:\/\/code-and-tech\.vercel\.app/g, SITE_URL)}
              </div>
            </div>
          </div>
        );

      case 'twitter':
        return (
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm max-w-md">
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">CT</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900 dark:text-white">Code & Tech</span>
                    <span className="text-gray-500 dark:text-gray-400">@haliilyesilyurt</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white mt-1 leading-relaxed">
                    {decodedTitle}
                  </p>
                  {decodedDescription && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                      {decodedDescription.length > 100 ? `${decodedDescription.substring(0, 100)}...` : decodedDescription}
                    </p>
                  )}
                  <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="relative h-32 bg-gray-200 dark:bg-gray-700">
                      <img 
                        src={imageUrl} 
                        alt={decodedTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/screenshot-1.png';
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        {siteName}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                        {decodedTitle}
                      </h4>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {url.replace(/https:\/\/code-and-tech\.vercel\.app/g, SITE_URL)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm max-w-md">
            <div className="relative h-32 bg-gray-200 dark:bg-gray-700">
              <img 
                src={imageUrl} 
                alt={decodedTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/screenshot-1.png';
                }}
              />
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {siteName}
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                {decodedTitle}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {decodedDescription.length > 150 ? `${decodedDescription.substring(0, 150)}...` : decodedDescription}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                {url.replace(/https:\/\/code-and-tech\.vercel\.app/g, SITE_URL)}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-gray-700">
      <h3 className="font-geist text-lg font-semibold text-slate-900 dark:text-white mb-4">Share Preview</h3>
      
      {/* Platform Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id as any)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPlatform === platform.id
                ? `${platform.color} text-white`
                : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
            }`}
          >
            {platform.name}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="flex justify-center mb-6">
        <div className="w-full max-w-md">
          {renderPreview()}
        </div>
      </div>

      {/* Preview Info */}
      <div className="p-4 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Preview Details</h4>
        <div className="space-y-3 text-sm text-slate-600 dark:text-gray-400">
          <div>
            <span className="font-medium text-slate-700 dark:text-gray-300">Title:</span>
            <div className="mt-1 text-slate-800 dark:text-gray-200">{decodeHtmlEntities(title)}</div>
          </div>
          {description && (
            <div>
              <span className="font-medium text-slate-700 dark:text-gray-300">Description:</span>
              <div className="mt-1 text-slate-800 dark:text-gray-200 leading-relaxed">
                {stripHtml(decodeHtmlEntities(description))}
              </div>
            </div>
          )}
          <div>
            <span className="font-medium text-slate-700 dark:text-gray-300">URL:</span>
            <div className="mt-1 text-slate-800 dark:text-gray-200 break-all">{url.replace(/https:\/\/code-and-tech\.vercel\.app/g, SITE_URL)}</div>
          </div>
          <div>
            <span className="font-medium text-slate-700 dark:text-gray-300">Image:</span>
            <div className="mt-1 text-slate-800 dark:text-gray-200">{featuredImage ? 'Custom image' : 'Default image'}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 