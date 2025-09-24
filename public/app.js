const { useState, useEffect } = React;

const API_BASE = '/api';

// Product Form Component
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = product ? `${API_BASE}/products/${product.id}` : `${API_BASE}/products`;
      const method = product ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {product ? 'Edit Product' : 'Add Product'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Food">Food</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="text-blue-500 hover:text-blue-700"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-500 hover:text-red-700"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
      <p className="text-sm mb-2">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-green-600">${product.price}</span>
        <span className={`px-2 py-1 rounded text-sm ${
          product.quantity > 10 ? 'bg-green-100 text-green-800' : 
          product.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
        }`}>
          Stock: {product.quantity}
        </span>
      </div>
    </div>
  );
};

// Dashboard Stats Component
const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <i className="fas fa-box text-blue-500 text-2xl mr-3"></i>
          <div>
            <p className="text-sm text-gray-600">Products</p>
            <p className="text-2xl font-bold">{stats.total_products || 0}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <i className="fas fa-cubes text-green-500 text-2xl mr-3"></i>
          <div>
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold">{stats.total_items || 0}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <i className="fas fa-tags text-purple-500 text-2xl mr-3"></i>
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold">{stats.categories || 0}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <i className="fas fa-dollar-sign text-yellow-500 text-2xl mr-3"></i>
          <div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-2xl font-bold">${parseInt(stats.total_value || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProducts();
    loadStats();
    registerServiceWorker();
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered');
      } catch (error) {
        console.log('SW registration failed');
      }
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
    loadStats();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
        loadProducts();
        loadStats();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <i className="fas fa-warehouse text-2xl text-blue-500 mr-3"></i>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Manager</h1>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <DashboardStats stats={stats} />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
