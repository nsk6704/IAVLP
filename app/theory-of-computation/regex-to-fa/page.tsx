"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, Play, RefreshCw, Info } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the structure of a state in the finite automaton
interface State {
  id: string;
  x: number;
  y: number;
  isInitial: boolean;
  isFinal: boolean;
}

// Define the structure of a transition in the finite automaton
interface Transition {
  from: string;
  to: string;
  symbol: string;
}

// Main component for the Regular Expression to Finite Automata visualization
const RegexToFAVisualization: React.FC = () => {
  // State variables
  const [regex, setRegex] = useState<string>("");
  const [states, setStates] = useState<State[]>([]);
  const [transitions, setTransitions] = useState<Transition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1600, height: 1000 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Step-by-step visualization variables
  const [isStepMode, setIsStepMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [constructionSteps, setConstructionSteps] = useState<Array<{states: State[], transitions: Transition[], description: string}>>([]);
  const [isVisualizationComplete, setIsVisualizationComplete] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll events to update the navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resize canvas when window size changes
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setCanvasSize({
          width: width,
          height: Math.max(500, Math.min(600, width * 0.6))
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle mouse wheel for zooming
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    
    const delta = -e.deltaY / 500; // Adjust zoom sensitivity
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta)); // Limit zoom range
    
    // Calculate zoom center (mouse position)
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Convert mouse position to canvas coordinates
    const canvasX = (mouseX / zoom) - pan.x;
    const canvasY = (mouseY / zoom) - pan.y;
    
    // Calculate new pan to keep the point under mouse cursor fixed
    const newPanX = (mouseX / newZoom) - canvasX;
    const newPanY = (mouseY / newZoom) - canvasY;
    
    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };
  
  // Set up wheel event listener with { passive: false }
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Add wheel event listener with { passive: false } to allow preventDefault
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    // Clean up event listener on unmount
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, pan]); // Re-add listener when zoom or pan changes
  
  // Handle mouse down for panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  
  // Handle mouse move for panning
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate the distance moved
    const dx = (mouseX - dragStart.x) / zoom;
    const dy = (mouseY - dragStart.y) / zoom;
    
    // Update pan and drag start position
    setPan({ x: pan.x + dx, y: pan.y + dy });
    setDragStart({ x: mouseX, y: mouseY });
  };
  
  // Handle mouse up to end panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Handle mouse leave to end panning
  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  // Draw the finite automaton on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || states.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // Draw the states
    drawStates(ctx);
    
    // Draw the transitions
    drawTransitions(ctx);
    
    // Restore the context
    ctx.restore();
  }, [states, transitions, canvasSize, zoom, pan]);

  // Draw the states (circles) on the canvas
  const drawStates = (ctx: CanvasRenderingContext2D) => {
    const stateRadius = 30;
    
    states.forEach(state => {
      // Draw the main circle
      ctx.beginPath();
      ctx.arc(state.x, state.y, stateRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgb(59, 130, 246)";
      ctx.stroke();
      
      // Draw state ID
      ctx.font = "16px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(state.id, state.x, state.y);
      
      // Draw initial state indicator (arrow pointing to the state)
      if (state.isInitial) {
        ctx.beginPath();
        ctx.moveTo(state.x - stateRadius - 30, state.y);
        ctx.lineTo(state.x - stateRadius, state.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(state.x - stateRadius, state.y);
        ctx.lineTo(state.x - stateRadius - 10, state.y - 5);
        ctx.lineTo(state.x - stateRadius - 10, state.y + 5);
        ctx.fillStyle = "white";
        ctx.fill();
      }
      
      // Draw final state indicator (double circle)
      if (state.isFinal) {
        ctx.beginPath();
        ctx.arc(state.x, state.y, stateRadius - 5, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgb(59, 130, 246)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  };

  // Draw the transitions (arrows) between states
  const drawTransitions = (ctx: CanvasRenderingContext2D) => {
    const stateRadius = 30;
    
    // Group transitions by their from/to states to avoid overlapping labels
    const transitionGroups: Record<string, Transition[]> = {};
    
    transitions.forEach(transition => {
      const key = `${transition.from}-${transition.to}`;
      if (!transitionGroups[key]) {
        transitionGroups[key] = [];
      }
      transitionGroups[key].push(transition);
    });
    
    // Draw each group of transitions
    Object.values(transitionGroups).forEach((group, groupIndex) => {
      if (group.length === 0) return;
      
      const fromState = states.find(s => s.id === group[0].from);
      const toState = states.find(s => s.id === group[0].to);
      
      if (!fromState || !toState) return;
      
      // Self-loop (transition to the same state)
      if (fromState.id === toState.id) {
        // Draw multiple self-loops at different angles
        const baseLoopAngle = -Math.PI / 4; // Start angle for the self-loop
        const angleOffset = Math.PI / 6; // Offset between multiple loops
        
        group.forEach((transition, index) => {
          const loopAngle = baseLoopAngle + index * angleOffset;
          const loopX = fromState.x + stateRadius * Math.cos(loopAngle);
          const loopY = fromState.y + stateRadius * Math.sin(loopAngle);
          const loopRadius = 20 + index * 5; // Increase radius for each additional loop
          
          // Draw a curved loop
          ctx.beginPath();
          ctx.moveTo(loopX, loopY);
          ctx.bezierCurveTo(
            loopX + loopRadius, loopY - loopRadius * 2,
            loopX + loopRadius * 2, loopY - loopRadius,
            loopX, loopY
          );
          
          // Draw arrowhead for the loop
          const arrowSize = 8;
          const arrowX = loopX;
          const arrowY = loopY;
          const arrowAngle = loopAngle - Math.PI / 2;
          
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX + arrowSize * Math.cos(arrowAngle - 0.5),
            arrowY + arrowSize * Math.sin(arrowAngle - 0.5)
          );
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX + arrowSize * Math.cos(arrowAngle + 0.5),
            arrowY + arrowSize * Math.sin(arrowAngle + 0.5)
          );
          
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw the label in the middle of the loop
          const labelX = loopX + loopRadius;
          const labelY = loopY - loopRadius * 1.5;
          ctx.fillStyle = "white";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          // Draw background for the label to improve readability
          const labelWidth = ctx.measureText(transition.symbol).width + 10;
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(labelX - labelWidth/2, labelY - 10, labelWidth, 20);
          
          ctx.fillStyle = "white";
          ctx.fillText(transition.symbol, labelX, labelY);
        });
      } else {
        // Calculate the angle between the two states
        const dx = toState.x - fromState.x;
        const dy = toState.y - fromState.y;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // For multiple transitions between the same states, curve them slightly
        group.forEach((transition, index) => {
          // Calculate curve offset based on number of transitions
          const curveOffset = group.length > 1 ? 
            (index - (group.length - 1) / 2) * 30 : 0;
          
          // Calculate control point for the curve
          const midX = (fromState.x + toState.x) / 2;
          const midY = (fromState.y + toState.y) / 2;
          const perpX = -dy / distance * curveOffset;
          const perpY = dx / distance * curveOffset;
          const controlX = midX + perpX;
          const controlY = midY + perpY;
          
          // Calculate the start and end points of the arrow
          const startAngle = angle + Math.atan2(perpY, perpX) * 0.5;
          const endAngle = angle + Math.atan2(perpY, perpX) * 0.5;
          
          const startX = fromState.x + stateRadius * Math.cos(startAngle);
          const startY = fromState.y + stateRadius * Math.sin(startAngle);
          const endX = toState.x - stateRadius * Math.cos(endAngle);
          const endY = toState.y - stateRadius * Math.sin(endAngle);
          
          // Draw the curved arrow with more pronounced curves
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          
          if (Math.abs(curveOffset) > 0.1) {
            // Draw curved line for multiple transitions with more pronounced curve
            const enhancedControlX = controlX + (controlX - midX) * 0.5;
            const enhancedControlY = controlY + (controlY - midY) * 0.5;
            ctx.quadraticCurveTo(enhancedControlX, enhancedControlY, endX, endY);
          } else {
            // For single transitions, add a slight curve for better visibility
            const perpX = -dy / distance * 20;
            const perpY = dx / distance * 20;
            ctx.quadraticCurveTo(midX + perpX, midY + perpY, endX, endY);
          }
          
          // Draw arrowhead
          const arrowSize = 10;
          const arrowAngle = Math.atan2(endY - controlY, endX - controlX);
          
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowSize * Math.cos(arrowAngle - 0.5),
            endY - arrowSize * Math.sin(arrowAngle - 0.5)
          );
          ctx.moveTo(endX, endY);
          ctx.lineTo(
            endX - arrowSize * Math.cos(arrowAngle + 0.5),
            endY - arrowSize * Math.sin(arrowAngle + 0.5)
          );
          
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw the label near the middle of the curve
          const labelX = controlX;
          const labelY = controlY - 10;
          
          // Draw background for the label to improve readability
          const labelWidth = ctx.measureText(transition.symbol).width + 10;
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(labelX - labelWidth/2, labelY - 10, labelWidth, 20);
          
          ctx.fillStyle = "white";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(transition.symbol, labelX, labelY);
        });
      }
    });
  };
  
  // Convert regex to finite automaton
  const convertRegexToFA = () => {
    // Validate the regex
    const validationResult = validateRegex(regex);
    if (!validationResult.isValid) {
      setError(validationResult.error);
      return;
    }
    
    setError(null);
    
    // Generate the finite automaton using Thompson's construction with steps
    const { states: newStates, transitions: newTransitions, steps } = thompsonsConstruction(regex);
    
    // Store the construction steps
    setConstructionSteps(steps.map(step => ({
      states: positionStates(step.states),
      transitions: step.transitions,
      description: step.description
    })));
    
    // Set the total number of steps
    setTotalSteps(steps.length);
    
    // Reset to the first step
    setCurrentStep(0);
    
    // If there are steps, show the first one
    if (steps.length > 0) {
      const firstStep = steps[0];
      const positionedStates = positionStates(firstStep.states);
      setStates(positionedStates);
      setTransitions(firstStep.transitions);
      setIsVisualizationComplete(false);
    } else {
      // If no steps (error case), clear the visualization
      setStates([]);
      setTransitions([]);
    }
  };
  
  // Move to the next step in the visualization
  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Update the visualization with the next step
      if (nextStep < constructionSteps.length) {
        const step = constructionSteps[nextStep];
        setStates(step.states);
        setTransitions(step.transitions);
      }
      
      // Check if we've reached the final step
      if (nextStep === totalSteps - 1) {
        setIsVisualizationComplete(true);
      }
    }
  };
  
  
  const parseRegex = (regex: string): { states: State[], transitions: Transition[] } => {
    // Basic validation of regex
    const validationResult = validateRegex(regex);
    if (!validationResult.isValid) {
      throw new Error(validationResult.error || "Invalid regex");
    }
    
    // Thompson's construction algorithm (simplified version)
    return thompsonsConstruction(regex);
  };

  // Validate the regular expression
  const validateRegex = (regex: string): { isValid: boolean, error: string | null } => {
    // Check for empty regex
    if (regex.trim() === '') {
      return { isValid: false, error: "Please enter a regular expression" };
    }
    
    // Check for valid characters and operators
    const validOperators = ['.', '+', '*'];
    const validChars = /[a-z.*+()]/; // Lowercase alphabets, operators, and parentheses
    
    // Check for balanced parentheses
    let parenthesesCount = 0;
    for (let i = 0; i < regex.length; i++) {
      if (regex[i] === '(') parenthesesCount++;
      if (regex[i] === ')') parenthesesCount--;
      if (parenthesesCount < 0) {
        return { isValid: false, error: "Unbalanced parentheses in regex" };
      }
    }
    
    if (parenthesesCount !== 0) {
      return { isValid: false, error: "Unbalanced parentheses in regex" };
    }
    
    for (let i = 0; i < regex.length; i++) {
      if (!validChars.test(regex[i])) {
        return { 
          isValid: false, 
          error: `Invalid character in regex: ${regex[i]}. Only lowercase alphabets (a-z), operators (., +, *), and parentheses are allowed.`
        };
      }
      
      // Check for consecutive operators
      if (validOperators.includes(regex[i]) && i > 0 && validOperators.includes(regex[i-1])) {
        throw new Error(`Consecutive operators not allowed: ${regex[i-1]}${regex[i]}`);
      }
      
      // Operator cannot be at the beginning (except opening parenthesis)
      if (i === 0 && validOperators.includes(regex[i])) {
        return { isValid: false, error: `Operator ${regex[i]} cannot be at the beginning of regex` };
      }
      
      // Check for operators at the end (except * and closing parenthesis)
      if (i === regex.length - 1 && (regex[i] === '.' || regex[i] === '+')) {
        return { isValid: false, error: `Operator ${regex[i]} cannot be at the end of regex` };
      }
      
      // Check for proper operands for operators
      if ((regex[i] === '.' || regex[i] === '+') && i + 1 >= regex.length) {
        return { isValid: false, error: `Missing operand after ${regex[i]} operator` };
      }
      
      // Check for proper operand before * operator
      if (regex[i] === '*' && (i === 0 || (validOperators.includes(regex[i-1]) && regex[i-1] !== ')'))) {
        return { isValid: false, error: `Missing operand before * operator` };
      }
    }
    
    // If we get here, the regex is valid
    return { isValid: true, error: null };
  };

  // Simplified Thompson's construction algorithm with parentheses support
  // Convert regex to finite automata using Thompson's construction algorithm with step-by-step tracking
  const thompsonsConstruction = (regex: string): { states: State[], transitions: Transition[], steps: Array<{states: State[], transitions: Transition[], description: string}> } => {
    let stateCounter = 0;
    const steps: Array<{states: State[], transitions: Transition[], description: string}> = [];
    
    // Create a new state
    const createState = (isInitial = false, isFinal = false): State => {
      return {
        id: `q${stateCounter++}`,
        x: 0, // Will be positioned later
        y: 0,
        isInitial,
        isFinal
      };
    };
    
    // Helper function to add a step to the construction process
    const addStep = (states: State[], transitions: Transition[], description: string) => {
      // Deep clone the states and transitions to avoid reference issues
      const statesClone = states.map(s => ({ ...s }));
      const transitionsClone = transitions.map(t => ({ ...t }));
      
      steps.push({
        states: statesClone,
        transitions: transitionsClone,
        description
      });
    };
    
    // Create initial and final states
    const initialState = createState(true, false);
    const finalState = createState(false, true);
    
    const allStates: State[] = [initialState, finalState];
    const allTransitions: Transition[] = [];
    
    // Add initial step
    addStep([...allStates], [...allTransitions], `Starting construction for regex: ${regex}`);
    
    // If the regex is empty, add an epsilon transition from initial to final
    if (regex.length === 0) {
      allTransitions.push({
        from: initialState.id,
        to: finalState.id,
        symbol: "ε"
      });
      
      addStep([...allStates], [...allTransitions], `Added epsilon transition for empty regex`);
      return { states: allStates, transitions: allTransitions, steps };
    }

    // Parse the regex using a recursive descent parser
    // This function parses the regex and returns the start and end states of the resulting NFA
    const parseRegex = (expr: string, startIdx: number, endIdx: number): { start: State, end: State } => {
      // Base case: empty expression
      if (startIdx > endIdx) {
        const start = createState();
        const end = createState();
        allStates.push(start, end);
        
        allTransitions.push({
          from: start.id,
          to: end.id,
          symbol: "ε"
        });
        
        addStep([...allStates], [...allTransitions], `Created empty expression NFA`);
        return { start, end };
      }
      
      // Look for the lowest precedence operator (+) outside of parentheses
      let lowestPrecedenceIdx = -1;
      let parenCount = 0;
      
      for (let i = startIdx; i <= endIdx; i++) {
        if (expr[i] === '(') {
          parenCount++;
        } else if (expr[i] === ')') {
          parenCount--;
        } else if (parenCount === 0 && expr[i] === '+') {
          lowestPrecedenceIdx = i;
        }
      }
      
      // If we found a union operator (+) at the top level
      if (lowestPrecedenceIdx !== -1) {
        // Parse the left and right subexpressions
        const leftNFA = parseRegex(expr, startIdx, lowestPrecedenceIdx - 1);
        const rightNFA = parseRegex(expr, lowestPrecedenceIdx + 1, endIdx);
        
        // Create a new start and end state for the union
        const start = createState();
        const end = createState();
        allStates.push(start, end);
        
        // Connect start to both branches
        allTransitions.push({
          from: start.id,
          to: leftNFA.start.id,
          symbol: "ε"
        });
        allTransitions.push({
          from: start.id,
          to: rightNFA.start.id,
          symbol: "ε"
        });
        
        // Connect both branches to end
        allTransitions.push({
          from: leftNFA.end.id,
          to: end.id,
          symbol: "ε"
        });
        allTransitions.push({
          from: rightNFA.end.id,
          to: end.id,
          symbol: "ε"
        });
        
        addStep([...allStates], [...allTransitions], `Applied union operation (+)`);
        return { start, end };
      }
      
      // Look for concatenation operator (.) outside of parentheses
      lowestPrecedenceIdx = -1;
      parenCount = 0;
      
      for (let i = startIdx; i <= endIdx; i++) {
        if (expr[i] === '(') {
          parenCount++;
        } else if (expr[i] === ')') {
          parenCount--;
        } else if (parenCount === 0 && expr[i] === '.') {
          lowestPrecedenceIdx = i;
          break; // Take the leftmost concatenation operator
        }
      }
      
      // If we found a concatenation operator (.)
      if (lowestPrecedenceIdx !== -1) {
        // Parse the left and right subexpressions
        const leftNFA = parseRegex(expr, startIdx, lowestPrecedenceIdx - 1);
        const rightNFA = parseRegex(expr, lowestPrecedenceIdx + 1, endIdx);
        
        // Connect the end of the left NFA to the start of the right NFA
        allTransitions.push({
          from: leftNFA.end.id,
          to: rightNFA.start.id,
          symbol: "ε"
        });
        
        addStep([...allStates], [...allTransitions], `Applied concatenation operation (.)`);
        return { start: leftNFA.start, end: rightNFA.end };
      }
      
      // Check for Kleene star (*) at the end
      if (expr[endIdx] === '*') {
        // Parse the subexpression before the star
        const subNFA = parseRegex(expr, startIdx, endIdx - 1);
        
        // Create a new start and end state for the star
        const start = createState();
        const end = createState();
        allStates.push(start, end);
        
        // Connect start to subexpression start and directly to end (skip)
        allTransitions.push({
          from: start.id,
          to: subNFA.start.id,
          symbol: "ε"
        });
        allTransitions.push({
          from: start.id,
          to: end.id,
          symbol: "ε"
        });
        
        // Connect subexpression end back to start (loop) and to end
        allTransitions.push({
          from: subNFA.end.id,
          to: subNFA.start.id,
          symbol: "ε"
        });
        allTransitions.push({
          from: subNFA.end.id,
          to: end.id,
          symbol: "ε"
        });
        
        addStep([...allStates], [...allTransitions], `Applied Kleene star operation (*)`);
        return { start, end };
      }
      
      // Check for parenthesized expression
      if (expr[startIdx] === '(' && expr[endIdx] === ')') {
        // Remove the outer parentheses and parse the inner expression
        const result = parseRegex(expr, startIdx + 1, endIdx - 1);
        addStep([...allStates], [...allTransitions], `Processed subexpression (${expr.substring(startIdx + 1, endIdx)})`);
        return result;
      }
      
      // Base case: single character
      if (startIdx === endIdx) {
        const start = createState();
        const end = createState();
        allStates.push(start, end);
        
        allTransitions.push({
          from: start.id,
          to: end.id,
          symbol: expr[startIdx]
        });
        
        addStep([...allStates], [...allTransitions], `Created NFA for character '${expr[startIdx]}'`);
        return { start, end };
      }
      
      // Should not reach here if the regex is valid
      throw new Error("Invalid regular expression");
    };
    
    try {
      // Parse the regex and get the resulting NFA
      const nfa = parseRegex(regex, 0, regex.length - 1);
      
      // Connect the initial state to the NFA start state
      allTransitions.push({
        from: initialState.id,
        to: nfa.start.id,
        symbol: "ε"
      });
      
      // Connect the NFA end state to the final state
      allTransitions.push({
        from: nfa.end.id,
        to: finalState.id,
        symbol: "ε"
      });
      
      // Add final step
      addStep([...allStates], [...allTransitions], `Completed NFA construction`);
      
      return { states: allStates, transitions: allTransitions, steps };
    } catch (error) {
      console.error("Error parsing regex:", error);
      return { states: [], transitions: [], steps };
    }
  };

  // Position the states in a simple hierarchical layout
  const positionStates = (states: State[]): State[] => {
    // Create a copy of states to modify
    const positionedStates = states.map(state => ({ ...state }));
    
    // Set fixed positions based on state type
    const initialState = positionedStates.find(s => s.isInitial);
    const finalStates = positionedStates.filter(s => s.isFinal);
    const regularStates = positionedStates.filter(s => !s.isInitial && !s.isFinal);
    
    // Constants for spacing
    const horizontalSpacing = 300; // Horizontal spacing between states
    const verticalSpacing = 200;   // Vertical spacing between states
    const leftMargin = 200;        // Left margin
    
    // Step 1: Position initial state on the left
    if (initialState) {
      initialState.x = leftMargin;
      initialState.y = canvasSize.height / 2;
    }
    
    // Step 2: Position final states on the right
    if (finalStates.length > 0) {
      const rightX = canvasSize.width - leftMargin;
      
      // If there's only one final state, center it vertically
      if (finalStates.length === 1) {
        finalStates[0].x = rightX;
        finalStates[0].y = canvasSize.height / 2;
      } else {
        // Multiple final states - distribute vertically
        const totalHeight = (finalStates.length - 1) * verticalSpacing;
        const startY = (canvasSize.height - totalHeight) / 2;
        
        finalStates.forEach((state, index) => {
          state.x = rightX;
          state.y = startY + index * verticalSpacing;
        });
      }
    }
    
    // Step 3: Position regular states in a layered approach from left to right
    if (regularStates.length > 0) {
      // Determine number of layers based on state count
      const numLayers = Math.min(5, Math.ceil(Math.sqrt(regularStates.length)));
      const statesPerLayer = Math.ceil(regularStates.length / numLayers);
      
      // Calculate available space
      const availableWidth = canvasSize.width - (2 * leftMargin);
      const layerWidth = availableWidth / (numLayers + 1); // +1 for spacing
      
      // Position each regular state in its layer
      regularStates.forEach((state, index) => {
        const layer = Math.floor(index / statesPerLayer);
        const posInLayer = index % statesPerLayer;
        
        // Calculate vertical position within layer
        const layerHeight = canvasSize.height - 200; // 100px margin top and bottom
        const verticalStep = layerHeight / (statesPerLayer + 1);
        
        // Add slight randomness to positions for better visualization
        const xOffset = (Math.random() * 0.3 - 0.15) * layerWidth; // ±15% random offset
        const yOffset = (Math.random() * 0.3 - 0.15) * verticalStep; // ±15% random offset
        
        // Position the state
        state.x = leftMargin + (layer + 1) * layerWidth + xOffset;
        state.y = 100 + (posInLayer + 1) * verticalStep + yOffset;
      });
    }
    
    // Step 4: Apply repulsion forces to ensure minimum distance between states
    const minDistance = 300; // Minimum distance between any two states
    const iterations = 20;   // Number of iterations for force-directed adjustment
    
    for (let iter = 0; iter < iterations; iter++) {
      // For each pair of states, apply repulsion if they're too close
      for (let i = 0; i < positionedStates.length; i++) {
        for (let j = i + 1; j < positionedStates.length; j++) {
          const state1 = positionedStates[i];
          const state2 = positionedStates[j];
          
          // Calculate distance between states
          const dx = state2.x - state1.x;
          const dy = state2.y - state1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If states are too close, push them apart
          if (distance < minDistance) {
            const force = (minDistance - distance) / distance;
            const moveX = dx * force * 0.5;
            const moveY = dy * force * 0.5;
            
            // Move states apart, but keep initial and final states more fixed
            if (!state1.isInitial && !state1.isFinal) {
              state1.x -= moveX;
              state1.y -= moveY;
            }
            
            if (!state2.isInitial && !state2.isFinal) {
              state2.x += moveX;
              state2.y += moveY;
            }
          }
        }
      }
    }
    
    // Step 5: Ensure all states are within canvas bounds
    const padding = 50; // Padding from canvas edge
    positionedStates.forEach(state => {
      state.x = Math.max(padding, Math.min(canvasSize.width - padding, state.x));
      state.y = Math.max(padding, Math.min(canvasSize.height - padding, state.y));
    });
    
    return positionedStates;
  };

  // Reset the visualization by reloading the page
  const resetVisualization = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Using universal header - custom header removed */}

      {/* Main content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {/* Controls and visualization */}
            <div className="glass-card p-4 sm:p-6 rounded-xl mb-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span>Regular Expression</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild suppressHydrationWarning>
                            <span><Info className="h-4 w-4 text-gray-400" /></span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Enter a regular expression using lowercase alphabets (a-z) and operators:
                              <br />
                              - Concatenation: . (e.g., a.b means a followed by b)
                              <br />
                              - Union: + (e.g., a+b means a or b)
                              <br />
                              - Kleene star: * (e.g., a* means zero or more a's)
                              <br />
                              - Parentheses: ( ) (e.g., (a+b).c for grouping and priority)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      value={regex}
                      onChange={(e) => setRegex(e.target.value)}
                      placeholder="Enter regex (e.g., a.b+c*)"
                      className="bg-black/30 border-gray-700 z-10"
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={convertRegexToFA}
                      variant="outline"
                      className="flex-1"
                      suppressHydrationWarning
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Convert
                    </Button>
                    
                    <Button
                      onClick={resetVisualization}
                      variant="outline"
                      className="flex-1"
                      suppressHydrationWarning
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
                
                {/* Visualization canvas with zoom and pan */}
                <div className="mt-4">
                  {/* Step indicator and Next button */}
                  {totalSteps > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-400">
                        Step {currentStep + 1} of {totalSteps}
                        {constructionSteps[currentStep] && (
                          <span className="ml-2 text-gray-300">
                            {constructionSteps[currentStep].description}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={goToNextStep}
                        variant="outline"
                        disabled={currentStep >= totalSteps - 1 || isVisualizationComplete}
                        className="ml-2"
                        suppressHydrationWarning
                      >
                        Next Step
                      </Button>
                    </div>
                  )}
                  
                  {/* Canvas container */}
                  <div ref={containerRef} className="w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden relative">
                    <canvas
                      ref={canvasRef}
                      width={canvasSize.width}
                      height={canvasSize.height}
                      className="w-full h-full cursor-move"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseLeave}
                    />
                    
                    {states.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                        Enter a regular expression and click Convert to visualize the finite automaton
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">State</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">Initial State</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 rounded-full relative">
                      <div className="w-2 h-2 bg-blue-500 rounded-full absolute inset-0 m-auto"></div>
                    </div>
                    <span className="text-sm text-gray-300">Final State</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-white"></div>
                    <span className="text-sm text-gray-300">Transition</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Explanation */}
            <div className="glass-card p-4 sm:p-6 rounded-xl">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4">Regular Expressions to Finite Automata</h2>
              <p className="text-gray-300 mb-4">
                Converting a regular expression to a finite automaton is a fundamental concept in the theory of computation. 
                This process allows us to transform a compact notation (regex) into a state machine that can recognize the same language.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Thompson's Construction Algorithm:
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>For each basic regex pattern, create a corresponding NFA fragment</li>
                    <li>Combine these fragments according to the regex operators (concatenation, union, Kleene star)</li>
                    <li>The result is an NFA that recognizes the language described by the regex</li>
                  </ul>
                </li>
                <li>Key Components:
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>States: Represented as circles</li>
                    <li>Transitions: Arrows labeled with input symbols</li>
                    <li>Initial State: The starting point of the automaton</li>
                    <li>Final States: States that indicate successful recognition</li>
                  </ul>
                </li>
              </ol>
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Regex Notation Used</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong>a:</strong> Matches the character 'a'</li>
                  <li><strong>a.b:</strong> Concatenation - matches 'a' followed by 'b'</li>
                  <li><strong>a+b:</strong> Union - matches either 'a' or 'b'</li>
                  <li><strong>a*:</strong> Kleene star - matches zero or more occurrences of 'a'</li>
                </ul>
                <p className="mt-3 text-gray-300">
                  Examples of valid regular expressions:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong>a.b:</strong> The string "ab"</li>
                  <li><strong>a+b:</strong> Either "a" or "b"</li>
                  <li><strong>a*:</strong> Zero or more "a"s (empty string, "a", "aa", "aaa", etc.)</li>
                  <li><strong>a.b+c:</strong> Either "ab" or "c" (+ has lower precedence than .)</li>
                  <li><strong>(a+b).c:</strong> Either "a" or "b", followed by "c" ("ac" or "bc")</li>
                  <li><strong>a.(b+c):</strong> "a" followed by either "b" or "c" ("ab" or "ac")</li>
                  <li><strong>(a+b)*:</strong> Zero or more occurrences of either 'a' or 'b'</li>
                </ul>
                <p className="mt-3 text-gray-300">
                  This visualization implements Thompson's construction algorithm for converting regular expressions to finite automata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegexToFAVisualization;
