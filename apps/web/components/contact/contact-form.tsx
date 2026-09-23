"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui";
import { submitContactForm, type ContactFormState } from "@/app/[locale]/contact/actions";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="rounded-3xl border p-8">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <div className="grid gap-3">
        <input
          required
          name="name"
          placeholder={t("namePlaceholder")}
          className="rounded-xl border p-3"
        />
        <input
          required
          type="email"
          name="email"
          placeholder={t("emailPlaceholder")}
          className="rounded-xl border p-3"
        />
        <input
          name="company"
          placeholder={t("companyPlaceholder")}
          className="rounded-xl border p-3"
        />
        <textarea
          required
          name="message"
          placeholder={t("messagePlaceholder")}
          className="min-h-40 rounded-xl border p-3"
        />
        <button
          disabled={pending}
          className="rounded-xl bg-[#58c900] px-5 py-3 font-extrabold text-[#092713] disabled:opacity-60"
        >
          {pending ? t("sending") : t("submit")}
        </button>
        {state.status === "success" && (
          <p className="rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">
            {t("success")}
          </p>
        )}
        {state.status === "error" && (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
            {t("error")}
          </p>
        )}
      </div>
    </form>
  );
}
