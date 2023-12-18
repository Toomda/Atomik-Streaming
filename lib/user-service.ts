import { db } from "./db";

export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        image: true,
        stream: {
          select: {
            id: true,
            isLive: true,
            isChatDelayed: true,
            isChatEnabled: true,
            isChatFollowersOnly: true,
            thumbnailUrl: true,
            name: true,
          },
        },
        _count: {
          select: {
            followedBy: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    throw new Error(
      `Unexpected Error while trying to retrieve the user ${username}`
    );
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
      include: {
        stream: true,
      },
    });

    return user;
  } catch (error) {
    throw new Error(`Unexpected Error while trying to retrieve the user ${id}`);
  }
};
