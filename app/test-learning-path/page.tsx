"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function TestLearningPathPage() {
  const [topic, setTopic] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      // Construct the URL with the topic as a query parameter
      const url = `https://7100-34-125-133-151.ngrok-free.app/learning-path?topic=${encodeURIComponent(topic)}`;
      setImageUrl(url);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate learning path. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 py-10 flex flex-col items-center">
        <Card className="w-full max-w-md backdrop-blur-lg bg-black/50 border border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <span>Learning Path Test</span>
              </div>
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter a topic to generate a visual learning path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium">
                  Topic
                </label>
                <Input
                  id="topic"
                  placeholder="e.g., Machine Learning, Web Development, Python"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Learning Path'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="w-full max-w-3xl p-4 bg-red-900/20 border border-red-500/30 rounded-lg mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {imageUrl && (
          <div className="w-full max-w-3xl">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6">Visual Learning Path for: {topic}</h2>
              <div className="relative w-full rounded-lg overflow-hidden border border-white/20 mb-6">
                <img 
                  src={imageUrl}
                  alt={`Learning path for ${topic}`}
                  className="w-full h-auto"
                  onError={(e) => {
                    console.error('Image failed to load:', e);
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Available';
                    setError('Failed to load image. The API might be unavailable or the response format has changed.');
                  }}
                />
              </div>
              <div className="flex gap-4 mt-4">
                <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Open in New Tab
                  </Button>
                </a>
                <Button 
                  onClick={() => setImageUrl(null)}
                  className="bg-white/10 hover:bg-white/20"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
