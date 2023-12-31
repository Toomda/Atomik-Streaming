'use server';

import { revalidatePath } from 'next/cache';

import axios from 'axios';
import { getSelf } from '@/lib/auth-service';

export const onFollow = async (id: string) => {
  const self = await getSelf();

  try {
    const response = await axios
      .post(`http://localhost:5000/api/user/follow/${id}`, null, {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      })
      .catch((err) => {
        throw new Error(err.response.statusText);
      });

    console.log('after post request');

    revalidatePath('/');
    if (response.data.followed) {
      revalidatePath(`/${response.data.followed}`);
    }

    console.log('after revalidating');
    console.log(response.data);
    return response.data.followed;
  } catch (error) {
    throw new Error('Internal Error');
  }
};

export const onUnfollow = async (id: string) => {
  const self = await getSelf();

  try {
    const response = await axios
      .post(`http://localhost:5000/api/user/unfollow/${id}`, null, {
        headers: {
          Authorization: `Bearer ${self.token}`,
        },
      })
      .catch((err) => {
        throw new Error(err.response.statusText);
      });

    revalidatePath('/');
    if (response.data.followed) {
      revalidatePath(`/${response.data.followed}`);
    }

    return response.data.followed;
  } catch (error) {
    throw new Error('Internal Error');
  }
};
