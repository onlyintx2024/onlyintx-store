// pages/api/printify/blueprints.js
export default async function handler(req, res) {
  const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;
  
  if (!PRINTIFY_API_KEY) {
    return res.status(500).json({ error: 'Printify API key not configured' });
  }

  const headers = {
    'Authorization': `Bearer ${PRINTIFY_API_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (id) {
        // Get specific blueprint details with variants and print providers
        const [blueprintResponse, providersResponse] = await Promise.all([
          fetch(`https://api.printify.com/v1/catalog/blueprints/${id}.json`, { headers }),
          fetch(`https://api.printify.com/v1/catalog/blueprints/${id}/print_providers.json`, { headers })
        ]);
        
        const [blueprintData, providersData] = await Promise.all([
          blueprintResponse.json(),
          providersResponse.json()
        ]);
        
        if (!blueprintResponse.ok || !providersResponse.ok) {
          throw new Error('Failed to fetch blueprint details');
        }
        
        return res.status(200).json({
          blueprint: blueprintData,
          printProviders: providersData
        });
      } else {
        // Get all available blueprints (product types)
        const response = await fetch('https://api.printify.com/v1/catalog/blueprints.json', {
          headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch blueprints');
        }
        
        // Filter for common apparel items
        const apparelBlueprints = data.filter(blueprint => 
          blueprint.title.toLowerCase().includes('t-shirt') ||
          blueprint.title.toLowerCase().includes('tee') ||
          blueprint.title.toLowerCase().includes('hoodie') ||
          blueprint.title.toLowerCase().includes('sweatshirt') ||
          blueprint.title.toLowerCase().includes('tank')
        );
        
        return res.status(200).json({ 
          blueprints: apparelBlueprints,
          total: apparelBlueprints.length 
        });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Printify Blueprints API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}