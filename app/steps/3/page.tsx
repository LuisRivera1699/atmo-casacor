import stepImage from "@/assets/step-3.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";
import {
  AR_TARGET_SRC,
  getStepModelSrc,
  getStepPlacementModelSrc,
  getStepPlacementUsdzSrc,
} from "@/lib/ar-assets";

export const dynamic = "force-dynamic";

export default function StepThreePage() {
  const step = 3;

  return (
    <NimboStepScreen
      arModelSrc={getStepModelSrc(step)}
      arTargetSrc={AR_TARGET_SRC}
      image={stepImage}
      imageAlt="Pieza Nimbo sentada"
      imageClassName="h-full w-auto rounded-[1.55rem] shadow-[0_1.6rem_2.8rem_rgba(255,255,255,0.18)]"
      placementModelSrc={getStepPlacementModelSrc(step)}
      placementUsdzSrc={getStepPlacementUsdzSrc(step)}
      step={step}
    />
  );
}
