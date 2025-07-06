# Troubleshooting Guide - Anime Figures Store

## Common Issues and Solutions

### 1. Backend Server Won't Start

**Problem**: Backend server fails to start or crashes immediately.

**Solutions**:
```bash
# Check if port 5000 is already in use
netstat -ano | findstr :5000

# If port is in use, kill the process
taskkill /PID <PID_NUMBER> /F

# Make sure all dependencies are installed
cd backend
npm install

# Start the server with detailed logs
npm run dev
```

### 2. Frontend Won't Connect to Backend

**Problem**: Frontend shows "Backend not available - using demo data" message.

**Solutions**:
- Ensure backend server is running on port 5000
- Check environment variable in `.env` file:
  ```
  REACT_APP_API_BASE_URL=http://localhost:5000/api
  ```
- Verify CORS is enabled in backend (it should be)
- Test backend directly: http://localhost:5000/api/health

### 3. CORS Errors

**Problem**: Browser console shows CORS policy errors.

**Solutions**:
- Backend already includes CORS middleware
- If still experiencing issues, restart both servers
- Clear browser cache and cookies

### 4. ESLint Warnings

**Problem**: Development server shows ESLint warnings.

**Most Common Warnings Fixed**:
- ✅ Unused variables in App.js
- ✅ Missing href attributes in anchor tags
- ✅ React hooks dependency warnings

**Remaining Minor Warnings**:
- Webpack dev server middleware warnings (can be ignored)

### 5. Images Not Loading

**Problem**: Product images don't display.

**Solutions**:
- Using Unsplash URLs which should work
- If images fail to load, check network connectivity
- Images are set to fallback gracefully

### 6. Cart Functionality Issues

**Problem**: Adding/removing items from cart doesn't work.

**Solutions**:
- Cart works in both online (backend connected) and offline modes
- If backend is available, cart syncs with server
- If backend is unavailable, cart uses local state management
- All cart operations include fallback mechanisms

### 7. Animation Performance Issues

**Problem**: Animations are laggy or don't work.

**Solutions**:
- Animations use Framer Motion which is well-optimized
- Reduce number of floating particles in Hero component if needed
- Check if browser supports CSS transforms and animations

### 8. Build Issues

**Problem**: `npm run build` fails.

**Solutions**:
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| API Endpoints | 5000 | http://localhost:5000/api |

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Backend (backend/.env)
```
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000/api
```

## Quick Verification Commands

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Get products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/categories
```

### Check Server Status
```bash
# Check if backend is running
netstat -ano | findstr :5000

# Check if frontend is running
netstat -ano | findstr :3000
```

## Development Workflow

### Starting Development Environment
1. **Option 1: Manual Start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm start
   ```

2. **Option 2: Use PowerShell Script**
   ```powershell
   .\start-dev.ps1
   ```

### Stopping Servers
- Use `Ctrl+C` in each terminal window
- Or close the terminal windows

## Features Working Correctly

✅ **Frontend**:
- React app starts successfully
- Modern black and white design loads
- Smooth animations with Framer Motion
- Responsive layout
- Navigation menu with proper links
- Product grid with filtering
- Shopping cart functionality
- Toast notifications
- Loading states
- Error handling with fallback data

✅ **Backend**:
- Express server runs on port 5000
- All API endpoints functional
- CORS enabled for frontend
- Error handling middleware
- Request logging
- Data validation
- In-memory cart management
- Product filtering
- Health check endpoint

✅ **Integration**:
- Frontend communicates with backend
- Cart operations work online and offline
- Proper error handling when backend is unavailable
- Fallback to demo data if needed
- Real-time updates via API calls

## Performance Optimizations

1. **Code Splitting**: Already implemented via Create React App
2. **Image Optimization**: Using external CDN (Unsplash)
3. **API Caching**: Could be added for production
4. **Bundle Size**: Optimized through React build process
5. **Animation Performance**: Using hardware-accelerated CSS transforms

## Security Considerations

✅ **Implemented**:
- Helmet.js for security headers
- Input validation in API endpoints
- CORS configuration
- Error message sanitization

🚧 **For Production**:
- Environment variable validation
- Rate limiting
- Authentication/authorization
- Database integration
- HTTPS enforcement
- Input sanitization

## Browser Compatibility

**Supported Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features**:
- ES6+ support
- CSS Grid
- CSS Custom Properties
- Framer Motion compatibility

## Need More Help?

1. Check the browser console for detailed error messages
2. Check the terminal where servers are running for server logs
3. Verify all dependencies are installed with `npm install`
4. Make sure you're using Node.js version 14 or higher
5. Try restarting both servers
6. Clear browser cache and localStorage
