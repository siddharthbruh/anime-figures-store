# Anime Figures Store

A modern, full-stack e-commerce application for anime figures with a sleek black and white design aesthetic. Built with React.js frontend and Node.js/Express.js backend, featuring sophisticated animations and premium functionality.

## Features

### Frontend
- 🎨 **Modern Design**: Black and white color scheme with smooth animations
- ✨ **Interactive UI**: Framer Motion animations with glass morphism effects
- 🛍️ **Shopping Cart**: Add, remove, and update item quantities with real-time totals
- 💖 **Favorites System**: Save favorite products (session-based)
- 🔍 **Product Filtering**: Filter by category and anime series
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔔 **Toast Notifications**: Real-time feedback for user actions
- 🎯 **Interactive Elements**: Hover effects and smooth transitions

### Backend
- 🚀 **RESTful API**: Full CRUD operations for products and cart management
- 🛡️ **Security**: Helmet.js for security headers and CORS configuration
- 📊 **Logging**: Morgan middleware for request logging
- 💾 **Data Management**: In-memory storage (easily replaceable with database)
- ⚡ **Performance**: Compression middleware and optimized responses
- 🔧 **Error Handling**: Comprehensive error handling and validation

## Technology Stack

### Frontend
- **React.js** - UI library and component framework
- **Framer Motion** - Advanced animation library
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notification system
- **Lucide React** - Modern icon library
- **CSS Variables** - Design system and theming

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Cors** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Compression** - Response compression
- **Dotenv** - Environment variable management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd anime-figures-store
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running the Application

You need to run both the frontend and backend servers:

#### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

#### Start the Frontend Development Server
In a new terminal window:
```bash
npm start
```
The frontend will start on `http://localhost:3000`

### Environment Variables

#### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

#### Backend (backend/.env)
```
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000/api
```

## API Endpoints

### Products
- `GET /api/products` - Get all products with optional filtering
- `GET /api/products/:id` - Get single product by ID
- `GET /api/categories` - Get all product categories
- `GET /api/anime` - Get all anime series

### Cart
- `GET /api/cart` - Get current cart contents
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update item quantity in cart
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders` - Create new order (checkout)
- `GET /api/orders` - Get all orders

### Health Check
- `GET /api/health` - Server health check

## Available Scripts

#### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented)

## Project Structure

```
anime-figures-store/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── Header.js     # Navigation header
│   │   ├── Hero.js       # Hero section
│   │   ├── ProductGrid.js # Product listing and filters
│   │   ├── Cart.js       # Shopping cart sidebar
│   │   └── Footer.js     # Footer section
│   ├── services/         # API service layer
│   │   └── api.js        # Axios API client
│   ├── data/             # Static data (fallback)
│   ├── App.js            # Main application component
│   ├── index.css         # Global styles and design system
│   └── index.js          # Application entry point
├── backend/
│   ├── server.js         # Express server and API routes
│   ├── package.json      # Backend dependencies
│   └── .env              # Backend environment variables
├── package.json          # Frontend dependencies
├── .env                  # Frontend environment variables
└── README.md             # This file
```

## Design System

The application uses a sophisticated black and white color palette with CSS custom properties:

- **Primary Colors**: Various shades of gray from white (#ffffff) to black (#000000)
- **Typography**: Inter font family for clean, modern text
- **Shadows**: Multiple shadow variations for depth
- **Animations**: Smooth transitions and hover effects
- **Border Radius**: Consistent rounded corners throughout

## Features in Detail

### Product Management
- Display products with images, names, prices, and stock status
- Filter products by category and anime series
- Favorite products (frontend state)
- Stock level indicators

### Shopping Cart
- Add products to cart with quantity management
- Update quantities directly in cart
- Remove individual items or clear entire cart
- Real-time total calculation
- Persistent cart state during session

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for various screen sizes

## Development

### Code Style
- ESLint configuration for code quality
- Consistent formatting and naming conventions
- Component-based architecture
- Separation of concerns between frontend and backend

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.

## Future Enhancements

- **Database Integration**: Replace in-memory storage with MongoDB/PostgreSQL
- **User Authentication**: User accounts and login system
- **Payment Processing**: Stripe or PayPal integration
- **Order Management**: Order tracking and history
- **Admin Panel**: Product management interface
- **Search Functionality**: Advanced product search
- **Reviews System**: User reviews and ratings
- **Wishlist**: Save products for later
- **Inventory Management**: Real-time stock updates
- **Email Notifications**: Order confirmations and updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ by anime fans for anime fans!

