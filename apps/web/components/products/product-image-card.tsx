"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function ProductImageCard({ imageUrl, name }: { imageUrl: string; name: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const t = (now - start) / 1000;
      const sway = Math.sin(t * 0.3) * 11;
      const card = cardRef.current;
      if (card) {
        const rotateY = sway + tiltRef.current.y;
        const rotateX = tiltRef.current.x;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current = { x: py * -10, y: px * 10 };
  }

  function handleMouseLeave() {
    tiltRef.current = { x: 0, y: 0 };
  }

  return (
    <div
      ref={stageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="[perspective:1200px]"
    >
      <div ref={cardRef} className="relative aspect-square w-full" style={{ transformStyle: "preserve-3d" }}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 30vw, 45vw"
          className="object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
