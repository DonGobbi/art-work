import { useState } from "react";
import "./Cart.css";

import { CartListing } from "./components/CartListing/CartListing";
import { Coupons } from "./components/Coupons/Coupons";
import { CartAmountSummary } from "./components/CartAmountSummary/CartAmountSummary";
import { useUserData } from "../../contexts/UserDataProvider.js";
import { useNavigate } from "react-router-dom";
import { useData } from "../../contexts/DataProvider.js";

export const Cart = () => {
  const [couponSelected, setCouponSelected] = useState([]);
  const { userDataState } = useUserData();
  const navigate = useNavigate();
  const { loading } = useData();

  return (
    !loading &&
    (userDataState.cartProducts.length ? (
      <div>
        <h1 className="page-heading">Your Shopping Cart</h1>
        <div className="cart-container">
          <div className="cart-listing">
            <CartListing />
          </div>
          <div className="cart-summary-container">
            <Coupons
              couponSelected={couponSelected}
              setCouponSelected={setCouponSelected}
            />
            <CartAmountSummary couponSelected={couponSelected} />
          </div>
        </div>
      </div>
    ) : (
      <div className="no-items-container">
        <h2 className="page-heading">Your Cart is Empty</h2>
        <p>Ready to discover unique artworks? Start exploring our collection!</p>
        <button
          className="explore-btn"
          onClick={() => navigate("/product-listing")}
        >
          <span>Browse Art Collection</span>
        </button>
      </div>
    ))
  );
};
