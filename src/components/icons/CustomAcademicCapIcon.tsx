import type React from 'react';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function CustomAcademicCapIcon({ size = 24, className, ...props }: CustomIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c0 1.66 4 3 6 3s6-1.34 6-3v-5"/>
    </svg>
  );
}
