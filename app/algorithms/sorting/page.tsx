"use client";

import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Play, GitGraph } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Import sorting algorithms
import { bubbleSort } from './algorithms/bubble-sort';
import { insertionSort } from './algorithms/insertion-sort';
import { selectionSort } from './algorithms/selection-sort';
import { quickSort } from './algorithms/quick-sort';
import { heapSort } from './algorithms/heap-sort';
import { mergeSort } from './algorithms/merge-sort';

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(50);
  const speedRef = useRef<number>(50);
  const [algorithm, setAlgorithm] = useState<string>("bubble");
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const arrayContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate random array
  const generateArray = () => {
    if (isSorting) return;
    
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      // Generate random values between 5 and 100
      newArray.push(5 + Math.floor(Math.random() * 95));
    }
    setArray(newArray);
    setIsSorted(false);
  };

  // Reset array
  const resetArray = () => {
    if (isSorting) return;
    generateArray();
  };

  // Get animation speed based on the current speed value
  const getAnimationSpeed = () => {
    return Math.max(5, 505 - speedRef.current * 5);
  };
  
  // Start sorting
  const startSorting = async () => {
    if (isSorting || isSorted) return;
    
    setIsSorting(true);
    
    // Update the speed reference to current speed value
    speedRef.current = speed;
    
    // Clone array to avoid direct mutations
    const arrayCopy = [...array];
    
    // Run the selected sorting algorithm
    switch (algorithm) {
      case 'bubble':
        await bubbleSort(arrayCopy, getAnimationSpeed, updateArrayState);
        break;
      case 'insertion':
        await insertionSort(arrayCopy, getAnimationSpeed, updateArrayState);
        break;
      case 'selection':
        await selectionSort(arrayCopy, getAnimationSpeed, updateArrayState);
        break;
      case 'quick':
        await quickSort(arrayCopy, 0, arrayCopy.length - 1, getAnimationSpeed, updateArrayState);
        break;
      case 'heap':
        await heapSort(arrayCopy, getAnimationSpeed, updateArrayState);
        break;
      case 'merge':
        await mergeSort(arrayCopy, 0, arrayCopy.length - 1, getAnimationSpeed, updateArrayState);
        break;
      default:
        break;
    }
    
    setIsSorting(false);
    setIsSorted(true);
  };

  // Update array state during sorting
  const updateArrayState = (newArray: number[]) => {
    setArray([...newArray]);
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
              Sorting Algorithm Visualizer
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Visualize and compare different sorting algorithms in real-time.
            </p>
          </div>

          {/* Controls */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4">
              <label className="block text-gray-300 mb-2">Algorithm</label>
              <Select
                value={algorithm}
                onValueChange={setAlgorithm}
                disabled={isSorting}
              >
                <SelectTrigger className="bg-black/50 border-white/20">
                  <SelectValue placeholder="Select Algorithm" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 border-white/20">
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="merge">Merge Sort</SelectItem>
                  <SelectItem value="quick">Quick Sort</SelectItem>
                  <SelectItem value="heap">Heap Sort</SelectItem>
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
                disabled={isSorting}
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
          </div>

          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <Link href="/algorithms/sorting/quiz">
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                Take Quiz
              </Button>
            </Link>
            <Button
              onClick={startSorting}
              disabled={isSorting || isSorted}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
            <Button
              onClick={resetArray}
              disabled={isSorting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          {/* Array visualization */}
          <div 
            ref={arrayContainerRef}
            className="h-[400px] backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4 flex items-end justify-center"
          >
            {array.map((value, idx) => (
              <div
                key={idx}
                className="array-bar mx-[1px] bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm"
                style={{
                  height: `${value * 3.5}px`,
                  width: `${Math.max(2, 100 / arraySize - 1)}px`,
                }}
              />
            ))}
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
    case 'bubble': return 'Bubble Sort';
    case 'insertion': return 'Insertion Sort';
    case 'selection': return 'Selection Sort';
    case 'merge': return 'Merge Sort';
    case 'quick': return 'Quick Sort';
    case 'heap': return 'Heap Sort';
    default: return '';
  }
}

function getAlgorithmDescription(algorithm: string): string {
  switch (algorithm) {
    case 'bubble':
      return 'Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.';
    case 'insertion':
      return 'Insertion Sort builds the final sorted array one item at a time. It iterates through an array, consuming one input element at each repetition, and growing a sorted output list.';
    case 'selection':
      return 'Selection Sort divides the input list into two parts: a sorted sublist of items built up from left to right and a sublist of the remaining unsorted items. It repeatedly selects the smallest element from the unsorted sublist and moves it to the end of the sorted sublist.';
    case 'merge':
      return 'Merge Sort is an efficient, stable, comparison-based, divide and conquer algorithm. It divides the input array into two halves, recursively sorts them, and then merges the sorted halves.';
    case 'quick':
      return 'Quick Sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer strategy. It works by selecting a "pivot" element and partitioning the array around the pivot, such that elements less than the pivot are on the left and elements greater are on the right.';
    case 'heap':
      return 'Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It builds a max-heap from the input data, then repeatedly extracts the maximum element and rebuilds the heap until the array is sorted.';
    default:
      return '';
  }
}

function getTimeComplexity(algorithm: string): { best: string, average: string, worst: string } {
  switch (algorithm) {
    case 'bubble':
      return { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' };
    case 'insertion':
      return { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' };
    case 'selection':
      return { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' };
    case 'merge':
      return { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' };
    case 'quick':
      return { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' };
    case 'heap':
      return { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' };
    default:
      return { best: '', average: '', worst: '' };
  }
}

function getSpaceComplexity(algorithm: string): string {
  switch (algorithm) {
    case 'bubble':
      return 'O(1)';
    case 'insertion':
      return 'O(1)';
    case 'selection':
      return 'O(1)';
    case 'merge':
      return 'O(n)';
    case 'quick':
      return 'O(log n)';
    case 'heap':
      return 'O(1)';
    default:
      return '';
  }
}
