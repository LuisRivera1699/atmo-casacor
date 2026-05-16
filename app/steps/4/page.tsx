import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function StepFourPage() {
  redirect("/steps/5");
}
