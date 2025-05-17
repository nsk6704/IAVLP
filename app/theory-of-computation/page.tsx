"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Code, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface VisualizationItem {
  name: string;
  id: string;
  description: string;
}

const visualizations: VisualizationItem[] = [
  {
    name: "Regular Expression to Finite Automata",
    id: "regex-to-fa",
    description: "Visualize how regular expressions are converted to finite automata using Thompson's construction algorithm"
  }
];

const BackgroundPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-[250px] -right-[250px] animate-pulse" />
    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-[250px] -left-[250px] animate-pulse delay-1000" />
  </div>
);

const VisualizationCard = ({ name, description, id }: VisualizationItem) => (
  <Link href={`/theory-of-computation/${id}`}>
    <div className="relative group cursor-pointer">
      <div className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105">
        <div className="flex items-center gap-4 mb-4">
          <Code className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold text-white">{name}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
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
    <div className="min-h-screen bg-black text-white">
      <BackgroundPattern />
      
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/50 backdrop-blur-lg shadow-lg" : ""
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/home" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold">Theory of Computation</h1>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text py-2">
              Theory of Computation
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore fundamental concepts in theoretical computer science through interactive visualizations.
            </p>
          </div>

          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-6 h-6" />
              <h2 className="text-3xl font-bold">Visualizations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visualizations.map((item, index) => (
                <VisualizationCard
                  key={index}
                  name={item.name}
                  id={item.id}
                  description={item.description}
                />
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">What is Theory of Computation?</h2>
              <p className="text-gray-300 mb-4">
                Theory of Computation is a branch of computer science that deals with how efficiently problems can be solved on a model of computation, using an algorithm. It focuses on the mathematical aspects of computing, including automata theory, formal languages, and computational complexity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Automata Theory</h3>
                  <p className="text-gray-400">
                    The study of abstract machines and the computational problems that can be solved using these machines. Key concepts include finite automata, pushdown automata, and Turing machines.
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Formal Languages</h3>
                  <p className="text-gray-400">
                    The study of mathematically defined languages, including regular expressions, context-free grammars, and the Chomsky hierarchy of language classes.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
