import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Company Info */}
                    <div className="footer-section">
                        <h3>Anime Figures Store</h3>
                        <p>
                            Your premier destination for high-quality anime figures and collectibles. 
                            We curate the finest pieces from top manufacturers worldwide.
                        </p>
                        <div style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            color: 'var(--gray-400)',
                            marginTop: '1rem'
                        }}>
                            <span>Made with</span>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{margin: '0 0.5rem'}}
                            >
                                <Heart size={16} style={{color: 'var(--secondary-400)'}} />
                            </motion.div>
                            <span>by anime enthusiasts</span>
                        </div>
                        
                        {/* Social Links */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '1.5rem'
                        }}>
                            <motion.a 
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -2 }}
                                style={{ color: 'var(--gray-400)' }}
                                aria-label="Visit our GitHub"
                            >
                                <Github size={20} />
                            </motion.a>
                            <motion.a 
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -2 }}
                                style={{ color: 'var(--gray-400)' }}
                                aria-label="Follow us on Twitter"
                            >
                                <Twitter size={20} />
                            </motion.a>
                            <motion.a 
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1, y: -2 }}
                                style={{ color: 'var(--gray-400)' }}
                                aria-label="Follow us on Instagram"
                            >
                                <Instagram size={20} />
                            </motion.a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <ul className="footer-links">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#products">Shop</a></li>
                            <li><a href="#new-arrivals">New Arrivals</a></li>
                            <li><a href="#pre-orders">Pre-orders</a></li>
                            <li><a href="#sale">Sale</a></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="footer-section">
                        <h3>Categories</h3>
                        <ul className="footer-links">
                            <li><a href="#premium-figures">Premium Figures</a></li>
                            <li><a href="#limited-edition">Limited Edition</a></li>
                            <li><a href="#nendoroids">Nendoroids</a></li>
                            <li><a href="#scale-figures">Scale Figures</a></li>
                            <li><a href="#action-figures">Action Figures</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul className="footer-links">
                            <li><a href="#contact">Contact Us</a></li>
                            <li><a href="#shipping">Shipping Info</a></li>
                            <li><a href="#returns">Returns & Exchanges</a></li>
                            <li><a href="#size-guide">Size Guide</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Anime Figures Store. All rights reserved. Built with passion for collectors.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
