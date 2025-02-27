import { v4 as uuid } from "uuid";
import { Response } from "miragejs";
import { formatDate } from "../utils/authUtils";
const jwt_encode = require('jwt-encode');

/**
 * All the routes related to Auth are present here.
 * These are Publicly accessible routes.
 * */

/**
 * This handler handles user signup.
 * send POST Request at /api/auth/signup
 * body contains {firstName, lastName, email, password}
 * */

export const signupHandler = function (schema, request) {
  const { email, password, ...rest } = JSON.parse(request.requestBody);
  try {
    // check if email already exists
    const foundUser = schema.users.findBy({ email });
    if (foundUser) {
      return new Response(
        422,
        {},
        {
          errors: ["Email already exists."],
        }
      );
    }
    const _id = uuid();
    const newUser = {
      _id,
      email,
      password,
      createdAt: formatDate(),
      updatedAt: formatDate(),
      ...rest,
      cart: [],
      wishlist: [],
      addressList: [],
    };
    const createdUser = schema.users.create(newUser);
    const encodedToken = jwt_encode({ _id, email }, "secret");
    return new Response(201, {}, { createdUser, encodedToken });
  } catch (error) {
    return new Response(
      500,
      {},
      {
        error,
      }
    );
  }
};

/**
 * This handler handles user login.
 * send POST Request at /api/auth/login
 * body contains {email, password}
 * */

export const loginHandler = function (schema, request) {
  const { email, password } = JSON.parse(request.requestBody);
  try {
    const foundUser = schema.users.findBy({ email });
    if (!foundUser) {
      return new Response(
        404,
        {},
        { errors: ["Email not registered. Please sign up."] }
      );
    }
    if (password === foundUser.password) {
      const encodedToken = jwt_encode(
        { _id: foundUser._id, email },
        "secret"
      );
      const sanitizedUser = { ...foundUser.attrs };
      delete sanitizedUser.password;
      return new Response(200, {}, { foundUser: sanitizedUser, encodedToken });
    }
    return new Response(
      401,
      {},
      {
        errors: [
          "The credentials you entered are invalid.",
        ],
      }
    );
  } catch (error) {
    return new Response(
      500,
      {},
      {
        errors: ["Something went wrong. Please try again later."],
      }
    );
  }
};
