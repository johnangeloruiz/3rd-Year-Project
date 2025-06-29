import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import aieslogo from './Images/AIEs Logo.jpg'
import { Link, NavLink, useNavigate  } from 'react-router-dom';
import shoppingcart from './Images/Shopping Cart.jpg'
import Login from './Login'
import Register from './Register';
import Logout from './Logout'
function Cart() {
  localStorage.setItem('hasRefreshed', false);
  window.localStorage.setItem('isCheckOut', false);
  const [isCheckOut, setIsCheckOut] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const UserLogin = window.localStorage.getItem("isLogin");
  const [quantities, setQuantities] = useState(Array(products.length).fill(1));
  const [activeLink, setActiveLink] = useState('home');
  const [isProductsLinkClicked, setProductsLinkClicked] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);
  const [inputValue, setInputValue] = useState(false || '');
  const [isLoading, setIsLoading] = useState(true);
  const email = window.localStorage.getItem('email')
const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchData = async () => {
    try {
      await axios.post('http://localhost:8081/turnfalse');
      const response = await axios.get('http://localhost:8081/cart');
      setProducts(response.data);

      // Extract product quantities from the response and set the initial state
      const initialQuantities = response.data.map((product) => product.productQuantity || 1);
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  
  const handleProductsClick = () => {
    setProductsLinkClicked(true);
    productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const handleRegisterButtonClick = () => {
    setShowRegisterModal(true);
  };
  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
  };
 
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };
  const handleQuantityChange = (index, newQuantity) => {
    // Parse the new quantity to an integer
    const parsedQuantity = parseInt(newQuantity, 10);
  
    // Check if the new quantity is a valid integer and not greater than productStock
    if (!isNaN(parsedQuantity) && parsedQuantity >= 1 && parsedQuantity <= products[index].productStock) {
      // Update the quantities state
      const newQuantities = [...quantities];
      newQuantities[index] = parsedQuantity;
      setQuantities(newQuantities);
    }
  };
const handleLoginButtonClick = () => {
    
  setShowLoginModal(true);
};const openLogoutModal = () => {
  setShowLogoutModal(true);
  console.log(showLogoutModal)
};

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
const handleCheckboxChange = (index) => {
  const updatedProducts = [...products];
  updatedProducts[index].isChecked = !updatedProducts[index].isChecked;
  setProducts(updatedProducts);
};

const handleRemoveItem = async (index) => {
  try {
    
    // Send a request to remove the item from the cart based on its productName
    const response = await axios.post('http://localhost:8081/removeItem', {
      productName: products[index].productName,
    });

    if (response.data.success) {
      // Update the state to reflect the removal
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
    } else {
      // Handle removal failure
      console.error('Item removal failed:', response.data.message);
    }
  } catch (error) {
    console.error('Error during item removal:', error);
  }
};
const updateIsCheckOut = async () => {
  try {
    setIsLoading(true);

    // Update isCheckOut in the component state
    // Save the updated isCheckOut value to localStorage
    localStorage.setItem('isCheckOut', 'false');

    // Get the list of checked items from the products state
    const checkedItems = products.filter((product) => product.isChecked);

    // Update the isCheckOut in the database
    const response = await axios.post('http://localhost:8081/updateAllCheckOut', {
      checkedItems: checkedItems,
    });

    console.log('isCheckOut updated to false in the database:', response.data);
  } catch (error) {
    console.error('Error updating isCheckOut:', error);
    // Log the detailed error information for debugging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  } finally {
    setIsLoading(false);
  }
};




useEffect(() => {
  localStorage.setItem('isCheckOut', 'false');
  setIsCheckOut(false);

  // Cleanup function for when the component is about to unmount
  return () => {
    // Update isCheckOut when navigating away from the Cart page
    updateIsCheckOut();
  };

}, []);





const handleBeforeUnload = () => {
  // Update the localStorage before leaving the page
  window.localStorage.setItem('isCheckOut', 'false');
};
const handleCheckout = async () => {
  try {
    // Check if at least one item is selected for checkout
    const checkedItems = products.filter((product) => product.isChecked);
    if (checkedItems.length === 0) {
      console.log('Please select at least one item for checkout.');
      return;
    }

    // Set a loading state to indicate that the checkout is in progress
    setCheckoutInProgress(true);

    // Get the current value of isCheckOut from the localStorage
    const isCheckOut = window.localStorage.getItem('isCheckOut') === 'true';

    // Convert isCheckOut to a boolean
    const isCheckOutBool = isCheckOut === 'true';

    // Update isCheckOut in the database for checked items
    const response = await axios.post('http://localhost:8081/updateAllCheckOut', {
      isCheckOut: isCheckOutBool,
      checkedItems,
    });

    console.log(response.data);

    // Redirect to the Checkout page
    navigate('/CheckOut');
  } catch (err) {
    console.error('Error during checkout:', err);
  } finally {
    // Reset the loading state
    setCheckoutInProgress(false);
  }
};



useEffect(() => {
  const handleBeforeUnload = () => {
    // Update the localStorage before leaving the page
    window.localStorage.setItem('isCheckOut', 'false');
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  // Cleanup function
  return () => {
    // Update isCheckOut when navigating away from the Cart page
    updateIsCheckOut();
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);







  const productsSectionRef = useRef();

 useEffect(() => {
  async function fetchData() {
    try {
      // Pass the user's email as a query parameter to the /cart endpoint
      const response = await axios.get(`http://localhost:8081/cart?email=${email}`);
      setProducts(response.data);

      // Extract product quantities from the response and set the initial state
      const initialQuantities = response.data.map((product) => product.productQuantity || 1);
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Fetch data only if the user's email is available
  if (email) {
    fetchData();
  }
}, [email]);

  return (
    <div className='"main-container"'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          <img className="logo"src={aieslogo}></img>
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
              <Link
                className={activeLink === 'home' ? 'nav-link active' : 'nav-link'}
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={activeLink === 'products' ? 'nav-link active' : 'nav-link'}
                to="/#products"
                onClick={handleProductsClick}
              >
                Products
              </Link>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/About">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Contacts">
                Contacts
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/Cart">
              <img className="cartSize" src={shoppingcart} alt="Shopping Cart" />
            </NavLink>
          </li>
          {UserLogin ? (
            <li className="nav-item logout">

            <button onClick={openLogoutModal}>Log Out</button>
                  
                  <Logout
                      isOpen={showLogoutModal}
                      onCancel={closeLogoutModal}
                      onConfirm={confirmLogout}
                  />
            </li>
          ) : (
            <li className="nav-item  logout">
               <button className='loginbtn' onClick={handleLoginButtonClick} >Login</button>
               {showLoginModal && <Login showModal={showLoginModal} onClose={handleLoginModalClose} />}
               
               <button type="button" className="registerbtn" onClick={handleRegisterButtonClick}>
        Register
      </button>

               {showRegisterModal && <Register showModal={showRegisterModal} onClose={handleRegisterModalClose}/>}

            </li>
          )}
        </div>
      </nav>
      
    
    <div>
    
      
      {products.length > 0 && (
        <Container className="mt-5">
          <div className="products-section" ref={productsSectionRef}>
            <h1>Cart</h1>
            <Row>
              {products.map((product, index) => (
                <Col key={product.id} md={6} lg={4}>
                  <input type='checkbox'
                  value={inputValue}
                  checked={product.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                  ></input>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={require(`./Images/${product.productName}.jpg`)}
                      className="imageSize mx-auto mt-3"
                    />
                    <Card.Body className="text-center">
                      <Card.Title>{product.productName}</Card.Title>
                      <Card.Text>Stock {product.productStock}</Card.Text>
                      <Card.Text>Price {product.productPrice}</Card.Text>
                      <Card.Text>Total Price {product.totalPrice}</Card.Text>
                      <div className="d-flex justify-content-around">
                        <Button variant="primary" className="me-2" onClick={() => handleQuantityChange(index, -1)}>
                          -
                        </Button>
                        <Card.Text>Quantity</Card.Text>
                        <input
    type="number"
    value={quantities[index]}
    onChange={(e) => handleQuantityChange(index, e.target.value)}
    className="quantity-input"
  />
                        <Button variant="success" className="ms-2" onClick={() => handleQuantityChange(index, 1)}>
                          +
                        </Button>
                        <Button variant="danger" onClick={() => handleRemoveItem(index)}>X</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          <div>
          <button onClick={handleCheckout} disabled={checkoutInProgress}>
        {checkoutInProgress ? 'Checking Out...' : 'Check Out'}
      </button>
          </div>
        </Container>
      )}
    </div>
    </div>
  );
}

export default Cart;
