'use server';

import { IngressClient, RoomServiceClient } from 'livekit-server-sdk';

import { getSelf } from '@/lib/auth-service';
import { revalidatePath } from 'next/cache';
import axios from 'axios';

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

export const resetIngresses = async (hostIdentiy: string) => {
  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentiy,
  });

  const rooms = await roomService.listRooms([hostIdentiy]);

  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
};

export const createIngress = async () => {
  const self = await getSelf();

  console.log(self.token);

  let response;
  try {
    response = await axios.get(
      `http://localhost:5000/api/streamkey/generate/${self.id}`,
      {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      }
    );
  } catch (error) {}

  if (!response || !response.data || response.status !== 200) {
    throw new Error('An unexpected Error occured!');
  }

  console.log(response.data);

  revalidatePath(`/u/${self.username}/keys`);

  return '';
};
