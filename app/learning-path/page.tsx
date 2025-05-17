"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Suggested topics for learning paths
const suggestedTopics = [
  { name: "Machine Learning", slug: "machine-learning" },
  { name: "Deep Learning", slug: "deep-learning" },
  { name: "Neural Networks", slug: "neural-networks" },
  { name: "Computer Vision", slug: "computer-vision" },
  { name: "Natural Language Processing", slug: "nlp" },
  { name: "Reinforcement Learning", slug: "reinforcement-learning" },
  { name: "Data Science", slug: "data-science" },
  { name: "Algorithms", slug: "algorithms" }
];

export default function LearningPathPage() {
  const [customTopic, setCustomTopic] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      router.push(`/learning-path/custom?topic=${encodeURIComponent(customTopic.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
      </div>
      
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">
              Learning Path Generator
            </h1>
            <p className="text-xl text-gray-400">
              Get a personalized learning path for any topic you want to master
            </p>
          </div>
          
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6">Enter a Topic</h2>
            
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    placeholder="e.g., Machine Learning, Neural Networks, Computer Vision..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
                <Button
                  type="submit"
                  disabled={!customTopic.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Generate
                </Button>
              </div>
            </form>
            
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-300">Or choose from suggested topics:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {suggestedTopics.map((topic) => (
                  <Link 
                    key={topic.slug} 
                    href={`/learning-path/custom?topic=${encodeURIComponent(topic.name)}`}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 text-center transition-all"
                  >
                    {topic.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white/5 hover:bg-white/10 text-white border-white/10"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
