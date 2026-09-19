"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const SPIN_DEG_PER_SEC = 360 / 22; // one full turn every 22s
const WOBBLE_DEG = 6;
const HOVER_TILT_DEG = 16;

export function FlipRotateImage({
  frontSrc,
  backSrc,
  alt,
  width,
  height,
}: {
  frontSrc: string;
  backSrc: string;
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
        const elapsed = (now - start) / 1000;
        const spinY = (elapsed * SPIN_DEG_PER_SEC) % 360;
        const wobbleX = Math.sin(elapsed * 0.5) * WOBBLE_DEG;
        const rotX = wobbleX + (hovering.current ? pointer.current.x : 0);
        const rotY = spinY + (hovering.current ? pointer.current.y : 0);
        el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
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
      style={{ perspective: "1600px", aspectRatio: `${width} / ${height}` }}
      className="relative w-full cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div
        ref={innerRef}
        style={{ transformStyle: "preserve-3d", willChange: "transform", transition: "transform 100ms linear" }}
        className="relative h-full w-full"
      >
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 [filter:drop-shadow(0_30px_28px_rgba(8,22,11,0.32))]"
        >
          <Image src={frontSrc} alt={alt} fill priority className="object-contain" />
        </div>
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 [filter:drop-shadow(0_30px_28px_rgba(8,22,11,0.32))]"
        >
          <Image src={backSrc} alt={`${alt} — rear view`} fill priority className="object-contain" />
        </div>
      </div>
    </div>
  );
}
