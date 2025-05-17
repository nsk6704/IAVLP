"use client";

import { useEffect, useState } from 'react';
import { LearningPathStep } from '@/lib/learning-path-service';

interface LearningPathVisualizationProps {
  steps: LearningPathStep[];
  topic: string;
}

export default function LearningPathVisualization({ steps, topic }: LearningPathVisualizationProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  
  useEffect(() => {
    if (steps.length === 0) return;
    
    // Generate SVG for the learning path
    generateSVG();
  }, [steps]);
  
  const generateSVG = () => {
    const boxWidth = 200;
    const boxHeight = 60;
    const horizontalGap = 80;
    const totalWidth = steps.length * (boxWidth + horizontalGap);
    const totalHeight = boxHeight + 40;
    
    // Start building the SVG
    let svg = `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Add gradient definitions
    svg += `
      <defs>
        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9333ea" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.2" />
        </linearGradient>
        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#9333ea" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
    `;
    
    // Add each step box and connecting arrows
    steps.forEach((step, index) => {
      const x = index * (boxWidth + horizontalGap);
      const y = 20;
      
      // Add box
      svg += `
        <rect 
          x="${x}" 
          y="${y}" 
          width="${boxWidth}" 
          height="${boxHeight}" 
          rx="10" 
          ry="10" 
          fill="url(#boxGradient)" 
          stroke="rgba(255,255,255,0.2)" 
          stroke-width="1"
        />
        <text 
          x="${x + boxWidth/2}" 
          y="${y + boxHeight/2}" 
          font-family="Arial" 
          font-size="14" 
          fill="white" 
          text-anchor="middle" 
          dominant-baseline="middle"
        >
          ${step.title.length > 25 ? step.title.substring(0, 22) + '...' : step.title}
        </text>
      `;
      
      // Add connecting arrow (if not the last step)
      if (index < steps.length - 1) {
        const startX = x + boxWidth;
        const startY = y + boxHeight/2;
        const endX = x + boxWidth + horizontalGap;
        const endY = startY;
        
        svg += `
          <line 
            x1="${startX}" 
            y1="${startY}" 
            x2="${endX - 10}" 
            y2="${endY}" 
            stroke="url(#arrowGradient)" 
            stroke-width="2" 
          />
          <polygon 
            points="${endX},${endY} ${endX-10},${endY-5} ${endX-10},${endY+5}" 
            fill="url(#arrowGradient)" 
          />
        `;
      }
    });
    
    // Close SVG
    svg += '</svg>';
    
    // Set the SVG content
    setSvgContent(svg);
  };
  
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="min-w-max">
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>
    </div>
  );
}
