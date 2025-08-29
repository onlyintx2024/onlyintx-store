// pages/admin/mockup-guide.js
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { generateMockupGuide, normalizeColorName } from '../../utils/mockupMapping';

export default function MockupGuide() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mockupGuide, setMockupGuide] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/printify/products');
        const data = await response.json();
        
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    
    // Get available colors from enabled variants
    const enabledVariants = product.variants?.filter(v => v.is_enabled) || [];
    const colors = [...new Set(enabledVariants.map(v => {
      // Parse color from variant title (you might need to adjust this logic)
      const parts = v.title.split(' / ');
      return parts.length > 1 ? parts[parts.length - 2]?.trim() : 'Default';
    }))].filter(color => color && color !== 'Default');

    if (colors.length > 0) {
      const guide = generateMockupGuide(product.id, colors);
      setMockupGuide(guide);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading products...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mockup Organization Guide</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Select Product</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedProduct?.id === product.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <h3 className="font-medium text-sm">{product.title}</h3>
                  <p className="text-xs text-gray-500">ID: {product.id}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup Guide */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Folder Structure Guide</h2>
            
            {!mockupGuide ? (
              <p className="text-gray-500">Select a product to see the mockup organization guide.</p>
            ) : (
              <div className="space-y-6">
                {/* Folder Path */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Create This Folder:
                  </label>
                  <div className="bg-gray-100 p-3 rounded border font-mono text-sm flex items-center justify-between">
                    <span>{mockupGuide.folderPath}</span>
                    <button
                      onClick={() => copyToClipboard(mockupGuide.folderPath)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Required Files */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Mockup Files (2 sizes per color):
                  </label>
                  <div className="space-y-3">
                    {mockupGuide.requiredFiles.map((file, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono text-sm text-blue-600">{file.filename}</div>
                            <div className="text-xs text-gray-600">
                              {file.color} - {file.type} ({file.dimensions})
                            </div>
                            <div className="text-xs text-green-600">{file.usage}</div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(file.filename)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size Specifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size Specifications:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <h4 className="font-semibold text-blue-800">Full Size Images</h4>
                      <div className="text-sm text-blue-700 mt-2">
                        <p><strong>Dimensions:</strong> {mockupGuide.sizeSpecs.full.dimensions}</p>
                        <p><strong>Quality:</strong> {mockupGuide.sizeSpecs.full.quality}</p>
                        <p><strong>File Size:</strong> {mockupGuide.sizeSpecs.full.fileSize}</p>
                        <p><strong>Usage:</strong> {mockupGuide.sizeSpecs.full.usage}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded border border-green-200">
                      <h4 className="font-semibold text-green-800">Thumbnail Images</h4>
                      <div className="text-sm text-green-700 mt-2">
                        <p><strong>Dimensions:</strong> {mockupGuide.sizeSpecs.thumb.dimensions}</p>
                        <p><strong>Quality:</strong> {mockupGuide.sizeSpecs.thumb.quality}</p>
                        <p><strong>File Size:</strong> {mockupGuide.sizeSpecs.thumb.fileSize}</p>
                        <p><strong>Usage:</strong> {mockupGuide.sizeSpecs.thumb.usage}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setup Instructions:
                  </label>
                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    {mockupGuide.instructions.map((instruction, index) => (
                      <div key={index} className="text-sm text-blue-800 mb-1">
                        {instruction}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example URLs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Example URLs (how they'll be accessed):
                  </label>
                  <div className="space-y-1">
                    {mockupGuide.requiredFiles.map((file, index) => (
                      <div key={index} className="font-mono text-xs text-gray-600 bg-gray-100 p-2 rounded">
                        /mockups/product-{selectedProduct.id}/{file.filename}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 General Guidelines</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>Image Format:</strong> Use JPG for best file size/quality balance</p>
            <p><strong>Dimensions:</strong> 1000x1000px recommended (square aspect ratio)</p>
            <p><strong>Consistency:</strong> Use same lighting and product positioning across all colors</p>
            <p><strong>File Naming:</strong> Colors are automatically normalized (e.g., "Sport Grey" → "sport-grey.jpg")</p>
            <p><strong>Fallbacks:</strong> If a custom mockup isn't found, the system falls back to Printify images</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}