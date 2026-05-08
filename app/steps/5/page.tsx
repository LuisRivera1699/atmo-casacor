import stepImage from "@/assets/step-5.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";
import {
  AR_TARGET_SRC,
  getStepModelSrc,
  getStepPlacementModelSrc,
  getStepPlacementUsdzSrc,
} from "@/lib/ar-assets";

export const dynamic = "force-dynamic";

export default function StepFivePage() {
  const step = 5;

  return (
    <NimboStepScreen
      arModelSrc={getStepModelSrc(step)}
      arTargetSrc={AR_TARGET_SRC}
      image={stepImage}
      imageAlt="Pieza Nimbo flujo"
      imageClassName="h-full w-auto scale-[1.08]"
      placementModelSrc={getStepPlacementModelSrc(step)}
      placementUsdzSrc={getStepPlacementUsdzSrc(step)}
      step={step}
    />
  );
}
