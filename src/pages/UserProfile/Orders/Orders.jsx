import React from "react";
import { useUserData } from "../../../contexts/UserDataProvider.js";
import "./Orders.css";

export const Orders = () => {
  const { userDataState } = useUserData();

  return !userDataState.orders?.length ? (
    <div className="orders-container">
      <div className="no-orders">
        <h2>No Orders Yet</h2>
        <p>Your order history will appear here once you make a purchase.</p>
      </div>
    </div>
  ) : (
    <div className="orders-container">
      {userDataState.orders?.map(
        ({
          amountPaid,
          deliveryAddress,
          orderId,
          orderedProducts,
          paymentId,
        }) => (
          <div key={orderId} className="ordered-items-card">
            <div className="order-header">
              <div>
                <div className="order-id-container">
                  <span>Order #{orderId}</span>
                </div>
                <div className="payment-id-container">
                  <span>Payment ID: {paymentId}</span>
                </div>
              </div>
              <div className="price-container">
                <span>Total Amount:</span>
                <span>${amountPaid}</span>
              </div>
            </div>

            <div className="delivery-address">
              <div className="delivery-address-title">Delivery Address</div>
              <div className="delivery-address-content">
                {deliveryAddress?.street}, {deliveryAddress?.state}, {deliveryAddress?.country}
              </div>
            </div>

            <div className="products-container">
              {orderedProducts?.map(
                ({ id, img, name, discounted_price, qty }) => (
                  <div className="products-card" key={id}>
                    <img src={img} alt={name} />
                    <div className="description">
                      <span className="name">{name}</span>
                      <span className="qty">Quantity: {qty}</span>
                      <span className="price">${discounted_price}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
