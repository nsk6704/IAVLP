# Algoviz - Interactive Algorithm Visualization Learning Platform:

## Overview

Algoviz is a comprehensive web application designed to help users understand complex algorithms and computational concepts through interactive visualizations. The platform provides step-by-step visual representations of various algorithms in computer science, making abstract concepts more accessible and engaging.

## Features

### Graph Algorithms

- **Dijkstra's Algorithm**: Visualize shortest path finding in weighted graphs with uniform cost search
- **A-star Pathfinding**: Explore efficient pathfinding using heuristic-based search techniques
- **DFS Traversal**: Understand depth-first search traversal and path finding in graphs

### AI & Machine Learning

- **A* Algorithm (8 Puzzle)**: Visualize pathfinding with heuristic search in the context of the 8-puzzle problem
- **Minimax with α-β Pruning**: Interactive game tree visualization with alpha-beta pruning demonstration
- **Hill Climb Search**: Explore local search optimization techniques through visualization

### Sorting Algorithms

- **Quick Sort**: Animated divide‑and‑conquer sorting with pivot selection and partition steps  
- **Merge Sort**: Visualize recursive splitting and merging of subarrays  
- **Heap Sort**: Interactive heap construction and extraction to demonstrate in‑place sorting
- **Selection Sort**: Step‑by‑step selection and swapping of the minimum element in each pass
- **Bubble Sort**: Animated pairwise comparisons and swaps to “bubble” the largest elements to the end
- **Insertion Sort**: Interactive insertion of elements into a growing sorted portion of the array   

### Theory of Computation

- **Regular Expression to Finite Automata**: Visualize how regular expressions are converted to finite automata using Thompson's construction algorithm
  - Step-by-step visualization of automata construction
  - Interactive zoom and pan functionality
  - Clear visualization of states and transitions

## Technical Implementation

### Frontend

- **Framework**: Next.js with React and TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Custom UI components with shadcn/ui
- **Animations**: Canvas-based visualizations with custom animation logic

### Key Components

- **Interactive Canvas**: All visualizations use HTML5 Canvas for rendering with custom zoom and pan functionality
- **Step Controls**: Users can step through algorithm execution to understand each phase
- **Responsive Design**: Optimized for various screen sizes and devices
- **Consistent UI**: Unified design system across all visualization modules
- 
### Backend & AI Features

- **Authentication**: User sign-up and sign-in are managed by Clerk for streamlined and secure account control.
- **RAG Chatbot, Adaptive Quizzes & Learning Path Generator**: Implemented in a Google Colab notebook (`.ipynb`), leveraging LLaMA 3 and Groq API  
- **Ngrok Tunnel**: Exposes FastAPI endpoints publicly for easy testing and demo  
- **Website Integration**: Upon successful endpoint tests, the public URL generated by Ngrok is wired into the site’s FastAPI client to power the chatbot, quizzes, and generating learning-path features

### Recent Enhancements

1. **Regular Expression to Finite Automata Visualization**:
   - Implemented Thompson's construction algorithm for converting regular expressions to finite automata
   - Added step-by-step visualization capability with a "Next" button
   - Integrated zoom and pan functionality for better interaction
   - Fixed input field issues and improved error handling
   - Enhanced state positioning for clearer visualization

2. **Theory of Computation UI Improvements**:
   - Updated background styling to match other algorithm pages
   - Enhanced card design and overall layout
   - Added grid overlay for visual consistency
   - Fixed hydration warnings and event handling issues

3. **General Improvements**:
   - Fixed console warnings related to event handling
   - Improved hydration compatibility with server components
   - Enhanced accessibility and user experience

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/IAVLP.git
   cd IAVLP
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
IAVLP/
├── app/                   # Next.js app directory
│   ├── algorithms/        # Algorithm visualizations
│   │   ├── astar/         # A* algorithm
│   │   ├── dijkstra/      # Dijkstra's algorithm
│   │   ├── dfs/           # Depth-first search
│   │   └── ...            # Other algorithm visualizations
│   ├── theory-of-computation/ # Theory of computation visualizations
│   │   └── regex-to-fa/   # Regular expression to finite automata
│   ├── home/              # Home page
│   └── ...                # Other app components
├── components/            # Reusable UI components
├── lib/                   # Utility functions and libraries
├── public/                # Static assets
└── ...                    # Configuration files
```


## License

This project is licensed under the MIT License - see the LICENSE file for details.
