// pages/product/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useCart } from '../../context/CartContext';
import { getColorMockupImage, getProductMockups } from '../../utils/mockupMapping';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentMockupImage, setCurrentMockupImage] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/printify/product-details?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
          setColorOptions(data.colorOptions);
          setSizeOptions(data.sizeOptions);
          
          // Set default selections
          if (data.colorOptions.length > 0) {
            setSelectedColor(data.colorOptions[0]);
          }
          if (data.sizeOptions.length > 0) {
            setSelectedSize(data.sizeOptions[0]);
          }
        } else {
          throw new Error(data.error || 'Failed to load product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update selected variant when color or size changes (using SKU for precision)
  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const variant = product.variants.find(v => 
        v.color === selectedColor && v.size === selectedSize && v.is_enabled
      );
      setSelectedVariant(variant);
      
      // Log for debugging
      if (variant) {
        console.log('Selected variant:', {
          sku: variant.sku,
          color: variant.color,
          size: variant.size,
          price: variant.price
        });
      }
    }
  }, [product, selectedColor, selectedSize]);

  // Update mockup image when color changes
  useEffect(() => {
    if (product && selectedColor) {
      const mockupImage = getColorMockupImage(product.id, selectedColor, 'full');
      setCurrentMockupImage(mockupImage);
      console.log(`Full-size mockup for ${selectedColor}:`, mockupImage);
    }
  }, [product, selectedColor]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a color and size');
      return;
    }

    const cartItem = {
      id: selectedVariant.id,
      productId: product.id,
      title: product.title,
      price: selectedVariant.price,
      color: selectedColor,
      size: selectedSize,
      variantId: selectedVariant.id,
      image: product.images?.[0]?.src || '/placeholder.jpg',
      quantity: 1
    };

    addToCart(cartItem);
    
    // Show success message or redirect
    alert('Added to cart!');
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => router.back()} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-600">Product not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentMockupImage || product.images?.[0]?.src || '/images/texas-default.jpg'}
                alt={`${product.title} - ${selectedColor || 'Product'}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to Printify image if custom mockup fails to load
                  console.log('Custom mockup failed to load, using fallback');
                  e.target.src = product.images?.[0]?.src || '/images/texas-default.jpg';
                }}
              />
            </div>
            
            {/* Color-based Thumbnail Images - Show available color mockups */}
            {colorOptions.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => {
                  const colorThumbnail = getColorMockupImage(product.id, color, 'thumb');
                  return (
                    <div 
                      key={color} 
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedColor === color ? 'border-blue-600' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedColor(color)}
                      title={`${color} mockup`}
                    >
                      <img
                        src={colorThumbnail}
                        alt={`${product.title} - ${color}`}
                        className="w-full h-full object-contain hover:opacity-80"
                        onError={(e) => {
                          // Fallback to default image for thumbnails
                          e.target.src = '/images/texas-default.jpg';
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              {selectedVariant && (
                <p className="text-2xl font-bold text-blue-600">
                  ${(selectedVariant.price / 100).toFixed(2)}
                </p>
              )}
            </div>

            {product.description && (
              <div className="prose max-w-none">
                <div 
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: product.description
                      .replace(/<p[^>]*>/gi, '')  // Remove opening <p> tags (case insensitive)
                      .replace(/<\/p>/gi, '')     // Remove closing </p> tags (case insensitive)
                      .replace(/<P[^>]*>/g, '')   // Remove opening <P> tags
                      .replace(/<\/P>/g, '')      // Remove closing </P> tags
                      .trim()                     // Remove extra whitespace
                  }}
                />
              </div>
            )}

            {/* Color Selection */}
            {colorOptions.length > 1 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizeOptions.length > 1 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Free Shipping Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center text-green-700 font-medium">
                <span className="text-lg mr-2">🚚</span>
                FREE SHIPPING on all orders
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant}
                className={`w-full py-3 px-6 rounded-lg font-medium ${
                  selectedVariant
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedVariant ? 'Add to Cart' : 'Select Options'}
              </button>
              
              {selectedVariant && (
                <p className="text-sm text-gray-600">
                  Selected: {selectedColor} / {selectedSize}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}