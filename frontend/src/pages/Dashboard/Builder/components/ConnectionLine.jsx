import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, GitBranch, AlertTriangle } from 'lucide-react';

const ConnectionLine = ({ connection, sourceMenu, targetMenu }) => {
  // Calculate connection points
  const getConnectionPoints = useMemo(() => {
    if (!sourceMenu || !targetMenu) {
      return {
        source: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
        control1: { x: 0, y: 0 },
        control2: { x: 0, y: 0 },
        distance: 0,
        angle: 0,
      };
    }
    const sourceX = sourceMenu.position.x + 320; // Menu width
    const sourceY = sourceMenu.position.y + 60;  // Menu height / 2
    const targetX = targetMenu.position.x;
    const targetY = targetMenu.position.y + 60;

    // Calculate control points for smooth curve
    const deltaX = targetX - sourceX;
    const deltaY = targetY - sourceY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Adjust curve based on distance and direction
    const curvature = Math.min(distance * 0.3, 100);
    const controlX1 = sourceX + curvature;
    const controlX2 = targetX - curvature;

    return {
      source: { x: sourceX, y: sourceY },
      target: { x: targetX, y: targetY },
      control1: { x: controlX1, y: sourceY },
      control2: { x: controlX2, y: targetY },
      distance,
      angle: Math.atan2(deltaY, deltaX) * (180 / Math.PI),
    };
  }, [sourceMenu, targetMenu]);

  // Early return if menus don't exist
  if (!sourceMenu || !targetMenu) return null;

  // Connection type configurations
  const connectionConfig = {
    flow: {
      color: 'stroke-blue-500',
      strokeWidth: 2,
      dashArray: 'none',
      markerColor: 'fill-blue-500',
      icon: ArrowRight,
      label: connection.label || 'Flow',
    },
    option: {
      color: 'stroke-emerald-500',
      strokeWidth: 3,
      dashArray: 'none',
      markerColor: 'fill-emerald-500',
      icon: GitBranch,
      label: connection.optionKey ? `Option ${connection.optionKey}` : 'Option',
    },
    input: {
      color: 'stroke-purple-500',
      strokeWidth: 2,
      dashArray: '5,5',
      markerColor: 'fill-purple-500',
      icon: Zap,
      label: 'Input Route',
    },
    conditional: {
      color: 'stroke-orange-500',
      strokeWidth: 2,
      dashArray: '5,5',
      markerColor: 'fill-orange-500',
      icon: GitBranch,
      label: 'Conditional',
    },
    api: {
      color: 'stroke-purple-500',
      strokeWidth: 2,
      dashArray: '10,5',
      markerColor: 'fill-purple-500',
      icon: Zap,
      label: 'API Call',
    },
    error: {
      color: 'stroke-red-500',
      strokeWidth: 2,
      dashArray: '3,3',
      markerColor: 'fill-red-500',
      icon: AlertTriangle,
      label: 'Error Handler',
    },
  };

  const config = connectionConfig[connection.type] || connectionConfig.flow;
  const IconComponent = config.icon;

  // Create SVG path
  const pathData = `
    M ${getConnectionPoints.source.x} ${getConnectionPoints.source.y}
    C ${getConnectionPoints.control1.x} ${getConnectionPoints.control1.y},
      ${getConnectionPoints.control2.x} ${getConnectionPoints.control2.y},
      ${getConnectionPoints.target.x} ${getConnectionPoints.target.y}
  `;

  // Calculate label position (midpoint of curve)
  const labelPosition = {
    x: (getConnectionPoints.source.x + getConnectionPoints.target.x) / 2,
    y: (getConnectionPoints.source.y + getConnectionPoints.target.y) / 2,
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    >
      <motion.g
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        exit={{ opacity: 0, pathLength: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
      {/* Define markers for arrowheads */}
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon
            points="0,0 0,6 9,3"
            className={config.markerColor}
          />
        </marker>
        
        {/* Glow filter for active connections */}
        <filter id={`glow-${connection.id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background glow line (for visual depth) */}
      <motion.path
        d={pathData}
        fill="none"
        className="stroke-black/10 dark:stroke-white/10"
        strokeWidth={config.strokeWidth + 4}
        strokeDasharray={config.dashArray}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Main connection line */}
      <motion.path
        d={pathData}
        fill="none"
        className={`${config.color} hover:stroke-opacity-80 transition-all duration-200`}
        strokeWidth={config.strokeWidth}
        strokeDasharray={config.dashArray}
        markerEnd={`url(#arrowhead-${connection.id})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
        style={{
          filter: connection.isActive ? `url(#glow-${connection.id})` : 'none',
        }}
      />

      {/* Animated flow indicator */}
      <motion.circle
        r="3"
        className={config.color}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0],
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          offsetPath: `path('${pathData}')`,
        }}
      />

      {/* Connection Label */}
      <AnimatePresence>
        {connection.label && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.5 }}
          >
            {/* Label background */}
            <rect
              x={labelPosition.x - 30}
              y={labelPosition.y - 12}
              width="60"
              height="24"
              rx="12"
              className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-600"
              strokeWidth="1"
            />
            
            {/* Label icon */}
            <foreignObject
              x={labelPosition.x - 8}
              y={labelPosition.y - 6}
              width="16"
              height="12"
            >
              <IconComponent 
                className={`w-3 h-3 ${config.color.replace('stroke-', 'text-')}`} 
              />
            </foreignObject>

            {/* Label text */}
            <text
              x={labelPosition.x}
              y={labelPosition.y + 15}
              textAnchor="middle"
              className="text-xs font-medium fill-slate-600 dark:fill-slate-300"
            >
              {connection.label}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Interactive hit area for connection selection */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth="20"
        className="cursor-pointer hover:stroke-blue-200/50"
        onClick={() => {
          // Handle connection selection/editing
          console.log('Connection clicked:', connection.id);
        }}
      />

      {/* Connection type indicator at start */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <circle
          cx={getConnectionPoints.source.x}
          cy={getConnectionPoints.source.y}
          r="8"
          className="fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600"
          strokeWidth="2"
        />
        <foreignObject
          x={getConnectionPoints.source.x - 6}
          y={getConnectionPoints.source.y - 6}
          width="12"
          height="12"
        >
          <IconComponent 
            className={`w-3 h-3 ${config.color.replace('stroke-', 'text-')}`} 
          />
        </foreignObject>
      </motion.g>

      {/* Connection stats (for debugging/development) */}
      {process.env.NODE_ENV === 'development' && (
        <text
          x={labelPosition.x}
          y={labelPosition.y + 30}
          textAnchor="middle"
          className="font-mono text-xs fill-slate-400"
        >
          {Math.round(getConnectionPoints.distance)}px
        </text>
      )}
    </motion.g>
    </svg>
  );
};

// Main SVG container for all connections
export const ConnectionsLayer = ({ connections, menus }) => {
  return (
    <svg
      className="overflow-visible absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <AnimatePresence>
        {Object.values(connections).map(connection => (
          <ConnectionLine
            key={connection.id}
            connection={connection}
            sourceMenu={menus[connection.source]}
            targetMenu={menus[connection.target]}
          />
        ))}
      </AnimatePresence>
    </svg>
  );
};

export default ConnectionLine;