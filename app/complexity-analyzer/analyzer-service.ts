// Advanced code complexity analyzer service

// Define the structure for complexity analysis results
export interface ComplexityResult {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  highlightedCode?: string;
  confidenceScore?: number;
  optimizationTips?: string[];
}

// Pattern definitions for static analysis
interface ComplexityPattern {
  pattern: RegExp;
  timeComplexity: string;
  description: string;
  priority: number; // Higher number means higher priority
}

// Static analysis patterns for common code structures
const complexityPatterns: ComplexityPattern[] = [
  // O(n³) - Triple nested loops
  {
    pattern: /for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)\s*{[^}]*for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)\s*{[^}]*for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/g,
    timeComplexity: "O(n³)",
    description: "Triple nested loops typically result in cubic time complexity",
    priority: 100
  },
  // O(n²) - Nested loops
  {
    pattern: /for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)\s*{[^}]*for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/g,
    timeComplexity: "O(n²)",
    description: "Nested loops typically result in quadratic time complexity",
    priority: 90
  },
  {
    pattern: /while\s*\([^)]*\)\s*{[^}]*while\s*\([^)]*\)/g,
    timeComplexity: "O(n²)",
    description: "Nested while loops typically result in quadratic time complexity",
    priority: 90
  },
  // O(n log n) - Efficient sorting
  {
    pattern: /\b(mergeSort|quickSort|heapSort|sort\()\b/g,
    timeComplexity: "O(n log n)",
    description: "Efficient sorting algorithms typically have linearithmic time complexity",
    priority: 80
  },
  // O(n) - Single loops
  {
    pattern: /for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/g,
    timeComplexity: "O(n)",
    description: "Single loop typically results in linear time complexity",
    priority: 70
  },
  {
    pattern: /while\s*\([^)]*\)/g,
    timeComplexity: "O(n)",
    description: "While loop typically results in linear time complexity",
    priority: 70
  },
  {
    pattern: /forEach|map|filter|reduce|for\s+\w+\s+of\s+/g,
    timeComplexity: "O(n)",
    description: "Array iteration methods typically have linear time complexity",
    priority: 70
  },
  // O(log n) - Binary search and divide-and-conquer
  {
    pattern: /binary_search|binarySearch|\.indexOf|\.search/g,
    timeComplexity: "O(log n)",
    description: "Binary search operations typically have logarithmic time complexity",
    priority: 60
  },
  {
    pattern: /\b(Math\.log|log\(|ln\()\b/g,
    timeComplexity: "O(log n)",
    description: "Logarithmic operations suggest logarithmic time complexity",
    priority: 60
  },
  // O(2^n) - Exponential
  {
    pattern: /function\s+(\w+)\([^)]*\)\s*{[^}]*\1\s*\(/g,
    timeComplexity: "Potentially exponential",
    description: "Recursive function calls can lead to exponential time complexity",
    priority: 95
  },
  // O(1) - Constant time
  {
    pattern: /^\s*(?!for|while|if|switch|function).*$/g,
    timeComplexity: "O(1)",
    description: "Simple operations typically have constant time complexity",
    priority: 50
  }
];

// Space complexity patterns
const spaceComplexityPatterns = [
  // O(n²) - Quadratic space
  {
    pattern: /new Array\([^)]*\)\.map\(\s*\(\)\s*=>\s*new Array/g,
    spaceComplexity: "O(n²)",
    description: "Creating a 2D array typically results in quadratic space complexity"
  },
  // O(n) - Linear space
  {
    pattern: /new Array|new Set|new Map|\[\]|\{\}|\.push|\.concat|\.slice/g,
    spaceComplexity: "O(n)",
    description: "Creating data structures that grow with input size typically results in linear space complexity"
  }
];

// Algorithm recognition patterns
const algorithmPatterns = [
  { 
    name: "Bubble Sort", 
    pattern: /\b(?:bubble[_\s]?sort|bubbleSort)\b|for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)\s*{[\s\S]*?for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?(?:swap|temp|>\s*[\w\[\]]+\s*[\+\-]\s*1)/g,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    optimizationTips: [
      "Consider using a more efficient sorting algorithm like Quick Sort or Merge Sort",
      "Bubble Sort has O(n²) time complexity which is inefficient for large datasets",
      "You could optimize by adding an early exit if no swaps occur in a pass"
    ]
  },
  { 
    name: "Selection Sort", 
    pattern: /\b(?:selection[_\s]?sort|selectionSort)\b|for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?(?:min|max|smallest|largest)[\s\S]*?for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/g,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    optimizationTips: [
      "Selection Sort always performs O(n²) comparisons even if the array is already sorted",
      "Consider using a more efficient algorithm for large datasets",
      "Selection Sort is useful when memory writes are expensive as it makes only O(n) swaps"
    ]
  },
  { 
    name: "Insertion Sort", 
    pattern: /\b(?:insertion[_\s]?sort|insertionSort)\b|for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?while\s*\([^)]*\)[\s\S]*?(?:>|<)[\s\S]*?(?:swap|temp|=)/g,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    optimizationTips: [
      "Insertion Sort is efficient for small datasets or nearly sorted arrays",
      "Consider using binary search to find the insertion position (Binary Insertion Sort)",
      "For large datasets, consider more efficient algorithms like Merge Sort or Quick Sort"
    ]
  },
  { 
    name: "Quick Sort", 
    pattern: /\b(?:quick[_\s]?sort|quickSort|partition)\b|(?:pivot|partition)[\s\S]*?(?:recursion|recursive|call)/g,
    timeComplexity: "O(n log n) average, O(n²) worst case",
    spaceComplexity: "O(log n)",
    optimizationTips: [
      "Choose a good pivot selection strategy to avoid the O(n²) worst case",
      "Consider using a hybrid approach with Insertion Sort for small subarrays",
      "Implement tail recursion optimization to reduce stack space usage"
    ]
  },
  { 
    name: "Merge Sort", 
    pattern: /\b(?:merge[_\s]?sort|mergeSort)\b|(?:merge)[\s\S]*?(?:left|right)[\s\S]*?(?:recursion|recursive|call)/g,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    optimizationTips: [
      "Merge Sort has consistent O(n log n) performance but requires O(n) extra space",
      "Consider using an in-place merge algorithm to reduce space complexity",
      "For small arrays, switch to Insertion Sort to improve performance"
    ]
  },
  { 
    name: "Heap Sort", 
    pattern: /\b(?:heap[_\s]?sort|heapSort|heapify)\b|(?:sift[_\s]?down|siftDown|heapify)[\s\S]*?(?:left|right|child|parent|2\s*\*\s*i)/g,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    optimizationTips: [
      "Heap Sort is in-place and has consistent O(n log n) performance",
      "Pre-allocate the heap to avoid resizing operations",
      "Consider using a binary heap implementation for better cache locality"
    ]
  },
  { 
    name: "Counting Sort", 
    pattern: /\b(?:counting[_\s]?sort|countingSort|count[_\s]?sort)\b|(?:count)[\s\S]*?(?:new Array|Array\(|\[\])[\s\S]*?(?:length|max|min)/g,
    timeComplexity: "O(n + k) where k is the range of input",
    spaceComplexity: "O(n + k)",
    optimizationTips: [
      "Counting Sort is efficient when the range of input values (k) is small",
      "Consider using a different algorithm if k is large compared to n",
      "Can be used as a subroutine in Radix Sort for larger ranges"
    ]
  },
  { 
    name: "Radix Sort", 
    pattern: /\b(?:radix[_\s]?sort|radixSort)\b|(?:digit|base|bucket)[\s\S]*?(?:count|bucket)[\s\S]*?(?:for|while)[\s\S]*?(?:pow|Math\.pow|10)/g,
    timeComplexity: "O(d * (n + k)) where d is number of digits and k is the base",
    spaceComplexity: "O(n + k)",
    optimizationTips: [
      "Radix Sort is efficient for fixed-length integers or strings",
      "Choose an appropriate base/radix for your data range",
      "Consider using Counting Sort as the stable sort for each digit"
    ]
  },
  { 
    name: "Bucket Sort", 
    pattern: /\b(?:bucket[_\s]?sort|bucketSort)\b|(?:bucket|buckets)[\s\S]*?(?:Array|\[\])[\s\S]*?(?:push|insert)[\s\S]*?(?:concat|flat)/g,
    timeComplexity: "O(n + k) average, O(n²) worst case",
    spaceComplexity: "O(n + k)",
    optimizationTips: [
      "Bucket Sort works best when input is uniformly distributed",
      "Choose the number of buckets based on the input distribution",
      "Use an efficient algorithm to sort individual buckets"
    ]
  },
  { 
    name: "Binary Search", 
    pattern: /\b(?:binary[_\s]?search|binarySearch)\b|(?:mid|middle)[\s\S]*?(?:left|right|start|end)[\s\S]*?(?:while|if)[\s\S]*?(?:<|>|=)/g,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    optimizationTips: [
      "Ensure the array is sorted before applying binary search",
      "Be careful with integer overflow when calculating mid = (left + right) / 2",
      "Consider using mid = left + (right - left) / 2 instead"
    ]
  },
  { 
    name: "Depth-First Search", 
    pattern: /\b(?:dfs|depth[_\s]?first|depthFirst)\b|(?:stack|visited)[\s\S]*?(?:push|add)[\s\S]*?(?:pop|remove|peek)/g,
    timeComplexity: "O(V + E) where V is vertices and E is edges",
    spaceComplexity: "O(V)",
    optimizationTips: [
      "Use an adjacency list instead of an adjacency matrix for sparse graphs",
      "Consider using recursion for cleaner code, but be aware of stack overflow for deep graphs",
      "Use a visited set to avoid processing the same node multiple times"
    ]
  },
  { 
    name: "Breadth-First Search", 
    pattern: /\b(?:bfs|breadth[_\s]?first|breadthFirst)\b|(?:queue|visited)[\s\S]*?(?:push|enqueue|add)[\s\S]*?(?:shift|dequeue|poll|remove)/g,
    timeComplexity: "O(V + E) where V is vertices and E is edges",
    spaceComplexity: "O(V)",
    optimizationTips: [
      "BFS is ideal for finding the shortest path in unweighted graphs",
      "Use an efficient queue implementation",
      "Consider using a visited array instead of a set for dense graphs with numeric vertex IDs"
    ]
  },
  { 
    name: "Dynamic Programming", 
    pattern: /\b(?:dp|memo|cache|tabulation|memoization)\b[\s\S]*?(?:array|matrix|table|map|\[\]|new Array)/g,
    timeComplexity: "Varies (typically polynomial)",
    spaceComplexity: "Varies (typically O(n) or O(n²))",
    optimizationTips: [
      "Consider using tabulation (bottom-up) instead of recursion with memoization for better space efficiency",
      "Look for overlapping subproblems and optimal substructure in your problem",
      "Consider space optimization techniques like using rolling arrays"
    ]
  }
];

// Generate optimization tips based on the detected complexity
const generateOptimizationTips = (timeComplexity: string, code: string): string[] => {
  const tips: string[] = [];
  
  switch (timeComplexity) {
    case "O(n³)":
      tips.push("Consider if you can reduce the number of nested loops from three to two");
      tips.push("Look for mathematical optimizations that can reduce the cubic complexity");
      tips.push("Check if dynamic programming can be applied to avoid redundant calculations");
      break;
    case "O(n²)":
      tips.push("Consider if a more efficient algorithm could be used (e.g., merge sort or quick sort instead of bubble sort)");
      tips.push("Check if you can reduce the number of nested loops");
      tips.push("Look for opportunities to use more efficient data structures like hash maps");
      if (code.includes("sort") || code.includes("Sort")) {
        tips.push("Consider using a more efficient sorting algorithm with O(n log n) complexity");
      }
      break;
    case "O(n log n)":
      tips.push("This is an efficient complexity for sorting and many divide-and-conquer algorithms");
      tips.push("For sorting, this is generally optimal for comparison-based sorting");
      tips.push("In some special cases, you might achieve O(n) with non-comparison sorts like radix or counting sort");
      break;
    case "O(n)":
      tips.push("This is a good complexity for many operations, but consider if a logarithmic solution is possible");
      tips.push("Check if you can use binary search or divide-and-conquer approaches for search operations");
      tips.push("Ensure you're not doing unnecessary work inside the loop");
      break;
    case "O(log n)":
      tips.push("This is an efficient complexity for search operations");
      tips.push("Ensure your implementation correctly maintains the logarithmic property");
      tips.push("Verify that the input is properly divided in each step (typically by half)");
      break;
    case "O(2ⁿ)":
      tips.push("Consider using dynamic programming to avoid redundant calculations");
      tips.push("Look for opportunities to use memoization to cache results");
      tips.push("Check if a bottom-up approach would be more efficient than recursion");
      tips.push("Consider if the problem can be reformulated to avoid exponential growth");
      break;
    case "O(1)":
      tips.push("Constant time complexity is ideal - no optimization needed for time complexity");
      tips.push("Check if space usage can be optimized further");
      break;
    default:
      tips.push("Consider the specific characteristics of your algorithm for optimization opportunities");
      break;
  }
  
  return tips;
};

// Detect common algorithms in the code
const detectAlgorithm = (code: string): { name: string, timeComplexity: string, spaceComplexity: string } | null => {
  for (const algo of algorithmPatterns) {
    if (algo.pattern.test(code)) {
      return {
        name: algo.name,
        timeComplexity: algo.timeComplexity,
        spaceComplexity: algo.spaceComplexity
      };
    }
  }
  return null;
};

// Main analyzer function
export const analyzeCodeComplexity = (code: string, language: string = "javascript"): ComplexityResult => {
  // Default result
  let result: ComplexityResult = {
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    explanation: "No complex operations detected. The code appears to have constant time complexity.",
    optimizationTips: ["Constant time complexity is ideal - no optimization needed."]
  };
  
  // Special case for common sorting algorithms with specific patterns
  
  // Bubble Sort
  if ((/\b(?:bubble[_\s]?sort|bubbleSort)\b/i.test(code) || 
      (/for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?swap/.test(code) && 
       !code.includes("pivot") && !code.includes("merge") && !code.includes("partition"))) && 
      !code.includes("quick") && !code.includes("merge") && !code.includes("heap")) {
    return {
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation: "Detected a Bubble Sort algorithm. Bubble Sort typically has O(n²) time complexity and O(1) space complexity.",
      confidenceScore: 0.95,
      optimizationTips: [
        "Consider using a more efficient sorting algorithm like Quick Sort or Merge Sort",
        "Bubble Sort has O(n²) time complexity which is inefficient for large datasets",
        "You could optimize by adding an early exit if no swaps occur in a pass"
      ]
    };
  }
  
  // Selection Sort
  if ((/\b(?:selection[_\s]?sort|selectionSort)\b/i.test(code) || 
      (/for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?(?:min|max|smallest|largest)[\s\S]*?for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/.test(code) && 
       !code.includes("pivot") && !code.includes("merge"))) && 
      !code.includes("quick") && !code.includes("merge") && !code.includes("heap")) {
    return {
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation: "Detected a Selection Sort algorithm. Selection Sort always performs O(n²) comparisons regardless of the input.",
      confidenceScore: 0.95,
      optimizationTips: [
        "Selection Sort always performs O(n²) comparisons even if the array is already sorted",
        "Consider using a more efficient algorithm for large datasets",
        "Selection Sort is useful when memory writes are expensive as it makes only O(n) swaps"
      ]
    };
  }
  
  // Insertion Sort
  if ((/\b(?:insertion[_\s]?sort|insertionSort)\b/i.test(code) || 
      (/for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?while\s*\([^)]*\)[\s\S]*?(?:>|<)[\s\S]*?(?:=|swap)/.test(code) && 
       !code.includes("pivot") && !code.includes("merge"))) && 
      !code.includes("quick") && !code.includes("merge") && !code.includes("heap")) {
    return {
      timeComplexity: "O(n²) worst case, O(n) best case",
      spaceComplexity: "O(1)",
      explanation: "Detected an Insertion Sort algorithm. Insertion Sort has O(n²) worst-case time complexity but performs well on nearly sorted data.",
      confidenceScore: 0.95,
      optimizationTips: [
        "Insertion Sort is efficient for small datasets or nearly sorted arrays",
        "Consider using binary search to find the insertion position (Binary Insertion Sort)",
        "For large datasets, consider more efficient algorithms like Merge Sort or Quick Sort"
      ]
    };
  }
  
  // Quick Sort
  if (/\b(?:quick[_\s]?sort|quickSort|partition)\b/i.test(code) || 
      (/(?:pivot|partition)[\s\S]*?(?:left|right)[\s\S]*?(?:recursion|recursive|call)/.test(code) && 
       !code.includes("merge") && !code.includes("heap"))) {
    return {
      timeComplexity: "O(n log n) average, O(n²) worst case",
      spaceComplexity: "O(log n)",
      explanation: "Detected a Quick Sort algorithm. Quick Sort has O(n log n) average-case time complexity but can degrade to O(n²) in the worst case.",
      confidenceScore: 0.95,
      optimizationTips: [
        "Choose a good pivot selection strategy (like median-of-three) to avoid the O(n²) worst case",
        "Consider using a hybrid approach with Insertion Sort for small subarrays",
        "Implement tail recursion optimization to reduce stack space usage"
      ]
    };
  }
  
  // Merge Sort
  if (/\b(?:merge[_\s]?sort|mergeSort)\b/i.test(code) || 
      (/(?:merge)[\s\S]*?(?:left|right)[\s\S]*?(?:mid|middle)/.test(code) && 
       !code.includes("quick") && !code.includes("heap"))) {
    return {
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      explanation: "Detected a Merge Sort algorithm. Merge Sort consistently performs at O(n log n) time complexity regardless of input.",
      confidenceScore: 0.95,
      optimizationTips: [
        "Merge Sort has consistent O(n log n) performance but requires O(n) extra space",
        "Consider using an in-place merge algorithm to reduce space complexity",
        "For small arrays, switch to Insertion Sort to improve performance"
      ]
    };
  }
  
  // Heap Sort
  if (/\b(?:heap[_\s]?sort|heapSort|heapify)\b/i.test(code) || 
      (/(?:sift[_\s]?down|siftDown|heapify)[\s\S]*?(?:left|right|child|parent|2\s*\*\s*i)/.test(code) && 
       !code.includes("quick") && !code.includes("merge"))) {
    return {
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
      explanation: "Detected a Heap Sort algorithm. Heap Sort has O(n log n) time complexity and uses O(1) extra space.",
      confidenceScore: 0.95,
      optimizationTips: [
        "Heap Sort is in-place and has consistent O(n log n) performance",
        "Pre-allocate the heap to avoid resizing operations",
        "Consider using a binary heap implementation for better cache locality"
      ]
    };
  }
  
  // Counting Sort
  if (/\b(?:counting[_\s]?sort|countingSort|count[_\s]?sort)\b/i.test(code) || 
      (/(?:count)[\s\S]*?(?:new Array|Array\(|\[\])[\s\S]*?(?:length|max|min)/.test(code) && 
       !code.includes("quick") && !code.includes("merge") && !code.includes("heap"))) {
    return {
      timeComplexity: "O(n + k) where k is the range of input",
      spaceComplexity: "O(n + k)",
      explanation: "Detected a Counting Sort algorithm. Counting Sort has O(n + k) time complexity where k is the range of input values.",
      confidenceScore: 0.9,
      optimizationTips: [
        "Counting Sort is efficient when the range of input values (k) is small",
        "Consider using a different algorithm if k is large compared to n",
        "Can be used as a subroutine in Radix Sort for larger ranges"
      ]
    };
  }
  
  // Radix Sort
  if (/\b(?:radix[_\s]?sort|radixSort)\b/i.test(code) || 
      (/(?:digit|base|bucket)[\s\S]*?(?:count|bucket)[\s\S]*?(?:for|while)[\s\S]*?(?:pow|Math\.pow|10)/.test(code) && 
       !code.includes("quick") && !code.includes("merge") && !code.includes("heap"))) {
    return {
      timeComplexity: "O(d * (n + k)) where d is number of digits and k is the base",
      spaceComplexity: "O(n + k)",
      explanation: "Detected a Radix Sort algorithm. Radix Sort has O(d * (n + k)) time complexity where d is the number of digits.",
      confidenceScore: 0.9,
      optimizationTips: [
        "Radix Sort is efficient for fixed-length integers or strings",
        "Choose an appropriate base/radix for your data range",
        "Consider using Counting Sort as the stable sort for each digit"
      ]
    };
  }
  
  // Bucket Sort
  if (/\b(?:bucket[_\s]?sort|bucketSort)\b/i.test(code) || 
      (/(?:bucket|buckets)[\s\S]*?(?:Array|\[\])[\s\S]*?(?:push|insert)[\s\S]*?(?:concat|flat)/.test(code) && 
       !code.includes("quick") && !code.includes("merge") && !code.includes("heap"))) {
    return {
      timeComplexity: "O(n + k) average, O(n²) worst case",
      spaceComplexity: "O(n + k)",
      explanation: "Detected a Bucket Sort algorithm. Bucket Sort has O(n + k) average time complexity but can degrade to O(n²).",
      confidenceScore: 0.9,
      optimizationTips: [
        "Bucket Sort works best when input is uniformly distributed",
        "Choose the number of buckets based on the input distribution",
        "Use an efficient algorithm to sort individual buckets"
      ]
    };
  }
  
  // Try to detect known algorithms first
  const detectedAlgorithm = detectAlgorithm(code);
  if (detectedAlgorithm) {
    result = {
      timeComplexity: detectedAlgorithm.timeComplexity,
      spaceComplexity: detectedAlgorithm.spaceComplexity,
      explanation: `Detected a ${detectedAlgorithm.name} algorithm. ${detectedAlgorithm.name} typically has ${detectedAlgorithm.timeComplexity} time complexity and ${detectedAlgorithm.spaceComplexity} space complexity.`,
      confidenceScore: 0.9
    };
  } else {
    // Check for nested loops first (most common pattern in algorithms)
    if (/for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/.test(code) ||
        /while\s*\([^)]*\)[\s\S]*?while\s*\([^)]*\)/.test(code) ||
        /for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)[\s\S]*?while\s*\([^)]*\)/.test(code) ||
        /while\s*\([^)]*\)[\s\S]*?for\s*\([^;]*;\s*[^;]*;\s*[^)]*\)/.test(code)) {
      result.timeComplexity = "O(n²)";
      result.explanation = "Nested loops detected. This typically results in quadratic time complexity.";
      result.confidenceScore = 0.85;
    } else {
      // Check for other time complexity patterns
      let highestPriorityMatch: ComplexityPattern | null = null;
      
      for (const pattern of complexityPatterns) {
        if (pattern.pattern.test(code)) {
          if (!highestPriorityMatch || pattern.priority > highestPriorityMatch.priority) {
            highestPriorityMatch = pattern;
          }
        }
      }
      
      if (highestPriorityMatch) {
        result.timeComplexity = highestPriorityMatch.timeComplexity;
        result.explanation = highestPriorityMatch.description;
      }
    }
    
    // Check for space complexity patterns
    for (const pattern of spaceComplexityPatterns) {
      if (pattern.pattern.test(code)) {
        result.spaceComplexity = pattern.spaceComplexity;
        result.explanation += ` ${pattern.description}.`;
        break;
      }
    }
  }
  
  // Generate optimization tips
  result.optimizationTips = generateOptimizationTips(result.timeComplexity, code);
  
  // Set confidence score based on code length and complexity
  result.confidenceScore = calculateConfidenceScore(code, result.timeComplexity);
  
  return result;
};

// Calculate a confidence score for the analysis
const calculateConfidenceScore = (code: string, complexity: string): number => {
  // Start with a base confidence
  let confidence = 0.7;
  
  // Adjust based on code length (very short or very long code is harder to analyze)
  const codeLength = code.length;
  if (codeLength < 50) {
    confidence -= 0.2; // Very short code snippets are harder to analyze
  } else if (codeLength > 500) {
    confidence -= 0.1; // Very long code is more complex and may have mixed patterns
  } else if (codeLength > 100 && codeLength < 300) {
    confidence += 0.1; // Medium length code is often clearer to analyze
  }
  
  // Adjust based on complexity type (some are easier to detect than others)
  if (complexity === "O(n²)" || complexity === "O(n)") {
    confidence += 0.1; // Loop patterns are easier to detect
  } else if (complexity === "O(2ⁿ)") {
    confidence -= 0.1; // Exponential is harder to confirm
  } else if (complexity === "O(1)") {
    confidence -= 0.05; // Constant time is often a default when nothing else is detected
  }
  
  // Ensure confidence is between 0 and 1
  return Math.max(0, Math.min(1, confidence));
};

// Export a function to get language-specific example code
export const getExampleCode = (language: string, algorithm: string = "bubble"): string => {
  const examples: Record<string, Record<string, string>> = {
    javascript: {
      bubble: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
      selection: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    // Find the minimum element in the unsorted part
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // Swap the found minimum element with the element at i
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`,
      insertion: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    // Pick the current element to be inserted
    let key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key to one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      quick: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Find the partition index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after the pivot
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];
  let i = low - 1;
  
  // Move all elements smaller than pivot to the left
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Place the pivot in its correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      merge: `function mergeSort(arr) {
  const n = arr.length;
  
  if (n <= 1) {
    return arr;
  }
  
  // Split the array into two halves
  const mid = Math.floor(n / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and merge them in sorted order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}`,
      heap: `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from the heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call heapify on the reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  // Check if left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // Check if right child is larger than the largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not the root
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}`,
      counting: `function countingSort(arr) {
  // Find the maximum element to determine the count array size
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  
  // Create count array and output array
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);
  
  // Store the count of each element
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }
  
  // Store the cumulative count
  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];
  }
  
  // Build the output array
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
  }
  
  // Copy the output array to the original array
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
  
  return arr;
}`,
      radix: `function radixSort(arr) {
  // Find the maximum number to know the number of digits
  const max = Math.max(...arr);
  
  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  
  return arr;
}

function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);
  
  // Store count of occurrences of current digit
  for (let i = 0; i < n; i++) {
    const digit = Math.floor(arr[i] / exp) % 10;
    count[digit]++;
  }
  
  // Change count[i] so that it contains the position of this digit in output[]
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  // Build the output array
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  
  // Copy the output array to arr[]
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`
    },
    python: {
      bubble: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
      selection: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        # Find the minimum element in the unsorted part
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        
        # Swap the found minimum element with the element at i
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    
    return arr`,
      insertion: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        # Move elements greater than key to one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    
    return arr`,
      quick: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Find the partition index
        pivot_index = partition(arr, low, high)
        
        # Recursively sort elements before and after the pivot
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    i = low - 1
    
    # Move all elements smaller than pivot to the left
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place the pivot in its correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      merge: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    # Split the array into two halves
    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]
    
    # Recursively sort both halves
    left = merge_sort(left)
    right = merge_sort(right)
    
    # Merge the sorted halves
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    # Compare elements from both arrays and merge them in sorted order
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      heap: `def heap_sort(arr):
    n = len(arr)
    
    # Build a max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]  # Swap
        heapify(arr, i, 0)
    
    return arr

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    # Check if left child exists and is greater than root
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    # Check if right child exists and is greater than the largest so far
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    # Change root if needed
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]  # Swap
        heapify(arr, n, largest)  # Heapify the affected sub-tree`
    },
    java: {
      bubble: `public static int[] bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}`,
      selection: `public static int[] selectionSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 0; i < n - 1; i++) {
        // Find the minimum element in the unsorted part
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        
        // Swap the found minimum element with the element at i
        int temp = arr[minIndex];
        arr[minIndex] = arr[i];
        arr[i] = temp;
    }
    
    return arr;
}`,
      insertion: `public static int[] insertionSort(int[] arr) {
    int n = arr.length;
    
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Move elements greater than key to one position ahead
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    
    return arr;
}`,
      quick: `public static int[] quickSort(int[] arr, int low, int high) {
    if (low < high) {
        // Find the partition index
        int pivotIndex = partition(arr, low, high);
        
        // Recursively sort elements before and after the pivot
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

private static int partition(int[] arr, int low, int high) {
    // Choose the rightmost element as pivot
    int pivot = arr[high];
    int i = (low - 1); // Index of smaller element
    
    for (int j = low; j < high; j++) {
        // If current element is smaller than or equal to pivot
        if (arr[j] <= pivot) {
            i++;
            
            // Swap arr[i] and arr[j]
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    // Swap arr[i+1] and arr[high] (or pivot)
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}`,
      merge: `public static int[] mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        // Find the middle point
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
    return arr;
}

private static void merge(int[] arr, int left, int mid, int right) {
    // Find sizes of two subarrays to be merged
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temp arrays
    int[] L = new int[n1];
    int[] R = new int[n2];
    
    // Copy data to temp arrays
    for (int i = 0; i < n1; ++i) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; ++j) {
        R[j] = arr[mid + 1 + j];
    }
    
    // Merge the temp arrays
    int i = 0, j = 0;
    int k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy remaining elements of L[] if any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy remaining elements of R[] if any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}`
    }
  };
  
  // Default to bubble sort if algorithm not specified
  const selectedAlgorithm = algorithm || "bubble";
  
  // Get the examples for the selected language, or default to JavaScript
  const languageExamples = examples[language] || examples.javascript;
  
  // Return the example for the selected algorithm, or default to bubble sort
  return languageExamples[selectedAlgorithm] || languageExamples.bubble;
};
