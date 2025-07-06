import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, User, LogIn, UserPlus } from 'lucide-react';

function Header({ cartItemCount, onCartClick, isAuthenticated, user, onLoginClick, onSignupClick, onProfileClick }) {
    return (
        <header className="navbar">
            <div className="navbar-container">
                <a href="/" className="navbar-brand">Anime Figures Store</a>
                <nav className="navbar-nav">
                    <a href="#home" className="navbar-link">Home</a>
                    <a href="#products" className="navbar-link">Shop</a>
                    <a href="#contact" className="navbar-link">Contact</a>
                </nav>
                
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="user-button"
                            onClick={onProfileClick}
                        >
                            <User size={20} />
                            <span>Hi, {user?.firstName}</span>
                        </motion.button>
                    ) : (
                        <div className="auth-buttons">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="auth-button login"
                                onClick={onLoginClick}
                            >
                                <LogIn size={18} />
                                Sign In
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="auth-button signup"
                                onClick={onSignupClick}
                            >
                                <UserPlus size={18} />
                                Sign Up
                            </motion.button>
                        </div>
                    )}
                    
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="cart-button"
                        onClick={onCartClick}
                    >
                        <ShoppingCart size={24} />
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </motion.button>
                </div>
            </div>
        </header>
    );
}

export default Header;

