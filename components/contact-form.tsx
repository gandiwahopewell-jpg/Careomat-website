"use client";

import { useState } from "react";
import { CheckCircle2, Send, AlertCircle, Loader2 } from "lucide-react";

type FormStatus = "idle" | "loading" | "success" | "error";

type Errors = Partial<
  Record<"name" | "email" | "organisation" | "message" | "privacy", string>
>;

const fieldClass =
  "mt-2 w-full rounded-md border bg-background px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  function validate(form: FormData): Errors {
    const next: Errors = {};
    if (!String(form.get("name") || "").trim()) {
      next.name = "Please enter your name.";
    }
    if (!/^\S+@\S+\.\S+$/.test(String(form.get("email") || ""))) {
      next.email = "Enter a valid email address.";
    }
    if (!String(form.get("organisation") || "").trim()) {
      next.organisation = "Please enter your organisation.";
    }
    if (String(form.get("message") || "").trim().length < 20) {
      next.message = "Tell us a little more (at least 20 characters).";
    }
    if (!form.get("privacy")) {
      next.privacy = "Please confirm we may use these details to reply.";
    }
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const clientErrors = validate(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setStatus("loading");
    setServerError(null);

    const payload = {
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      organisation: String(form.get("organisation") || "").trim(),
      enquiry: String(form.get("enquiry") || "").trim() || undefined,
      budget: String(form.get("budget") || "").trim() || undefined,
      message: String(form.get("message") || "").trim(),
      privacyAgreed: Boolean(form.get("privacy")),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setServerError(
          data.error ||
            "Something went wrong. Please try again or email us at hello@careomat.co.uk."
        );
        setStatus("error");
      }
    } catch {
      setServerError(
        "Could not reach the server. Please check your connection or email us at hello@careomat.co.uk."
      );
      setStatus("error");
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        className="flex min-h-96 flex-col items-start justify-center gap-5 rounded-lg border bg-muted p-8"
        role="status"
      >
        <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">
          Thank you. Your project is on our radar.
        </h2>
        <p className="max-w-lg leading-7 text-muted-foreground">
          We have received your enquiry and will reply within two working days.
          If your need is urgent, email us directly at{" "}
          <a
            href="mailto:hello@careomat.co.uk"
            className="font-medium text-primary underline"
          >
            hello@careomat.co.uk
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-semibold text-primary hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const isLoading = status === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Server error banner */}
      {status === "error" && serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name
          <input
            name="name"
            autoComplete="name"
            disabled={isLoading}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={fieldClass}
          />
          {errors.name && (
            <span id="name-error" className="mt-2 block text-sm text-destructive">
              {errors.name}
            </span>
          )}
        </label>
        <label className="text-sm font-semibold">
          Work email
          <input
            name="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={fieldClass}
          />
          {errors.email && (
            <span id="email-error" className="mt-2 block text-sm text-destructive">
              {errors.email}
            </span>
          )}
        </label>
      </div>

      {/* Organisation */}
      <label className="text-sm font-semibold">
        Organisation
        <input
          name="organisation"
          autoComplete="organization"
          disabled={isLoading}
          aria-invalid={!!errors.organisation}
          aria-describedby={errors.organisation ? "organisation-error" : undefined}
          className={fieldClass}
        />
        {errors.organisation && (
          <span
            id="organisation-error"
            className="mt-2 block text-sm text-destructive"
          >
            {errors.organisation}
          </span>
        )}
      </label>

      {/* Enquiry + Budget */}
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          How can we help?
          <select
            name="enquiry"
            disabled={isLoading}
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select one
            </option>
            <option>Shape a new service</option>
            <option>Build custom software</option>
            <option>Modernise an existing system</option>
            <option>Review delivery or architecture</option>
            <option>Discuss a procurement opportunity</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Indicative budget
          <select
            name="budget"
            disabled={isLoading}
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select if known
            </option>
            <option>Under £25,000</option>
            <option>£25,000–£75,000</option>
            <option>£75,000–£150,000</option>
            <option>£150,000+</option>
            <option>Not yet known</option>
          </select>
        </label>
      </div>

      {/* Message */}
      <label className="text-sm font-semibold">
        What are you trying to change?
        <textarea
          name="message"
          rows={6}
          disabled={isLoading}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={fieldClass}
          placeholder="The service problem, what is already known, and any important date or constraint."
        />
        {errors.message && (
          <span
            id="message-error"
            className="mt-2 block text-sm text-destructive"
          >
            {errors.message}
          </span>
        )}
      </label>

      {/* Privacy */}
      <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
        <input
          name="privacy"
          type="checkbox"
          disabled={isLoading}
          className="mt-1 size-4 accent-primary"
        />
        <span>
          Careomat may use these details to respond to this enquiry. No marketing
          lists or third-party sharing.
        </span>
      </label>
      {errors.privacy && (
        <p className="text-sm text-destructive">{errors.privacy}</p>
      )}

      {/* Submit */}
      <button
        id="contact-submit-btn"
        type="submit"
        disabled={isLoading}
        className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 transition-opacity"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Send project enquiry
            <Send className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
