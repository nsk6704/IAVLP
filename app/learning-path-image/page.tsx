"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import LearningPathDirect from '@/components/learning-path-direct';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function LearningPathImagePage() {
  const [topic, setTopic] = useState('');
  const [submittedTopic, setSubmittedTopic] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      setSubmittedTopic(topic);
      setIsFormSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsFormSubmitted(false);
    setTopic('');
    setSubmittedTopic('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
      </div>

      {!isFormSubmitted ? (
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen">
          <Card className="w-full max-w-md backdrop-blur-lg bg-black/50 border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  <span>Learning Path Generator</span>
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
                >
                  Generate Learning Path
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-xs text-center text-gray-500 flex justify-center">
              <p>
                Powered by AI to create personalized learning paths with visual diagrams
              </p>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <LearningPathDirect 
          topic={submittedTopic} 
          returnUrl="/learning-path-image" 
          pageTitle="Learning Path Generator"
        />
      )}
    </div>
  );
}
