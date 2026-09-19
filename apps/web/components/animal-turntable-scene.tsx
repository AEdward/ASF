import { AsfPlate } from "@/components/asf-plate";
import { FlipSprite } from "@/components/flip-sprite";
import { RotatingSprite } from "@/components/rotating-sprite";

const ROTATING_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function framesFor(animal: string) {
  return ROTATING_ANGLES.map((deg) => ({ deg, src: `/animals/${animal}-${deg}.png` }));
}

const animals: {
  key: string;
  kind: "rotate" | "flip";
  alt: string;
  left: string;
  top: string;
  height: string;
  degPerSec: number;
  phaseDeg: number;
}[] = [
  { key: "cow", kind: "flip", alt: "Cow", left: "20%", top: "44%", height: "40%", degPerSec: 16, phaseDeg: 0 },
  { key: "ox", kind: "flip", alt: "Ox", left: "50%", top: "42%", height: "42%", degPerSec: 14, phaseDeg: 90 },
  { key: "camel", kind: "rotate", alt: "Camel", left: "80%", top: "44%", height: "40%", degPerSec: 22, phaseDeg: 30 },
  { key: "sheep", kind: "flip", alt: "Sheep", left: "12%", top: "98%", height: "34%", degPerSec: 17, phaseDeg: 180 },
  { key: "goat", kind: "flip", alt: "Goat", left: "50%", top: "98%", height: "32%", degPerSec: 15, phaseDeg: 270 },
  { key: "chicken", kind: "rotate", alt: "Chicken", left: "88%", top: "97%", height: "26%", degPerSec: 26, phaseDeg: 150 },
];

export function AnimalTurntableScene() {
  return (
    <div className="relative w-full" style={{ aspectRatio: "600 / 750" }}>
      <div className="absolute left-0 top-0 w-full" style={{ aspectRatio: "600 / 560" }}>
        <AsfPlate />
      </div>
      {animals.map((animal) => (
        <div
          key={animal.key}
          className="absolute"
          style={{
            left: animal.left,
            top: animal.top,
            height: animal.height,
            width: "auto",
            aspectRatio: "86 / 216",
            transform: "translate(-50%, -100%)",
          }}
        >
          {animal.kind === "rotate" ? (
            <RotatingSprite
              frames={framesFor(animal.key)}
              alt={animal.alt}
              width={86}
              height={216}
              degPerSec={animal.degPerSec}
              phaseDeg={animal.phaseDeg}
            />
          ) : (
            <FlipSprite
              frontSrc={`/animals/${animal.key}-0.png`}
              backSrc={`/animals/${animal.key}-180.png`}
              alt={animal.alt}
              width={86}
              height={216}
              degPerSec={animal.degPerSec}
              phaseDeg={animal.phaseDeg}
            />
          )}
        </div>
      ))}
    </div>
  );
}
