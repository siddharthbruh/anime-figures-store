import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Edit, Save, X, Package, Heart, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Profile({ onClose }) {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
    
    setIsLoading(false);
  };

  const handleCancelEdit = () => {
    setFormData({
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
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const ProfileTab = () => (
    <div className="profile-tab">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <User size={40} />
          </div>
          <div className="profile-info">
            <h2>{user?.firstName} {user?.lastName}</h2>
            <p>{user?.email}</p>
          </div>
        </div>
        
        <button
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X size={20} /> : <Edit size={20} />}
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Address</h3>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <div className="loading-spinner" /> : <Save size={20} />}
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );

  const OrdersTab = () => (
    <div className="orders-tab">
      <h3>Order History</h3>
      <div className="orders-list">
        <div className="order-item">
          <div className="order-info">
            <h4>Order #12345</h4>
            <p>Placed on January 15, 2024</p>
            <span className="order-status delivered">Delivered</span>
          </div>
          <div className="order-total">$189.99</div>
        </div>
        
        <div className="order-item">
          <div className="order-info">
            <h4>Order #12344</h4>
            <p>Placed on January 10, 2024</p>
            <span className="order-status shipped">Shipped</span>
          </div>
          <div className="order-total">$94.99</div>
        </div>
        
        <div className="order-item">
          <div className="order-info">
            <h4>Order #12343</h4>
            <p>Placed on January 5, 2024</p>
            <span className="order-status processing">Processing</span>
          </div>
          <div className="order-total">$259.99</div>
        </div>
      </div>
    </div>
  );

  const FavoritesTab = () => (
    <div className="favorites-tab">
      <h3>Favorites</h3>
      <div className="favorites-grid">
        <div className="favorite-item">
          <img src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200" alt="Favorite" />
          <div className="favorite-info">
            <h4>Nezuko Kamado Figure</h4>
            <p>$89.99</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="settings-tab">
      <h3>Account Settings</h3>
      
      <div className="setting-section">
        <h4>Change Password</h4>
        <form className="password-form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Password
          </button>
        </form>
      </div>

      <div className="setting-section">
        <h4>Account Actions</h4>
        <button 
          className="btn btn-danger"
          onClick={logout}
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      className="profile-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="profile-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-header-bar">
          <h2>My Account</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <nav className="profile-nav">
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                Profile
              </button>
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={20} />
                Orders
              </button>
              <button
                className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                <Heart size={20} />
                Favorites
              </button>
              <button
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings size={20} />
                Settings
              </button>
            </nav>
          </div>

          <div className="profile-main">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'favorites' && <FavoritesTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Profile;
