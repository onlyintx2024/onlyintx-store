// Product metadata management - design orders and sales tracking

let productMetadata = {
  '68a2acaa09de3a1de90e76bc': { designOrder: 1, unitsSold: 1 },  // Houston (oldest)
  '68a2b13ab9d87186e105fab5': { designOrder: 2, unitsSold: 2 },  // San Antonio  
  '68a2bc1b87987a828a0b6a4b': { designOrder: 3, unitsSold: 3 },  // Dallas
  '68a2bcee571c2c156d0885f8': { designOrder: 4, unitsSold: 4 },  // Austin Foodie
  '68afd1f5a85dd8cf040a3818': { designOrder: 5, unitsSold: 0 }   // Keep Austin Loud (newest)
}

export function getProductMetadata(productId) {
  return productMetadata[productId] || null
}

export function setProductMetadata(productId, metadata) {
  productMetadata[productId] = {
    ...productMetadata[productId],
    ...metadata
  }
  return productMetadata[productId]
}

export function getAllProductMetadata() {
  return { ...productMetadata }
}

export function getNextDesignOrder() {
  // Find highest current design order and add 1
  const orders = Object.values(productMetadata).map(p => p.designOrder || 0)
  return Math.max(...orders, 0) + 1
}

export function assignDesignOrderToNewProduct(productId) {
  const nextOrder = getNextDesignOrder()
  
  if (!productMetadata[productId]) {
    productMetadata[productId] = {
      designOrder: nextOrder,
      unitsSold: 0
    }
    console.log(`Auto-assigned design order ${nextOrder} to new product ${productId}`)
  }
  
  return productMetadata[productId]
}

export function updateUnitsSold(productId, quantity = 1) {
  if (!productMetadata[productId]) {
    productMetadata[productId] = {
      designOrder: getNextDesignOrder(),
      unitsSold: 0
    }
  }
  
  productMetadata[productId].unitsSold = (productMetadata[productId].unitsSold || 0) + quantity
  return productMetadata[productId]
}