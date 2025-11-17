import { getGymVisitsByUser } from "@/service/WorkoutService";
import { GymVisitHistory } from "./GymVisitHistory";

export function SingleUserHistory({ userId }: { userId: string }) {
  return (
    <GymVisitHistory
      getGymVisits={() => getGymVisitsByUser(userId)}
      title="User History"
    />
  );
}
