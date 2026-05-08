import stepImage from "@/assets/step-2.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";
import {
  AR_TARGET_SRC,
  getStepModelSrc,
  getStepPlacementModelSrc,
  getStepPlacementUsdzSrc,
} from "@/lib/ar-assets";

export const dynamic = "force-dynamic";

export default function StepTwoPage() {
  const step = 2;

  return (
    <NimboStepScreen
      arModelSrc={getStepModelSrc(step)}
      arTargetSrc={AR_TARGET_SRC}
      image={stepImage}
      imageAlt="Piezas Nimbo muros"
      imageClassName="h-full w-auto max-w-[108vw]"
      placementModelSrc={getStepPlacementModelSrc(step)}
      placementUsdzSrc={getStepPlacementUsdzSrc(step)}
      step={step}
    />
  );
}
