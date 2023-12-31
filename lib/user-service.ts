import axios from 'axios';
import { db } from './db';
import { getSelf } from './auth-service';

interface User {
  username: string;
  bio: string;
  image: File;
}

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
            thumbnail: true,
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
      select: {
        stream: true,
        image: true,
        username: true,
        id: true,
      },
    });

    console.log(user!.image);
    return user;
  } catch (error) {
    throw new Error(`Unexpected Error while trying to retrieve the user ${id}`);
  }
};

export const updateUser = async (values: Partial<User>) => {
  const self = await getSelf();

  console.log(values.username);

  let response;
  try {
    const formData = new FormData();
    formData.append('image', values.image!);
    if (values.username) formData.append('username', values.username);
    if (values.bio) formData.append('bio', values.bio);

    response = await axios.patchForm(
      `http://localhost:5000/api/user/${self.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong, trying to update the user!');
  }

  console.log('after patch');

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const updatedUser = response.data.user;

  return updatedUser;
};
