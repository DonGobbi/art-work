import React, { useState } from "react";
import { useUserData } from "../../../../contexts/UserDataProvider.js";
import AddressModal from "../AddressModal/AddressModal";
import { toast } from "react-toastify";
import './AddressSection.css';

export const AddressSection = () => {
  const { userDataState, dispatch } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleSaveAddress = async (addressData) => {
    try {
      // Transform the form data to match your API structure
      const formattedAddress = {
        name: addressData.name,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        pincode: addressData.pincode,
        phone: addressData.phone,
        _id: editingAddress?._id // Preserve ID if editing
      };

      // If editing, update the address, otherwise add new
      const updatedAddresses = editingAddress
        ? (userDataState.addressList || []).map(addr => 
            addr._id === editingAddress._id ? formattedAddress : addr
          )
        : [...(userDataState.addressList || []), { ...formattedAddress, _id: Date.now().toString() }];

      // Update the address list in your state
      dispatch({
        type: "SET_ADDRESS",
        payload: updatedAddresses
      });

      // If this is the first address, set it as the selected address
      if (!userDataState.orderDetails?.orderAddress) {
        dispatch({
          type: "SET_ORDER",
          payload: { orderAddress: formattedAddress }
        });
      }

      toast.success(editingAddress ? "Address updated successfully!" : "New address added successfully!");
      setIsModalOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleEditAddress = (address) => {
    // No need to transform the data structure anymore since we're using the same structure
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  return (
    <div className="address-container">
      <h2 className="section-title">Shipping Address</h2>
      
      {(userDataState.addressList || []).map((address) => {
        const { name, street, city, state, country, pincode, phone, _id } = address;

        return (
          <div key={_id} className="address-card">
            <div className="address-card-content">
              <div className="radio-wrapper">
                <input
                  checked={_id === userDataState.orderDetails?.orderAddress?._id}
                  onChange={() => {
                    dispatch({
                      type: "SET_ORDER",
                      payload: { orderAddress: address },
                    });
                  }}
                  name="address"
                  id={_id}
                  type="radio"
                />
              </div>
              <label htmlFor={_id} className="address-details">
                <h3 className="address-name">{name}</h3>
                <p className="address-text">
                  {street},<br />
                  {city}, {state}, {pincode}<br />
                  {country}
                </p>
                <p className="address-phone">
                  <span className="phone-label">Phone:</span> {phone}
                </p>
              </label>
              <div className="address-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => handleEditAddress(address)}
                  aria-label="Edit address"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => {/* Add delete handler */}}
                  aria-label="Delete address"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="add-new-address-btn-container">
        <button
          className="add-new-address-btn"
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add New Address
        </button>
      </div>

      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
      />
    </div>
  );
};

export default AddressSection;
