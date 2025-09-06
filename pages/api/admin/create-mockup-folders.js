import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fetch current products from Printify
    const printifyResponse = await fetch(`https://api.printify.com/v1/shops/18727817/products.json`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!printifyResponse.ok) {
      throw new Error('Failed to fetch products from Printify')
    }

    const printifyData = await printifyResponse.json()
    const products = printifyData.data || []

    // Check existing mockup folders
    const mockupsPath = path.join(process.cwd(), 'public', 'mockups')
    const existingFolders = fs.existsSync(mockupsPath) 
      ? fs.readdirSync(mockupsPath).filter(item => {
          const itemPath = path.join(mockupsPath, item)
          return fs.statSync(itemPath).isDirectory()
        })
      : []

    const existingProductIds = existingFolders
      .map(folder => folder.replace('product-', ''))
      .filter(id => id !== folder) // Only folders that match the pattern

    // Find products that don't have folders
    const missingFolders = products.filter(product => 
      !existingProductIds.includes(product.id)
    )

    const createdFolders = []
    const errors = []

    // Create folders for missing products
    for (const product of missingFolders) {
      const folderName = `product-${product.id}`
      const folderPath = path.join(mockupsPath, folderName)

      try {
        // Create main product folder
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true })
          
          // Create common color subfolders based on your existing structure
          const commonColors = ['black', 'white', 'navy', 'heather-grey', 'red']
          const viewTypes = ['full', 'thumb']
          
          for (const color of commonColors) {
            for (const viewType of viewTypes) {
              const subFolderPath = path.join(folderPath, `${color}-${viewType}`)
              if (!fs.existsSync(subFolderPath)) {
                fs.mkdirSync(subFolderPath, { recursive: true })
              }
            }
          }

          createdFolders.push({
            productId: product.id,
            productName: product.title,
            folderName: folderName,
            subfolders: commonColors.length * viewTypes.length
          })
        }
      } catch (error) {
        console.error(`Error creating folder for product ${product.id}:`, error)
        errors.push({
          productId: product.id,
          productName: product.title,
          error: error.message
        })
      }
    }

    return res.status(200).json({
      success: true,
      message: `Created ${createdFolders.length} mockup folders`,
      createdFolders,
      errors,
      totalProducts: products.length,
      existingFolders: existingFolders.length,
      newFolders: createdFolders.length
    })

  } catch (error) {
    console.error('Error in create-mockup-folders:', error)
    return res.status(500).json({ 
      error: 'Failed to create mockup folders',
      details: error.message 
    })
  }
}