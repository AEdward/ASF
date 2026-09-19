"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function RotatingSprite({
  frames,
  alt,
  width,
  height,
  degPerSec = 24,
  phaseDeg = 0,
}: {
  frames: { deg: number; src: string }[];
  alt: string;
  width: number;
  height: number;
  degPerSec?: number;
  phaseDeg?: number;
}) {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const step = 360 / frames.length;

    const loop = (now: number) => {
      const elapsed = (now - start) / 1000;
      const angle = (elapsed * degPerSec + phaseDeg) % 360;
      const rawIdx = angle / step;
      const lower = Math.floor(rawIdx) % frames.length;
      const upper = (lower + 1) % frames.length;
      const blend = rawIdx - Math.floor(rawIdx);

      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === lower) el.style.opacity = String(1 - blend);
        else if (i === upper) el.style.opacity = String(blend);
        else el.style.opacity = "0";
      });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [frames.length, degPerSec, phaseDeg]);

  return (
    <div className="relative h-full w-full [filter:drop-shadow(0_14px_10px_rgba(8,22,11,0.3))]">
      {frames.map((frame, i) => (
        <div
          key={frame.deg}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <Image src={frame.src} alt={alt} width={width} height={height} className="h-full w-full object-contain" />
        </div>
      ))}
    </div>
  );
}
