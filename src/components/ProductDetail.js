import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Heart, Plus, Minus, Truck, Shield, RefreshCw } from 'lucide-react';

function ProductDetail({ product, onClose, onAddToCart, isFavorite, onToggleFavorite }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const images = product.images || [product.image, product.image, product.image];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
  };

  const StarRating = ({ rating, reviews }) => (
    <div className="product-rating">
      <div className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={20}
            className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
            style={{
              fill: i < Math.floor(rating) ? 'currentColor' : 'none',
              opacity: i < Math.floor(rating) ? 1 : 0.3
            }}
          />
        ))}
      </div>
      <span className="rating-text">({reviews} reviews)</span>
    </div>
  );

  return (
    <motion.div
      className="product-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="product-detail-modal"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product-detail-header">
          <button className="back-button" onClick={onClose}>
            <ArrowLeft size={24} />
            Back to Products
          </button>
        </div>

        <div className="product-detail-content">
          <div className="product-detail-images">
            <div className="main-image">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="product-main-image"
              />
              {product.category === 'Limited Edition' && (
                <div className="product-badge">Limited Edition</div>
              )}
              {product.stock === 0 && (
                <div className="out-of-stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
            
            <div className="thumbnail-images">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="product-detail-info">
            <div className="product-meta">
              <span className="product-category">{product.category}</span>
              <span className="product-anime">{product.anime}</span>
            </div>

            <h1 className="product-detail-title">{product.name}</h1>
            
            <StarRating rating={product.rating} reviews={product.reviews} />

            <div className="product-price">
              <span className="current-price">${product.price}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
            </div>

            <div className="stock-info">
              <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || `Beautiful ${product.name} figure from ${product.anime}. This high-quality collectible features incredible detail and craftsmanship, perfect for any anime fan's collection.`}</p>
            </div>

            <div className="specifications">
              <h3>Specifications</h3>
              <div className="spec-grid">
                <div className="spec-item">
                  <span className="spec-label">Scale</span>
                  <span className="spec-value">1/7 Scale</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Height</span>
                  <span className="spec-value">~25cm</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Material</span>
                  <span className="spec-value">PVC & ABS</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Manufacturer</span>
                  <span className="spec-value">Premium Figures Co.</span>
                </div>
              </div>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    disabled={quantity >= (product.stock || 10)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <motion.button
                  className="btn btn-primary add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart size={20} />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </motion.button>

                <motion.button
                  className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                  onClick={() => onToggleFavorite(product.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={20} style={{ fill: isFavorite ? 'currentColor' : 'none' }} />
                </motion.button>
              </div>
            </div>

            <div className="shipping-info">
              <div className="shipping-item">
                <Truck size={20} />
                <div>
                  <strong>Free Shipping</strong>
                  <span>On orders over $75</span>
                </div>
              </div>
              <div className="shipping-item">
                <Shield size={20} />
                <div>
                  <strong>Authenticity Guaranteed</strong>
                  <span>100% genuine products</span>
                </div>
              </div>
              <div className="shipping-item">
                <RefreshCw size={20} />
                <div>
                  <strong>30-Day Returns</strong>
                  <span>Easy returns & exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProductDetail;
