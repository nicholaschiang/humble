import { getGymVisitFeedForUser } from "@/service/WorkoutService";
import { GymVisitHistory } from "./GymVisitHistory";

export function UserFeed({ userId }: { userId: string }) {
  return (
    <GymVisitHistory
      getGymVisits={() => getGymVisitFeedForUser(userId)}
    />
  );
}
