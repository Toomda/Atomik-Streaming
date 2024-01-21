"use server";

import axios from "axios";

export const getCategories = async () => {
  let result;
  try {
    result = await axios.get("http://localhost:5000/api/category");
  } catch (error) {
    throw new Error("Error while getting recommended Categories");
  }

  return result.data.categories;
};

export const getCategoriesBySearchTerm = async (searchTerm: string) => {
  let result;
  try {
    result = await axios.get("http://localhost:5000/api/category/search", {
      data: {
        searchTerm,
      },
    });
  } catch (error) {
    throw new Error("Error while getting Categories!");
  }

  return result.data.categories;
};
