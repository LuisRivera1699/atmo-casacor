import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function StepTwoPage() {
  redirect("/steps/5");
}
