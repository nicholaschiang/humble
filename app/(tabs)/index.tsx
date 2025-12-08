import { UserFeed } from "@/components/history/UserFeed";

import { useSession } from "@/lib/session";

export default function Home() {
  const session = useSession();
  return <UserFeed userId={session.user.id} />;
}
