import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * EventHub Primary Location Pin Icon matching the screenshot branding
 */
export const EventHubLogoIcon: React.FC<IconProps> = ({
  size = 28,
  className = '',
  color = '#266665',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Outer Pin Outline */}
    <path
      d="M16 3C10.4772 3 6 7.47715 6 13C6 20.25 14.5 28.2 15.35 28.98C15.72 29.32 16.28 29.32 16.65 28.98C17.5 28.2 26 20.25 26 13C26 7.47715 21.5228 3 16 3Z"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Inner Concentric Circle Target */}
    <circle
      cx="16"
      cy="13"
      r="4.2"
      stroke={color}
      strokeWidth="2.2"
      fill="none"
    />
  </svg>
);

/**
 * Geofence Radar / Perimeter Visualizer Icon
 */
export const GeofenceRadarIcon: React.FC<IconProps> = ({
  size = 24,
  className = '',
  color = '#266665',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" strokeDasharray="3 3" />
    <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2" fill={color} />
    <path d="M12 3V1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 23V21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M3 12H1" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M23 12H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * High-Precision GPS Signal Icon
 */
export const GpsSignalIcon: React.FC<IconProps> = ({
  size = 20,
  className = '',
  color = 'currentColor',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
  </svg>
);
