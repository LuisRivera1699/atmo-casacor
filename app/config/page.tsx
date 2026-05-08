"use client";

import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  AR_CONFIG_COLLECTION,
  AR_CONFIG_DOC_ID,
  AR_TARGET_OPTIONS,
  DEFAULT_AR_TARGET_ID,
  getARActiveTargetId,
  type ARTargetId,
} from "@/lib/ar-targets";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function ConfigPage() {
  const [activeTarget, setActiveTarget] =
    useState<ARTargetId>(DEFAULT_AR_TARGET_ID);
  const [loadingError, setLoadingError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savingTarget, setSavingTarget] = useState<ARTargetId | null>(null);

  useEffect(() => {
    const configRef = doc(db, AR_CONFIG_COLLECTION, AR_CONFIG_DOC_ID);

    return onSnapshot(
      configRef,
      (snapshot) => {
        setActiveTarget(getARActiveTargetId(snapshot.data()?.activeTarget));
        setLoadingError("");
      },
      (error) => {
        console.error("Error loading AR config", error);
        setLoadingError("No pudimos cargar la config desde Firestore.");
      },
    );
  }, []);

  async function updateActiveTarget(targetId: ARTargetId) {
    const configRef = doc(db, AR_CONFIG_COLLECTION, AR_CONFIG_DOC_ID);

    setActiveTarget(targetId);
    setSavingTarget(targetId);
    setSaveStatus("saving");
    setSaveError("");

    try {
      await setDoc(
        configRef,
        {
          activeTarget: targetId,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setSaveStatus("saved");
    } catch (error) {
      console.error("Error saving AR config", error);
      setSaveStatus("error");
      setSaveError("No pudimos guardar el activador. Intenta de nuevo.");
    } finally {
      setSavingTarget(null);
    }
  }

  return (
    <main className="min-h-svh bg-black px-[7vw] py-10 text-white">
      <section className="mx-auto flex min-h-[calc(100svh-5rem)] w-full max-w-[28rem] flex-col justify-center">
        <p className="text-[0.72rem] font-[500] uppercase tracking-[0.18em] text-white/45">
          Living Nimbo Universe
        </p>

        <h1 className="mt-3 text-[clamp(2.2rem,11vw,4.2rem)] font-[700] uppercase leading-[0.9] tracking-[-0.08em]">
          Config AR
        </h1>

        <p className="mt-5 text-[1rem] leading-snug tracking-[-0.035em] text-white/62">
          Elige que archivo .mind debe usar la experiencia. El cambio se guarda
          en Firestore y aplica para todos los pasos.
        </p>

        <div className="mt-8 space-y-3">
          {AR_TARGET_OPTIONS.map((target) => {
            const isActive = target.id === activeTarget;
            const isSaving = savingTarget === target.id;

            return (
              <button
                className={cn(
                  "flex w-full items-center justify-between rounded-[1rem] border px-5 py-4 text-left transition",
                  isActive
                    ? "border-white bg-white text-black"
                    : "border-white/18 bg-white/[0.06] text-white hover:bg-white/[0.1]",
                )}
                disabled={saveStatus === "saving"}
                key={target.id}
                onClick={() => updateActiveTarget(target.id)}
                type="button"
              >
                <span>
                  <span className="block text-[1.15rem] font-[700] uppercase tracking-[-0.045em]">
                    {target.label}
                  </span>
                  <span
                    className={cn(
                      "mt-1 block text-[0.78rem] tracking-[-0.02em]",
                      isActive ? "text-black/52" : "text-white/45",
                    )}
                  >
                    {target.src}
                  </span>
                </span>

                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[0.68rem] font-[600] uppercase tracking-[0.12em]",
                    isActive
                      ? "bg-black text-white"
                      : "bg-white/10 text-white/52",
                  )}
                >
                  {isSaving ? "Guardando" : isActive ? "Activo" : "Usar"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 min-h-6 text-[0.82rem] tracking-[-0.02em] text-white/58">
          {loadingError || saveError ? (
            <p className="text-red-300">{loadingError || saveError}</p>
          ) : saveStatus === "saved" ? (
            <p>Config guardada.</p>
          ) : (
            <p>
              Activo ahora:{" "}
              <span className="font-[700] text-white">{activeTarget}</span>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
