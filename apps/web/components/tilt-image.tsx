"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

const MAX_TILT_DEG = 16;

export function TiltImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -MAX_TILT_DEG * 2, y: px * MAX_TILT_DEG * 2 });
  }, []);

  const handleLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ perspective: "1400px" }}
      className="cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="transition-transform duration-200 ease-out"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          className="h-auto w-full [filter:drop-shadow(0_30px_28px_rgba(8,22,11,0.28))]"
        />
      </div>
    </div>
  );
}
