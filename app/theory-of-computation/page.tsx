"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Code, ChevronRight, GitGraph, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface VisualizationItem {
  name: string;
  id: string;
  description: string;
  icon: React.ReactNode;
}

const visualizations: VisualizationItem[] = [
  {
    name: "Regular Expression to Finite Automata",
    id: "regex-to-fa",
    description: "Visualize how regular expressions are converted to finite automata using Thompson's construction algorithm",
    icon: <Network className="w-10 h-10 text-blue-500" />
  }
];

const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-[250px] -right-[250px] animate-pulse" />
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-[250px] -left-[250px] animate-pulse delay-1000" />
  </div>
);

const VisualizationCard = ({ name, description, id, icon }: VisualizationItem) => (
  <Link href={`/theory-of-computation/${id}`}>
    <div className="relative group cursor-pointer">
      <div className="glass-card p-6 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg">
        <div className="absolute top-4 right-4 opacity-70 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5" />
        </div>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-gray-900/70 backdrop-blur-sm">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{name}</h3>
          </div>
          <p className="text-gray-300 mt-2">{description}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default function TheoryOfComputation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <BackgroundPattern />
      

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text py-2">
              Theory of Computation
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore fundamental concepts in theoretical computer science through interactive visualizations.
            </p>
          </div>

          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <GitGraph className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold">Visualizations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visualizations.map((item, index) => (
                <VisualizationCard
                  key={index}
                  name={item.name}
                  id={item.id}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="glass-card p-8 rounded-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Code className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">About Theory of Computation</h2>
              </div>
              <div className="text-gray-300 space-y-4">
                <p>
                  Theory of Computation is a branch of computer science that deals with how problems can be solved using algorithms. 
                  It focuses on answering the fundamental question: "What can be computed?"
                </p>
                <p>
                  The field explores various computational models like finite automata, pushdown automata, and Turing machines, 
                  as well as formal languages and their hierarchies.
                </p>
                <p>
                  Our interactive visualizations help you understand these abstract concepts through hands-on exploration and step-by-step animations.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
