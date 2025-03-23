
import React from 'react';

interface CircleProgressProps {
  value: number;
  maxValue: number;
  radius?: number;
  className?: string;
  strokeWidth?: number;
}

export const CircleProgress: React.FC<CircleProgressProps> = ({
  value,
  maxValue,
  radius = 24,
  className = "text-blue-500",
  strokeWidth = 3,
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / maxValue) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      className={`transform -rotate-90 ${className}`}
    >
      <circle
        stroke="currentColor"
        fill="transparent"
        strokeOpacity="0.2"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};
