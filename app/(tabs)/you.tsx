import { SingleUserHistory } from "@/components/history/SingleUserHistory";

import { useSession } from "@/lib/session";

export default function You() {
  const session = useSession();
  return <SingleUserHistory userId={session.user.id} />;
}
