import React, { useRef, useEffect } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  percentage: number;
  gradientClass: string;
}

/**
 * ProgressBar Component
 * 
 * Displays an animated progress bar with a specified percentage and gradient.
 * Uses CSS custom properties to set the dynamic width value.
 * 
 * @param percentage - The progress percentage (0-100)
 * @param gradientClass - Tailwind gradient class for the bar color
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, gradientClass }) => {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.style.setProperty('--progress-width', `${percentage}%`);
    }
  }, [percentage]);

  return (
    <div className="progress-bar-container">
      <div 
        ref={fillRef}
        className={`${gradientClass} progress-bar-fill`}
      ></div>
    </div>
  );
};

export default ProgressBar;
