export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the time complexity of Bubble Sort in the worst case?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What is the space complexity of Merge Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "Which sorting algorithm is stable by nature?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What is the best-case time complexity of Bubble Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(1)"],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "Which sorting algorithm uses a divide-and-conquer approach?",
    options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "Quick Sort"],
    correctAnswer: 3
  },
  {
    id: 7,
    question: "What is the worst-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Which sorting algorithm is most efficient for nearly sorted arrays?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 9,
    question: "What is the space complexity of Bubble Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0
  },
  {
    id: 10,
    question: "Which sorting algorithm always makes exactly n(n-1)/2 comparisons?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 1
  },
  {
    id: 11,
    question: "What is the average-case time complexity of Merge Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 12,
    question: "Which sorting algorithm uses a binary heap data structure?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 3
  },
  {
    id: 13,
    question: "What is the worst-case time complexity of Insertion Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(1)"],
    correctAnswer: 1
  },
  {
    id: 14,
    question: "Which sorting algorithm is in-place?",
    options: ["Merge Sort", "Radix Sort", "Counting Sort", "Quick Sort"],
    correctAnswer: 3
  },
  {
    id: 15,
    question: "What is the best-case time complexity of Quick Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 0
  },
  {
    id: 16,
    question: "Which sorting algorithm is most suitable for small datasets?",
    options: ["Merge Sort", "Quick Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 17,
    question: "What is the space complexity of Quick Sort in the worst case?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 2
  },
  {
    id: 18,
    question: "Which sorting algorithm is least efficient for reverse-sorted arrays?",
    options: ["Merge Sort", "Quick Sort", "Heap Sort", "Insertion Sort"],
    correctAnswer: 3
  },
  {
    id: 19,
    question: "What is the time complexity of Heap Sort in all cases?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 20,
    question: "Which sorting algorithm is based on the principle of reducing the number of inversions?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 0
  },
  {
    id: 21,
    question: "What is the time complexity of building a heap in Heap Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 0
  },
  {
    id: 22,
    question: "Which sorting algorithm is most efficient for large datasets with many duplicates?",
    options: ["Merge Sort", "Quick Sort", "Counting Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 23,
    question: "What is the worst-case time complexity of Merge Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 24,
    question: "Which sorting algorithm always divides the array into two equal parts?",
    options: ["Quick Sort", "Merge Sort", "Heap Sort", "Insertion Sort"],
    correctAnswer: 1
  },
  {
    id: 25,
    question: "What is the best-case time complexity of Selection Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(1)"],
    correctAnswer: 1
  },
  {
    id: 26,
    question: "Which sorting algorithm is most suitable for external sorting?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Bubble Sort"],
    correctAnswer: 1
  },
  {
    id: 27,
    question: "What is the space complexity of Selection Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0
  },
  {
    id: 28,
    question: "Which sorting algorithm is most efficient for arrays with a small range of values?",
    options: ["Merge Sort", "Quick Sort", "Counting Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 29,
    question: "What is the average-case time complexity of Insertion Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 30,
    question: "Which sorting algorithm is most efficient for linked lists?",
    options: ["Quick Sort", "Merge Sort", "Heap Sort", "Bubble Sort"],
    correctAnswer: 1
  },
  {
    id: 31,
    question: "What is the time complexity of Counting Sort?",
    options: ["O(n+k)", "O(n log n)", "O(n²)", "O(n log k)"],
    correctAnswer: 0
  },
  {
    id: 32,
    question: "Which sorting algorithm uses recursion?",
    options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "Quick Sort"],
    correctAnswer: 3
  },
  {
    id: 33,
    question: "What is the worst-case time complexity of Heap Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 34,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"],
    correctAnswer: 3
  },
  {
    id: 35,
    question: "What is the space complexity of Heap Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0
  },
  {
    id: 36,
    question: "Which sorting algorithm is most efficient for arrays with a small number of distinct values?",
    options: ["Merge Sort", "Quick Sort", "Counting Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 37,
    question: "What is the best-case time complexity of Heap Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 38,
    question: "Which sorting algorithm is most suitable for real-time systems?",
    options: ["Quick Sort", "Merge Sort", "Heap Sort", "Insertion Sort"],
    correctAnswer: 2
  },
  {
    id: 39,
    question: "What is the time complexity of Radix Sort?",
    options: ["O(nk)", "O(n log n)", "O(n²)", "O(n+k)"],
    correctAnswer: 0
  },
  {
    id: 40,
    question: "Which sorting algorithm is most efficient for arrays with a small range of integers?",
    options: ["Merge Sort", "Quick Sort", "Counting Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 41,
    question: "What is the space complexity of Radix Sort?",
    options: ["O(1)", "O(log n)", "O(n+k)", "O(n log n)"],
    correctAnswer: 2
  },
  {
    id: 42,
    question: "Which sorting algorithm is most efficient for arrays with a large number of duplicates?",
    options: ["Quick Sort", "Merge Sort", "Heap Sort", "Counting Sort"],
    correctAnswer: 3
  },
  {
    id: 43,
    question: "What is the average-case time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 44,
    question: "Which sorting algorithm is most efficient for nearly sorted arrays?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 45,
    question: "What is the worst-case time complexity of Counting Sort?",
    options: ["O(n+k)", "O(n log n)", "O(n²)", "O(n log k)"],
    correctAnswer: 0
  },
  {
    id: 46,
    question: "Which sorting algorithm is most efficient for arrays with a large range of values?",
    options: ["Counting Sort", "Radix Sort", "Bucket Sort", "Merge Sort"],
    correctAnswer: 3
  },
  {
    id: 47,
    question: "What is the space complexity of Bucket Sort?",
    options: ["O(1)", "O(log n)", "O(n+k)", "O(n log n)"],
    correctAnswer: 2
  },
  {
    id: 48,
    question: "Which sorting algorithm is most efficient for arrays with a small number of inversions?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 49,
    question: "What is the best-case time complexity of Merge Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 50,
    question: "Which sorting algorithm is most efficient for arrays with a large number of inversions?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort"],
    correctAnswer: 3
  },
  {
    id: 51,
    question: "What is the time complexity of Shell Sort in the average case?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(n log² n)"],
    correctAnswer: 3
  },
  {
    id: 52,
    question: "Which sorting algorithm is most efficient for arrays with a small range of floating-point values?",
    options: ["Counting Sort", "Radix Sort", "Bucket Sort", "Merge Sort"],
    correctAnswer: 2
  },
  {
    id: 53,
    question: "What is the space complexity of Shell Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0
  },
  {
    id: 54,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements close to their final positions?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 55,
    question: "What is the worst-case time complexity of Bucket Sort?",
    options: ["O(n+k)", "O(n log n)", "O(n²)", "O(n log k)"],
    correctAnswer: 2
  },
  {
    id: 56,
    question: "Which sorting algorithm is most efficient for arrays with a small number of unique elements?",
    options: ["Merge Sort", "Quick Sort", "Counting Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 57,
    question: "What is the average-case time complexity of Heap Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 58,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements at the beginning that are already sorted?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 59,
    question: "What is the best-case time complexity of Counting Sort?",
    options: ["O(n+k)", "O(n log n)", "O(n²)", "O(n log k)"],
    correctAnswer: 0
  },
  {
    id: 60,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements at the end that are already sorted?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort"],
    correctAnswer: 0
  },
  {
    id: 61,
    question: "What is the time complexity of Tim Sort in the worst case?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 62,
    question: "Which sorting algorithm is a hybrid of Merge Sort and Insertion Sort?",
    options: ["Quick Sort", "Tim Sort", "Heap Sort", "Shell Sort"],
    correctAnswer: 1
  },
  {
    id: 63,
    question: "What is the space complexity of Tim Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 2
  },
  {
    id: 64,
    question: "Which sorting algorithm is used in Python's built-in sort() function?",
    options: ["Quick Sort", "Merge Sort", "Tim Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 65,
    question: "What is the average-case time complexity of Bubble Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 66,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements that are in reverse order?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort"],
    correctAnswer: 3
  },
  {
    id: 67,
    question: "What is the worst-case time complexity of Radix Sort?",
    options: ["O(nk)", "O(n log n)", "O(n²)", "O(n+k)"],
    correctAnswer: 0
  },
  {
    id: 68,
    question: "Which sorting algorithm is most efficient for arrays with a small number of elements that are in reverse order?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 1
  },
  {
    id: 69,
    question: "What is the best-case time complexity of Radix Sort?",
    options: ["O(nk)", "O(n log n)", "O(n²)", "O(n+k)"],
    correctAnswer: 0
  },
  {
    id: 70,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements that are already sorted?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"],
    correctAnswer: 2
  },
  {
    id: 71,
    question: "What is the time complexity of Intro Sort in the worst case?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 72,
    question: "Which sorting algorithm is a hybrid of Quick Sort, Heap Sort, and Insertion Sort?",
    options: ["Tim Sort", "Intro Sort", "Shell Sort", "Bucket Sort"],
    correctAnswer: 1
  },
  {
    id: 73,
    question: "What is the space complexity of Intro Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1
  },
  {
    id: 74,
    question: "Which sorting algorithm is used in C++'s STL sort() function?",
    options: ["Quick Sort", "Merge Sort", "Tim Sort", "Intro Sort"],
    correctAnswer: 3
  },
  {
    id: 75,
    question: "What is the average-case time complexity of Selection Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 76,
    question: "Which sorting algorithm is most efficient for arrays with a small number of elements that are already sorted?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 77,
    question: "What is the worst-case time complexity of Shell Sort?",
    options: ["O(n log n)", "O(n log² n)", "O(n²)", "O(n^(3/2))"],
    correctAnswer: 2
  },
  {
    id: 78,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements that are partially sorted?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Tim Sort"],
    correctAnswer: 3
  },
  {
    id: 79,
    question: "What is the best-case time complexity of Shell Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(n log² n)"],
    correctAnswer: 0
  },
  {
    id: 80,
    question: "Which sorting algorithm is most efficient for arrays with a small number of elements that are partially sorted?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 81,
    question: "What is the time complexity of Cocktail Sort in the worst case?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 82,
    question: "Which sorting algorithm is a bidirectional variant of Bubble Sort?",
    options: ["Selection Sort", "Insertion Sort", "Cocktail Sort", "Shell Sort"],
    correctAnswer: 2
  },
  {
    id: 83,
    question: "What is the space complexity of Cocktail Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0
  },
  {
    id: 84,
    question: "Which sorting algorithm is most efficient for arrays with a small number of inversions at both ends?",
    options: ["Bubble Sort", "Cocktail Sort", "Insertion Sort", "Merge Sort"],
    correctAnswer: 1
  },
  {
    id: 85,
    question: "What is the average-case time complexity of Cocktail Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 86,
    question: "Which sorting algorithm is most efficient for arrays with a large number of duplicates at both ends?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Cocktail Sort"],
    correctAnswer: 3
  },
  {
    id: 87,
    question: "What is the worst-case time complexity of Comb Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 88,
    question: "Which sorting algorithm is an improvement over Bubble Sort with a gap sequence?",
    options: ["Shell Sort", "Comb Sort", "Cocktail Sort", "Insertion Sort"],
    correctAnswer: 1
  },
  {
    id: 89,
    question: "What is the space complexity of Comb Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0
  },
  {
    id: 90,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements with a few inversions?",
    options: ["Bubble Sort", "Selection Sort", "Comb Sort", "Heap Sort"],
    correctAnswer: 2
  },
  {
    id: 91,
    question: "What is the average-case time complexity of Comb Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(n log² n)"],
    correctAnswer: 0
  },
  {
    id: 92,
    question: "Which sorting algorithm is most efficient for arrays with a small number of elements with many inversions?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Comb Sort"],
    correctAnswer: 1
  },
  {
    id: 93,
    question: "What is the worst-case time complexity of Gnome Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 94,
    question: "Which sorting algorithm is similar to Insertion Sort but uses swaps like Bubble Sort?",
    options: ["Selection Sort", "Gnome Sort", "Cocktail Sort", "Shell Sort"],
    correctAnswer: 1
  },
  {
    id: 95,
    question: "What is the space complexity of Gnome Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 0
  },
  {
    id: 96,
    question: "Which sorting algorithm is most efficient for arrays with a small number of elements that are nearly sorted?",
    options: ["Bubble Sort", "Selection Sort", "Gnome Sort", "Insertion Sort"],
    correctAnswer: 3
  },
  {
    id: 97,
    question: "What is the average-case time complexity of Gnome Sort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1
  },
  {
    id: 98,
    question: "Which sorting algorithm is most efficient for arrays with a large number of elements with many inversions?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Gnome Sort"],
    correctAnswer: 1
  },
  {
    id: 99,
    question: "What is the time complexity of Bogo Sort in the worst case?",
    options: ["O(n!)", "O(n²)", "O(∞)", "O(n log n)"],
    correctAnswer: 2
  },
  {
    id: 100,
    question: "Which sorting algorithm randomly shuffles the array until it is sorted?",
    options: ["Quick Sort", "Merge Sort", "Bogo Sort", "Heap Sort"],
    correctAnswer: 2
  }
];
