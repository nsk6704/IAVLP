"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Code, Play, RefreshCw, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { analyzeCodeComplexity, getExampleCode, ComplexityResult } from "./analyzer-service";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Main component for the Complexity Analyzer
const ComplexityAnalyzer: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [algorithm, setAlgorithm] = useState<string>("bubble");
  const [result, setResult] = useState<ComplexityResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedAlgorithm, setDetectedAlgorithm] = useState<string | null>(null);
  
  // Sorting algorithms available for selection
  const sortingAlgorithms = [
    { id: "bubble", name: "Bubble Sort", complexity: "O(n²)" },
    { id: "selection", name: "Selection Sort", complexity: "O(n²)" },
    { id: "insertion", name: "Insertion Sort", complexity: "O(n²)" },
    { id: "quick", name: "Quick Sort", complexity: "O(n log n)" },
    { id: "merge", name: "Merge Sort", complexity: "O(n log n)" },
    { id: "heap", name: "Heap Sort", complexity: "O(n log n)" },
    { id: "counting", name: "Counting Sort", complexity: "O(n+k)" },
    { id: "radix", name: "Radix Sort", complexity: "O(d(n+k))" },
  ];

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle code analysis
  const analyzeCode = () => {
    if (!code.trim()) {
      setError("Please enter some code to analyze");
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    setDetectedAlgorithm(null);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      try {
        const analysisResult = analyzeCodeComplexity(code, language);
        setResult(analysisResult);
        
        // Check if we detected a known algorithm
        if (analysisResult.explanation.includes("Detected a")) {
          const algorithmName = analysisResult.explanation.match(/Detected a ([\w\s]+) algorithm/)?.[1] || null;
          setDetectedAlgorithm(algorithmName);
        }
      } catch (err) {
        setError("Error analyzing code. Please check your input and try again.");
      } finally {
        setIsAnalyzing(false);
      }
    }, 1000);
  };

  // Load example code
  const loadExample = () => {
    const exampleCode = getExampleCode(language, algorithm);
    setCode(exampleCode);
    setResult(null);
  };

  // Reset the analyzer
  const resetAnalyzer = () => {
    setCode("");
    setResult(null);
    setError(null);
    setDetectedAlgorithm(null);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Using universal header - custom header removed */}

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-transparent bg-clip-text py-2">
              Sorting Algorithm Complexity Analyzer
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Analyze sorting algorithms to determine their time and space complexity. 
              Understand the efficiency of different sorting techniques and identify potential bottlenecks.
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl mb-8">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Code Input</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild suppressHydrationWarning>
                        <span><Info className="h-4 w-4 text-gray-400" /></span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Paste your sorting algorithm code here for analysis. The analyzer works best with algorithm implementations and functions.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadExample}
                    suppressHydrationWarning
                  >
                    Load Example
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetAnalyzer}
                    suppressHydrationWarning
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Programming Language</label>
                  <Tabs defaultValue="javascript" onValueChange={(value) => setLanguage(value)}>
                    <TabsList className="w-full">
                      <TabsTrigger value="javascript" className="flex-1">JavaScript</TabsTrigger>
                      <TabsTrigger value="python" className="flex-1">Python</TabsTrigger>
                      <TabsTrigger value="java" className="flex-1">Java</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Sorting Algorithm</label>
                  <select 
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-md p-2 text-white"
                  >
                    {sortingAlgorithms.map((algo) => (
                      <option key={algo.id} value={algo.id}>
                        {algo.name} ({algo.complexity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your sorting algorithm code here..."
                className="min-h-[300px] font-mono text-sm bg-gray-900/50 border-gray-700"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <Button 
              onClick={analyzeCode} 
              className="w-full"
              disabled={isAnalyzing}
              suppressHydrationWarning
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Analyze Complexity
                </>
              )}
            </Button>
          </div>

          {result && (
            <div className="glass-card p-6 rounded-xl mb-8 animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
              
              {detectedAlgorithm && (
                <div className="mb-6 p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <h3 className="text-xl font-semibold text-green-400">Algorithm Detected</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">{detectedAlgorithm}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">Time Complexity</h3>
                  <p className="text-3xl font-bold">{result.timeComplexity}</p>
                </div>
                
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <h3 className="text-xl font-semibold mb-2 text-purple-400">Space Complexity</h3>
                  <p className="text-3xl font-bold">{result.spaceComplexity}</p>
                </div>
              </div>
              
              {result.confidenceScore !== undefined && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-md font-semibold">Analysis Confidence</h3>
                    <span className="text-sm">{Math.round(result.confidenceScore * 100)}%</span>
                  </div>
                  <Progress value={result.confidenceScore * 100} className="h-2" />
                  <p className="text-xs text-gray-400 mt-1">
                    {result.confidenceScore > 0.8 ? "High confidence in this analysis" : 
                     result.confidenceScore > 0.5 ? "Moderate confidence in this analysis" : 
                     "Low confidence - this is a best guess based on the code patterns"}
                  </p>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Explanation</h3>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-gray-300">{result.explanation}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Optimization Tips</h3>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {result.optimizationTips ? (
                      result.optimizationTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))
                    ) : (
                      <li>No specific optimization tips available for this code.</li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complexity Comparison</h3>
                  <div className="p-4 bg-gray-800/50 rounded-lg h-full">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>O(1)</span>
                        <Badge variant={result.timeComplexity === "O(1)" ? "default" : "outline"} className="ml-2">
                          Constant
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>O(log n)</span>
                        <Badge variant={result.timeComplexity === "O(log n)" ? "default" : "outline"} className="ml-2">
                          Logarithmic
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>O(n)</span>
                        <Badge variant={result.timeComplexity === "O(n)" ? "default" : "outline"} className="ml-2">
                          Linear
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>O(n log n)</span>
                        <Badge variant={result.timeComplexity === "O(n log n)" ? "default" : "outline"} className="ml-2">
                          Linearithmic
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>O(n²)</span>
                        <Badge variant={result.timeComplexity === "O(n²)" ? "default" : "outline"} className="ml-2">
                          Quadratic
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>O(2ⁿ)</span>
                        <Badge variant={result.timeComplexity.includes("O(2ⁿ)") ? "default" : "outline"} className="ml-2">
                          Exponential
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Performance Impact</h3>
                  <div className="p-4 bg-gray-800/50 rounded-lg h-full">
                    <div className="space-y-4">
                      {result.timeComplexity === "O(1)" && (
                        <p className="text-green-400">Excellent! This code will perform consistently regardless of input size.</p>
                      )}
                      {result.timeComplexity === "O(log n)" && (
                        <p className="text-green-400">Very good! This code will scale well even with large inputs.</p>
                      )}
                      {result.timeComplexity === "O(n)" && (
                        <p className="text-blue-400">Good. Performance scales linearly with input size.</p>
                      )}
                      {result.timeComplexity === "O(n log n)" && (
                        <p className="text-blue-400">Reasonable. This is often the best possible for comparison-based sorting.</p>
                      )}
                      {result.timeComplexity === "O(n²)" && (
                        <p className="text-yellow-400">Caution. May become slow with larger inputs.</p>
                      )}
                      {result.timeComplexity === "O(n³)" && (
                        <p className="text-red-400">Warning! Will become very slow with moderate to large inputs.</p>
                      )}
                      {result.timeComplexity.includes("O(2ⁿ)") && (
                        <p className="text-red-400">Critical! Will become unusable with even modestly sized inputs.</p>
                      )}
                      
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Input Size Impact</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="text-left pb-2">Input Size</th>
                              <th className="text-right pb-2">Operations</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.timeComplexity === "O(1)" && (
                              <>
                                <tr><td>10</td><td className="text-right">1</td></tr>
                                <tr><td>100</td><td className="text-right">1</td></tr>
                                <tr><td>1,000</td><td className="text-right">1</td></tr>
                                <tr><td>10,000</td><td className="text-right">1</td></tr>
                              </>
                            )}
                            {result.timeComplexity === "O(log n)" && (
                              <>
                                <tr><td>10</td><td className="text-right">3</td></tr>
                                <tr><td>100</td><td className="text-right">7</td></tr>
                                <tr><td>1,000</td><td className="text-right">10</td></tr>
                                <tr><td>10,000</td><td className="text-right">13</td></tr>
                              </>
                            )}
                            {result.timeComplexity === "O(n)" && (
                              <>
                                <tr><td>10</td><td className="text-right">10</td></tr>
                                <tr><td>100</td><td className="text-right">100</td></tr>
                                <tr><td>1,000</td><td className="text-right">1,000</td></tr>
                                <tr><td>10,000</td><td className="text-right">10,000</td></tr>
                              </>
                            )}
                            {result.timeComplexity === "O(n log n)" && (
                              <>
                                <tr><td>10</td><td className="text-right">33</td></tr>
                                <tr><td>100</td><td className="text-right">664</td></tr>
                                <tr><td>1,000</td><td className="text-right">9,966</td></tr>
                                <tr><td>10,000</td><td className="text-right">132,877</td></tr>
                              </>
                            )}
                            {result.timeComplexity === "O(n²)" && (
                              <>
                                <tr><td>10</td><td className="text-right">100</td></tr>
                                <tr><td>100</td><td className="text-right">10,000</td></tr>
                                <tr><td>1,000</td><td className="text-right">1,000,000</td></tr>
                                <tr><td>10,000</td><td className="text-right">100,000,000</td></tr>
                              </>
                            )}
                            {result.timeComplexity === "O(n³)" && (
                              <>
                                <tr><td>10</td><td className="text-right">1,000</td></tr>
                                <tr><td>100</td><td className="text-right">1,000,000</td></tr>
                                <tr><td>1,000</td><td className="text-right">1,000,000,000</td></tr>
                                <tr><td>10,000</td><td className="text-right">10¹²</td></tr>
                              </>
                            )}
                            {result.timeComplexity.includes("O(2ⁿ)") && (
                              <>
                                <tr><td>10</td><td className="text-right">1,024</td></tr>
                                <tr><td>20</td><td className="text-right">1,048,576</td></tr>
                                <tr><td>30</td><td className="text-right">1,073,741,824</td></tr>
                                <tr><td>100</td><td className="text-right">10³⁰</td></tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">About Sorting Algorithm Complexity</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Understanding the time and space complexity of sorting algorithms is crucial for choosing the right algorithm for your specific use case:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">Common Sorting Algorithms</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Bubble Sort</strong> - O(n²) time, O(1) space - Simple but inefficient</li>
                    <li><strong>Selection Sort</strong> - O(n²) time, O(1) space - Minimizes swaps</li>
                    <li><strong>Insertion Sort</strong> - O(n²) time, O(1) space - Efficient for small or nearly sorted data</li>
                    <li><strong>Merge Sort</strong> - O(n log n) time, O(n) space - Stable and consistent</li>
                    <li><strong>Quick Sort</strong> - O(n log n) average time, O(log n) space - Fast in practice</li>
                    <li><strong>Heap Sort</strong> - O(n log n) time, O(1) space - In-place sorting</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">When to Use Each Algorithm</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Small datasets</strong> - Insertion Sort</li>
                    <li><strong>Nearly sorted data</strong> - Insertion Sort</li>
                    <li><strong>Memory constraints</strong> - Heap Sort</li>
                    <li><strong>Guaranteed performance</strong> - Merge Sort</li>
                    <li><strong>Average case performance</strong> - Quick Sort</li>
                    <li><strong>Linked lists</strong> - Merge Sort</li>
                  </ul>
                </div>
              </div>
              
              <p className="mt-4">
                This analyzer provides a basic estimation of complexity based on code patterns. For more accurate analysis, 
                consider the specific implementation details and edge cases of your algorithm.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplexityAnalyzer;
