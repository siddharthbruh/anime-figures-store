import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingCart, Star } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

function ProductGrid({ products, categories = [], animeShows = [], onProductClick, onAddToCart }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedAnime, setSelectedAnime] = useState('All');
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true
    });

    const allCategories = ['All', ...categories];
    const allAnimeShows = ['All', ...animeShows];

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.anime.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        // Anime filter
        if (selectedAnime !== 'All') {
            filtered = filtered.filter(product => product.anime === selectedAnime);
        }

        return filtered;
    }, [products, searchQuery, selectedCategory, selectedAnime]);

    const toggleFavorite = (productId) => {
        setFavorites(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const StarRating = ({ rating, reviews }) => (
        <div className="product-rating">
            <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
                        style={{
                            fill: i < Math.floor(rating) ? 'currentColor' : 'none',
                            opacity: i < Math.floor(rating) ? 1 : 0.3
                        }}
                    />
                ))}
            </div>
            <span className="rating-text">({reviews})</span>
        </div>
    );

    return (
        <section className="products-section" ref={ref}>
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="section-title">Featured Collection</h2>
                    <p className="section-subtitle">
                        Discover our handpicked selection of premium anime figures, 
                        each one a masterpiece of craftsmanship and detail.
                    </p>
                </motion.div>

                {/* Simple Search */}
                <motion.div
                    className="search-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ marginBottom: '2rem', textAlign: 'center' }}
                >
                    <div className="search-container" style={{ maxWidth: '400px', margin: '0 auto', position: 'relative' }}>
                        <Search size={20} style={{ 
                            position: 'absolute', 
                            left: '12px', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: 'var(--gray-400)' 
                        }} />
                        <input
                            type="text"
                            placeholder="Search anime figures..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 44px',
                                border: '1px solid var(--gray-300)',
                                borderRadius: '8px',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="filters"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {allCategories.map((category) => (
                        <button
                            key={category}
                            className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                <motion.div
                    className="filters"
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ marginTop: '1rem' }}
                >
                    {allAnimeShows.map((anime) => (
                        <button
                            key={anime}
                            className={`filter-chip ${selectedAnime === anime ? 'active' : ''}`}
                            onClick={() => setSelectedAnime(anime)}
                        >
                            {anime}
                        </button>
                    ))}
                </motion.div>

                {/* Product Grid */}
                <motion.div
                    className="product-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                >
                    <AnimatePresence mode="wait">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                className="product-card"
                                variants={itemVariants}
                                layout
                                whileHover={{ 
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                                onClick={() => onProductClick(product)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="product-image-container">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                    
                                    {product.category === 'Limited Edition' && (
                                        <div className="product-badge">Limited</div>
                                    )}
                                    
                                    <motion.button
                                        className={`favorite-button ${favorites.includes(product.id) ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(product.id);
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Heart
                                            size={20}
                                            style={{
                                                fill: favorites.includes(product.id) ? 'currentColor' : 'none'
                                            }}
                                        />
                                    </motion.button>

                                    {product.stock === 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'rgba(0,0,0,0.6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.125rem',
                                            fontWeight: '600'
                                        }}>
                                            Out of Stock
                                        </div>
                                    )}
                                </div>

                                <div className="product-info">
                                    <div className="product-category">{product.category}</div>
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-anime">{product.anime}</p>
                                    
                                    <StarRating rating={product.rating} reviews={product.reviews} />
                                    
                                    <div className="product-footer">
                                        <span className="product-price">${product.price}</span>
                                        <span className={`stock-status ${product.stock > 0 ? 'stock-in' : 'stock-out'}`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                        </span>
                                    </div>

                                    <motion.button
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: '1rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAddToCart(product);
                                        }}
                                        disabled={product.stock === 0}
                                        whileHover={product.stock > 0 ? { scale: 1.02 } : {}}
                                        whileTap={product.stock > 0 ? { scale: 0.98 } : {}}
                                    >
                                        <ShoppingCart size={18} />
                                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                    <motion.div
                        style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            color: 'var(--gray-500)'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3>No products found</h3>
                        <p>Try adjusting your filters to see more results.</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}

export default ProductGrid;
