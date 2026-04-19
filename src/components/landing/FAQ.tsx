import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How does the digital invitation work?", a: "After purchase, you fill in your wedding details through a simple form. We generate a unique link for your personalized invitation webpage that you can share with guests via WhatsApp, email, or any messaging platform." },
  { q: "Can I edit my invitation after creating it?", a: "Yes — each link supports up to 5 edits, so you can update details like timings, dress code, or add photos as your plans evolve." },
  { q: "How many invitations can I create?", a: "Your one-time payment includes up to 2 unique invitation links — perfect if you'd like separate invitations for different events or guest groups." },
  { q: "Is there a limit on how many guests can view my invitation?", a: "No — share your link with as many guests as you like. There are no per-view fees." },
  { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, UPI, and net banking through our secure payment gateway." },
  { q: "Can I get a refund?", a: "Because invitations are personalized digital products generated immediately upon payment, refunds are only issued if there is a technical issue we cannot resolve." },
];

export const FAQ = () => (
  <section className="py-24 md:py-32 bg-gradient-emerald">
    <div className="container max-w-3xl">
      <div className="text-center mb-12">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Got Questions?</p>
        <h2 className="font-display text-4xl md:text-5xl">Frequently Asked Questions</h2>
        <div className="ornament-divider mt-6"><span className="text-gold">✦</span></div>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border border-gold/15 rounded-lg px-5 bg-background/30 backdrop-blur data-[state=open]:border-gold/40"
          >
            <AccordionTrigger className="font-display text-lg text-left hover:text-gold hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
