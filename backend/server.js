const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(morgan('combined')); // Logging
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Sample data - In a real app, this would come from a database
const products = [
  {
    id: 1,
    name: "Nezuko Kamado Figure",
    anime: "Demon Slayer",
    category: "figures",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400",
    stock: 15,
    rating: 4.8,
    reviews: 124,
    description: "High-quality PVC figure of Nezuko Kamado from Demon Slayer anime series."
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
    reviews: 89,
    description: "Premium collectible figure of Monkey D. Luffy in Gear 4 form."
  },
  {
    id: 3,
    name: "Goku Ultra Instinct",
    anime: "Dragon Ball Super",
    category: "figures",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1555400121-3ad13c532a5a?w=400",
    stock: 5,
    rating: 4.7,
    reviews: 156,
    description: "Detailed figure of Goku in Ultra Instinct form with special effects."
  },
  {
    id: 4,
    name: "Naruto Rasengan Figure",
    anime: "Naruto",
    category: "figures",
    price: 94.99,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400",
    stock: 12,
    rating: 4.6,
    reviews: 203,
    description: "Dynamic figure of Naruto Uzumaki performing the Rasengan jutsu."
  },
  {
    id: 5,
    name: "Attack on Titan Scout Regiment",
    anime: "Attack on Titan",
    category: "figures",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1566493199068-af10e675695b?w=400",
    stock: 0,
    rating: 4.5,
    reviews: 78,
    description: "Scout Regiment member figure with ODM gear accessories."
  },
  {
    id: 6,
    name: "Jujutsu Kaisen Gojo Figure",
    anime: "Jujutsu Kaisen",
    category: "figures",
    price: 109.99,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400",
    stock: 7,
    rating: 4.9,
    reviews: 95,
    description: "Satoru Gojo figure with blindfold and special pose."
  }
];

let cart = [];
let orders = [];
let users = []; // In-memory user storage
let currentUserId = 1;

// Helper function to generate JWT-like token (simplified for demo)
function generateToken(user) {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString('base64');
}

// Helper function to decode token
function decodeToken(token) {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch {
    return null;
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Authentication routes

// Sign up
app.post('/api/auth/signup', (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;
    
    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required'
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const newUser = {
      id: currentUserId++,
      firstName,
      lastName,
      email,
      password, // In production, this should be hashed
      phone: phone || '',
      address: address || {},
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Generate token
    const token = generateToken(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
});

// Sign in
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// Update profile
app.put('/api/auth/profile', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    const userIndex = users.findIndex(u => u.id === decoded.id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user data
    const { firstName, lastName, email, phone, address } = req.body;
    const updatedUser = {
      ...users[userIndex],
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      email: email || users[userIndex].email,
      phone: phone || users[userIndex].phone,
      address: address || users[userIndex].address,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  try {
    // In a real application, you would invalidate the token
    // For this simple implementation, we just return success
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: error.message
    });
  }
});

// Change password
app.put('/api/auth/change-password', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    const userIndex = users.findIndex(u => u.id === decoded.id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
});

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const { category, anime, search } = req.query;
    let filteredProducts = [...products];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by anime
    if (anime && anime !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.anime.toLowerCase().includes(anime.toLowerCase())
      );
    }

    // Search functionality
    if (search) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.anime.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = [...new Set(products.map(p => p.category))];
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Get anime shows
app.get('/api/anime', (req, res) => {
  try {
    const animeShows = [...new Set(products.map(p => p.anime))];
    res.json({
      success: true,
      data: animeShows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching anime shows',
      error: error.message
    });
  }
});

// Cart routes

// Get cart
app.get('/api/cart', (req, res) => {
  try {
    res.json({
      success: true,
      data: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// Add to cart
app.post('/api/cart', (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity
      });
    }

    res.json({
      success: true,
      message: 'Product added to cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
app.put('/api/cart/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    cart[itemIndex].quantity = quantity;

    res.json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
});

// Remove from cart
app.delete('/api/cart/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const initialLength = cart.length;
    
    cart = cart.filter(item => item.id !== productId);
    
    if (cart.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
});

// Clear cart
app.delete('/api/cart', (req, res) => {
  try {
    cart = [];
    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

// Order routes

// Create order (checkout)
app.post('/api/orders', (req, res) => {
  try {
    const { items, shippingInfo, paymentInfo, orderSummary, userId } = req.body;
    
    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Shipping information is required'
      });
    }

    if (!paymentInfo || !paymentInfo.cardNumber || !paymentInfo.cardholderName) {
      return res.status(400).json({
        success: false,
        message: 'Payment information is required'
      });
    }

    // Generate order ID
    const orderId = orders.length + 1;
    
    // Create order object
    const order = {
      id: orderId,
      orderNumber: `ORD-${Date.now()}-${orderId.toString().padStart(4, '0')}`,
      userId: userId || null,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        anime: item.anime,
        category: item.category,
        subtotal: item.price * item.quantity
      })),
      shippingInfo: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        email: shippingInfo.email,
        phone: shippingInfo.phone || '',
        address: shippingInfo.address
      },
      paymentInfo: {
        cardholderName: paymentInfo.cardholderName,
        cardNumber: paymentInfo.cardNumber, // Already masked in frontend
        billingAddress: paymentInfo.billingAddress
      },
      orderSummary: {
        subtotal: orderSummary?.subtotal || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping: orderSummary?.shipping || 0,
        tax: orderSummary?.tax || 0,
        total: orderSummary?.total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add order to orders array
    orders.push(order);

    // Update product stock (simulate inventory management)
    items.forEach(orderItem => {
      const productIndex = products.findIndex(p => p.id === orderItem.id);
      if (productIndex !== -1) {
        products[productIndex].stock = Math.max(0, products[productIndex].stock - orderItem.quantity);
      }
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.orderSummary.total,
          createdAt: order.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Get orders
app.get('/api/orders', (req, res) => {
  try {
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get user orders (requires authentication) - MUST come before /:id route
app.get('/api/orders/user', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const token = authHeader.substring(7);
    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    const userOrders = orders.filter(order => order.userId === decoded.id);
    
    res.json({
      success: true,
      data: userOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders',
      error: error.message
    });
  }
});

// Get single order by ID
app.get('/api/orders/:id', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: orders[orderIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
