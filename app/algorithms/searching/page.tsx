"use client";

import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Play, GitGraph, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Import search algorithms
import { linearSearch } from './algorithms/linear-search';
import { binarySearch } from './algorithms/binary-search';
import { jumpSearch } from './algorithms/jump-search';
import { interpolationSearch } from './algorithms/interpolation-search';
import { exponentialSearch } from './algorithms/exponential-search';

export default function SearchingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(50);
  const speedRef = useRef<number>(50);
  const [algorithm, setAlgorithm] = useState<string>("linear");
  const [targetValue, setTargetValue] = useState<number>(50);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const arrayContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate sorted array for searching
  const generateArray = () => {
    if (isSearching) return;
    
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      // Generate values between 1 and 100
      newArray.push(1 + Math.floor(Math.random() * 99));
    }
    // Sort the array (required for binary search and other algorithms)
    newArray.sort((a, b) => a - b);
    setArray(newArray);
    setFoundIndex(null);
    
    // Set a random target value from the array or a random value not in the array
    if (Math.random() > 0.7) {
      // 30% chance to search for a value not in the array
      setTargetValue(Math.floor(Math.random() * 100));
    } else {
      // 70% chance to search for a value in the array
      setTargetValue(newArray[Math.floor(Math.random() * newArray.length)]);
    }
  };
  
  // Reset array
  const resetArray = () => {
    if (isSearching) return;
    generateArray();
  };

  // Get animation speed based on the current speed value
  const getAnimationSpeed = () => {
    return Math.max(5, 505 - speedRef.current * 5);
  };
  
  // Start searching
  const startSearching = async () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setFoundIndex(null);
    
    // Update the speed reference to current speed value
    speedRef.current = speed;
    
    // Run the selected searching algorithm
    let result = -1;
    const animateStep = (index: number, found: boolean = false) => {
      updateCurrentIndex(index, found);
    };
    
    switch (algorithm) {
      case 'linear':
        result = await linearSearch(array, targetValue, getAnimationSpeed, animateStep);
        break;
      case 'binary':
        result = await binarySearch(array, targetValue, getAnimationSpeed, animateStep);
        break;
      case 'jump':
        result = await jumpSearch(array, targetValue, getAnimationSpeed, animateStep);
        break;
      case 'interpolation':
        result = await interpolationSearch(array, targetValue, getAnimationSpeed, animateStep);
        break;
      case 'exponential':
        result = await exponentialSearch(array, targetValue, getAnimationSpeed, animateStep);
        break;
      default:
        break;
    }
    
    setFoundIndex(result !== -1 ? result : null);
    setIsSearching(false);
  };

  // Update current search index during animation
  const updateCurrentIndex = (index: number, found: boolean) => {
    setArray(prevArray => 
      prevArray.map((value, idx) => 
        idx === index ? (found ? -value : value) : Math.abs(value)
      )
    );
  };

  // Initialize array on component mount
  useEffect(() => {
    generateArray();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Regenerate array when array size changes
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Update target value manually
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 100) {
      setTargetValue(value);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
      </div>
      
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/50 backdrop-blur-xl shadow-lg" : ""
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitGraph className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">AlgoViz</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text py-2">
              Search Algorithm Visualizer
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Visualize and compare different search algorithms in real-time.
            </p>
          </div>

          {/* Controls */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="block text-gray-300 mb-2">Algorithm</label>
              <Select
                value={algorithm}
                onValueChange={setAlgorithm}
                disabled={isSearching}
              >
                <SelectTrigger className="bg-black/50 border-white/20">
                  <SelectValue placeholder="Select Algorithm" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 border-white/20">
                  <SelectItem value="linear">Linear Search</SelectItem>
                  <SelectItem value="binary">Binary Search</SelectItem>
                  <SelectItem value="jump">Jump Search</SelectItem>
                  <SelectItem value="interpolation">Interpolation Search</SelectItem>
                  <SelectItem value="exponential">Exponential Search</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="block text-gray-300 mb-2">Array Size: {arraySize}</label>
              <Slider
                value={[arraySize]}
                min={10}
                max={100}
                step={1}
                onValueChange={(value) => setArraySize(value[0])}
                disabled={isSearching}
                className="py-2"
              />
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="block text-gray-300 mb-2">Speed: {speed}</label>
              <Slider
                value={[speed]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => {
                  setSpeed(value[0]);
                  speedRef.current = value[0];
                }}
                className="py-2"
              />
            </div>

            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <label htmlFor="target" className="block text-gray-300 mb-2">Target Value (1-100)</label>
              <input
                id="target"
                type="number"
                min="1"
                max="100"
                value={targetValue}
                onChange={handleTargetChange}
                disabled={isSearching}
                className="w-full bg-black/50 border border-white/20 rounded-md px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Link href="/algorithms/searching/quiz">
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Take Quiz
              </Button>
            </Link>
            <Button
              onClick={startSearching}
              disabled={isSearching}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button
              onClick={resetArray}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Array
            </Button>
          </div>

          {/* Array visualization */}
          <div 
            ref={arrayContainerRef}
            className="min-h-[400px] backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col"
          >
            <div className="flex-1 flex items-end justify-center mb-4">
              {array.map((value, idx) => {
                const currentlyChecking = value < 0;
                const isTarget = foundIndex === idx;
                const barValue = Math.abs(value);
                
                return (
                  <div
                    key={idx}
                    className={`array-bar mx-[1px] rounded-t-sm ${
                      isTarget 
                        ? 'bg-gradient-to-t from-green-500 to-green-300' 
                        : currentlyChecking
                          ? 'bg-gradient-to-t from-orange-500 to-yellow-300'
                          : 'bg-gradient-to-t from-purple-500 to-blue-500'
                    }`}
                    style={{
                      height: `${barValue * 3.5}px`,
                      width: `${Math.max(2, 100 / arraySize - 1)}px`,
                    }}
                  />
                );
              })}
            </div>
            <div className="text-center mt-4">
              <p className="text-xl">
                {foundIndex !== null 
                  ? `Found ${targetValue} at index ${foundIndex}!` 
                  : isSearching 
                    ? "Searching..." 
                    : "Target not found."}
              </p>
            </div>
          </div>

          {/* Algorithm explanation */}
          <div className="mt-12 backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">About {getAlgorithmName(algorithm)}</h2>
            <p className="text-gray-300 mb-4">{getAlgorithmDescription(algorithm)}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Time Complexity</h3>
                <ul className="list-disc list-inside text-gray-300">
                  <li>Best Case: {getTimeComplexity(algorithm).best}</li>
                  <li>Average Case: {getTimeComplexity(algorithm).average}</li>
                  <li>Worst Case: {getTimeComplexity(algorithm).worst}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Space Complexity</h3>
                <p className="text-gray-300">{getSpaceComplexity(algorithm)}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Prerequisites</h3>
                <p className="text-gray-300">{getAlgorithmPrerequisites(algorithm)}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions for algorithm information
function getAlgorithmName(algorithm: string): string {
  switch (algorithm) {
    case 'linear': return 'Linear Search';
    case 'binary': return 'Binary Search';
    case 'jump': return 'Jump Search';
    case 'interpolation': return 'Interpolation Search';
    case 'exponential': return 'Exponential Search';
    default: return '';
  }
}

function getAlgorithmDescription(algorithm: string): string {
  switch (algorithm) {
    case 'linear':
      return 'Linear Search is the simplest search algorithm that works by checking each element of the array one by one until the target value is found or the end of the array is reached.';
    case 'binary':
      return 'Binary Search is an efficient algorithm that works on sorted arrays by repeatedly dividing the search interval in half. It compares the target value with the middle element of the array.';
    case 'jump':
      return 'Jump Search is a searching algorithm that works on sorted arrays by jumping ahead by fixed steps and then performing a linear search to find the element.';
    case 'interpolation':
      return 'Interpolation Search is an improved variant of Binary Search that works better for uniformly distributed sorted arrays. It estimates the position of the target value using interpolation formula.';
    case 'exponential':
      return 'Exponential Search involves two steps: finding a range where the element is present by repeatedly doubling an index, then using binary search within that range.';
    default:
      return '';
  }
}

function getTimeComplexity(algorithm: string): { best: string, average: string, worst: string } {
  switch (algorithm) {
    case 'linear':
      return { best: 'O(1)', average: 'O(n)', worst: 'O(n)' };
    case 'binary':
      return { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' };
    case 'jump':
      return { best: 'O(1)', average: 'O(√n)', worst: 'O(n)' };
    case 'interpolation':
      return { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' };
    case 'exponential':
      return { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' };
    default:
      return { best: '', average: '', worst: '' };
  }
}

function getSpaceComplexity(algorithm: string): string {
  switch (algorithm) {
    case 'linear':
      return 'O(1)';
    case 'binary':
      return 'O(1) for iterative, O(log n) for recursive';
    case 'jump':
      return 'O(1)';
    case 'interpolation':
      return 'O(1)';
    case 'exponential':
      return 'O(1)';
    default:
      return '';
  }
}

function getAlgorithmPrerequisites(algorithm: string): string {
  switch (algorithm) {
    case 'linear':
      return 'None - can work with unsorted arrays';
    case 'binary':
      return 'Sorted array';
    case 'jump':
      return 'Sorted array';
    case 'interpolation':
      return 'Sorted array with uniformly distributed values';
    case 'exponential':
      return 'Sorted array';
    default:
      return '';
  }
}