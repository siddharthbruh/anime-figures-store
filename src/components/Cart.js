import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

function Cart({ items, onClose, onRemove, onUpdateQuantity, totalPrice, isOpen, onCheckout }) {
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    const sidebarVariants = {
        hidden: { x: '100%' },
        visible: { 
            x: 0,
            transition: { 
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        },
        exit: { 
            x: '100%',
            transition: { 
                type: 'spring',
                stiffness: 400,
                damping: 40
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0,
            x: -20,
            transition: { duration: 0.2 }
        }
    };

    const handleCheckout = () => {
        toast.success('Checkout feature coming soon!', {
            icon: '🚀',
            style: {
                borderRadius: '12px',
                background: 'var(--surface-primary)',
                color: 'var(--gray-900)',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-lg)'
            }
        });
    };

    const handleRemove = (itemId, itemName) => {
        onRemove(itemId);
        toast.success(`Removed ${itemName} from cart`, {
            icon: '🗑️',
            style: {
                borderRadius: '12px',
                background: 'var(--surface-primary)',
                color: 'var(--gray-900)',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-lg)'
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="cart-overlay"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                >
                    <motion.div
                        className="cart-sidebar"
                        variants={sidebarVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="cart-header">
                            <h2 className="cart-title">Shopping Cart</h2>
                            <motion.button
                                className="cart-close"
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={24} />
                            </motion.button>
                        </div>

                        <div className="cart-content">
                            <AnimatePresence>
                                {items.length === 0 ? (
                                    <motion.div
                                        className="cart-empty"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <ShoppingBag size={64} style={{ color: 'var(--gray-300)', marginBottom: '1rem' }} />
                                        <h3 style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>Your cart is empty</h3>
                                        <p style={{ color: 'var(--gray-500)' }}>Add some amazing anime figures to get started!</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        {items.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                className="cart-item"
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="cart-item-image"
                                                />
                                                <div className="cart-item-info">
                                                    <h3 className="cart-item-name">{item.name}</h3>
                                                    <p className="cart-item-anime">{item.anime}</p>
                                                    <p className="cart-item-price">${item.price}</p>
                                                </div>
                                                <div className="cart-item-controls">
                                                    <motion.button
                                                        className="remove-btn"
                                                        onClick={() => handleRemove(item.id, item.name)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </motion.button>
                                                    <div className="quantity-controls">
                                                        <motion.button
                                                            className="quantity-btn"
                                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={14} />
                                                        </motion.button>
                                                        <span className="quantity-value">{item.quantity}</span>
                                                        <motion.button
                                                            className="quantity-btn"
                                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Plus size={14} />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        {items.length > 0 && (
                            <motion.div
                                className="cart-footer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="cart-total">
                                    <span>Total:</span>
                                    <span style={{ 
                                        background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>
                                <motion.button
                                    className="checkout-btn"
                                    onClick={() => {
                                        onClose();
                                        onCheckout();
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Proceed to Checkout
                                </motion.button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Cart;
