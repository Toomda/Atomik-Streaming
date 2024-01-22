"use server";

import axios from "axios";

export const getCategories = async () => {
  let result;
  try {
    result = await axios.get(`${process.env.BASE_URL}/category`);
  } catch (error) {
    throw new Error("Error while getting recommended Categories");
  }

  return result.data.categories;
};

export const getCategoriesBySearchTerm = async (searchTerm: string) => {
  let result;
  try {
    result = await axios.get(`${process.env.BASE_URL}/category/search`, {
      data: {
        searchTerm,
      },
    });
  } catch (error) {
    throw new Error("Error while getting Categories!");
  }

  return result.data.categories;
};
