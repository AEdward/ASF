"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function FlipSprite({
  frontSrc,
  backSrc,
  alt,
  width,
  height,
  degPerSec = 18,
  phaseDeg = 0,
}: {
  frontSrc: string;
  backSrc: string;
  alt: string;
  width: number;
  height: number;
  degPerSec?: number;
  phaseDeg?: number;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const start = performance.now();

    const loop = (now: number) => {
      const el = innerRef.current;
      if (el) {
        const elapsed = (now - start) / 1000;
        const spinY = (elapsed * degPerSec + phaseDeg) % 360;
        el.style.transform = `rotateY(${spinY}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [degPerSec, phaseDeg]);

  return (
    <div style={{ perspective: "900px" }} className="relative h-full w-full">
      <div ref={innerRef} style={{ transformStyle: "preserve-3d" }} className="relative h-full w-full">
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="absolute inset-0 [filter:drop-shadow(0_14px_10px_rgba(8,22,11,0.3))]"
        >
          <Image src={frontSrc} alt={alt} width={width} height={height} className="h-full w-full object-contain" />
        </div>
        <div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 [filter:drop-shadow(0_14px_10px_rgba(8,22,11,0.3))]"
        >
          <Image src={backSrc} alt={`${alt} — rear view`} width={width} height={height} className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
}
