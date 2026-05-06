import stepImage from "@/assets/step-4.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";

export default function StepFourPage() {
  return (
    <NimboStepScreen
      image={stepImage}
      imageAlt="Pieza Nimbo eco"
      imageClassName="h-full w-auto"
      step={4}
    />
  );
}
