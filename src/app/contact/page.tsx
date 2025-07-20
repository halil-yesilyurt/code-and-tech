'use client';
// metadata moved to separate server file

import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question about my blog posts, want to collaborate, or just want to say hello? I'd love to hear from you!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8 text-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Let's Connect</h2>
              <p className="text-gray-600 mb-8">
                I'm passionate about technology and love sharing knowledge through my blog. 
                Whether you have questions about my articles, want to discuss tech topics, 
                or are interested in collaboration, I'm always happy to connect!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col items-center space-x-4 justify-center">
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                </div>
                  <p className="text-gray-600">hi@halilyesilyurt.com</p>
                  <p className="text-sm text-gray-500">I'll get back to you within 24 hours</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Me</h3>
              <div className="flex space-x-4 justify-center">
                <a href="https://halilyesilyurt.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </a>
                <a href="https://www.linkedin.com/in/halilyesilyurt/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.601 2.001 3.601 4.601v5.595z"/></svg>
                </a>
                <a href="https://github.com/halil-yesilyurt" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="mailto:hi@halilyesilyurt.com" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 