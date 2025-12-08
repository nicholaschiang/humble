import { useState, useEffect } from "react";
import {
  followUser,
  unfollowUser,
  isFollowingUser,
} from "@/service/FollowService";
import { useSessionState } from "@/lib/session";

export function useFollowUser(targetUserId: string) {
  const { session } = useSessionState();
  const currentUserId = session?.user.id ?? null;

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Optionally: load initial follow state (great for profile page)
  useEffect(() => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId)
      return;

    let cancelled = false;

    async function fetchStatus() {
      try {
        const following = await isFollowingUser(
          currentUserId as string,
          targetUserId as string,
        );
        if (!cancelled) {
          setIsFollowing(following);
        }
      } catch (err) {
        console.log("Error loading follow status:", err);
      }
    }

    fetchStatus();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, targetUserId]);

  async function follow() {
    if (!currentUserId || !targetUserId) return;

    setLoading(true);
    try {
      await followUser(currentUserId, targetUserId);
      setIsFollowing(true); // optimistic update
    } catch (err) {
      console.log("Follow error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function unfollow() {
    if (!currentUserId || !targetUserId) return;

    setLoading(true);
    try {
      await unfollowUser(currentUserId, targetUserId);
      setIsFollowing(false);
    } catch (err) {
      console.log("Unfollow error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFollow() {
    if (isFollowing) {
      await unfollow();
    } else {
      await follow();
    }
  }

  return {
    isFollowing,
    loading,
    follow,
    unfollow,
    toggleFollow,
  };
}
