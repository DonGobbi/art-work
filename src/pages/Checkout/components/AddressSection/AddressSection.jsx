import "./AddressSection.css";
import React, { useState } from "react";
import { useUserData } from "../../../../contexts/UserDataProvider.js";
import AddressModal from "../AddressModal/AddressModal";
import { toast } from "react-hot-toast";

export const AddressSection = () => {
  const { userDataState, dispatch } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleSaveAddress = async (addressData) => {
    try {
      // Transform the form data to match your API structure
      const formattedAddress = {
        name: addressData.fullName,
        street: addressData.addressLine1,
        city: addressData.city,
        state: addressData.state,
        country: "United States", // Default to US or make this configurable
        pincode: addressData.zipCode,
        phone: addressData.phone,
        _id: editingAddress?._id // Preserve ID if editing
      };

      // If editing, update the address, otherwise add new
      const updatedAddresses = editingAddress
        ? userDataState.addressList.map(addr => 
            addr._id === editingAddress._id ? formattedAddress : addr
          )
        : [...userDataState.addressList, { ...formattedAddress, _id: Date.now().toString() }];

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
      setEditingAddress(null);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress({
      fullName: address.name,
      addressLine1: address.street,
      addressLine2: "",
      city: address.city,
      state: address.state,
      zipCode: address.pincode,
      phone: address.phone
    });
    setIsModalOpen(true);
  };

  return (
    <div className="address-container">
      <h2 className="section-title">Shipping Address</h2>
      
      {userDataState.addressList?.map((address) => {
        const { name, street, city, state, country, pincode, phone, _id } = address;

        return (
          <div key={_id} className="address-card">
            <div className="address-card-header">
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
              <label htmlFor={_id} className="address-label">
                <p className="name">{name}</p>
                <p className="address">
                  {street}, {city}, {state}, {country} {pincode}
                </p>
                <p className="phone">{phone}</p>
              </label>
            </div>
            <button 
              className="edit-address-btn"
              onClick={() => handleEditAddress(address)}
            >
              Edit
            </button>
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
