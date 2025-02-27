import { Response } from "miragejs";
import { categories } from "../db/categories";

/**
 * All the routes related to Category are present here.
 * These are Publicly accessible routes.
 * */

/**
 * This handler handles gets all categories in the db.
 * send GET Request at /api/categories
 * */

export const getAllCategoriesHandler = function (schema) {
  try {
    const categories = schema.categories.all();
    return new Response(200, {}, { categories: categories.models });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        errors: ["Failed to fetch categories"],
      }
    );
  }
};

/**
 * This handler handles gets all categories in the db.
 * send GET Request at /api/user/category/:categoryId
 * */

export const getCategoryHandler = function (schema, request) {
  const categoryId = request.params.categoryId;
  try {
    const category = schema.categories.findBy({ _id: categoryId });
    if (!category) {
      return new Response(
        404,
        {},
        { errors: ["Category not found"] }
      );
    }
    return new Response(200, {}, { category });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        errors: ["Failed to fetch category"],
      }
    );
  }
};
