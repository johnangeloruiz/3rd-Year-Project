import React, {useState, useEffect} from 'react'
import aieslogo from './Images/AIEs Logo.jpg'
import shoppingcart from './Images/Shopping Cart.jpg'
import './ProductsAdmin.css'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logout from './Logout'
function ProductsAdmin() {
    const UserLogin = window.localStorage.getItem("isLogin");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState('');
  const [newStock, setNewStock] = useState('');
  
  const [successMessage, setSuccessMessage] = useState(null);
  const [stockChanges, setStockChanges] = useState({});
const [priceChanges, setPriceChanges] = useState({});

  const [newPrice, setNewPrice] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
const [editType, setEditType] = useState(null);
    const navigate = useNavigate()

    const handleEditClick = (productId, type) => {
      setEditingProductId(productId);
      setEditType(type);
    };
    
    const handleStockChange = (productId, newStock) => {
      setStockChanges((prevStockChanges) => ({
        ...prevStockChanges,
        [productId]: newStock,
      }));
    };
    
    const handlePriceChange = (productId, newPrice) => {
      setPriceChanges((prevPriceChanges) => ({
        ...prevPriceChanges,
        [productId]: newPrice,
      }));
    };
    
    
    
  
    const handleSubmitStockChanges = async (productId, newStock) => {
      try {
        // Check if the stock value has changed
        if (newStock !== products.find(product => product.id === productId).productStock) {
          // Send the updated stock data to your server
          const response = await fetch('http://localhost:8081/updateProductStock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId,
              newStock,
            }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            alert('Product stock has been changed.');
            window.location.reload() // Clear the message after 3 seconds
            // If the update was successful, you might want to update the local state as well
            // For example:
            // handleStockChange(productId, newStock);
          } else {
            console.error(data.error);
          }
        }
      } catch (error) {
        console.error('Error submitting stock changes:', error);
      }
    };
  
    const handleSubmitPriceChanges = async (productId, newPrice) => {
      try {
        // Send the updated price data to your server
        const response = await fetch('http://localhost:8081/updateProductPrice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            newPrice,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('Product stock has been changed.');
            window.location.reload() 
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error submitting price changes:', error);
      }
    };
    

      const openLogoutModal = () => {
        setShowLogoutModal(true);
        console.log(showLogoutModal)
    };

    useEffect(() => {
      // Fetch products from your server endpoint
      const fetchProducts = async () => {
        try {
          const response = await fetch('http://localhost:8081/getProductsAdmin'); // Replace with your actual endpoint
          const data = await response.json();
          setProducts(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      fetchProducts();
    }, []);
    const closeLogoutModal = () => {
        setShowLogoutModal(false);
    };
    
      
      const confirmLogout = () => {
        // Perform logout actions here
        window.localStorage.removeItem("email");
        window.localStorage.removeItem("isLogin");
        navigate('/');
        closeLogoutModal();
        window.location.reload()
      };
      
    
  return (
    
    <div>
        <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/HomeAdmin">
                    <img className="logo" src={aieslogo}></img>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className='nav-link' to="/HomeAdmin">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className='nav-link' to="/ProductsAdmin">Products</Link>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/InquiriesAdmin">
                                Inquiries
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/cart">
                            <img className="cartSize" src={shoppingcart} alt="Shopping Cart" />
                        </NavLink>
                    </li>
                    
                    <li className="nav-item logout">
                    <button onClick={openLogoutModal}>Log Out</button>
      
                    <Logout
                        isOpen={showLogoutModal}
                        onCancel={closeLogoutModal}
                        onConfirm={confirmLogout}
                    />
                    </li>
                    
                </div>
            </nav>
        </div>
        <div>
            {/* Display your products */}
            <ul>
            {products.map((product) => (
  <div key={product.id} className="product-item">
    <li>{product.productName}</li>
    <li>
  Stock: {editingProductId === product.id && editType === 'stock' ? (
    <>
      <input
        type="text"
        value={stockChanges[product.id] !== undefined ? stockChanges[product.id] : product.productStock}
        onChange={(e) => handleStockChange(product.id, e.target.value)}
      />
      <button
        onClick={() => {
          setEditType(null); // Hide the input and disable editing
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => {
          handleSubmitStockChanges(product.id, stockChanges[product.id]);
        }}
      >
        Save Stock
      </button>
    </>
  ) : (
    <>
      <span>{product.productStock}</span>
      <button
        onClick={() => {
          handleEditClick(product.id, 'stock');
        }}
      >
        Edit Stock
      </button>
    </>
  )}
</li>


<li>
  Price: {editingProductId === product.id && editType === 'price' ? (
    <>
      <input
        type="text"
        value={priceChanges[product.id] !== undefined ? priceChanges[product.id] : product.productPrice}
        onChange={(e) => handlePriceChange(product.id, e.target.value)}
      />
      <button
        onClick={() => {
          setEditType(null); // Hide the input and disable editing
        }}
      >
        Cancel
      </button>
      <button
        onClick={() => {
          handleSubmitPriceChanges(product.id, priceChanges[product.id]);
        }}
      >
        Save Price
      </button>
    </>
  ) : (
    <>
      <span>{product.productPrice}</span>
      <button
        onClick={() => {
          handleEditClick(product.id, 'price');
        }}
      >
        Edit Price
      </button>
    </>
  )}
</li>

  </div>
))}

      </ul>


      </div>
    </div>
  )
}

export default ProductsAdmin