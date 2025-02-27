import axios from "axios";

export const getAllProducts = async () => {
  try {
    const response = await axios.get("/api/products");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await axios.get(`/api/products/${productId}`);
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axios.get("/api/categories");
    return response;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/api/categories/${categoryId}`);
    return response;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};
