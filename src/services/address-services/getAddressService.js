import axios from "axios";

export const getAddressService = async (token) => {
  return await axios.get(
    "/api/user/address",
    { headers: { authorization: token } }
  );
};
