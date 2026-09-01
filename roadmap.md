# Zareqia Rebrand + Plans + Event Type

## Goals
1. Rebrand every "Digital Invition" reference to "Zareqia".
2. Introduce Classic (₹1199) and Royal (₹1499) plans with template gating.
3. Add event-type selection to invitations.

## Tasks
- [ ] Database schema: add `event_type` to invitations, `plan` to profiles, split prices in app_settings.
- [ ] Edge functions: accept plan parameter, set profile plan on payment.
- [ ] Templates: tag each template as classic/royal.
- [ ] usePaid hook: expose current user plan.
- [ ] Create page: event type field + template plan validation.
- [ ] Templates page: filter/prompt upgrade based on plan.
- [ ] Checkout page: show Classic & Royal cards.
- [ ] Admin page: manage both prices + see user plans.
- [ ] InvitationView: show event type.
- [ ] Branding: Logo, footer, checkout, index.html, invitation footer.
- [ ] Landing page content refresh (Hero, Features, Pricing, etc.).
- [ ] Build & verify.
