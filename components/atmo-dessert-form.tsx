"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        width="17"
        height="17"
        x="3.5"
        y="3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        rx="5"
      />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function AtmoDessertForm() {
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function validateForm(form: HTMLFormElement) {
    const formData = new FormData(form);
    const nextName = String(formData.get("name") ?? "").trim();
    const nextEmail = String(formData.get("email") ?? "").trim();
    const hasConsent = formData.get("commercial-consent") === "on";
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail);

    return nextName.length > 0 && hasValidEmail && hasConsent;
  }

  function updateCanSubmit(form: HTMLFormElement) {
    setCanSubmit(validateForm(form));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!validateForm(form) || isSubmitting) {
      setCanSubmit(false);
      return;
    }

    const formData = new FormData(form);
    const trimmedName = String(formData.get("name") ?? "").trim();
    const trimmedEmail = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const phone = String(formData.get("phone") ?? "").trim();

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await addDoc(collection(db, "casacor-leads"), {
        name: trimmedName,
        email: trimmedEmail,
        phone,
        commercialConsent: true,
        source: "casacor-mobile-web",
        createdAt: serverTimestamp(),
      });

      setSubmittedName(trimmedName);
      setIsModalOpen(true);
      form.reset();
      setCanSubmit(false);
    } catch (error) {
      console.error("Error saving casacor lead", error);
      setSubmitError("No pudimos enviar tus datos. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="formulario" className="bg-black px-[8vw] py-[4.75rem] text-white">
      <div className="mx-auto max-w-[26rem]">
        <p className="text-center text-[clamp(1.55rem,5.35vw,2rem)] font-[400] leading-[1.25] tracking-[-0.055em]">
          Recibe un postre <span className="font-[650]">ÁTMO</span> gratis,
          realizado por Alanya.
        </p>
        <p className="mx-auto mt-[1.05rem] max-w-[21rem] text-center text-[clamp(1rem,3.8vw,1.2rem)] font-[400] leading-[1.35] tracking-[-0.035em] text-white/78">
          Llena el formulario y muestra la confirmación en caja para reclamarlo.
        </p>

        <form
          className="mt-[2.4rem] space-y-[1.05rem]"
          onChange={(event) => updateCanSubmit(event.currentTarget)}
          onInput={(event) => updateCanSubmit(event.currentTarget)}
          onSubmit={handleSubmit}
        >
          <label className="block">
            <span className="mb-2 block text-[0.95rem] tracking-[-0.02em] text-white/82">
              Nombre <span className="text-white">*</span>
            </span>
            <input
              className="h-[3.35rem] w-full rounded-[0.9rem] border border-white/55 bg-transparent px-4 text-[1rem] text-white outline-none transition placeholder:text-white/35 focus:border-white"
              name="name"
              required
              type="text"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.95rem] tracking-[-0.02em] text-white/82">
              Correo <span className="text-white">*</span>
            </span>
            <input
              className="h-[3.35rem] w-full rounded-[0.9rem] border border-white/55 bg-transparent px-4 text-[1rem] text-white outline-none transition placeholder:text-white/35 focus:border-white"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[0.95rem] tracking-[-0.02em] text-white/82">
              Celular <span className="text-white/60">(opcional)</span>
            </span>
            <input
              className="h-[3.35rem] w-full rounded-[0.9rem] border border-white/55 bg-transparent px-4 text-[1rem] text-white outline-none transition placeholder:text-white/35 focus:border-white"
              name="phone"
              inputMode="tel"
              type="tel"
            />
          </label>

          <label className="flex gap-3 pt-[0.3rem] text-[0.82rem] font-[400] leading-[1.35] tracking-[-0.025em] text-white/72">
            <input
              className="mt-1 h-5 w-5 shrink-0 accent-white"
              name="commercial-consent"
              required
              type="checkbox"
            />
            <span>
              Acepto que studio ÁTMO utilice estos datos para fines comerciales
              de la marca. <span className="text-white">*</span>
            </span>
          </label>

          <p className="text-[0.78rem] tracking-[-0.02em] text-white/55">
            * Campos obligatorios
          </p>

          <Button
            disabled={!canSubmit || isSubmitting}
            type="submit"
            className="mt-[1.4rem] h-10 w-full rounded-[0.7rem] border-2 border-white bg-white text-[1rem] font-[400] uppercase tracking-[-0.035em] text-black shadow-none hover:bg-white/90 disabled:border-white/30 disabled:bg-white/20 disabled:text-white/40"
          >
            {isSubmitting ? "Enviando" : "Enviar"}
          </Button>

          {submitError ? (
            <p className="text-center text-[0.86rem] leading-[1.3] text-white/72">
              {submitError}
            </p>
          ) : null}
        </form>
      </div>

      <a
        className="mx-auto mt-[4rem] block w-fit text-center text-[0.78rem] tracking-[-0.02em] text-white/42 underline-offset-4 hover:text-white/70 hover:underline"
        href="https://teamaurora.pe"
        rel="noreferrer"
        target="_blank"
      >
        Construido por Aurora Software Factory
      </a>

      {isModalOpen ? (
        <div
          aria-labelledby="dessert-modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-[6vw]"
          role="dialog"
        >
          <div className="relative w-full max-w-[25rem] rounded-[1.5rem] border border-white/28 bg-black px-[7vw] py-[2.4rem] text-center text-white shadow-2xl">
            <button
              aria-label="Cerrar modal"
              className="absolute right-4 top-3 text-[1.8rem] leading-none text-white/70"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <p
              className="text-[clamp(1.6rem,6vw,2.15rem)] font-[400] leading-[1.15] tracking-[-0.06em]"
              id="dessert-modal-title"
            >
              Gracias, {submittedName}.
            </p>

            <p className="mt-[1.2rem] text-[clamp(1rem,3.9vw,1.25rem)] font-[400] leading-[1.38] tracking-[-0.035em] text-white/82">
              Acércate a caja para reclamar tu postre ÁTMO gratis. Tómale
              screenshot a este modal para no perderlo.
            </p>

            <div className="mt-[1.6rem] rounded-[1rem] border border-white/18 bg-white/[0.06] px-4 py-4">
              <p className="text-[0.95rem] leading-[1.35] tracking-[-0.025em] text-white/78">
                ¿Quieres un café gratis? Publica una historia de una de las
                esculturas del NIMBO Universe y etiquétanos en Instagram:
                <span className="text-white"> @studio.atmo_</span>
              </p>

              <a
                className="mx-auto mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white px-4 text-[0.85rem] uppercase tracking-[-0.02em] text-white"
                href="instagram://story-camera"
              >
                <InstagramIcon />
                Abrir stories
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
