import { Response } from "miragejs";

/**
 * All the routes related to Product are present here.
 * These are Publicly accessible routes.
 * */

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/products
 * */

export const getAllProductsHandler = function (schema) {
  try {
    const products = schema.products.all();
    return new Response(200, {}, { products: products.models });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        errors: ["Failed to fetch products"],
      }
    );
  }
};

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/user/products/:productId
 * */

export const getProductHandler = function (schema, request) {
  const productId = request.params.productId;
  try {
    const product = schema.products.findBy({ _id: productId });
    if (!product) {
      return new Response(
        404,
        {},
        { errors: ["Product not found"] }
      );
    }
    return new Response(200, {}, { product });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        errors: ["Failed to fetch product"],
      }
    );
  }
};
