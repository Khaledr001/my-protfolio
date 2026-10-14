import { useState, type ChangeEvent, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";

import { profile } from "@/data/profile";
import { emailjsConfig } from "@/lib/emailjs";
import { cn } from "@/lib/utils";

type Status = { type: "success" | "error"; message: string; fallbackHref?: string } | null;

/** A mailto: link carrying the visitor's message, used if sending fails. */
function mailtoFor(form: { name: string; email: string; message: string }) {
  const subject = `Portfolio enquiry from ${form.name || "a visitor"}`;
  const body = `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const fieldClass =
  "w-full rounded-xl border border-line bg-ink-950/70 px-4 py-3 text-[15px] text-fg placeholder:text-fg-subtle/70 outline-none transition-colors focus:border-accent/70 focus-visible:outline-none";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { serviceId, templateId, publicKey } = emailjsConfig;
    if (!serviceId || !templateId || !publicKey) return;
    setSending(true);
    setStatus(null);
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          to_name: profile.name,
          from_email: form.email,
          to_email: profile.email,
          message: form.message,
        },
        publicKey,
      );
      setStatus({ type: "success", message: "Thanks — your message is on its way. I'll reply soon." });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      // EmailJS rejects with { status, text } describing the exact problem
      // (e.g. an invalid template ID or a disconnected email service).
      const detail = error as { status?: number; text?: string };
      console.error("EmailJS send failed:", detail.status, detail.text ?? error);
      // Keep the form filled in and offer the same message by email instead.
      setStatus({
        type: "error",
        message: "The message couldn't be sent from the site.",
        fallbackHref: mailtoFor(form),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-describedby="contact-status">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-2 block">Name</span>
          <input
            name="name"
            required
            autoComplete="name"
            value={form.name}
            onChange={onChange}
            className={fieldClass}
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            className={fieldClass}
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow mb-2 block">Message</span>
        <textarea
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={onChange}
          className={cn(fieldClass, "resize-y")}
          placeholder="What are you building?"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[14px] font-medium text-fg transition-colors hover:border-accent/60 hover:bg-white/[0.05] disabled:cursor-wait disabled:opacity-60"
        >
          {sending ? (
            <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <Send aria-hidden="true" className="h-4 w-4" />
          )}
          {sending ? "Sending…" : "Send message"}
        </button>
        <p id="contact-status" role="status" aria-live="polite" className="text-[14px]">
          {status && (
            <span
              className={cn(
                "inline-flex flex-wrap items-center gap-x-2 gap-y-1",
                status.type === "success" ? "text-cool-soft" : "text-rose-300",
              )}
            >
              {status.type === "success" ? (
                <CircleCheck aria-hidden="true" className="h-4 w-4" />
              ) : (
                <CircleAlert aria-hidden="true" className="h-4 w-4" />
              )}
              {status.message}
              {status.fallbackHref && (
                <a href={status.fallbackHref} className="font-semibold text-accent underline underline-offset-4 hover:text-accent-soft">
                  Send it from your email app instead
                </a>
              )}
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
