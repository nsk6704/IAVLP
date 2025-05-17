"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, GitGraph, Target, ArrowRight, Cpu, Network, Code, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Import layout components
import { Header } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import { ContentWrapper } from "@/components/content-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";

// Define topic suggestions
const topicSuggestions = [
  { name: "Sorting Algorithms", id: "sorting", icon: <GitGraph className="w-5 h-5" /> },
  { name: "K-Nearest Neighbors", id: "knn", icon: <Brain className="w-5 h-5" /> },
  { name: "Naive Bayes", id: "naive-bayes", icon: <Brain className="w-5 h-5" /> },
  { name: "Dijkstra's Algorithm", id: "dijkstra", icon: <Network className="w-5 h-5" /> },
  { name: "A* Pathfinding", id: "astar", icon: <Network className="w-5 h-5" /> },
  { name: "Minimax", id: "minimax", icon: <Cpu className="w-5 h-5" /> },
  { name: "Machine Learning", id: "machine-learning", icon: <Brain className="w-5 h-5" /> },
  { name: "Data Structures", id: "data-structures", icon: <Code className="w-5 h-5" /> },
];

export default function QuizPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleTopicSelect = (topicId: string) => {
    setTopic(topicId);
    setCustomTopic("");
  };

  const handleCustomTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTopic(e.target.value);
    setTopic("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalTopic = topic || customTopic;
    
    if (!finalTopic) {
      setError("Please select or enter a topic");
      return;
    }
    
    setError("");
    setIsSubmitting(true);
    
    // Map difficulty to current_score
    let currentScore = 0.5; // Default medium
    if (difficulty === "easy") currentScore = 0.2;
    if (difficulty === "hard") currentScore = 0.7;
    
    // Navigate to the custom quiz page with the parameters
    router.push(`/quiz/custom?topic=${encodeURIComponent(finalTopic)}&difficulty=${difficulty}&current_score=${currentScore}`);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Header component */}
      <Header />
      
      {/* Sidebar component */}
      <AppSidebar />
      
      {/* Main content */}
      <ContentWrapper>
        <div className="min-h-screen bg-black text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
          </div>
          
          <main className="pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text py-2">
                  AI-Powered Quiz
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Test your knowledge with our AI-generated quizzes. Select a topic and difficulty level to get started.
                </p>
              </div>

              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Select a Topic</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {topicSuggestions.map((suggestion) => (
                        <div 
                          key={suggestion.id}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-3",
                            topic === suggestion.id 
                              ? "bg-purple-500/20 border-purple-500" 
                              : "border-white/10 hover:bg-white/10"
                          )}
                          onClick={() => handleTopicSelect(suggestion.id)}
                        >
                          {suggestion.icon}
                          <span>{suggestion.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <Label htmlFor="custom-topic" className="text-white mb-2 block">Or enter your own topic:</Label>
                      <Input 
                        id="custom-topic"
                        value={customTopic}
                        onChange={handleCustomTopicChange}
                        placeholder="e.g., Graph Algorithms, Binary Trees, etc."
                        className="bg-black/50 border-white/20 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">Select Difficulty</h2>
                    
                    <RadioGroup 
                      value={difficulty} 
                      onValueChange={setDifficulty}
                      className="flex flex-col space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="easy" id="easy" className="border-white/50 text-white" />
                        <Label htmlFor="easy" className="text-white font-medium">Easy</Label>
                        <span className="text-sm text-gray-400 ml-2">- Beginner-friendly questions</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="medium" id="medium" className="border-white/50 text-white" />
                        <Label htmlFor="medium" className="text-white font-medium">Medium</Label>
                        <span className="text-sm text-gray-400 ml-2">- Moderate difficulty</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="hard" id="hard" className="border-white/50 text-white" />
                        <Label htmlFor="hard" className="text-white font-medium">Hard</Label>
                        <span className="text-sm text-gray-400 ml-2">- Challenging questions</span>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                      <p>{error}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    <span>Start Quiz</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </ContentWrapper>
    </SidebarProvider>
  );
}
