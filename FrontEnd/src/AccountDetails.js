import React, { useState, useEffect, useRef } from 'react';
import UpdatePassword from './UpdatePassword';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import shoppingcart from './Images/Shopping Cart.jpg'
import aieslogo from './Images/AIEs Logo.jpg'
import UpdateMeetUpPlace from './UpdateMeetUpPlace';
import UpdateSelectedLocation from './UpdateSelectedLocation';
import UpdateCellphoneNumber from './UpdateCellphoneNumber'
import Register from './Register';
import Logout from './Logout'
import axios from 'axios';
import Login from './Login'
import AccountChangeDetails from './AccountChangeDetails';
import AccountOrders from './AccountOrders';
function AccountDetails() {
  const [orderStatus, setOrderStatus] = useState({});
  const [selectedSale, setSelectedSale] = useState(null);
  const [waitingApprovalSales, setWaitingApprovalSales] = useState([]);
  const [approvedSales, setApprovedSales] = useState([]);
  const [cancelledSales, setCancelledSales] = useState([]);
  const [completedSales, setCompletedSales] = useState([]);
  const UserLogin = window.localStorage.getItem("isLogin");
  const [activeLink, setActiveLink] = useState('home');
  const email = window.localStorage.getItem('email');
  const [isProductsLinkClicked, setProductsLinkClicked] = useState(false);
  const productsSectionRef = useRef();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [newItemsCount, setNewItemsCount] = useState({
    'Needs Approval': { count: 0, checked: false },
    'Approved': { count: 0, checked: false },
    'Cancelled': { count: 0, checked: false },
    'Completed': { count: 0, checked: false },
  });
  const [activeSection, setActiveSection] = useState(null);
  const [accountData, setAccountData] = useState(null);

  const sections = ['Account Details', 'Orders']; // Add or modify sections as needed
  const [activeSectionMain, setActiveSectionMain] = useState(null);
  const handleSectionMainClick = (section) => {
    setActiveSectionMain(section);
  };

  useEffect(() => {
    // Fetch account data when the component mounts
    fetchAccountData();
  }, []);
  // Add handlers for other modals if needed
  const [isUpdatePasswordModalOpen, setUpdatePasswordModalOpen] = useState(false);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };
  const handleProductsClick = () => {
    setProductsLinkClicked(true);
    productsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    setNewItemsCount(0); // Reset new items count
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
  const [orders, setOrders] = useState([]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };
  useEffect(() => {
    fetchAccountData();
  }, []);
  const fetchAccountData = async () => {
    try {
      const response = await fetch(`http://localhost:8081/getDataAccount?email=${email}`);
      const data = await response.json();
      setAccountData(data.account);
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  const fetchSalesData = async () => {
    try {
      let response;

      if (activeSection === 'Needs Approval') {
        try {
          const response = await axios.get('http://localhost:8081/getOrdersWaiting', {
            params: { email: email },
          });
          setWaitingApprovalSales(response.data);
        } catch (error) {
          console.error('Error fetching waiting orders:', error);
        }
      }
      else if (activeSection === 'Approved') {
        response = await axios.get('http://localhost:8081/getSalesApproved');
        setApprovedSales(response.data);
      } else if (activeSection === 'Cancelled') {
        response = await axios.get('http://localhost:8081/getSalesCancelled');
        setCancelledSales(response.data);
      } else if (activeSection === 'Completed') {
        response = await axios.get('http://localhost:8081/getSalesCompleted');
        setCompletedSales(response.data);
      }

      // Sort sales based on date in descending order
      response.data.sort((a, b) => new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase));
    } catch (error) {
      console.error(`Error fetching ${activeSection} items:`, error);
    }
  };
  const handleCancelOrderClick = async (saleId) => {
    try {
      // Fetch order details based on saleId
      const orderResponse = await axios.get(`http://localhost:8081/getOrderDetails?saleId=${saleId}`);

      // Check if order details are available
      if (!orderResponse.data || !orderResponse.data.order) {
        console.error('Order details not found for the specified saleId.');
        return;
      }

      // Extract buyer email from order details
      const buyerEmail = orderResponse.data.order.buyer;

      // Send a POST request to the server to cancel the order
      await axios.post('http://localhost:8081/cancelOrder', { saleId });

      // After cancellation, fetch the updated list of waitingApprovalSales
      const response = await axios.get('http://localhost:8081/getSalesWaiting');
      setWaitingApprovalSales(response.data);

      // ... (Update other sales lists if needed)

      setSelectedSale(null);
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8081/getOrders?email=${email}`);

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();

      if (data && data.orders) {
        setOrders(data.orders);
        // Initialize order status
        const statusObj = {};
        data.orders.forEach((order) => {
          statusObj[order.orderId] = 'Pending'; // Set initial status
        });
        setOrderStatus(statusObj);
      } else {
        console.error('Error: Orders data is missing or undefined.');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSectionAccountClick = (section) => {
    // Set the active section
    setActiveSection(section);
    if (section === 'Orders') {
    } else if (section === 'Account Details') {
    } else {
    }
  };

  useEffect(() => {
    fetchAccountData();
    fetchOrders(); // Fetch orders when the component mounts
  }, []);

  const handleOrderStatusChange = (orderId, status) => {
    setOrderStatus((prevStatus) => ({
      ...prevStatus,
      [orderId]: status,
    }));
  };
  useEffect(() => {
    fetchSalesData();
  }, [activeSection]);



  useEffect(() => {
    fetchAccountData();
  }, []);

  const handleUpdatePasswordClick = () => {
    setUpdatePasswordModalOpen(true);
  };

  const handleCloseModal = () => {
    setUpdatePasswordModalOpen(false);
  };
  // Assume you have a function to fetch account data from your backend
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


  return (
    <div>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
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

                {showRegisterModal && <Register showModal={showRegisterModal} onClose={handleRegisterModalClose} />}

              </li>
            )}
          </div>
        </nav>
      </div>
      <div>
        <div className="clickable-sections">
          {sections.map((section) => (
            <h6
              key={section}
              className={`clickable-section ${activeSectionMain === section ? 'active-section' : ''}`}
              onClick={() => handleSectionMainClick(section)}
            >
              {section}
            </h6>
          ))}
        </div>

        {activeSectionMain === 'Account Details' && (
          <div>
            <AccountChangeDetails />
          </div>
        )}

        {activeSectionMain === 'Orders' && (
          <div>
            <AccountOrders />
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountDetails;
