// pages/api/printify/test.js
export default async function handler(req, res) {
  const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;
  
  // Debug info first
  const debugInfo = {
    hasApiKey: !!PRINTIFY_API_KEY,
    apiKeyLength: PRINTIFY_API_KEY ? PRINTIFY_API_KEY.length : 0,
    apiKeyStart: PRINTIFY_API_KEY ? PRINTIFY_API_KEY.substring(0, 8) + '...' : 'none',
    nodeEnv: process.env.NODE_ENV
  };

  if (!PRINTIFY_API_KEY) {
    return res.status(500).json({ 
      success: false,
      error: 'Printify API key not found',
      message: 'Make sure PRINTIFY_API_KEY is set in your .env.local file',
      debug: debugInfo
    });
  }

  try {
    console.log('Testing Printify connection...');
    console.log('API Key length:', PRINTIFY_API_KEY.length);
    
    // Test basic connection to Printify - get shops
    const response = await fetch('https://api.printify.com/v1/shops.json', {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));

    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: data.error || data.message || `HTTP ${response.status}`,
        message: 'Printify API returned an error',
        debug: {
          ...debugInfo,
          httpStatus: response.status,
          printifyError: data
        }
      });
    }

    // Also test getting catalog products
    const catalogResponse = await fetch('https://api.printify.com/v1/catalog/blueprints.json', {
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const catalogData = await catalogResponse.json();

    return res.status(200).json({
      success: true,
      shops: data,
      sampleProducts: catalogData?.slice(0, 5) || [],
      message: 'Printify connection successful!',
      debug: debugInfo
    });

  } catch (error) {
    console.error('Printify connection error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.name + ': ' + error.message,
      message: 'Failed to connect to Printify',
      debug: {
        ...debugInfo,
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack?.split('\n')[0]
      }
    });
  }
}