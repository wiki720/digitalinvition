REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM authenticated;