import { v4 as uuid } from "uuid";
import { formatDate } from "../utils/authUtils";

export const users = [
  {
    _id: uuid(),
    firstName: "Test",
    lastName: "User",
    email: "test@gmail.com",
    password: "test123",
    createdAt: formatDate(),
    updatedAt: formatDate(),
    cart: [],
    wishlist: [],
    addressList: [],
  },
];
