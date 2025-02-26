import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './AddressModal.css';

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  addressLine1: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  city: Yup.string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters'),
  state: Yup.string()
    .required('State is required')
    .min(2, 'State must be at least 2 characters'),
  zipCode: Yup.string()
    .required('ZIP code is required')
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\+?[\d\s-]{10,}$/, 'Invalid phone number format')
});

const AddressModal = ({ isOpen, onClose, onSave, initialAddress = {} }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsActive(true), 10);
    } else {
      setIsActive(false);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formik = useFormik({
    initialValues: {
      fullName: initialAddress.fullName || '',
      addressLine1: initialAddress.addressLine1 || '',
      addressLine2: initialAddress.addressLine2 || '',
      city: initialAddress.city || '',
      state: initialAddress.state || '',
      zipCode: initialAddress.zipCode || '',
      phone: initialAddress.phone || ''
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

  if (!isOpen) return null;

  return (
    <div className={`address-modal-overlay ${isActive ? 'active' : ''}`}>
      <div className={`address-modal ${isActive ? 'active' : ''}`}>
        <div className="address-modal-header">
          <h2 className="address-modal-title">Shipping Address</h2>
          <button className="address-modal-close" onClick={handleClose}>×</button>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="address-form">
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              className={`form-input ${formik.touched.fullName && formik.errors.fullName ? 'error' : ''}`}
              {...formik.getFieldProps('fullName')}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="error-message">{formik.errors.fullName}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="addressLine1">Address Line 1</label>
            <input
              id="addressLine1"
              type="text"
              className={`form-input ${formik.touched.addressLine1 && formik.errors.addressLine1 ? 'error' : ''}`}
              {...formik.getFieldProps('addressLine1')}
            />
            {formik.touched.addressLine1 && formik.errors.addressLine1 && (
              <div className="error-message">{formik.errors.addressLine1}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="addressLine2">Address Line 2 (Optional)</label>
            <input
              id="addressLine2"
              type="text"
              className="form-input"
              {...formik.getFieldProps('addressLine2')}
            />
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
              <label className="form-label" htmlFor="zipCode">ZIP Code</label>
              <input
                id="zipCode"
                type="text"
                className={`form-input ${formik.touched.zipCode && formik.errors.zipCode ? 'error' : ''}`}
                {...formik.getFieldProps('zipCode')}
              />
              {formik.touched.zipCode && formik.errors.zipCode && (
                <div className="error-message">{formik.errors.zipCode}</div>
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
