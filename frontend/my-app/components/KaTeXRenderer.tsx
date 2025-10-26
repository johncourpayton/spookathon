"use client";
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface KaTeXRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ 
  latex, 
  displayMode = false, 
  className = "" 
}) => {
  if (!latex || latex.trim() === '') {
    return <span className={className}>No formula available</span>;
  }

  try {
    // Clean up the LaTeX string
    const cleanLatex = latex.trim();
    
    if (displayMode) {
      return (
        <div className={`katex-display ${className}`}>
          <BlockMath math={cleanLatex} />
        </div>
      );
    } else {
      return (
        <span className={`katex-inline ${className}`}>
          <InlineMath math={cleanLatex} />
        </span>
      );
    }
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    return (
      <span className={`text-red-500 ${className}`}>
        Error rendering formula: {latex}
      </span>
    );
  }
};

// Component for rendering LaTeX within text content
export const LaTeXText: React.FC<{ content: string; className?: string }> = ({ 
  content, 
  className = "" 
}) => {
  if (!content) return null;

  // Split content by LaTeX delimiters and render accordingly
  const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/);
  
  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // Block math (display mode)
          const latex = part.slice(2, -2).trim();
          return <KaTeXRenderer key={index} latex={latex} displayMode={true} />;
        } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
          // Inline math
          const latex = part.slice(1, -1).trim();
          return <KaTeXRenderer key={index} latex={latex} displayMode={false} />;
        } else {
          // Regular text
          return <span key={index}>{part}</span>;
        }
      })}
    </div>
  );
};
