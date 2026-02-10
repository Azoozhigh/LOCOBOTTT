
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  onClick,
  hoverable = true 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        glass p-6 rounded-[2rem] transition-all duration-500 ease-out
        ${hoverable ? 'hover:glass-heavy hover:scale-[1.02] cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
