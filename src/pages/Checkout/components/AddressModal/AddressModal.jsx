import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../../contexts/AuthProvider';
import { countries } from '../../../../data/countries';
import './AddressModal.css';

const validationSchema = Yup.object({
  street: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  city: Yup.string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  state: Yup.string()
    .required('State is required')
    .min(2, 'State must be at least 2 characters'),
  country: Yup.string()
    .required('Country is required'),
  pincode: Yup.string()
    .required('PIN/ZIP code is required')
    .matches(/^(\d{5}(-\d{4})?|\d{6})$/, 'Please enter a valid ZIP code (12345 or 12345-6789) or PIN code (123456)'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format')
});

const AddressModal = ({ isOpen, onClose, onSave, initialAddress }) => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);

  // Ensure initialAddress is properly initialized
  const address = initialAddress || {};

  useEffect(() => {
    if (isOpen) {
      setIsActive(true);
    } else {
      const timer = setTimeout(() => setIsActive(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      name: address.name || user?.displayName || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      country: address.country || 'United States',
      pincode: address.pincode || '',
      phone: address.phone || ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSave(values);
        onClose();
      } catch (error) {
        console.error('Error saving address:', error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleClose = () => {
    setIsActive(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !isActive) return null;

  return (
    <div className={`address-modal-overlay ${isActive ? 'active' : ''}`} onClick={onClose}>
      <div className={`address-modal ${isActive ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="address-modal-header">
          <h2 className="address-modal-title">Shipping Address</h2>
          <button className="address-modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="address-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="error-message">{formik.errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="street">Street Address</label>
            <input
              id="street"
              type="text"
              className={`form-input ${formik.touched.street && formik.errors.street ? 'error' : ''}`}
              {...formik.getFieldProps('street')}
            />
            {formik.touched.street && formik.errors.street && (
              <div className="error-message">{formik.errors.street}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                className={`form-input ${formik.touched.city && formik.errors.city ? 'error' : ''}`}
                {...formik.getFieldProps('city')}
              />
              {formik.touched.city && formik.errors.city && (
                <div className="error-message">{formik.errors.city}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="state">State</label>
              <input
                id="state"
                type="text"
                className={`form-input ${formik.touched.state && formik.errors.state ? 'error' : ''}`}
                {...formik.getFieldProps('state')}
              />
              {formik.touched.state && formik.errors.state && (
                <div className="error-message">{formik.errors.state}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="country">Country</label>
              <select
                id="country"
                className={`form-input ${formik.touched.country && formik.errors.country ? 'error' : ''}`}
                {...formik.getFieldProps('country')}
              >
                <option value="">Select a country</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {formik.touched.country && formik.errors.country && (
                <div className="error-message">{formik.errors.country}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pincode">
                {formik.values.country === 'India' ? 'PIN Code' : 'ZIP Code'}
              </label>
              <input
                id="pincode"
                type="text"
                className={`form-input ${formik.touched.pincode && formik.errors.pincode ? 'error' : ''}`}
                {...formik.getFieldProps('pincode')}
              />
              {formik.touched.pincode && formik.errors.pincode && (
                <div className="error-message">{formik.errors.pincode}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className={`form-input ${formik.touched.phone && formik.errors.phone ? 'error' : ''}`}
              {...formik.getFieldProps('phone')}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="error-message">{formik.errors.phone}</div>
            )}
          </div>

          <div className="address-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
