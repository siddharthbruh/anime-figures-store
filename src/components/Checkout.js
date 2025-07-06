import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Check, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

function Checkout({ cartItems, totalPrice, onClose, onOrderComplete }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || 'United States'
    }
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      sameAsShipping: true,
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });

  const [orderSummary] = useState({
    subtotal: totalPrice,
    shipping: totalPrice > 75 ? 0 : 9.99,
    tax: totalPrice * 0.08,
    total: totalPrice + (totalPrice > 75 ? 0 : 9.99) + (totalPrice * 0.08)
  });

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setShippingInfo(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setShippingInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentChange = useCallback((e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'sameAsShipping') {
      setPaymentInfo(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          sameAsShipping: checked,
          ...(checked ? {
            street: shippingInfo.address.street,
            city: shippingInfo.address.city,
            state: shippingInfo.address.state,
            zipCode: shippingInfo.address.zipCode,
            country: shippingInfo.address.country
          } : {})
        }
      }));
    } else if (name.startsWith('billingAddress.')) {
      const addressField = name.split('.')[1];
      setPaymentInfo(prev => ({
        ...prev,
        billingAddress: { ...prev.billingAddress, [addressField]: value }
      }));
    } else {
      let formattedValue = value;
      
      // Simple formatting without complex logic
      if (name === 'cardNumber') {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 16) {
          formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        } else {
          return;
        }
      } else if (name === 'expiryDate') {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 4) {
          if (digits.length >= 2) {
            formattedValue = digits.slice(0, 2) + '/' + digits.slice(2, 4);
          } else {
            formattedValue = digits;
          }
        } else {
          return;
        }
      } else if (name === 'cvv') {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 4) {
          formattedValue = digits;
        } else {
          return;
        }
      }
      
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    }
  }, [shippingInfo.address]);

  const validateStep = (step) => {
    if (step === 1) {
      return shippingInfo.firstName && shippingInfo.lastName && 
             shippingInfo.email && shippingInfo.address.street &&
             shippingInfo.address.city && shippingInfo.address.state &&
             shippingInfo.address.zipCode;
    }
    if (step === 2) {
      return paymentInfo.cardNumber && paymentInfo.expiryDate &&
             paymentInfo.cvv && paymentInfo.cardholderName;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep(2)) {
      toast.error('Please complete payment information');
      return;
    }

    setIsLoading(true);
    
    try {
      // Format card number safely
      const cardNumber = paymentInfo.cardNumber.replace(/\s/g, ''); // Remove spaces
      const maskedCardNumber = cardNumber.length >= 4 
        ? '**** **** **** ' + cardNumber.slice(-4)
        : '**** **** **** ****';

      const orderData = {
        items: cartItems,
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: maskedCardNumber
        },
        orderSummary,
        userId: user?.id
      };

      const response = await apiService.orders.create(orderData);
      
      toast.success('Order placed successfully!', {
        icon: '🎉',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });

      onOrderComplete(response.data.data);
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const ShippingStep = () => (
    <div className="checkout-step">
      <h3>Shipping Information</h3>
      
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={shippingInfo.firstName}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={shippingInfo.lastName}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={shippingInfo.email}
            onChange={handleShippingChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleShippingChange}
          />
        </div>

        <div className="form-group">
          <label>Street Address *</label>
          <input
            type="text"
            name="address.street"
            value={shippingInfo.address.street}
            onChange={handleShippingChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="address.city"
              value={shippingInfo.address.city}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="address.state"
              value={shippingInfo.address.state}
              onChange={handleShippingChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ZIP Code *</label>
            <input
              type="text"
              name="address.zipCode"
              value={shippingInfo.address.zipCode}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="checkout-step">
      <h3>Payment Information</h3>
      
      <div className="form-section">
        <div className="form-group">
          <label>Cardholder Name *</label>
          <input
            type="text"
            name="cardholderName"
            value={paymentInfo.cardholderName || ''}
            onChange={handlePaymentChange}
            placeholder="Enter cardholder name"
            autoComplete="cc-name"
            style={{ width: '100%' }}
            required
          />
        </div>

        <div className="form-group">
          <label>Card Number *</label>
          <input
            type="text"
            name="cardNumber"
            value={paymentInfo.cardNumber || ''}
            onChange={handlePaymentChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            autoComplete="cc-number"
            style={{ width: '100%' }}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date *</label>
            <input
              type="text"
              name="expiryDate"
              value={paymentInfo.expiryDate || ''}
              onChange={handlePaymentChange}
              placeholder="MM/YY"
              maxLength="5"
              autoComplete="cc-exp"
              style={{ width: '100%' }}
              required
            />
          </div>
          <div className="form-group">
            <label>CVV *</label>
            <input
              type="text"
              name="cvv"
              value={paymentInfo.cvv || ''}
              onChange={handlePaymentChange}
              placeholder="123"
              maxLength="4"
              autoComplete="cc-csc"
              style={{ width: '100%' }}
              required
            />
          </div>
        </div>

        <div className="billing-address">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="sameAsShipping"
              name="sameAsShipping"
              checked={paymentInfo.billingAddress.sameAsShipping}
              onChange={handlePaymentChange}
            />
            <label htmlFor="sameAsShipping">Billing address same as shipping</label>
          </div>

          {!paymentInfo.billingAddress.sameAsShipping && (
            <div className="billing-form">
              <h4>Billing Address</h4>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="billingAddress.street"
                  value={paymentInfo.billingAddress.street}
                  onChange={handlePaymentChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="billingAddress.city"
                    value={paymentInfo.billingAddress.city}
                    onChange={handlePaymentChange}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="billingAddress.state"
                    value={paymentInfo.billingAddress.state}
                    onChange={handlePaymentChange}
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="billingAddress.zipCode"
                    value={paymentInfo.billingAddress.zipCode}
                    onChange={handlePaymentChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ReviewStep = () => (
    <div className="checkout-step">
      <h3>Review Order</h3>
      
      <div className="review-sections">
        <div className="review-section">
          <h4>Shipping Information</h4>
          <div className="review-info">
            <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p>{shippingInfo.email}</p>
            <p>{shippingInfo.address.street}</p>
            <p>{shippingInfo.address.city}, {shippingInfo.address.state} {shippingInfo.address.zipCode}</p>
          </div>
        </div>

        <div className="review-section">
          <h4>Payment Method</h4>
          <div className="review-info">
            <p>**** **** **** {paymentInfo.cardNumber.replace(/\s/g, '').slice(-4) || '****'}</p>
            <p>{paymentInfo.cardholderName}</p>
          </div>
        </div>

        <div className="review-section">
          <h4>Order Items</h4>
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h5>{item.name}</h5>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="checkout-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="checkout-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="checkout-header">
          <button className="back-button" onClick={onClose}>
            <ArrowLeft size={24} />
            Back
          </button>
          <h2>Checkout</h2>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            <div className="checkout-progress">
              <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-icon">
                  {currentStep > 1 ? <Check size={20} /> : <Truck size={20} />}
                </div>
                <span>Shipping</span>
              </div>
              <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-icon">
                  {currentStep > 2 ? <Check size={20} /> : <CreditCard size={20} />}
                </div>
                <span>Payment</span>
              </div>
              <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-icon">
                  <Check size={20} />
                </div>
                <span>Review</span>
              </div>
            </div>

            {currentStep === 1 && <ShippingStep />}
            {currentStep === 2 && renderPaymentStep()}
            {currentStep === 3 && <ReviewStep />}

            <div className="checkout-actions">
              {currentStep > 1 && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                  disabled={!validateStep(currentStep)}
                >
                  Continue
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                >
                  {isLoading ? <div className="loading-spinner" /> : 'Place Order'}
                </button>
              )}
            </div>
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{orderSummary.shipping === 0 ? 'Free' : `$${orderSummary.shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {orderSummary.shipping === 0 && (
                <div className="free-shipping-notice">
                  🎉 You qualify for free shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Checkout;
