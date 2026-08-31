import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const RsvpForm = ({
  invitationId,
  accent,
  fg,
}: {
  invitationId: string;
  accent: string;
  fg: string;
}) => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [count, setCount] = useState(1);
  const [attending, setAttending] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) return toast.error("Please confirm if you'll attend");
    const trimmedName = name.trim();
    const trimmedMessage = msg.trim();
    if (trimmedName.length < 1 || trimmedName.length > 100) {
      return toast.error("Please enter a name up to 100 characters");
    }
    if (trimmedMessage.length < 1 || trimmedMessage.length > 1000) {
      return toast.error("Please enter a message up to 1,000 characters");
    }
    setSubmitting(true);
    const { error } = await supabase.from("guest_messages").insert({
      invitation_id: invitationId,
      guest_name: trimmedName,
      message: trimmedMessage,
      attending,
      guest_count: Math.min(20, Math.max(1, count)),
    });
    setSubmitting(false);
    if (error) return toast.error("We couldn't send your RSVP. Please try again.");
    setDone(true);
  };

  if (done) {
    return (
      <div
        className="rounded-lg border-2 p-8 text-center"
        style={{ borderColor: accent, color: fg }}
      >
        <div className="font-display text-3xl mb-2" style={{ color: accent }}>Thank you ✦</div>
        <p className="opacity-80">Your message has been sent to the couple.</p>
      </div>
    );
  }

  const inputCls = "w-full rounded-md px-3 py-2 text-sm bg-transparent border outline-none focus:ring-1";

  return (
    <form
      onSubmit={submit}
      className="rounded-lg border-2 p-6 md:p-8 space-y-4"
      style={{ borderColor: `${accent}66`, color: fg, background: `${accent}05` }}
    >
      <div>
        <label className="text-xs uppercase tracking-widest opacity-70">Your Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls + " mt-1"}
          style={{ borderColor: `${accent}55` }}
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest opacity-70">Will you attend?</label>
        <div className="flex gap-2 mt-2">
          {[
            { v: true, l: "Yes, with joy ✦" },
            { v: false, l: "Sadly cannot" },
          ].map((opt) => (
            <button
              type="button"
              key={String(opt.v)}
              onClick={() => setAttending(opt.v)}
              className="flex-1 px-3 py-2 rounded-md border text-sm transition-all"
              style={{
                borderColor: attending === opt.v ? accent : `${accent}40`,
                background: attending === opt.v ? `${accent}25` : "transparent",
              }}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      {attending && (
        <div>
          <label className="text-xs uppercase tracking-widest opacity-70">Number of Guests</label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className={inputCls + " mt-1"}
            style={{ borderColor: `${accent}55` }}
          />
        </div>
      )}

      <div>
        <label className="text-xs uppercase tracking-widest opacity-70">Message for the Couple</label>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          required
          className={inputCls + " mt-1 resize-none"}
          style={{ borderColor: `${accent}55` }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-3 rounded-md font-semibold tracking-wider uppercase text-xs transition-all hover:opacity-90"
        style={{ background: accent, color: fg.includes("90%") || fg.includes("88%") || fg.includes("92%") ? "#1a1a1a" : "#fff" }}
      >
        {submitting ? "Sending…" : "Send Wishes"}
      </button>
    </form>
  );
};
