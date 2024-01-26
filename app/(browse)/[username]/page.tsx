import { isFollowingUser } from "@/actions/follow";
import { getUserByUsername } from "@/actions/user";
import { notFound } from "next/navigation";
import { StreamPlayer } from "@/components/stream-player";
import { isBannedByUser } from "@/actions/ban";

interface UserPageProps {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUsername(params.username);

  if (!user || !user.stream) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);
  const isBanned = await isBannedByUser(params.username);

  return (
    <StreamPlayer
      user={user}
      stream={user.stream}
      isFollowing={isFollowing}
      isBanned={isBanned}
    />
  );
};

export default UserPage;
