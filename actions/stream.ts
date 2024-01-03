'use server';

import { revalidatePath } from 'next/cache';
import { Stream } from '@prisma/client';

import { getSelf } from '@/lib/auth-service';
import axios from 'axios';

export const updateStream = async (values: Partial<Stream>) => {
  const self = await getSelf();

  let response;
  response = await axios
    .post(
      `http://localhost:5000/api/livestreams/${self.id}`,
      {
        thumbnail: values.thumbnail,
        name: values.name,
        isChatDelayed: values.isChatDelayed,
        isChatEnabled: values.isChatEnabled,
        isChatFollowersOnly: values.isChatFollowersOnly,
      },
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    )
    .catch((err) => {
      console.log(err.response.status);
      console.log(err.response.statusText);
      throw new Error(err.response.statusText);
    });

  revalidatePath(`/u/${self.username}/chat`);
  revalidatePath(`/u/${self.username}`);
  revalidatePath(`/${self.username}`);
  revalidatePath(`/`);

  return response.data.stream;
};
