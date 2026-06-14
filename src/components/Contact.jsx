import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  User,
  Mail,
  MessageSquareText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { styles } from "../style";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { personalInfo } from "../content";
import SocialLinks from "./SocialLinks";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

const inputClasses =
  "w-full rounded-xl border border-white/20 bg-black/30 py-3 pl-12 pr-4 font-medium text-white outline-none transition-all duration-200 placeholder:text-secondary/60 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

const iconClasses =
  "pointer-events-none absolute left-4 h-5 w-5 text-secondary transition-colors duration-200 group-focus-within:text-[var(--accent)]";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", message }

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: personalInfo.contactName,
          from_email: form.email,
          to_email: personalInfo.email,
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          setStatus({
            type: "success",
            message: "Thank you! I'll get back to you as soon as possible.",
          });
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          setStatus({
            type: "error",
            message: "Something went wrong. Please try again.",
          });
        }
      );
  };

  return (
    <div className="flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] rounded-3xl border border-white/20 bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-5"
        >
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white-100">Your Name</span>
            <div className="group relative flex items-center">
              <User className={iconClasses} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="What's your good name?"
                className={inputClasses}
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white-100">
              Your Email
            </span>
            <div className="group relative flex items-center">
              <Mail className={iconClasses} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="What's your email address?"
                className={inputClasses}
              />
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white-100">
              Your Message
            </span>
            <div className="group relative">
              <MessageSquareText className={`${iconClasses} top-4`} />
              <textarea
                rows={4}
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="What do you want to say?"
                className={`${inputClasses} resize-none pt-4`}
              />
            </div>
          </label>

          {status && (
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                status.type === "success"
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-red-500/10 text-red-300"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              {status.message}
            </div>
          )}

          <LiquidButton
            type="submit"
            disabled={loading}
            size="xl"
            className="group w-fit gap-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </>
            )}
          </LiquidButton>
        </form>

        {/* Social / profile links */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm text-secondary">Or connect with me</p>
          <SocialLinks className="mt-4" />
        </div>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="h-[350px] md:h-[550px] xl:h-auto xl:flex-1"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
