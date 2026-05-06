import stepImage from "@/assets/step-1.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";

export default function StepOnePage() {
  return (
    <NimboStepScreen
      image={stepImage}
      imageAlt="Pieza Nimbo de pie"
      imageClassName="h-full w-auto rounded-[1.55rem] shadow-[0_1.6rem_2.8rem_rgba(255,255,255,0.18)]"
      step={1}
    />
  );
}
