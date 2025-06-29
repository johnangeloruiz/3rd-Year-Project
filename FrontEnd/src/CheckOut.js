import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import aieslogo from './Images/AIEs Logo.jpg'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logout from './Logout'
import shoppingcart from './Images/Shopping Cart.jpg'
import Login from './Login'
import Register from './Register';
function CheckOut() {
    window.localStorage.setItem('isCheckOut', true);
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState(Array(products.length).fill(1));
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const productsSectionRef = useRef();
    const [isProductsLinkClicked, setProductsLinkClicked] = useState(false);
    const [activeLink, setActiveLink] = useState('home');
    const userEmail = window.localStorage.getItem("email")
    const UserLogin = window.localStorage.getItem("isLogin");
    const [isPaymentSelected, setIsPaymentSelected] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  const [isCheckOut, setIsCheckOut] = useState(false);
  const navigate = useNavigate();
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const handleProductsClick = () => {
        setProductsLinkClicked(true);
        productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      };
  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };
  const handleRegisterButtonClick = () => {
    setShowRegisterModal(true);
  };
  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
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

  const handlePurchase = async () => {
  try {
    if (!isPaymentSelected) {
      // If the radio button is not selected, show an error message and return
      alert('Please choose "Cash On Delivery" before checking out.');
      return;
    }
    // Retrieve the email from localStorage
    const userEmail = window.localStorage.getItem('email');

    // Make a request to the /purchase endpoint
    const response = await axios.post('http://localhost:8081/purchase', {
      email: userEmail,
      
      // Include any other data needed for the purchase logic
    });
    
    // Check if the response includes a requireRedirect flag
    
    if (response.data.requireRedirect) {
      // Redirect to the specified page
      navigate('/SetupAccount');
    } else {
      const orderDetailsResponse = await axios.post('http://localhost:8081/orderPurchaseDetails', {
        email: userEmail,
        paymentMethod: 'Cash On Delivery', // Add the selected payment method here
        // Include any other order details you want to insert
      });
      await updateIsCheckOut();
      alert('Purchase Complete Please wait for the approval of the owner.')
      navigate('/')
    }
  } catch (error) {
    console.error('Error during purchase:', error);
    // Handle other error cases
  }
};

  
const openLogoutModal = () => {
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

  const handleLoginButtonClick = () => {
    
    setShowLoginModal(true);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8081/checkoutcod');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

    // Retrieve isCheckOut from localStorage on component mount
    setIsCheckOut(false); // Set isCheckOut to false on mount
  const storedIsCheckOut = localStorage.getItem('isCheckOut');
  if (storedIsCheckOut !== null) {
    setIsCheckOut(storedIsCheckOut === 'true');
  }

  // Cleanup function
  return () => {
    // Update isCheckOut when navigating to a different page
    setIsCheckOut(false);
    localStorage.setItem('isCheckOut', 'false');
  };
}, []);
    
      
      
  return (
    <div>
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
        <Container className="mt-5">
          <div className="products-section" ref={productsSectionRef}>
            <h1>Cart</h1>
            <Row>
              {products.map((product, index) => (
                <Col key={product.id} md={6} lg={4}>
                  
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
                        
                        <Card.Text>Quantity {product.productQuantity}</Card.Text>
                        <Card.Text></Card.Text>

                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          <div>
          <h2>Type of Payment</h2>
          <input
            type="radio"
            required
            onChange={() => setIsPaymentSelected(true)} // Set the state when the radio button is selected
          />
          <span>Cash On Delivery</span>
          <br />
          {/* Add a conditional error message */}
          {!isPaymentSelected && <p style={{ color: 'red' }}>Please choose a payment method before checking out.</p>}
          <button onClick={handlePurchase}>Purchase</button>
        </div>
        </Container>
    </div>
  )
}

export default CheckOut