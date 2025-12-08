import { Tables } from "@/lib/database.types";
import { formatGymVisitDate, getExerciseTypeName } from "@/lib/workout-utils";
import {
  AddLike,
  GetLikeCountForGymVisit,
  RemoveLike,
  UserLikesGymVisit,
} from "@/service/SocialService";
import { FontAwesome } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { CommentsModal } from "./CommentsModal";

type GymVisit = Tables<"GymVisit">;
type Exercise = Tables<"Exercise">;
type SetRow = Tables<"Set">;

function formatSetRows(sets: SetRow[]): string {
  if (!sets.length) return "No sets";
  return sets
    .map((s, i) => {
      const parts: string[] = [];
      if (s.reps != null) parts.push(`Reps: ${s.reps}`);
      if (s.weight != null) parts.push(`Weight: ${s.weight}`);
      if (s.duration_sec != null) parts.push(`Duration: ${s.duration_sec}s`);
      if (s.distance_mi != null) parts.push(`Distance: ${s.distance_mi}mi`);
      return `${i + 1}. ${parts.join(" ")}`;
    })
    .join("\n");
}

function DeleteVisitButton({
  onDelete,
  visitId,
}: {
  onDelete: (id: string) => Promise<void>;
  visitId: string;
}) {
  return (
    <View style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}>
      <Button
        variant="ghost"
        size="icon"
        onPress={() => onDelete(visitId)}
        accessibilityLabel={`Delete visit ${visitId}`}
      >
        <Text style={{ color: "#ef4444", fontWeight: "700", fontSize: 16 }}>
          ✕
        </Text>
      </Button>
    </View>
  );
}

type NavigationParams = NavigationProp<{
  CommentsPage: {
    visit: GymVisit;
    exercises: Exercise[];
    setsMap: Record<string, SetRow[]>;
    exerciseTypes: any[];
    userReadableName: string;
  };
}>;

export function VisitCard({
  visit,
  exercises,
  setsMap,
  exerciseTypes,
  userReadableName,
  onDelete,
  currentUserId,
}: {
  visit: GymVisit;
  exercises: Exercise[];
  setsMap: Record<string, SetRow[]>;
  exerciseTypes: any[];
  userReadableName: string;
  onDelete?: (id: string) => Promise<void>;
  currentUserId?: string | null;
}) {
  const navigation = useNavigation<NavigationParams>();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);

  useEffect(() => {
    const fetchLikeStatusAndCount = async () => {
      if (!currentUserId) return;

      try {
        const [isLiked, count] = await Promise.all([
          UserLikesGymVisit(currentUserId, visit.id),
          GetLikeCountForGymVisit(visit.id),
        ]);
        setLiked(isLiked);
        setLikeCount(count);
      } catch (error) {
        console.error("Failed to fetch like status or count:", error);
      }
    };

    fetchLikeStatusAndCount();
  }, [currentUserId, visit.id]);

  const toggleLike = async () => {
    if (!currentUserId) return;

    try {
      if (liked) {
        await RemoveLike(currentUserId, visit.id);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        await AddLike(currentUserId, visit.id);
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <View
      key={visit.id}
      className="mb-4 bg-card rounded-md overflow-hidden"
      style={{ borderWidth: 2, borderColor: "#0f1724", position: "relative" }}
    >
      {onDelete && currentUserId && currentUserId === visit.user_id && (
        <DeleteVisitButton onDelete={onDelete} visitId={visit.id} />
      )}
      <View className="p-4">
        <Text className="text-2xl font-semibold">
          {formatGymVisitDate(visit.created_at)}
        </Text>
        <Text className="text-sm text-muted-foreground mt-1">
          By {userReadableName}
        </Text>

        {exercises.length > 0 && (
          <View className="mt-4 border-t border-border pt-4">
            {exercises.map((ex) => (
              <View key={ex.id} className="mb-3">
                <Text className="text-lg font-semibold">
                  {getExerciseTypeName(
                    ex.exercise_type_id || "",
                    exerciseTypes,
                  )}
                </Text>

                <Text className="text-sm text-muted-foreground mt-1">
                  {formatSetRows(setsMap[ex.id] || [])}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View className="mt-4 flex-row items-center">
          <Button
            className="bg-muted rounded-md px-3 py-2 flex-row items-center"
            onPress={() => setCommentsVisible(true)}
            accessibilityLabel={`Open comments for visit ${visit.id}`}
          >
            <FontAwesome
              name="comment"
              size={16}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text className="text-foreground font-semibold">Comments</Text>
          </Button>
          <Button
            className="ml-2 bg-muted rounded-md px-3 py-2 flex-row items-center"
            onPress={toggleLike}
            accessibilityLabel={`Toggle like for visit ${visit.id}`}
          >
            <Text className="text-foreground font-semibold mr-2">
              {likeCount}
            </Text>
            <FontAwesome
              name={liked ? "thumbs-up" : "thumbs-o-up"}
              size={16}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text className="text-foreground font-semibold">
              {liked ? "Liked!" : "Like"}
            </Text>
          </Button>
        </View>
      </View>
      <CommentsModal
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        visit={visit}
        exercises={exercises}
        setsMap={setsMap}
        exerciseTypes={exerciseTypes}
        userReadableName={userReadableName}
      />
    </View>
  );
}
