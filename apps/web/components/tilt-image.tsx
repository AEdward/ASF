"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const IDLE_TILT_DEG = 8;
const HOVER_TILT_DEG = 22;

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf: number;
    const start = performance.now();

    const loop = (now: number) => {
      const el = innerRef.current;
      if (el) {
        if (hovering.current) {
          el.style.transform = `translateZ(40px) scale(1.05) rotateX(${pointer.current.x}deg) rotateY(${pointer.current.y}deg)`;
        } else {
          const elapsed = (now - start) / 1000;
          const x = Math.sin(elapsed * 0.6) * IDLE_TILT_DEG;
          const y = Math.cos(elapsed * 0.4) * IDLE_TILT_DEG;
          el.style.transform = `translateZ(0px) scale(1) rotateX(${x}deg) rotateY(${y}deg)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    hovering.current = true;
    pointer.current = { x: py * -HOVER_TILT_DEG * 2, y: px * HOVER_TILT_DEG * 2 };
  };

  const handleLeave = () => {
    hovering.current = false;
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ perspective: "900px" }}
      className="cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div
        ref={innerRef}
        style={{ transformStyle: "preserve-3d", willChange: "transform", transition: "transform 120ms ease-out" }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority
          className="h-auto w-full [filter:drop-shadow(0_30px_28px_rgba(8,22,11,0.32))]"
        />
      </div>
    </div>
  );
}
