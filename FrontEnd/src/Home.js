import React, { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import shoppingcart from './Images/Shopping Cart.jpg'
import longChurros from './Images/Long Churros.jpg'
import condensedMilkCheeseBalls from './Images/Condensed Milk Cheese Balls.jpg'
import chocolateChipCookies from './Images/Chocolate Chip Cookies.jpg'
import aieslogo from './Images/AIEs Logo.jpg'
import brownBites from './Images/Brownie Bites.jpg'
import './Home.css'
import Slideshow from './slideShow'
import axios from 'axios';
import About from './About'
import Logout from './Logout'
import Login from './Login'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './ProductSection.css'; 
import Register from './Register';
function Home() {
  const [newItemsCount, setNewItemsCount] = useState(0);
  window.localStorage.setItem('isCheckOut', false);
  const email = window.localStorage.getItem('email')
  const UserLogin = window.localStorage.getItem("isLogin");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeLink, setActiveLink] = useState('home');
  const [isProductsLinkClicked, setProductsLinkClicked] = useState(false);
  const productsSectionRef = useRef();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate()

  const [cartItemCount, setCartItemCount] = useState(0);
  const images = [
    longChurros,
    condensedMilkCheeseBalls,
    chocolateChipCookies,
    brownBites,
  ];
  useEffect(() => {
    // Check if the refresh flag is present in localStorage
    const hasRefreshed = localStorage.getItem('hasRefreshed');

    if (hasRefreshed === 'false') {
      // Set the flag in localStorage to prevent continuous refreshes
      localStorage.setItem('hasRefreshed', true);
      // Refresh the entire browser window when the component mounts
      window.location.reload();
    }
  }, []);
  
  useEffect(() => {
    // Check if the refresh flag is present in localStorage
    const hasRefreshed = localStorage.getItem('HomehasRefreshed');

    if (hasRefreshed === 'false') {
      // Set the flag in localStorage to prevent continuous refreshes
      localStorage.setItem('HomehasRefreshed', true);

      // Refresh the entire browser window when the component mounts
      window.location.reload();
    }
  }, []);
  
  
  

  
  const openLogoutModal = () => {
    setShowLogoutModal(true);
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
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleLoginShow = () => setShowLogin(true);
  const handleLoginClose = () => setShowLogin(false);
  const [products, setProducts] = useState([]);

  
  
          const [values, setValues] = useState({
            productName: '',
            productStock: '',
            productPrice: ''
          })
          useEffect(() => {
            // Run the axios.post request when the component mounts
            const fetchData = async () => {
              try {
                await axios.post('http://localhost:8081/turnfalse');
                await axios.get('http://localhost:8081/products');
              } catch (error) {
                console.error('Error turning false:', error);
              }
            };
            fetchData();
          }, []);
          useEffect(() => {
            async function fetchData() {
              try {
                const response = await axios.get('http://localhost:8081/products');
                const newProducts = response.data.filter(
                  (newProduct) =>
                    !products.some((existingProduct) => existingProduct.id === newProduct.id)
                );
                
                if (newProducts.length > 0) {
                  setNewItemsCount(newItemsCount + newProducts.length);
                }
          
                setProducts(response.data);
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            }
          
            fetchData();
          }, [products, newItemsCount]);
          
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleButtonClick = () => {
    setShowRegisterModal(true);
  };

  const handleRegisterButtonClick = () => {
    setShowRegisterModal(true);
  };
  const handleRegisterModalClose = () => {
    setShowRegisterModal(false);
  };
  const handleLoginButtonClick = () => {
    
    setShowLoginModal(true);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
    window.location.reload()
  };
  const handleScroll = () => {
    const currentPosition = window.scrollY;
    setScrollPosition(currentPosition);
    if(currentPosition >= 81) {
      setActiveLink('products');
    } else {
      setActiveLink('home');
    
    }
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Replace 'userEmail' with the actual user's email
        const response = await fetch(`http://localhost:8081/getCartData?email=${email}`);
        const data = await response.json();
  
        // Assuming the response is an array
        setCartItemCount(data.length);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
  
    fetchCartData();
  }, []);
  
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleProductsClick = () => {
    setProductsLinkClicked(true);
    productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    setNewItemsCount(0); // Reset new items count
  };
  
  useEffect(() => {
    const handleAddtoCart = async (event) => {
      const isAddToCartButton = event.target.classList.contains('AddtoCart');
  
      if (isAddToCartButton) {
        const productName = event.target.dataset.productName;
        const productStock = event.target.dataset.productStock;
        const productPrice = event.target.dataset.productPrice;
  
        // Fetch the product quantity from the cart database
        const cartResponse = await axios.get(`http://localhost:8081/cart?email=${email}`);
        const cartProducts = cartResponse.data;
        const cartProduct = cartProducts.find(product => product.productName === productName);
        const cartQuantity = cartProduct ? cartProduct.productQuantity : 0;
  
        // Check if adding the product to the cart would exceed the stock
        if (parseInt(cartQuantity) + 1 <= parseInt(productStock)) {
          setValues({
            productName,
            productStock,
            productPrice
          });
  
          const userEmail = window.localStorage.getItem('email');
          if (UserLogin) {
            try {
              await axios.post('http://localhost:8081/addtocart', {
                productName,
                productStock,
                productPrice,
                userEmail
              });
              alert("Item has been added to cart successfully")
            } catch (error) {
              console.log(error);
            }
          } else {
            // User is not logged in, open the login modal
            handleLoginButtonClick();
          }
        } else {
          // Show an alert or handle the case where adding to the cart exceeds the stock
          alert('Cannot add more items to the cart. Stock limit reached.');
        }
      }
    };
  
    window.addEventListener('click', handleAddtoCart);
  
    return () => {
      window.removeEventListener('click', handleAddtoCart);
    };
  }, [UserLogin]);
  

  useEffect(() => {
    const handleButtonClick = async (event) => {
      const isBuyNowButton = event.target.classList.contains('BuyNow');
      if (isBuyNowButton) {
        const productName = event.target.dataset.productName;
        const productStock = event.target.dataset.productStock;
        const productPrice = event.target.dataset.productPrice;
  
        setValues({
          productName,
          productStock,
          productPrice
        });
        if (UserLogin) {
          try {
            await axios.post('http://localhost:8081/buyNow', {
              productName,
              productStock,
              productPrice,
            });
            navigate('/CheckOut')
          } catch (error) {
            console.log(error);
          }
        } else {
          // User is not logged in, open the login modal
          handleLoginButtonClick();
        }
      }
    };
  
    window.addEventListener('click', handleButtonClick);
  
    return () => {
      window.removeEventListener('click', handleButtonClick);
    };
  }, [UserLogin]);
  
  
  
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
        {UserLogin ? (
          <li className="nav-item">
          
          <NavLink className="nav-link" to="/Cart">
          {cartItemCount > 0 && <span>{cartItemCount}</span>}
            <img className="cartSize" src={shoppingcart} alt="Shopping Cart" />
            
          </NavLink>
          
        </li>
        ): (
          <div></div>
        )}
          
          {UserLogin ? (
      <div>
        <NavLink to="/AccountDetails">{email}</NavLink>
        <li className="nav-item logout">
      
      <button onClick={openLogoutModal}>Log Out</button>

<Logout
  isOpen={showLogoutModal}
  onCancel={closeLogoutModal}
  onConfirm={confirmLogout}
/>
    </li>
      </div>
      
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
      <div className="slideshow-container" style={{ maxHeight: '850px', overflow: 'hidden' }}>
    <Slideshow images={images} />
    </div>

  
    <div>
    {products.length > 0 && (
      <Container className="mt-5">
        <div className="products-section" ref={productsSectionRef}>
        <div>
          <h1>Products</h1>
          <Row>
            {products.map((product) => (
              <Col key={product.id} md={6} lg={4}>
                <Card><Card.Img
                      variant="top"
                      src={require(`./Images/${product.productName}.jpg`)}
                      className="imageSize mx-auto mt-3"
                    />


                  <Card.Body className="text-center">
                    <Card.Title>{product.productName}</Card.Title>
                    <Card.Text>Stock {product.productStock}</Card.Text>
                    <Card.Text>Price {product.productPrice}</Card.Text>
                    <div className="d-flex justify-content-around">
                    
                    <button className="AddtoCart" 
                    data-product-name={product.productName}
                    data-product-stock={product.productStock}
                    data-product-price={product.productPrice.toString()}>
                      Add to Cart
                    </button>
                    <button className="BuyNow"
                    data-product-name={product.productName}
                    data-product-stock={product.productStock}
                    data-product-price={product.productPrice.toString()}>Buy Now</button>
                        
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          </div>
        </div>
      </Container>
    )}

    </div>
    
  </div>
  );
}

export default Home;
