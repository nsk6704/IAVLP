"use client";

import { useEffect, useState } from "react";
import { Brain, GitGraph, Target, ChevronRight, Cpu, Network, Code, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Import layout components
import { Header } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import { HomeContentWrapper } from "@/components/home-content-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AlgorithmItem {
  name: string;
  id: string;
  description: string;
}

interface AlgorithmCategory {
  category: string;
  icon: React.ReactNode;
  items: AlgorithmItem[];
}

// Define type for your component props
interface AlgorithmCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  id: string;
  category?: string;
}

const algorithms: AlgorithmCategory[] = [
  {
    category: "Machine Learning",
    icon: <Brain className="w-6 h-6" />,
    items: [
      { name: "K-Means Clustering", id: "kmeans", description: "Interactive visualization of clustering algorithm with customizable parameters" },
      { name: "KNN Classification", id: "knn", description: "Visual demonstration of K-Nearest Neighbors with real-time classification" },
      { name: "Logistic Regression", id: "logistic", description: "Step-by-step visualization of binary classification" },
      { name: "Naive Bayes", id: "naive-bayes", description: "Interactive probability-based classification visualization" }
    ]
  },
  {
    category: "Artificial Intelligence",
    icon: <Cpu className="w-6 h-6" />,
    items: [
      { name: "A* Algorithm (8 Puzzle)", id: "astar", description: "Pathfinding visualization with heuristic search" },
      { name: "Minimax with α-β Pruning", id: "minimax", description: "Game tree visualization with pruning demonstration" },
      { name: "Hill Climb Search", id: "hillclimb", description: "Local search optimization visualization" },
    ]
  },
  {
    category: "Graph Shortest Path",
    icon: <Network className="w-6 h-6" />,
    items: [
      { name: "Dijkstra's Algorithm", id: "dijkstra", description: "Shortest path finding in graphs with uniform cost search" },
      { name: "A* Pathfinding", id: "astar_shortest_path", description: "Efficient pathfinding using heuristic-based search" },
      { name: "DFS Traversal", id: "dfs", description: "Depth-first search traversal and path finding in graphs" }
    ]
  },
  {
    category: "Theory of Computation",
    icon: <Code className="w-6 h-6" />,
    items: [
      { name: "Regex to Finite Automata", id: "regex-to-fa", description: "Visualize the conversion of regular expressions to finite automata" }
    ]
  },
  {
    category: "Sorting Algorithms",
    icon: <GitGraph className="w-6 h-6" />,
    items: [
      { name: "Sorting Visualizer", id: "sorting", description: "Interactive visualization of popular sorting algorithms with customizable parameters" },
      { name: "Complexity Analyzer", id: "sorting/complexity", description: "Analyze time and space complexity of sorting algorithms with detailed explanations" }
    ]
  }
];

const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
  </div>
);

const AlgorithmCard = ({ title, description, icon, id, category }: AlgorithmCardProps) => {
  // Create the correct link path based on the category
  let linkPath = `/algorithms/${id}`;
  if (category === "Theory of Computation") {
    linkPath = `/theory-of-computation/${id}`;
  } else if (category === "Code Analysis") {
    linkPath = `/${id}`;
  }
  
  return (
    <Link href={linkPath}>
      <div className="relative group cursor-pointer">
        <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105">
          <div className="flex items-center gap-4 mb-4">
            {icon}
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          <p className="text-gray-400">{description}</p>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      {/* Header component */}
      <Header />
      
      {/* Sidebar component */}
      <AppSidebar />
      
      {/* Main content with specialized wrapper for home page */}
      <HomeContentWrapper>
        <div className="min-h-screen bg-black text-white">
          <BackgroundPattern />
          
          <main className="pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text py-2">
                  AlgoViz
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Interactive visualizations of popular Machine Learning and Artificial Intelligence algorithms. Learn through exploration and experimentation.
                </p>
              </div>

              {/* AI Quiz Section */}
              <section className="mb-20" id="ai-quiz">
                <div className="flex items-center gap-3 mb-8">
                  <BookOpen className="w-6 h-6" />
                  <h2 className="text-3xl font-bold">AI-Powered Quiz</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <Link href="/quiz">
                    <div className="relative group cursor-pointer">
                      <div className="p-6 rounded-xl backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105">
                        <div className="flex items-center gap-4 mb-4">
                          <BookOpen className="w-6 h-6 text-purple-500" />
                          <h3 className="text-xl font-semibold text-white">Take a Custom Quiz</h3>
                        </div>
                        <p className="text-gray-400">Test your knowledge with our AI-generated quizzes. Choose any topic and difficulty level.</p>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
              
              {/* Learning Path Section */}
              <section className="mb-20" id="learning-path">
                <div className="flex items-center gap-3 mb-8">
                  <GitGraph className="w-6 h-6" />
                  <h2 className="text-3xl font-bold">Learning Path</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <Link href="/learning-path">
                    <div className="relative group cursor-pointer">
                      <div className="p-6 rounded-xl backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105">
                        <div className="flex items-center gap-4 mb-4">
                          <GitGraph className="w-6 h-6 text-blue-500" />
                          <h3 className="text-xl font-semibold text-white">Get a Custom Learning Path</h3>
                        </div>
                        <p className="text-gray-400">Receive a personalized step-by-step learning path for any topic you want to master.</p>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
              
              {algorithms.map((category, idx) => (
                <section key={idx} className="mb-20" id={category.category.toLowerCase().replace(" ", "-")}>
                  <div className="flex items-center gap-3 mb-8">
                    {category.icon}
                    <h2 className="text-3xl font-bold">{category.category}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.items.map((item, itemIdx) => (
                      <AlgorithmCard
                        key={itemIdx}
                        title={item.name}
                        description={item.description}
                        icon={<Target className="w-6 h-6 text-purple-500" />}
                        id={item.id}
                        category={category.category}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </HomeContentWrapper>
    </SidebarProvider>
  );
}