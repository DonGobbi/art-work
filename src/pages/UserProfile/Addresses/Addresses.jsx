import React, { useState } from "react";
import { useAddress } from "../../../contexts/AddressProvider";
import "./Addresses.css";

export const Addresses = () => {
  const { addresses } = useAddress();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="addresses-container">
      <div className="addresses-header">
        <h2>Saved Addresses</h2>
        <p>Manage your delivery addresses</p>
      </div>

      <div className="add-address-container">
        <button className="add-address-btn" onClick={() => setShowModal(true)}>
          <span className="plus">+</span>
          Add New Address
        </button>
      </div>

      {addresses?.length > 0 ? (
        <div className="addresses-grid">
          {addresses.map((address, index) => (
            <div key={index} className="address-card">
              <div className="recipient-name">{address.name}</div>
              <div className="address-details">
                {address.street}<br />
                {address.city}, {address.state} {address.zipCode}<br />
                Phone: {address.phone}
              </div>
              <div className="address-actions">
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-addresses">
          <h2>No Addresses Added</h2>
          <p>Add a new address to get started with your shopping experience.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {/* Modal content will be added here */}
          </div>
        </div>
      )}
    </div>
  );
};
