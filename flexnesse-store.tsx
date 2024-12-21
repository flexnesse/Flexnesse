import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Settings, Home, Grid, DollarSign, Package, Edit, Trash2, Plus, Image, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FlexnesseStore = () => {
  // State Management
  const [products, setProducts] = useState([]);
  const [currentView, setCurrentView] = useState('store');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    sizes: [],
    colors: [],
    stock: '',
    discount: '0'
  });
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['قمصان', 'بناطيل', 'جواكت', 'أحذية', 'إكسسوارات'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['أبيض', 'أسود', 'أحمر', 'أزرق', 'أخضر', 'رمادي'];

  // Notifications
  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  // Product Management
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !imagePreview) {
      showNotification('الرجاء إكمال جميع البيانات المطلوبة');
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: Date.now(),
      image: imagePreview,
      createdAt: new Date().toISOString()
    };

    setProducts([...products, productToAdd]);
    showNotification('تم إضافة المنتج بنجاح');
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category: '',
      sizes: [],
      colors: [],
      stock: '',
      discount: '0'
    });
    setImagePreview(null);
    setCurrentView('admin');
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    showNotification('تم حذف المنتج بنجاح');
  };

  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    showNotification('تم إضافة المنتج إلى السلة');
  };

  // Store View Component
  const StoreView = () => (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-4">
              <h3 className="text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">{product.price} جنيه</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {product.sizes.map(size => (
                  <span key={size} className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {size}
                  </span>
                ))}
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleAddToCart(product)}
              >
                إضافة للسلة
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Admin Panel Component (reused from original)
  const AdminPanel = () => (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">لوحة التحكم</h2>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setCurrentView('addProduct')}
          >
            <Plus className="ml-2" /> إضافة منتج جديد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-500 text-white">
            <CardContent className="p-6">
              <Package className="h-8 w-8 mb-2" />
              <h3 className="text-xl font-bold">إجمالي المنتجات</h3>
              <p className="text-2xl">{products.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-500 text-white">
            <CardContent className="p-6">
              <DollarSign className="h-8 w-8 mb-2" />
              <h3 className="text-xl font-bold">إجمالي المبيعات</h3>
              <p className="text-2xl">0 جنيه</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-500 text-white">
            <CardContent className="p-6">
              <Grid className="h-8 w-8 mb-2" />
              <h3 className="text-xl font-bold">الفئات</h3>
              <p className="text-2xl">{categories.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg">
          <h3 className="text-xl font-bold mb-4">قائمة المنتجات</h3>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد منتجات. قم بإضافة منتجات جديدة.
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map(product => (
                <div key={product.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-gray-600">{product.price} جنيه</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="bg-blue-500 text-white">
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <header className="bg-gray-800 text-white p-4 sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Flexnesse - متجر الملابس</h1>
          <div className="flex items-center space-x-4">
            {currentView === 'store' ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white"
                  onClick={() => setShowCart(true)}
                >
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  <span>({cart.length})</span>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-white"
                  onClick={() => setCurrentView('admin')}
                >
                  <Settings className="h-5 w-5 ml-2" />
                  لوحة التحكم
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                className="text-white"
                onClick={() => setCurrentView('store')}
              >
                <Home className="h-5 w-5 ml-2" />
                العودة للمتجر
              </Button>
            )}
          </div>
        </div>
      </header>

      {currentView === 'store' && <StoreView />}
      {currentView === 'admin' && <AdminPanel />}
    </div>
  );
};

export default FlexnesseStore;
