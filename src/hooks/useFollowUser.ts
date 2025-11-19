import { useState, useEffect } from "react";
import {
  followUser,
  unfollowUser,
  isFollowingUser,
} from "@/service/FollowService";
//import { useAuth } from "@/hooks/useAuth"; // or whatever you use to get current user

export function useFollowUser(targetUserId: string) {
  //   const { user } = useAuth(); // adjust to your actual auth hook/context
  //   const currentUserId = user?.id ?? null;
  const currentUserId = "2efcbe2e-ff99-4ed0-81e4-bd413a1d2d01"; // TODO: Replace with actual logged-in user ID

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Optionally: load initial follow state (great for profile page)
  useEffect(() => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId)
      return;

    let cancelled = false;

    async function fetchStatus() {
      try {
        const following = await isFollowingUser(currentUserId, targetUserId);
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
