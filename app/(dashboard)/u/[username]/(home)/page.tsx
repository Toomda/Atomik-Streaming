import { StreamPlayer } from "@/components/stream-player";
import { getUserByUsername } from "@/actions/user";
import { currentUser } from "@/lib/auth";

interface CreatorPageProps {
  params: {
    username: string;
  };
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const loggedInUser = await currentUser();
  const user = await getUserByUsername(params.username);

  if (!user || !user.stream || loggedInUser?.id !== user.id) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full">
      <StreamPlayer
        user={user}
        stream={user.stream}
        isFollowing
        isBanned={false}
      />
    </div>
  );
};

export default CreatorPage;
