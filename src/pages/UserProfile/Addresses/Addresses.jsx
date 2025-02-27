import React, { useState, useEffect } from "react";
import { useAddress } from "../../../contexts/AddressProvider";
import { useAuth } from "../../../contexts/AuthProvider";
import { addAddressService } from "../../../services/address-services/addAddressService";
import { getAddressService } from "../../../services/address-services/getAddressService";
import { useUserData } from "../../../contexts/UserDataProvider";
import { toast } from "react-toastify";
import { countries } from "../../../data/countries";
import "./Addresses.css";

export const Addresses = () => {
  const { auth } = useAuth();
  const { dispatch } = useUserData();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddressService(auth.token);
        if (response.status === 200) {
          setAddresses(response.data.addressList);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to load addresses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [auth.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.country) {
      toast.error("Please select a country");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const addressData = {
        name: formData.name,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipCode,
        phone: formData.phone,
        country: formData.country
      };

      const response = await addAddressService(addressData, auth.token);
      
      if (response.status === 200 || response.status === 201) {
        setAddresses(response.data.addressList);
        dispatch({ type: "SET_ADDRESS", payload: response.data.addressList });
        toast.success("Address added successfully!");
        setShowModal(false);
        setFormData({
          name: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        });
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(error.response?.data?.message || "Failed to add address. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (addressId) => {
    // Implement delete functionality
    console.log("Delete address:", addressId);
  };

  const handleEdit = (address) => {
    // Implement edit functionality
    console.log("Edit address:", address);
  };

  if (isLoading) {
    return (
      <div className="addresses-container">
        <div className="addresses-header">
          <h2>Saved Addresses</h2>
          <p>Loading your addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="addresses-container">
      <div className="addresses-header">
        <h2>Saved Addresses</h2>
        <p>Manage your delivery addresses</p>
      </div>

      <button className="add-address-btn" onClick={() => setShowModal(true)}>
        <span className="plus">+</span>
        Add New Address
      </button>

      {addresses?.length > 0 ? (
        addresses.map((address) => (
          <div key={address._id} className="address-card">
            <div className="recipient-name">{address.name}</div>
            <div className="address-details">
              {address.street},<br />
              {address.city}, {address.state} {address.pincode}
            </div>
            <div className="phone-details">
              Phone: {address.phone}
            </div>
            <div className="address-actions">
              <button className="edit-btn" onClick={() => handleEdit(address)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(address._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-addresses">
          <h2>No Addresses Added</h2>
          <p>Add a new address to get started with your shopping experience.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            <div className="modal-header">
              <h3>Add New Address</h3>
            </div>
            <form className="address-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">{formData.country === 'India' ? 'PIN Code' : 'ZIP Code'}</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder={formData.country === 'India' ? 'Enter PIN code' : 'Enter ZIP code'}
                  required
                  pattern={formData.country === 'India' ? '[0-9]{6}' : '[0-9]{5}(-[0-9]{4})?'}
                  title={formData.country === 'India' ? 'Please enter a valid 6-digit PIN code' : 'Please enter a valid ZIP code (12345 or 12345-6789)'}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Adding Address...
                    </>
                  ) : (
                    <>
                      <span>Save Address</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
