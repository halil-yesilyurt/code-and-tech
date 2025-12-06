'use client';
// metadata moved to separate server file

import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import SocialMediaLinks from '../components/SocialMediaLinks';

export default function ContactPage() {
  return (
    <div className="my-8">
      <div className="max-w-4xl mx-auto">
        {/* Contact Card */}
        <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-6 md:p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have a question about my blog posts, want to collaborate, or just want to say hello? I'd love to hear from you!
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 text-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Let's Connect</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                I'm passionate about technology and love sharing knowledge through my blog. 
                Whether you have questions about my articles, want to discuss tech topics, 
                or are interested in collaboration, I'm always happy to connect!
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-2">
                  <EnvelopeIcon className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">hi@halilyesilyurt.com</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">I'll get back to you within 24 hours</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Follow Me</h3>
              <div className="flex justify-center w-full">
                <SocialMediaLinks variant="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 