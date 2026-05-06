import stepImage from "@/assets/step-5.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";

export default function StepFivePage() {
  return (
    <NimboStepScreen
      image={stepImage}
      imageAlt="Pieza Nimbo flujo"
      imageClassName="h-full w-auto scale-[1.08]"
      step={5}
    />
  );
}
