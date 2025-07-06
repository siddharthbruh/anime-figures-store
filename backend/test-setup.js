const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🔍 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);

    // Test products endpoint
    console.log('\n2. Testing products endpoint...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    console.log('✅ Products found:', productsResponse.data.total);

    // Test categories endpoint
    console.log('\n3. Testing categories endpoint...');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
    console.log('✅ Categories found:', categoriesResponse.data.data.length);

    // Test anime endpoint
    console.log('\n4. Testing anime endpoint...');
    const animeResponse = await axios.get(`${API_BASE_URL}/anime`);
    console.log('✅ Anime shows found:', animeResponse.data.data.length);

    // Test cart endpoint
    console.log('\n5. Testing cart endpoint...');
    const cartResponse = await axios.get(`${API_BASE_URL}/cart`);
    console.log('✅ Cart items:', cartResponse.data.data.length);

    console.log('\n🎉 All API endpoints working correctly!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running on port 5000');
      console.log('   Run: cd backend && npm run dev');
    }
  }
}

testAPI();
