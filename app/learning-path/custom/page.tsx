"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LearningPath from '@/components/learning-path';
import { Header } from '@/components/header';
import { AppSidebar } from '@/components/app-sidebar';
import { HomeContentWrapper } from '@/components/home-content-wrapper';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function CustomLearningPathPage() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState('');
  
  useEffect(() => {
    const topicParam = searchParams.get('topic');
    if (topicParam) {
      setTopic(topicParam);
    }
  }, [searchParams]);

  return (
    <SidebarProvider defaultOpen={false}>
      {/* Header component */}
      <Header />
      
      {/* Sidebar component */}
      <AppSidebar />
      
      {/* Main content */}
      <HomeContentWrapper>
        {topic ? (
          <LearningPath 
            topic={topic} 
            returnUrl="/learning-path" 
            pageTitle="Learning Path Generator" 
          />
        ) : (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">Please specify a topic for your learning path.</p>
            </div>
          </div>
        )}
      </HomeContentWrapper>
    </SidebarProvider>
  );
}
