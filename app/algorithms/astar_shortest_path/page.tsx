"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Play, Pause, GitGraph, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Node types for the graph
interface GraphNode {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  weight: number;
  fScore: number;
  gScore: number;
  hScore: number;
  parent: { row: number; col: number } | null;
}

// Main component for A* visualization
const AStarVisualization = () => {
  // Grid dimensions
  const ROWS = 20;
  const COLS = 40;

  // Canvas for visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State variables
  const [grid, setGrid] = useState<GraphNode[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [heuristicType, setHeuristicType] = useState<"manhattan" | "euclidean" | "diagonal">("manhattan");
  const [startNode, setStartNode] = useState({ row: 10, col: 10 });
  const [endNode, setEndNode] = useState({ row: 10, col: 30 });
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [visitedNodesInOrder, setVisitedNodesInOrder] = useState<GraphNode[]>([]);
  const [nodesInShortestPath, setNodesInShortestPath] = useState<GraphNode[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [currentMode, setCurrentMode] = useState<'wall' | 'start' | 'end'>('wall');

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  // Create initial grid
  const initializeGrid = () => {
    const newGrid: GraphNode[][] = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow: GraphNode[] = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(row, col, 1)); // All nodes have weight 1
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
  };

  // Create a node
  const createNode = (row: number, col: number, weight: number): GraphNode => {
    return {
      row,
      col,
      isWall: false,
      isStart: row === startNode.row && col === startNode.col,
      isEnd: row === endNode.row && col === endNode.col,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      weight,
      fScore: Infinity,
      gScore: Infinity,
      hScore: 0,
      parent: null,
    };
  };

  // Handle node interaction based on current mode
  const handleNodeInteraction = (row: number, col: number) => {
    if (isRunning) return;

    const newGrid = [...grid];

    // Handle different modes
    switch (currentMode) {
      case 'wall':
        // Don't allow placing walls on start or end nodes
        if (
          (row === startNode.row && col === startNode.col) ||
          (row === endNode.row && col === endNode.col)
        ) {
          return;
        }
        newGrid[row][col].isWall = !newGrid[row][col].isWall;
        break;

      case 'start':
        // Remove previous start node
        if (startNode) {
          newGrid[startNode.row][startNode.col].isStart = false;
        }
        // Don't allow placing start on end node or wall
        if (row === endNode.row && col === endNode.col) return;
        if (newGrid[row][col].isWall) newGrid[row][col].isWall = false;
        
        // Set new start node
        newGrid[row][col].isStart = true;
        setStartNode({ row, col });
        break;

      case 'end':
        // Remove previous end node
        if (endNode) {
          newGrid[endNode.row][endNode.col].isEnd = false;
        }
        // Don't allow placing end on start node or wall
        if (row === startNode.row && col === startNode.col) return;
        if (newGrid[row][col].isWall) newGrid[row][col].isWall = false;
        
        // Set new end node
        newGrid[row][col].isEnd = true;
        setEndNode({ row, col });
        break;
    }

    setGrid(newGrid);
  };

  // Handle mouse events
  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    setMouseIsPressed(true);
    handleNodeInteraction(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isRunning) return;
    // Only allow drawing walls while dragging, not changing start/end
    if (currentMode === 'wall') {
      handleNodeInteraction(row, col);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  // Reset the grid
  const resetGrid = () => {
    setIsRunning(false);
    setVisitedNodesInOrder([]);
    setNodesInShortestPath([]);
    setCurrentStep(0);
    initializeGrid();
  };

  // No weighted graph option

  // Calculate heuristic based on selected type
  const calculateHeuristic = (row: number, col: number, endRow: number, endCol: number): number => {
    // Weight factor to make heuristic more influential (makes A* more greedy)
    // Higher values make A* more focused on the goal, lower values make it more like Dijkstra
    const heuristicWeight = 1.2; // Value > 1 makes A* more greedy toward the goal
    
    let baseHeuristic: number;
    switch (heuristicType) {
      case "manhattan":
        // Manhattan distance (L1 norm)
        baseHeuristic = Math.abs(row - endRow) + Math.abs(col - endCol);
        break;
      case "euclidean":
        // Euclidean distance (L2 norm)
        baseHeuristic = Math.sqrt(Math.pow(row - endRow, 2) + Math.pow(col - endCol, 2));
        break;
      case "diagonal":
        // Chebyshev distance (L∞ norm)
        baseHeuristic = Math.max(Math.abs(row - endRow), Math.abs(col - endCol));
        break;
      default:
        baseHeuristic = Math.abs(row - endRow) + Math.abs(col - endCol);
    }
    
    // Apply weight to make the heuristic more influential
    return baseHeuristic * heuristicWeight;
  };

  // A* algorithm implementation
  const astar = () => {
    // Create a deep copy of the grid to avoid state mutation
    const gridCopy = JSON.parse(JSON.stringify(grid));
    
    // Initialize all nodes
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        gridCopy[row][col].gScore = Infinity;
        gridCopy[row][col].fScore = Infinity;
        gridCopy[row][col].hScore = 0;
        gridCopy[row][col].isVisited = false;
        gridCopy[row][col].parent = null;
      }
    }
    
    // Initialize start node
    const start = gridCopy[startNode.row][startNode.col];
    start.gScore = 0;
    start.hScore = calculateHeuristic(start.row, start.col, endNode.row, endNode.col);
    start.fScore = start.hScore;
    
    // Track visited nodes for visualization
    const visitedNodesInOrder: GraphNode[] = [];
    
    // Create open and closed sets
    const openSet: GraphNode[] = [start];
    
    // Main algorithm loop
    while (openSet.length > 0) {
      // Sort by fScore - A* prioritizes nodes with lowest combined cost (g+h)
      // This is the key difference from Dijkstra which only considers g (distance from start)
      openSet.sort((a, b) => {
        // First sort by fScore (g+h)
        if (a.fScore !== b.fScore) return a.fScore - b.fScore;
        // Break ties using hScore (prefer nodes closer to goal)
        return a.hScore - b.hScore;
      });
      
      // Get node with lowest fScore
      const current = openSet.shift();
      if (!current) break;
      
      // Skip walls
      if (current.isWall) continue;
      
      // Mark as visited
      current.isVisited = true;
      visitedNodesInOrder.push(current);
      
      // If we've reached the end node, we're done
      if (current.row === endNode.row && current.col === endNode.col) {
        return visitedNodesInOrder;
      }
      
      // Get neighbors
      const neighbors = getNeighbors(current, gridCopy);
      
      // For each neighbor
      for (const neighbor of neighbors) {
        // Skip if already visited or is a wall
        if (neighbor.isVisited || neighbor.isWall) continue;
        
        // Calculate tentative gScore
        const tentativeGScore = current.gScore + neighbor.weight;
        
        // If this path is better than any previous one
        if (tentativeGScore < neighbor.gScore) {
          // Update path and scores
          neighbor.parent = { row: current.row, col: current.col };
          neighbor.gScore = tentativeGScore;
          
          // Calculate heuristic - this is what makes A* different from Dijkstra
          // A* uses this heuristic to guide the search toward the goal
          neighbor.hScore = calculateHeuristic(neighbor.row, neighbor.col, endNode.row, endNode.col);
          
          // fScore = gScore + hScore (actual cost + estimated cost)
          neighbor.fScore = neighbor.gScore + neighbor.hScore;
          
          // Add to open set if not already there
          if (!openSet.some(node => node.row === neighbor.row && node.col === neighbor.col)) {
            openSet.push(neighbor);
          }
        }
      }
    }
    
    // If we get here, there's no path
    return visitedNodesInOrder;
  };

  // Get valid neighbors
  const getNeighbors = (node: GraphNode, grid: GraphNode[][]) => {
    const { row, col } = node;
    const neighbors: GraphNode[] = [];
    
    // Check all four directions
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
    
    return neighbors;
  };

  // Get nodes in shortest path
  const getNodesInShortestPath = (endNode: GraphNode, gridCopy: GraphNode[][]) => {
    const nodesInShortestPath: GraphNode[] = [];
    let currentNode: GraphNode | null = endNode;
    
    while (currentNode) {
      nodesInShortestPath.unshift(currentNode);
      if (!currentNode.parent) break;
      const { row, col }: { row: number; col: number } = currentNode.parent;
      currentNode = gridCopy[row][col];
    }
    
    return nodesInShortestPath;
  };

  // Animate the algorithm
  const animateAlgorithm = () => {
    if (isRunning) return; // Prevent multiple runs
    
    // First reset any previous visualization
    const newGrid = grid.map(row => 
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false
      }))
    );
    setGrid(newGrid);
    
    // Set running state and reset animation counters
    setIsRunning(true);
    setCurrentStep(0);
    
    // Run the algorithm and get results
    const visitedNodesInOrder = astar();
    setVisitedNodesInOrder(visitedNodesInOrder);
    
    // Calculate shortest path if we found the end node
    if (visitedNodesInOrder.length > 0) {
      const lastNode = visitedNodesInOrder[visitedNodesInOrder.length - 1];
      if (lastNode.row === endNode.row && lastNode.col === endNode.col) {
        // Create a deep copy of the grid with the algorithm results
        const gridCopy = JSON.parse(JSON.stringify(grid));
        
        // Update the grid copy with visited information
        for (const node of visitedNodesInOrder) {
          if (gridCopy[node.row][node.col]) {
            gridCopy[node.row][node.col].isVisited = true;
            gridCopy[node.row][node.col].gScore = node.gScore;
            gridCopy[node.row][node.col].fScore = node.fScore;
            gridCopy[node.row][node.col].hScore = node.hScore;
            gridCopy[node.row][node.col].parent = node.parent;
          }
        }
        
        const path = getNodesInShortestPath(lastNode, gridCopy);
        setNodesInShortestPath(path);
      }
    }
  };

  // Handle animation steps
  useEffect(() => {
    if (!isRunning) return;
    
    if (currentStep < visitedNodesInOrder.length) {
      // Set a timer for showing each visited node
      const timer = setTimeout(() => {
        // Update grid to show visited node
        const { row, col } = visitedNodesInOrder[currentStep];
        const newGrid = [...grid];
        newGrid[row][col].isVisited = true;
        setGrid(newGrid);
        
        // Move to next step
        setCurrentStep(prevStep => prevStep + 1);
      }, Math.max(5, 500 - (animationSpeed * 4.95)));
      
      return () => clearTimeout(timer);
    } 
    // After showing all visited nodes, show the shortest path
    else if (currentStep === visitedNodesInOrder.length && nodesInShortestPath.length > 0) {
      // Animate shortest path
      const pathTimer = setTimeout(() => {
        const newGrid = [...grid];
        
        // Mark all nodes in shortest path
        for (const node of nodesInShortestPath) {
          if (!newGrid[node.row][node.col].isStart && !newGrid[node.row][node.col].isEnd) {
            newGrid[node.row][node.col].isPath = true;
          }
        }
        
        setGrid(newGrid);
        setIsRunning(false);
      }, Math.max(5, 250 - (animationSpeed * 2.45)));
      
      return () => clearTimeout(pathTimer);
    } 
    // If there are no more nodes to animate, finish
    else {
      setIsRunning(false);
    }
  }, [currentStep, isRunning, visitedNodesInOrder, nodesInShortestPath, grid, animationSpeed]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header removed to prevent overlap with base header */}

      <div className="min-h-screen bg-black text-white p-4 sm:p-8 flex flex-col justify-center pt-20">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">
            A* Pathfinding Algorithm
          </h1>
          
          <div className="glass-card p-4 sm:p-6 rounded-xl mb-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <span className="mb-1">Heuristic:</span>
                  <Select
                    value={heuristicType}
                    onValueChange={(value: "manhattan" | "euclidean" | "diagonal") => setHeuristicType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select heuristic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manhattan">Manhattan Distance</SelectItem>
                      <SelectItem value="euclidean">Euclidean Distance</SelectItem>
                      <SelectItem value="diagonal">Diagonal Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col">
                  <span className="mb-1">Animation Speed: {animationSpeed}%</span>
                  <Slider
                    value={[animationSpeed]}
                    onValueChange={(value) => setAnimationSpeed(value[0])}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>
                
                <div className="flex gap-2 sm:col-span-3">
                  <Button
                    onClick={animateAlgorithm}
                    variant="outline"
                    disabled={isRunning}
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                  
                  <Button
                    onClick={resetGrid}
                    variant="outline"
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
                
                {/* Mode selection */}
                <div className="flex flex-col sm:col-span-3">
                  <span className="mb-1">Drawing Mode:</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setCurrentMode('wall')}
                      variant={currentMode === 'wall' ? 'default' : 'outline'}
                      className={`flex-1 ${currentMode === 'wall' ? 'bg-gray-700' : ''}`}
                    >
                      Draw Walls
                    </Button>
                    <Button
                      onClick={() => setCurrentMode('start')}
                      variant={currentMode === 'start' ? 'default' : 'outline'}
                      className={`flex-1 ${currentMode === 'start' ? 'bg-green-700' : ''}`}
                    >
                      Set Start
                    </Button>
                    <Button
                      onClick={() => setCurrentMode('end')}
                      variant={currentMode === 'end' ? 'default' : 'outline'}
                      className={`flex-1 ${currentMode === 'end' ? 'bg-red-700' : ''}`}
                    >
                      Set End
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Grid visualization */}
              <div 
                className="grid gap-[1px] bg-gray-800 p-1 rounded-lg overflow-auto"
                style={{ 
                  gridTemplateColumns: `repeat(${COLS}, minmax(20px, 1fr))`,
                  maxHeight: '70vh',
                  width: '100%',
                  overflowX: 'auto'
                }}
                onMouseLeave={handleMouseUp}
              >
                {grid.map((row, rowIdx) =>
                  row.map((node, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={cn(
                        "aspect-square flex items-center justify-center text-xs transition-colors duration-200",
                        node.isStart ? "bg-green-500" : "",
                        node.isEnd ? "bg-red-500" : "",
                        node.isWall ? "bg-gray-700" : "",
                        node.isPath ? "bg-yellow-400" : "",
                        node.isVisited && !node.isStart && !node.isEnd && !node.isPath ? "bg-blue-500" : "",
                        !node.isStart && !node.isEnd && !node.isWall && !node.isVisited && !node.isPath ? "bg-gray-900" : "",
                        "hover:bg-gray-700 cursor-pointer"
                      )}
                      onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                      onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                      onMouseUp={handleMouseUp}
                    >
                      {/* No weight display */}
                    </div>
                  ))
                )}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 justify-center mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                  <span className="text-sm text-gray-300">Start Node (Click "Set Start" to place)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                  <span className="text-sm text-gray-300">End Node (Click "Set End" to place)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
                  <span className="text-sm text-gray-300">Wall (Click "Draw Walls" to place)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                  <span className="text-sm text-gray-300">Visited Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                  <span className="text-sm text-gray-300">Shortest Path</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-4 sm:p-6 rounded-xl">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">How A* Algorithm Works</h2>
            <p className="text-gray-300 mb-4">
              A* is an informed search algorithm that combines the advantages of Dijkstra's algorithm (completeness, optimality) with the benefits of greedy best-first search (efficiency using heuristics).
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Initialize the open set with the start node and the closed set as empty</li>
              <li>For each node, calculate:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>g(n): the cost from the start node to n</li>
                  <li>h(n): the heuristic estimate of cost from n to the goal</li>
                  <li>f(n) = g(n) + h(n): the estimated total cost</li>
                </ul>
              </li>
              <li>While the open set is not empty:
                <ul className="list-disc list-inside ml-6 mt-1">
                  <li>Select the node with the lowest f(n) value</li>
                  <li>If this node is the goal, reconstruct and return the path</li>
                  <li>Move this node to the closed set</li>
                  <li>For each neighbor of the current node:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li>If the neighbor is in the closed set, skip it</li>
                      <li>Calculate the tentative g score</li>
                      <li>If this path is better than any previous one, update the node</li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>If the open set is empty and no path is found, return failure</li>
            </ol>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Heuristic Functions</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>Manhattan Distance:</strong> Sum of horizontal and vertical distances (best for grid-based movement without diagonals)</li>
                <li><strong>Euclidean Distance:</strong> Straight-line distance between points (best for unrestricted movement)</li>
                <li><strong>Diagonal Distance:</strong> Maximum of horizontal and vertical distances (best for grid-based movement with diagonals)</li>
              </ul>
              <p className="mt-3 text-gray-300">Unlike Dijkstra's algorithm which explores in all directions equally, A* uses these heuristics to focus its search toward the goal, making it more efficient in most cases.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AStarVisualization;
