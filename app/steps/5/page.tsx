import stepBackground from "@/assets/step-background.webp";
import stepImage from "@/assets/nimbus-no-bg.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";
import {
  getStepPlacementModelSrc,
  getStepPlacementUsdzSrc,
} from "@/lib/ar-assets";

export const dynamic = "force-dynamic";

export default function StepFivePage() {
  const step = 5;

  return (
    <NimboStepScreen
      backgroundImage={stepBackground}
      backgroundPosition="center 42%"
      subtitle={
        <>
          Toma una foto o graba un video con
          <br />
          NIMBUS - Flujo del ahora
        </>
      }
      title="Encuentra esta pieza en la realidad"
      image={stepImage}
      imageAlt="NIMBUS - Flujo del ahora"
      imageClassName="h-full w-auto max-w-[72vw] object-contain"
      placementModelSrc={getStepPlacementModelSrc(step)}
      placementUsdzSrc={getStepPlacementUsdzSrc(step)}
      step={step}
    />
  );
}
