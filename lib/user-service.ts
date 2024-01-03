import axios from 'axios';

export const getUserByUsername = async (username: string) => {
  let response;
  try {
    response = await axios.get(
      `http://localhost:5000/api/user/username/${username}`
    );
  } catch (error) {
    throw new Error(
      `Unexpected Error while trying to retrieve the user ${username}`
    );
  }

  return response.data.user;
};

export const getUserById = async (id: string) => {
  let response;
  try {
    response = await axios.get(`http://localhost:5000/api/user/${id}`);
  } catch (error) {
    throw new Error(`Unexpected Error while trying to retrieve the user ${id}`);
  }

  return response.data.user;
};
