'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function NetworkGraph() {
  const networkRef = useRef(null);

  useEffect(() => {
    // Check if vis is loaded
    if (typeof window !== 'undefined' && window.vis) {
      drawGraph();
    }
  }, []);

  function drawGraph() {
    const container = networkRef.current;
    if (!container) return;

    // Initialize global variables
    let network;
    let nodeColors = {};

    // Create nodes and edges
    const nodes = new window.vis.DataSet([
      {"color": "#e67e22", "font": {"color": "white"}, "id": "Data Structures", "label": "Data Structures", "opacity": 1, "shape": "dot", "size": 30, "title": "Organizing data efficiently"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Arrays", "label": "Arrays", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Contiguous memory blocks"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Linked Lists", "label": "Linked Lists", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Nodes connected by pointers"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Singly Linked List", "label": "Singly Linked List", "opacity": 0.1, "shape": "dot", "size": 15, "title": "One-way link"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Doubly Linked List", "label": "Doubly Linked List", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Two-way link"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Circular Linked List", "label": "Circular Linked List", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Last node points to head"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Stacks", "label": "Stacks", "opacity": 0.1, "shape": "dot", "size": 15, "title": "LIFO structure"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Queues", "label": "Queues", "opacity": 0.1, "shape": "dot", "size": 15, "title": "FIFO structure"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Trees", "label": "Trees", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Hierarchical nodes"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Binary Tree", "label": "Binary Tree", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Max two children"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Binary Search Tree", "label": "Binary Search Tree", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Ordered tree"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "AVL Tree", "label": "AVL Tree", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Self-balancing BST"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Red-Black Tree", "label": "Red-Black Tree", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Balanced BST"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Graphs", "label": "Graphs", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Nodes and edges"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Hash Tables", "label": "Hash Tables", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Key-value pairs"},
      {"color": "#16a085", "font": {"color": "white"}, "id": "Algorithms", "label": "Algorithms", "opacity": 1, "shape": "dot", "size": 30, "title": "Step-by-step problem solving"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Sorting", "label": "Sorting", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Ordering data"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Quick Sort", "label": "Quick Sort", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Divide and conquer"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Merge Sort", "label": "Merge Sort", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Stable sort"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Heap Sort", "label": "Heap Sort", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Using heap"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Bubble Sort", "label": "Bubble Sort", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Simple, inefficient"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Searching", "label": "Searching", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Find element"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Binary Search", "label": "Binary Search", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Logarithmic search"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Linear Search", "label": "Linear Search", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Sequential search"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Divide and Conquer", "label": "Divide and Conquer", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Split problem recursively"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Dynamic Programming", "label": "Dynamic Programming", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Optimal substructure"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Greedy", "label": "Greedy", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Locally optimal choices"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Backtracking", "label": "Backtracking", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Try all possibilities"},
      {"color": "#8e44ad", "font": {"color": "white"}, "id": "AIML Algorithms", "label": "AIML Algorithms", "opacity": 1, "shape": "dot", "size": 30, "title": "Artificial Intelligence & Machine Learning"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Linear Regression", "label": "Linear Regression", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Predict continuous output"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Logistic Regression", "label": "Logistic Regression", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Binary classification"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Decision Trees", "label": "Decision Trees", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Tree based model"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Random Forests", "label": "Random Forests", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Ensemble of trees"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Neural Networks", "label": "Neural Networks", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Deep learning"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "SVM", "label": "SVM", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Support Vector Machine"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "K-Means", "label": "K-Means", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Clustering algorithm"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "PCA", "label": "PCA", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Dimensionality reduction"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "KNN", "label": "KNN", "opacity": 0.1, "shape": "dot", "size": 15, "title": "K nearest neighbors"},
      {"color": "#2980b9", "font": {"color": "white"}, "id": "Important Computer Science Courses", "label": "Important Computer Science Courses", "opacity": 1, "shape": "dot", "size": 30, "title": "Additional core subjects"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Operating Systems", "label": "Operating Systems", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Manage hardware & software"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "DBMS", "label": "DBMS", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Database Management Systems"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Computer Networks", "label": "Computer Networks", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Communication protocols"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Software Engineering", "label": "Software Engineering", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Development processes"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Theory of Computation", "label": "Theory of Computation", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Mathematical foundations"},
      {"color": "#3498db", "font": {"color": "white"}, "id": "Compiler Design", "label": "Compiler Design", "opacity": 0.1, "shape": "dot", "size": 15, "title": "Translate source code"}
    ]);
    
    const edges = new window.vis.DataSet([
      {"from": "Data Structures", "to": "Arrays"},
      {"from": "Data Structures", "to": "Linked Lists"},
      {"from": "Linked Lists", "to": "Singly Linked List"},
      {"from": "Linked Lists", "to": "Doubly Linked List"},
      {"from": "Linked Lists", "to": "Circular Linked List"},
      {"from": "Data Structures", "to": "Stacks"},
      {"from": "Data Structures", "to": "Queues"},
      {"from": "Data Structures", "to": "Trees"},
      {"from": "Trees", "to": "Binary Tree"},
      {"from": "Trees", "to": "Binary Search Tree"},
      {"from": "Trees", "to": "AVL Tree"},
      {"from": "Trees", "to": "Red-Black Tree"},
      {"from": "Data Structures", "to": "Graphs"},
      {"from": "Data Structures", "to": "Hash Tables"},
      {"from": "Algorithms", "to": "Sorting"},
      {"from": "Sorting", "to": "Quick Sort"},
      {"from": "Sorting", "to": "Merge Sort"},
      {"from": "Sorting", "to": "Heap Sort"},
      {"from": "Sorting", "to": "Bubble Sort"},
      {"from": "Algorithms", "to": "Searching"},
      {"from": "Searching", "to": "Binary Search"},
      {"from": "Searching", "to": "Linear Search"},
      {"from": "Algorithms", "to": "Divide and Conquer"},
      {"from": "Algorithms", "to": "Dynamic Programming"},
      {"from": "Algorithms", "to": "Greedy"},
      {"from": "Algorithms", "to": "Backtracking"},
      {"from": "AIML Algorithms", "to": "Linear Regression"},
      {"from": "AIML Algorithms", "to": "Logistic Regression"},
      {"from": "AIML Algorithms", "to": "Decision Trees"},
      {"from": "AIML Algorithms", "to": "Random Forests"},
      {"from": "AIML Algorithms", "to": "Neural Networks"},
      {"from": "AIML Algorithms", "to": "SVM"},
      {"from": "AIML Algorithms", "to": "K-Means"},
      {"from": "AIML Algorithms", "to": "PCA"},
      {"from": "AIML Algorithms", "to": "KNN"},
      {"from": "Important Computer Science Courses", "to": "Operating Systems"},
      {"from": "Important Computer Science Courses", "to": "DBMS"},
      {"from": "Important Computer Science Courses", "to": "Computer Networks"},
      {"from": "Important Computer Science Courses", "to": "Software Engineering"},
      {"from": "Important Computer Science Courses", "to": "Theory of Computation"},
      {"from": "Important Computer Science Courses", "to": "Compiler Design"}
    ]);

    const allNodes = nodes.get({ returnType: "Object" });
    for (const nodeId in allNodes) {
      nodeColors[nodeId] = allNodes[nodeId].color;
    }
    
    const allEdges = edges.get({ returnType: "Object" });
    
    // Adding nodes and edges to the graph
    const data = {nodes: nodes, edges: edges};

    const options = {
      "physics": {
        "enabled": true, 
        "barnesHut": {
          "gravitationalConstant": -3000, 
          "centralGravity": 0.3, 
          "springLength": 95, 
          "springConstant": 0.04, 
          "damping": 0.09, 
          "avoidOverlap": 1
        }
      }, 
      "interaction": {
        "hover": true, 
        "tooltipDelay": 200, 
        "multiselect": false, 
        "navigationButtons": true, 
        "keyboard": true
      }
    };

    network = new window.vis.Network(container, data, options);
    return network;
  }

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.2/dist/vis-network.min.js" 
        integrity="sha512-LnvoEWDFrqGHlHmDD2101OrLcbsfkrzoSpvtSQtxK3RMnRV0eOkhhBN2dXHKRrUU8p2DGRTk35n4O8nWSVe1mQ==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer"
        onLoad={() => drawGraph()}
      />
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/vis-network/9.1.2/dist/dist/vis-network.min.css" 
        integrity="sha512-WgxfT5LWjfszlPHXRmBWHkV2eceiWTOBvrKCNbdgDYTHrT2AeLCGbF4sZlZw3UMN3WtL0tGUoIAKsu8mllg/XA==" 
        crossOrigin="anonymous" 
        referrerPolicy="no-referrer" 
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
        crossOrigin="anonymous"
      />
      
      <div className="card" style={{ width: '100%' }}>
        <div 
          id="mynetwork" 
          ref={networkRef} 
          className="card-body" 
          style={{
            width: '100%',
            height: '750px',
            backgroundColor: '#222222',
            border: '1px solid lightgray',
            position: 'relative',
            float: 'left'
          }}
        />
      </div>
    </>
  );
}