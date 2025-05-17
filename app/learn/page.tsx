"use client";

import React from "react";
import { BookOpen, ExternalLink, Database, FileText, GitGraph } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Resource item interface
interface ResourceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
}

// Resources data
const resources: ResourceItem[] = [
  {
    title: "RAG Document Sources",
    description: "Collection of documents used for our Retrieval-Augmented Generation (RAG) chatbot system. These documents provide the knowledge base for algorithm explanations and visualizations.",
    icon: <Database className="w-10 h-10 text-purple-500" />,
    url: "https://drive.google.com/drive/folders/1VIEZib_MofVz3musrCUpR6hfzFz6PvNY"
  },
 
];

// Background pattern component
const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-[250px] -right-[250px] animate-pulse" />
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-[250px] -left-[250px] animate-pulse delay-1000" />
  </div>
);

// Resource card component
const ResourceCard = ({ title, description, icon, url }: ResourceItem) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="block">
    <div className="relative group">
      <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 h-full">
        <div className="absolute top-4 right-4 opacity-70 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-5 h-5" />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-gray-900/70 backdrop-blur-sm">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          <p className="text-gray-300 mt-2">{description}</p>
        </div>
      </div>
    </div>
  </a>
);

export default function LearnPage() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <BackgroundPattern />
      
      {/* Using universal header - custom header removed */}

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-transparent bg-clip-text py-2">
              Learning Resources
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Access our collection of educational materials and resources for algorithm visualization and understanding.
            </p>
          </div>

          <div className="flex justify-center items-center w-full">
            {resources.map((resource, index) => (
              <ResourceCard 
                key={index}
                title={resource.title}
                description={resource.description}
                icon={resource.icon}
                url={resource.url}
              />
            ))}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Resources?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Our collection of learning materials is constantly growing. Check back regularly for new additions.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://github.com/nsk6704/IAVLP/tree/main" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <GitGraph className="w-5 h-5 text-purple-400" />
                <span>View Project Repository</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
