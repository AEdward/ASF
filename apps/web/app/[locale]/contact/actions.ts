"use server";

import { sendContactEmail } from "@/lib/mail";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  error?: string;
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { status: "error", error: "missing" };
  }

  try {
    await sendContactEmail({ name, email, company: company || undefined, message });
    return { status: "success" };
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return { status: "error", error: "send-failed" };
  }
}
