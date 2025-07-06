import React, { useState, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { apiService } from './services/api';
import toast from 'react-hot-toast';

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [animeShows, setAnimeShows] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'product', 'login', 'signup', 'profile', 'checkout'
  const [favorites, setFavorites] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Fallback data in case backend is not available
  const fallbackProducts = useMemo(() => [
    {
      id: 1,
      name: "Nezuko Kamado Figure",
      anime: "Demon Slayer",
      category: "figures",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400",
      stock: 15,
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: "Luffy Gear 4 Figure",
      anime: "One Piece",
      category: "figures",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      stock: 8,
      rating: 4.9,
      reviews: 89
    }
  ], []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse, animeResponse, cartResponse] = await Promise.all([
          apiService.products.getAll(),
          apiService.products.getCategories(),
          apiService.products.getAnimeShows(),
          apiService.cart.get()
        ]);
        
        setProducts(productsResponse.data?.data || []);
        setCategories(categoriesResponse.data?.data || []);
        setAnimeShows(animeResponse.data?.data || []);
        setCartItems(cartResponse.data?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        console.warn('Using fallback data - backend might not be running');
        // Use fallback data if backend is not available
        setProducts(fallbackProducts);
        setCategories(['figures']);
        setAnimeShows(['Demon Slayer', 'One Piece']);
        setCartItems([]);
        toast.error('Backend not available - using demo data', {
          icon: '⚠️',
          style: {
            borderRadius: '12px',
            background: 'var(--surface-primary)',
            color: 'var(--gray-900)',
            border: '1px solid var(--gray-200)',
            boxShadow: 'var(--shadow-lg)'
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fallbackProducts]);

  const addToCart = async (product) => {
    if (product.stock === 0) {
      toast.error('This item is out of stock', {
        icon: '❌',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
      return;
    }

    try {
      const response = await apiService.cart.add(product.id, 1);
      setCartItems(response.data?.data || []);
      
      toast.success(`Added ${product.name} to cart`, {
        icon: '🛒',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local cart management
      const existingItem = cartItems.find(item => item.id === product.id);
      if (existingItem) {
        setCartItems(prev => prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
      }
      
      toast.success(`Added ${product.name} to cart (offline mode)`, {
        icon: '🛒',
        style: {
          borderRadius: '12px',
          background: 'var(--surface-primary)',
          color: 'var(--gray-900)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-lg)'
        }
      });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await apiService.cart.remove(productId);
      setCartItems(response.data?.data || []);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to local cart management
      setCartItems(prev => prev.filter(item => item.id !== productId));
      toast.success('Item removed from cart (offline mode)');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    try {
      const response = await apiService.cart.update(productId, quantity);
      setCartItems(response.data?.data || []);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Fallback to local cart management
      setCartItems(prev => prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProductClick = (product) => {
    // Navigate to product detail page
    setSelectedProduct(product);
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const handleOrderComplete = (order) => {
    setCartItems([]);
    setShowCheckout(false);
    toast.success('Order placed successfully!');
  };

  return (
    <>
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: 'var(--surface-primary)',
            color: 'var(--gray-900)',
            border: '1px solid var(--gray-200)',
            boxShadow: 'var(--shadow-lg)'
          }
        }}
      />
      
      <div style={{ paddingTop: '80px' }}>
        <Header 
          cartItemCount={getTotalItems()} 
          onCartClick={() => setIsCartOpen(true)}
          isAuthenticated={isAuthenticated}
          user={user}
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
          onProfileClick={() => setShowProfile(true)}
        />
        
        <main>
          <section id="home">
            <Hero />
          </section>
          
          <section id="products">
            {loading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '400px',
                fontSize: '1.2rem',
                color: 'var(--gray-600)'
              }}>
                Loading products...
              </div>
            ) : (
              <ProductGrid 
                products={products}
                categories={categories}
                animeShows={animeShows}
                onProductClick={handleProductClick}
                onAddToCart={addToCart}
              />
            )}
          </section>
        </main>

        <Footer />

        <Cart 
          items={cartItems}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          totalPrice={getTotalPrice()}
          onCheckout={handleCheckout}
        />

        {/* Modals */}
        <AnimatePresence>
          {showLogin && (
            <Login
              onClose={() => setShowLogin(false)}
              onSwitchToSignup={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
            />
          )}
          
          {showSignup && (
            <Signup
              onClose={() => setShowSignup(false)}
              onSwitchToLogin={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
            />
          )}
          
          {showProfile && (
            <Profile onClose={() => setShowProfile(false)} />
          )}
          
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={addToCart}
              isFavorite={favorites.includes(selectedProduct.id)}
              onToggleFavorite={toggleFavorite}
            />
          )}
          
          {showCheckout && (
            <Checkout
              cartItems={cartItems}
              totalPrice={getTotalPrice()}
              onClose={() => setShowCheckout(false)}
              onOrderComplete={handleOrderComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
