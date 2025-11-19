// components/FollowButton.tsx
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useFollowUser } from "@/hooks/useFollowUser";

type FollowButtonProps = {
  targetUserId: string;
  className?: string;
};

export function FollowButton({ targetUserId, className }: FollowButtonProps) {
  const { isFollowing, loading, toggleFollow } = useFollowUser(targetUserId);

  const baseClasses = "rounded-full px-4";
  const stateClasses = isFollowing ? "bg-muted border border-border" : "bg-green-700";

  return (
    <Button
      size="sm"
      disabled={loading}
      className={`${baseClasses} ${stateClasses} ${className ?? ""}`}
      onPress={toggleFollow}
    >
      <Text className="font-semibold">
        {isFollowing ? "Following" : "Follow"}
      </Text>
    </Button>
  );
}
