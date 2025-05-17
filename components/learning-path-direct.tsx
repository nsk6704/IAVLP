"use client";

import { useState, useEffect } from 'react';
import { fetchLearningPath, LearningPathStep, LearningPathImageResponse } from '@/lib/learning-path-service-direct';
import { ArrowLeft, Clock, ExternalLink, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface LearningPathDirectProps {
  topic: string;
  returnUrl: string;
  pageTitle: string;
}

export default function LearningPathDirect({ topic, returnUrl, pageTitle }: LearningPathDirectProps) {
  const [steps, setSteps] = useState<LearningPathStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageResponse, setImageResponse] = useState<LearningPathImageResponse | null>(null);

  // Fetch learning path from AI bot
  const fetchPath = async () => {
    setIsLoading(true);
    setError(null);
    setImageResponse(null);
    
    try {
      const response = await fetchLearningPath(topic);
      
      // Check if we received an image response
      if ('isImage' in response && response.isImage) {
        console.log('Displaying image response');
        setImageResponse(response);
        setIsLoading(false);
      } else if ('success' in response && response.success && response.steps.length > 0) {
        setSteps(response.steps);
        setIsLoading(false);
      } else if ('success' in response) {
        setError(response.message || "Failed to load learning path. Please try again.");
        setIsLoading(false);
      } else {
        setError("Received an invalid response format. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching learning path:', error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Initialize learning path
  useEffect(() => {
    fetchPath();
  }, [topic]);

  const getTotalTime = () => {
    return steps.reduce((total, step) => total + step.estimatedTimeMinutes, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Creating your learning path...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Learning Path</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={fetchPath}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              Try Again
            </Button>
            <Link href={returnUrl}>
              <Button 
                className="bg-white/10 hover:bg-white/20"
              >
                Back to {pageTitle}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Display image if we received an image response
  if (imageResponse) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start pt-10">
        <div className="fixed top-0 left-0 w-full backdrop-blur-md bg-black/50 p-4 z-10 flex items-center">
          <Link href={returnUrl} className="mr-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold flex-1">Learning Path for: {imageResponse.topic}</h1>
        </div>
        
        <div className="mt-20 max-w-4xl w-full px-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Visual Learning Path</h2>
            <div className="relative w-full max-w-3xl rounded-lg overflow-hidden border border-white/20 mb-6">
              {imageResponse.imageUrl && (
                <img 
                  src={imageResponse.imageUrl}
                  alt={`Learning path for ${imageResponse.topic}`}
                  className="w-full h-auto"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    // Add a fallback image or error message
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Available';
                  }}
                />
              )}
            </div>
            <div className="flex gap-4 mt-4">
              {imageResponse.imageUrl && (
                <a href={imageResponse.imageUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <ExternalLink className="h-4 w-4" />
                    Open in New Tab
                  </Button>
                </a>
              )}
              <Button 
                onClick={fetchPath}
                className="bg-white/10 hover:bg-white/20"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (steps.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">No learning path available. Please try a different topic.</p>
          <Link href={returnUrl} className="mt-4 inline-block">
            <Button>
              Back to {pageTitle}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Display steps if we received a regular learning path response
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
      </div>
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Learning Path: {topic}</h1>
                <div className="flex items-center gap-2 text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>~{getTotalTime()} minutes</span>
                </div>
              </div>
              <p className="text-gray-400">A personalized learning path to help you master {topic}.</p>
            </div>
            
            <div className="space-y-4">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      {step.id}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{step.title}</h3>
                      <p className="text-gray-400 mt-1">{step.description}</p>
                      
                      <div className="mt-3 flex items-center text-sm text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>~{step.estimatedTimeMinutes} minutes</span>
                      </div>
                      
                      {step.resources && step.resources.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Resources:</p>
                          <ul className="space-y-1">
                            {step.resources.map((resource, idx) => (
                              <li key={idx} className="flex items-start">
                                <ExternalLink className="w-4 h-4 mr-2 mt-0.5 text-blue-400" />
                                <a 
                                  href={resource} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm break-all"
                                >
                                  {resource}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-between">
              <Link href={returnUrl}>
                <Button 
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to {pageTitle}
                </Button>
              </Link>
              <Button 
                onClick={fetchPath}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Regenerate Path
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
