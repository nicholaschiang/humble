import { Tables } from "@/lib/database.types";
import { getExerciseTypeName } from "@/lib/workout-utils";
import { getUserProfile } from "@/service/AuthService";
import {
  AddLike,
  GetCommentCountForGymVisit,
  GetLikeCountForGymVisit,
  RemoveLike,
  UserLikesGymVisit,
} from "@/service/SocialService";
import { FontAwesome } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { CommentsModal } from "./CommentsModal";
import { ProfileAvatar } from "../ProfileAvatar";

type GymVisit = Tables<"GymVisit">;
type Exercise = Tables<"Exercise">;
type SetRow = Tables<"Set">;

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [visitUserFullName, setVisitUserFullName] = useState<string | null>(
    null
  );
  const [visitUserUsername, setVisitUserUsername] = useState<string | null>(
    null
  );
  const [visitUserImageUrl, setVisitUserImageUrl] = useState<string | null>(
    null
  );
  const [expanded, setExpanded] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  // -------- FETCH LIKE / COMMENT COUNTS ----------
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [likeCnt, commentCnt] = await Promise.all([
          GetLikeCountForGymVisit(visit.id),
          GetCommentCountForGymVisit(visit.id),
        ]);
        setLikeCount(likeCnt);
        setCommentCount(commentCnt);

        if (currentUserId) {
          const isLiked = await UserLikesGymVisit(currentUserId, visit.id);
          setLiked(isLiked);
        }
      } catch (error) {
        console.error("Failed to fetch like/comment counts or status:", error);
      }
    }
    fetchCounts();
  }, [currentUserId, visit.id]);

  // -------- FETCH USER PROFILE ----------
  useEffect(() => {
    async function fetchVisitUser() {
      try {
        if (!visit.user_id) {
          setVisitUserFullName(userReadableName);
          return;
        }

        const profile = await getUserProfile(visit.user_id);
        const full =
          [profile.first_name || "", profile.last_name || ""]
            .filter(Boolean)
            .join(" ") || userReadableName;

        setVisitUserFullName(full);
        setVisitUserUsername(profile.username || null);
        setVisitUserImageUrl(profile.image_url || null);
      } catch {
        setVisitUserFullName(userReadableName);
      }
    }
    fetchVisitUser();
  }, [visit.user_id, userReadableName]);

  // -------- LIKE / UNLIKE ----------
  async function toggleLike() {
    if (!currentUserId) return;

    try {
      if (liked) {
        await RemoveLike(currentUserId, visit.id);
        setLikeCount((prev) => Math.max(prev - 1, 0));
      } else {
        await AddLike(currentUserId, visit.id);
        setLikeCount((prev) => prev + 1);
      }
      setLiked((prev) => !prev);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  }

  function handleToggleExpanded() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
    setMenuVisible(false);
  }

  const displayName = `${visitUserFullName ?? userReadableName}${
    visitUserUsername ? ` (${visitUserUsername})` : ""
  }`;

  const isOwner = currentUserId && currentUserId === visit.user_id;

  // -------- QUICK SUMMARY CALCULATIONS ----------
  const totalVolume = exercises.reduce((acc, ex) => {
    const sets = setsMap[ex.id] || [];
    const volumeForExercise = sets.reduce((sum, s) => {
      const reps = s.reps ?? 0;
      const weight = s.weight ?? 0;
      return sum + reps * weight;
    }, 0);
    return acc + volumeForExercise;
  }, 0);

  const uniqueLiftCount = new Set(exercises.map((ex) => ex.exercise_type_id))
    .size;

  return (
    <View
      key={visit.id}
      className="mb-4 bg-card rounded-md overflow-hidden"
      style={{
        borderWidth: 2,
        borderColor: "#0f1724",
        position: "relative",
        backgroundColor: "#161618ff",
      }}
    >
      {/* -------- 3-DOTS MENU -------- */}
      {isOwner && onDelete && (
        <>
          <Pressable
            style={{
              position: "absolute",
              right: 8,
              zIndex: 20,
              padding: 4,
            }}
            hitSlop={8}
            onPress={() => setMenuVisible((prev) => !prev)}
          >
            <FontAwesome name="ellipsis-h" size={18} color="#bbc1caff" />
          </Pressable>

          {menuVisible && (
            <View
              style={{
                position: "absolute",
                top: 25,
                right: 8,
                zIndex: 30,
                backgroundColor: "#0c0c0dff",
                borderRadius: 8,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderWidth: 1,
                borderColor: "#1f2937",
                shadowColor: "#000",
                shadowOpacity: 0.25,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 4 },
                elevation: 5,
              }}
            >
              <Pressable
                onPress={async () => {
                  setMenuVisible(false);
                  try {
                    await onDelete(visit.id);
                  } catch (err) {
                    console.error("Failed to delete visit:", err);
                  }
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 6,
                  paddingHorizontal: 4,
                }}
              >
                <FontAwesome
                  name="trash"
                  size={16}
                  color="#ef4444"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: "#ef4444",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  Delete workout
                </Text>
              </Pressable>
            </View>
          )}
        </>
      )}

      {/* -------- CARD CONTENT -------- */}
      <View className="p-4">
        {/* HEADER */}
        <Pressable
          onPress={handleToggleExpanded}
          //className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center justify-between">
            <View
              style={{
                right: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ProfileAvatar uri={visitUserImageUrl ?? null} size={60} />
            </View>
            <View className="flex-1 mr-2">
              <Text className="text-2xl font-semibold">{displayName}</Text>
            </View>

            <FontAwesome
              name={expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#FFF"
            />
          </View>
          <View className="mt-2" style={{ top: 4 }}>
            <Text className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(visit.created_at), {
                addSuffix: true,
              })}
            </Text>
          </View>

          {exercises.length > 0 && (
            <View className="mt-2">
              <Text className="text-sm text-muted-foreground">
                Total Weight:{" "}
                <Text className="text-green-600 font-semibold">
                  {totalVolume} lbs
                </Text>
              </Text>

              <Text className="text-sm text-muted-foreground">
                Unique Lifts:{" "}
                <Text className="text-green-700 font-semibold">
                  {uniqueLiftCount}
                </Text>
              </Text>
            </View>
          )}
        </Pressable>

        {/* -------- DETAILS (only expanded) -------- */}
        {expanded && exercises.length > 0 && (
          <View className="mt-4 border-t border-border pt-4">
            {exercises.map((ex) => (
              <View key={ex.id} className="mb-3">
                <Text className="text-lg font-semibold">
                  {getExerciseTypeName(
                    ex.exercise_type_id || "",
                    exerciseTypes
                  )}
                </Text>

                <Text className="text-sm text-muted-foreground mt-1">
                  {formatSetRows(setsMap[ex.id] || [])}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* -------- LIKES & COMMENTS -------- */}
        <View className="mt-4 flex-row items-center">
          <Button
            className="bg-muted rounded-md px-3 py-2 flex-row items-center"
            onPress={() => setCommentsVisible(true)}
            accessibilityLabel={`Open comments for visit ${visit.id}`}
          >
            <Text className="text-foreground font-semibold mr-2">
              {commentCount}
            </Text>
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

      {/* -------- COMMENTS MODAL -------- */}
      <CommentsModal
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        visit={visit}
        exercises={exercises}
        setsMap={setsMap}
        exerciseTypes={exerciseTypes}
        userReadableName={userReadableName}
        onCommentAdded={() => setCommentCount((c) => c + 1)}
      />
    </View>
  );
}
