CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.validate_guest_message()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.guest_name := btrim(NEW.guest_name);
  NEW.message := btrim(NEW.message);

  IF char_length(NEW.guest_name) NOT BETWEEN 1 AND 100 THEN
    RAISE EXCEPTION 'Invalid guest name';
  END IF;

  IF char_length(NEW.message) NOT BETWEEN 1 AND 1000 THEN
    RAISE EXCEPTION 'Invalid guest message';
  END IF;

  IF NEW.guest_count IS NULL THEN
    NEW.guest_count := 1;
  ELSIF NEW.guest_count NOT BETWEEN 1 AND 20 THEN
    RAISE EXCEPTION 'Invalid guest count';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.invitations
    WHERE id = NEW.invitation_id
      AND is_published = true
  ) THEN
    RAISE EXCEPTION 'Invitation is not available';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_guest_message_before_insert ON public.guest_messages;
CREATE TRIGGER validate_guest_message_before_insert
  BEFORE INSERT ON public.guest_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_guest_message();