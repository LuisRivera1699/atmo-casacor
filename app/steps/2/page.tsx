import stepImage from "@/assets/step-2.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";

export default function StepTwoPage() {
  return (
    <NimboStepScreen
      image={stepImage}
      imageAlt="Piezas Nimbo muros"
      imageClassName="h-full w-auto max-w-[108vw]"
      step={2}
    />
  );
}
