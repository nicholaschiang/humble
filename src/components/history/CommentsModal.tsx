import { Tables } from "@/lib/database.types";
import { useSession } from "@/lib/session";
import { getExerciseTypeName } from "@/lib/workout-utils";
import { getUserProfile } from "@/service/AuthService";
import { AddComment, GetCommentsForGymVisit } from "@/service/SocialService";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Text } from "../ui/text";

type Comment = {
  content: string;
  commenter_id: string;
  created_at: string;
  gym_visit_id: string;
};

type FormattedComment = Comment & {
  commenter_name: string;
  commenter_username: string;
};

type CommentsModalProps = {
  visible: boolean;
  onClose: () => void;
  visit: Tables<"GymVisit">;
  exercises: Tables<"Exercise">[];
  setsMap: Record<string, Tables<"Set">[]>;
  exerciseTypes: any[];
  userReadableName: string;
  onCommentAdded?: () => void;
};

export function CommentsModal({
  visible,
  onClose,
  visit,
  exercises,
  setsMap,
  exerciseTypes,
  userReadableName,
  onCommentAdded,
}: CommentsModalProps) {
  const session = useSession();
  const [visitUserFullName, setVisitUserFullName] = useState<string | null>(
    null,
  );
  const [visitUserUsername, setVisitUserUsername] = useState<string | null>(
    null,
  );
  const [comments, setComments] = useState<FormattedComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const addedCommentResponse = await AddComment(
        session.user.id,
        visit.id,
        newComment,
      );

      const userProfile = await getUserProfile(session.user.id);
      const addedComment: FormattedComment = {
        content: addedCommentResponse.comment,
        commenter_id: addedCommentResponse.commenter_id,
        commenter_name: userProfile.first_name + " " + userProfile.last_name,
        commenter_username: userProfile.username,
        created_at: addedCommentResponse.created_at,
        gym_visit_id: addedCommentResponse.gym_visit_id,
      };

      // insert newest comment at the top
      setComments((prev) => [addedComment, ...prev]);
      if (onCommentAdded) onCommentAdded();
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await GetCommentsForGymVisit(visit.id);
        const formattedComments: FormattedComment[] = await Promise.all(
          fetchedComments.map(async (comment) => {
            const userProfile = await getUserProfile(comment.commenter_id);
            return {
              content: comment.comment,
              commenter_id: comment.commenter_id,
              commenter_name:
                userProfile.first_name + " " + userProfile.last_name,
              commenter_username: userProfile.username,
              created_at: comment.created_at,
              gym_visit_id: comment.gym_visit_id,
            };
          }),
        );
        // sort newest first
        const sorted = formattedComments.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setComments(sorted);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    const fetchVisitUser = async () => {
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
      } catch (error) {
        setVisitUserFullName(userReadableName);
      }
    };

    if (visible) {
      fetchComments();
      fetchVisitUser();
    }
  }, [visible, visit.id]);

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <View style={{ position: "absolute", top: 8, right: 8, zIndex: 50 }}>
          <Button
            variant="ghost"
            size="icon"
            onPress={onClose}
            accessibilityLabel="Close comments"
          >
            <Text style={{ fontSize: 16, fontWeight: "700" }}>✕</Text>
          </Button>
        </View>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <ScrollView>
          <Text>
            <Text className="text-2xl font-semibold">{`${visitUserFullName ?? userReadableName}${visitUserUsername ? ` (${visitUserUsername})` : ""}`}</Text>
            <Text className="text-sm text-muted-foreground">{` • ${formatDistanceToNow(new Date(visit.created_at), { addSuffix: true })}`}</Text>
          </Text>

          {exercises.length > 0 && (
            <View className="mt-4 border-t border-border pt-4">
              {exercises.map((ex: Tables<"Exercise">) => (
                <View key={ex.id} className="mb-3">
                  <Text className="text-lg font-semibold">
                    {getExerciseTypeName(
                      ex.exercise_type_id || "",
                      exerciseTypes,
                    )}
                  </Text>

                  <View className="mt-1">
                    {setsMap[ex.id]?.map(
                      (set: Tables<"Set">, index: number) => (
                        <Text
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          {index + 1}. Reps: {set.reps}, Weight: {set.weight},
                          Duration: {set.duration_sec}s, Distance:{" "}
                          {set.distance_mi}mi
                        </Text>
                      ),
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View className="mt-4 z-10">
            <Text className="text-lg font-semibold mb-2">Add a Comment</Text>
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write your comment..."
              placeholderTextColor="#6b7280"
              className="flex-1 border border-border rounded-md p-2 text-white"
              onSubmitEditing={handleAddComment}
              returnKeyType="send"
            />
          </View>

          <View className="mt-4 border-t border-border pt-4">
            <Text className="text-lg font-semibold mb-2">Comments</Text>
            {comments.length > 0 ? (
              comments.map((comment: FormattedComment, index: number) => (
                <View key={index} className="mb-2">
                  <Text className="text-xs text-muted-foreground">
                    <Text className="font-semibold">{`${comment.commenter_name} (${comment.commenter_username})`}</Text>
                    <Text className="text-xs text-muted-foreground">{` • ${formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}`}</Text>
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {comment.content}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-muted-foreground">
                No comments yet.
              </Text>
            )}
          </View>
        </ScrollView>
      </DialogContent>
    </Dialog>
  );
}
