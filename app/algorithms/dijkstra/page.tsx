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
  parent: { row: number; col: number } | null;
}

// Main component for Dijkstra visualization
const DijkstraVisualization = () => {
  // Grid dimensions
  const ROWS = 20;
  const COLS = 40;

  // Canvas for visualization
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State variables
  const [grid, setGrid] = useState<GraphNode[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
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

  // Dijkstra's algorithm implementation
  const dijkstra = () => {
    // Create a deep copy of the grid to avoid state mutation
    const gridCopy = JSON.parse(JSON.stringify(grid));
    
    // Initialize all distances to infinity except the start node
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        gridCopy[row][col].distance = Infinity;
        gridCopy[row][col].isVisited = false;
        gridCopy[row][col].parent = null;
      }
    }
    
    // Set start node distance to 0
    gridCopy[startNode.row][startNode.col].distance = 0;
    
    // Track visited nodes for visualization
    const visitedNodesInOrder: GraphNode[] = [];
    
    // Create a priority queue (unvisited nodes)
    const unvisitedNodes = getAllNodes(gridCopy);
    
    // Main algorithm loop
    while (unvisitedNodes.length) {
      // Sort by distance to get the closest node
      sortNodesByDistance(unvisitedNodes);
      
      // Get the node with the smallest distance
      const closestNode = unvisitedNodes.shift();
      if (!closestNode) break;
      
      // Skip walls
      if (closestNode.isWall) continue;
      
      // If the closest node is at a distance of infinity, we're trapped
      if (closestNode.distance === Infinity) {
        // No path exists
        return visitedNodesInOrder;
      }
      
      // Mark node as visited
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      
      // If we've reached the end node, we're done
      if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
        return visitedNodesInOrder;
      }
      
      // Update unvisited neighbors
      updateUnvisitedNeighbors(closestNode, gridCopy);
    }
    
    // If we get here, there's no path
    return visitedNodesInOrder;
  };

  // Get all nodes as a flat array
  const getAllNodes = (grid: GraphNode[][]) => {
    const nodes: GraphNode[] = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };

  // Sort nodes by distance
  const sortNodesByDistance = (nodes: GraphNode[]) => {
    nodes.sort((a, b) => a.distance - b.distance);
  };

  // Update unvisited neighbors
  const updateUnvisitedNeighbors = (node: GraphNode, grid: GraphNode[][]) => {
    const { row, col } = node;
    const neighbors = getNeighbors(node, grid);
    
    for (const neighbor of neighbors) {
      // Skip already visited nodes
      if (neighbor.isVisited) continue;
      
      // Calculate new distance (use weight for weighted graphs)
      const newDistance = node.distance + neighbor.weight;
      
      // If new distance is shorter, update
      if (newDistance < neighbor.distance) {
        neighbor.distance = newDistance;
        neighbor.parent = { row, col };
      }
    }
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
    
    // Filter out walls (we'll handle visited status in updateUnvisitedNeighbors)
    return neighbors.filter(neighbor => !neighbor.isWall);
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
    const visitedNodesInOrder = dijkstra();
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
            gridCopy[node.row][node.col].distance = node.distance;
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
            Dijkstra's Shortest Path Algorithm
          </h1>
          
          <div className="glass-card p-4 sm:p-6 rounded-xl mb-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                
                <div className="flex gap-2">
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
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">How Dijkstra's Algorithm Works</h2>
            <p className="text-gray-300 mb-4">
              Dijkstra's algorithm is a graph search algorithm that finds the shortest path between nodes in a graph.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Initialize all nodes with distance infinity except the start node (distance 0)</li>
              <li>Mark all nodes as unvisited and create a set of all unvisited nodes</li>
              <li>For the current node, consider all of its unvisited neighbors</li>
              <li>Calculate their tentative distances through the current node</li>
              <li>If this distance is less than the previously recorded distance, update it</li>
              <li>When done with all neighbors, mark the current node as visited</li>
              <li>If the destination node has been marked visited, we're done</li>
              <li>Otherwise, select the unvisited node with the smallest distance and repeat from step 3</li>
            </ol>
            <div className="mt-4 p-4 bg-white/5 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Visualization Guide</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Click and drag on the grid to create walls</li>
                <li>Toggle "Weighted Graph" to switch between weighted and unweighted graphs</li>
                <li>In weighted graphs, each cell has a weight (cost) to traverse</li>
                <li>Adjust the animation speed to see the algorithm work faster or slower</li>
                <li>The blue cells show the nodes being visited by the algorithm</li>
                <li>The yellow path shows the shortest path found from start to end</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DijkstraVisualization;
