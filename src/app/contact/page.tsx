'use client';
// metadata moved to separate server file

import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import SocialMediaLinks from '../components/SocialMediaLinks';

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
              <SocialMediaLinks variant="footer" className="justify-center" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 