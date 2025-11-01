import { Account } from "@/components/Account";
import { useSession } from "@/lib/session";

export default function You() {
  const session = useSession();
  return <Account session={session} />;
}
