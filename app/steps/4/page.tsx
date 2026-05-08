import stepImage from "@/assets/step-4.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";
import {
  AR_TARGET_SRC,
  getStepModelSrc,
  getStepPlacementModelSrc,
  getStepPlacementUsdzSrc,
} from "@/lib/ar-assets";

export const dynamic = "force-dynamic";

export default function StepFourPage() {
  const step = 4;

  return (
    <NimboStepScreen
      arModelSrc={getStepModelSrc(step)}
      arTargetSrc={AR_TARGET_SRC}
      image={stepImage}
      imageAlt="Pieza Nimbo eco"
      imageClassName="h-full w-auto"
      placementModelSrc={getStepPlacementModelSrc(step)}
      placementUsdzSrc={getStepPlacementUsdzSrc(step)}
      step={step}
    />
  );
}
