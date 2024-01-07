import { getSelf } from '@/lib/./auth-service';
import axios from 'axios';

export const getFollowedUsers = async () => {
  let self;
  try {
    self = await getSelf();
  } catch (error) {
    return [];
  }

  let response;
  try {
    response = await axios.get('http://localhost:5000/api/user/follow/all', {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    return [];
  }
  return response.data.followedUsers;
};

export const isFollowingUser = async (id: string) => {
  let response;
  try {
    const self = await getSelf();

    response = await axios.get(`http://localhost:5000/api/user/follow/${id}`, {
      headers: {
        Authorization: `Bearer ${self.token}`,
      },
    });
  } catch (error) {
    return false;
  }
  return response.status === 200;
};
