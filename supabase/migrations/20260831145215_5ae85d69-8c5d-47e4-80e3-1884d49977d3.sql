DROP POLICY IF EXISTS "Anyone can insert guest messages" ON public.guest_messages;
DROP POLICY IF EXISTS "Public guests can submit messages" ON public.guest_messages;

CREATE POLICY "Authenticated guests can submit messages"
  ON public.guest_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.invitations i
      WHERE i.id = guest_messages.invitation_id
        AND i.is_published = true
    )
  );