import {
  use,
  createContext,
  useState,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<{
  session: Session | null;
  isLoading: boolean;
} | null>(null);

export function useSessionState() {
  const value = use(AuthContext);
  if (!value)
    throw new Error("useSessionState must be in a <SessionProvider />");
  return value;
}

export function useSession() {
  const value = useSessionState();
  if (!value.session)
    throw new Error("useSession must be in an authenticated route");
  return value.session;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoading(false);
      setSession(session);
    });
    const res = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => res.data.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({ session, isLoading }), [session, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
