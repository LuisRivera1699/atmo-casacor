import stepImage from "@/assets/step-3.png";
import { NimboStepScreen } from "@/components/nimbo-step-screen";

export default function StepThreePage() {
  return (
    <NimboStepScreen
      image={stepImage}
      imageAlt="Pieza Nimbo sentada"
      imageClassName="h-full w-auto rounded-[1.55rem] shadow-[0_1.6rem_2.8rem_rgba(255,255,255,0.18)]"
      step={3}
    />
  );
}
