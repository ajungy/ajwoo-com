'use client';

import { useEffect, useRef, useState } from 'react';

// Two connected paths keep all five strokes joined cleanly while they move.
const brand = [[4, 24], [10, 8], [16, 24], [16, 24], [22, 8], [28, 24], [34, 8]];
const house = [[6, 15], [20, 4], [34, 15], [29, 11], [29, 27], [11, 27], [11, 11]];
const path = (points: number[][]) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

export function Logo({ className, home = true }: { className?: string; home?: boolean }) {
  const [points, setPoints] = useState(home ? brand : house);
  const current = useRef(points);

  useEffect(() => {
    const destination = home ? brand : house;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = destination;
      setPoints(destination);
      return;
    }
    const origin = current.current;
    let frame = 0;
    let start: number | undefined;
    const draw = (time: number) => {
      start ??= time;
      const progress = Math.min((time - start) / 300, 1);
      const eased = progress * progress * (3 - 2 * progress);
      const next = destination.map((point, i) => point.map((value, axis) =>
        origin[i][axis] + (value - origin[i][axis]) * eased));
      current.current = next;
      setPoints(next);
      if (progress < 1) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [home]);

  return (
    <svg viewBox="0 0 40 32" role="img" aria-label={home ? 'Alex Woo' : 'Home'}
      className={`logo-morph ${className ?? ''}`} data-mark={home ? 'brand' : 'home'}
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path(points.slice(0, 3))} vectorEffect="non-scaling-stroke" />
      <path d={path(points.slice(3))} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
