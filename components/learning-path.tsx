"use client";

import { useState, useEffect } from 'react';
import { fetchLearningPath, LearningPathStep, LearningPathImageResponse } from '@/lib/learning-path-service-post';
import { ArrowLeft, Clock, ExternalLink, GitGraph, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LearningPathVisualization from './learning-path-visualization';
import Image from 'next/image';

interface LearningPathProps {
  topic: string;
  returnUrl: string;
  pageTitle: string;
}

export default function LearningPath({ topic, returnUrl, pageTitle }: LearningPathProps) {
  const [steps, setSteps] = useState<LearningPathStep[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [imageResponse, setImageResponse] = useState<LearningPathImageResponse | null>(null);

  // Fetch learning path from AI bot
  const fetchPath = async () => {
    setIsLoading(true);
    setError(null);
    setImageResponse(null);
    
    try {
      const response = await fetchLearningPath(topic);
      
      // Check if we received an image response
      if ('isImage' in response && response.isImage && 'imageUrl' in response && 'topic' in response) {
        console.log('Displaying image response');
        setImageResponse(response as {isImage: true; imageUrl: string; topic: string});
        setIsLoading(false);
      } else if ('success' in response && response.success && response.steps.length > 0) {
        setSteps(response.steps);
        setIsLoading(false);
        // Expand the first step by default
        setExpandedStep(1);
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
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [topic]);

  const toggleStep = (stepId: number) => {
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
    }
  };

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
        
        <div className="mt-20 max-w-7xl w-full px-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Visual Learning Path</h2>
            <div className="relative w-full max-w-6xl rounded-lg overflow-hidden border border-white/20 mb-6">
              {/* Use iframe to display the learning path visualization */}
              <iframe
                src={`/api/learning-path?topic=${encodeURIComponent(imageResponse.topic)}`}
                title={`Learning path for ${imageResponse.topic}`}
                className="w-full h-[700px] border-0"
                onError={(e) => {
                  console.error('Iframe failed to load:', e);
                }}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <a href={imageResponse.imageUrl} download={`learning-path-${imageResponse.topic}.png`} target="_blank" rel="noopener noreferrer">
                <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  <Download className="h-4 w-4" />
                  Download Image
                </Button>
              </a>
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background pattern */}
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
            
            {/* Learning Path Visualization */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <GitGraph className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-medium">Visual Learning Path</h2>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 overflow-x-auto">
                <LearningPathVisualization steps={steps} topic={topic} />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className="border border-white/10 rounded-lg overflow-hidden"
                >
                  <div 
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      expandedStep === step.id 
                        ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20" 
                        : "hover:bg-white/5"
                    )}
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                          {step.id}
                        </div>
                        <h3 className="text-lg font-medium">{step.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{step.estimatedTimeMinutes} min</span>
                      </div>
                    </div>
                  </div>
                  
                  {expandedStep === step.id && (
                    <div className="p-4 border-t border-white/10 bg-white/5">
                      <p className="text-gray-300 mb-4">{step.description}</p>
                      
                      {step.resources.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-purple-300 mb-2">Resources:</h4>
                          <ul className="space-y-2">
                            {step.resources.map((resource, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <ExternalLink className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                                <a 
                                  href={resource} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline text-sm break-all"
                                >
                                  {resource}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Link href={returnUrl}>
              <Button 
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {pageTitle}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
