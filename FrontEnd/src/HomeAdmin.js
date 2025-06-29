import React, { useState, useEffect } from 'react'
import aieslogo from './Images/AIEs Logo.jpg'

import axios from 'axios'
import Logout from './Logout'
import shoppingcart from './Images/Shopping Cart.jpg'
import { Link, NavLink, useNavigate } from 'react-router-dom';
function HomeAdmin() {
  const UserLogin = window.localStorage.getItem("isLogin");
  const sections = ['Needs Approval', 'Approved', 'Cancelled', 'Completed'];
  const [newItemsCount, setNewItemsCount] = useState({
    'Needs Approval': { count: 0, checked: false },
    'Approved': { count: 0, checked: false },
    'Cancelled': { count: 0, checked: false },
    'Completed': { count: 0, checked: false },
  });
  const [sales, setSales] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [waitingApprovalSales, setWaitingApprovalSales] = useState([]);
  const [approvedSales, setApprovedSales] = useState([])
  const [cancelledSales, setCancelledSales] = useState([])
  const [completedSales, setCompletedSales] = useState([])
  const [selectedSale, setSelectedSale] = useState(null);
  const [onDeliveryClicked, setOnDeliveryClicked] = useState([]);
  const getOnClickDelivery = JSON.parse(window.localStorage.getItem('onDeliveryClicked')) || [];

const handleOnDeliveryClick = async (saleId, productName, buyer) => {
  try {
    // Update the UI state to reflect that the "On Delivery" button is clicked
    setOnDeliveryClicked((prevClicked) => [...prevClicked, saleId]);

    // Save onDeliveryClicked to localStorage
    localStorage.setItem('onDeliveryClicked', JSON.stringify([...getOnClickDelivery, saleId]));

    // Send a POST request to update the delivery status on the server
    await axios.post('http://localhost:8081/itemOnDelivery', { saleId, productName, buyer });

    // After updating the delivery status, fetch the updated list of sales or perform any additional UI updates as needed
    await fetchUpdatedSales();

    // Add any additional UI updates here
  } catch (error) {
    console.error('Error updating delivery status:', error);
    // Handle error, e.g., display an error message to the user
  }
};

  
  
  const handleMoreInfoClick = (sale) => {
    if (selectedSale && selectedSale.id === sale.id) {
      // If the selected sale is already the current sale, hide the details
      setSelectedSale(null);
    } else {
      // Otherwise, show the details for the current sale
      setSelectedSale(sale);
    }
  };
  const handleApproveClick = async (productName) => {
    try {
      console.log(productName)
      // Send a POST request to the server to update the adminApproval status
      await axios.post('http://localhost:8081/setSalesApprove', { productName });
      
      // After approval, fetch the updated list of waitingApprovalSales
      const response = await axios.get('http://localhost:8081/getSalesWaiting');
      setWaitingApprovalSales(response.data);
  
      const approvedSaleResponse = await axios.get('http://localhost:8081/getSalesApproved');
      setApprovedSales(approvedSaleResponse.data);
  
      const cancelledSaleResponse = await axios.get('http://localhost:8081/getSalesCancelled')
      setCancelledSales(cancelledSaleResponse.data);
  
      const completedSaleResponse = await axios.get('http://localhost:8081/getSalesCompleted')
      setCompletedSales(completedSaleResponse.data);
  
    } catch (error) {
      console.error('Error approving sale:', error);
    }
  };
  
  const fetchUpdatedSales = async () => {
    try {
      const waitingApprovalResponse = await axios.get('http://localhost:8081/getSalesWaiting');
      setWaitingApprovalSales(waitingApprovalResponse.data);
  
      const approvedSaleResponse = await axios.get('http://localhost:8081/getSalesApproved');
      setApprovedSales(approvedSaleResponse.data);
  
      const cancelledSaleResponse = await axios.get('http://localhost:8081/getSalesCancelled');
      setCancelledSales(cancelledSaleResponse.data);
  
      const completedSaleResponse = await axios.get('http://localhost:8081/getSalesCompleted');
      setCompletedSales(completedSaleResponse.data);
  
      setSelectedSale(null);
    } catch (error) {
      console.error('Error fetching updated sales:', error);
    }
  };
  
  const handleDeclineClick = async (productName) => {
    try {
      await axios.post('http://localhost:8081/setSalesCancelled', { productName });
      await fetchUpdatedSales();
    } catch (error) {
      console.error('Error declining sale:', error);
    }
  };
  
  const handleCompletedClick = async (productName) => {
    try {
      await axios.post('http://localhost:8081/setSalesCompleted', { productName });
      await fetchUpdatedSales();
    } catch (error) {
      console.error('Error completing sale:', error);
    }
  };
  
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate()
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
  const handleSectionClick = async (section) => {
    setActiveSection(section);

    try {
      let waiting, completed, cancelled, approved;

      // Fetch the data based on the clicked section
      if (section === 'Needs Approval') {
        console.log('Fetching Needs Approval data...');
        // Fetch the count of items with the new value in newItem
        const countResponse = await axios.get('http://localhost:8081/getItemsAdminWaiting');

        // Log the data to the console
        console.log(countResponse.data);

        // Assuming the count is available in the response
        const newItemCount = countResponse.data.count;
        await axios.post('http://localhost:8081/updateProductWaitingAdmin');

        // Update the count in the state based on the fetched data
        setNewItemsCount((prevCounts) => ({
          ...prevCounts,
          [section]: {
            count: newItemCount,
            checked: true,
          },
        }));

        // Update the waitingApprovalSales state with the fetched data
        setWaitingApprovalSales(countResponse.data);
        console.log(countResponse.data);
      }
      else if (section === 'Approved') {
        const countResponse = await axios.get('http://localhost:8081/getItemsAdminApproved');

        // Assuming the count is available in the response
        const newItemCount = countResponse.data.count;
        await axios.post('http://localhost:8081/updateProductApprovedAdmin');
        // Update the count in the state based on the fetched data
        setNewItemsCount((prevCounts) => ({
          ...prevCounts,
          [section]: {
            count: newItemCount,
            checked: true,
          },
        }));
      } else if (section === 'Completed') {
        const countResponse = await axios.get('http://localhost:8081/getItemsAdminCompleted');

        // Assuming the count is available in the response
        const newItemCount = countResponse.data.count;
        await axios.post('http://localhost:8081/updateProductCompletedAdmin');
        // Update the count in the state based on the fetched data
        setNewItemsCount((prevCounts) => ({
          ...prevCounts,
          [section]: {
            count: newItemCount,
            checked: true,
          },
        }));
      } else if (section === 'Cancelled') {
        const countResponse = await axios.get('http://localhost:8081/getItemsAdminCancelled');

        // Assuming the count is available in the response
        const newItemCount = countResponse.data.count;
        await axios.post('http://localhost:8081/updateProductCancelledAdmin');
        // Update the count in the state based on the fetched data
        setNewItemsCount((prevCounts) => ({
          ...prevCounts,
          [section]: {
            count: newItemCount,
            checked: true,
          },
        }));
      }

      // Fetch the detailed data based on the clicked section
      waiting = await axios.get(`http://localhost:8081/getSalesWaiting`);
      approved = await axios.get(`http://localhost:8081/getSalesApproved`);
      cancelled = await axios.get(`http://localhost:8081/getSalesCancelled`);
      completed = await axios.get(`http://localhost:8081/getSalesCompleted`);

      // Update the data in your component state based on the fetched data
      if (section === 'Needs Approval') {
        setWaitingApprovalSales(waiting.data);
      } else if (section === 'Approved') {
        setApprovedSales(approved.data);
      }
      else if (section === 'Cancelled') {
        setApprovedSales(cancelled.data);
      }
      else if (section === 'Completed') {
        setApprovedSales(completed.data);
      }

    } catch (error) {
      console.error(`Error fetching ${section} items:`, error);
    }
  };







  const updateNewItemsCount = async () => {
    try {
      const responseWaiting = await axios.get('http://localhost:8081/getItemsAdminWaiting');
      const responseApproved = await axios.get('http://localhost:8081/getSalesApproved');
      const responseCancelled = await axios.get('http://localhost:8081/getSalesCancelled');
      const responseCompleted = await axios.get('http://localhost:8081/getSalesCompleted');

      console.log(responseWaiting.data.length);
      console.log(responseApproved.data.length);
      console.log(responseCancelled.data.length);
      console.log(responseCompleted.data.length);

      setNewItemsCount((prevCounts) => ({
        'Needs Approval': {
          count: responseWaiting.data.length,
          checked: true,
        },
        'Approved': {
          count: responseApproved.data.length,
          checked: true,
        },
        'Cancelled': {
          count: responseCancelled.data.length,
          checked: true,
        },
        'Completed': {
          count: responseCompleted.data.length,
          checked: true,
        },
      }));
    } catch (error) {
      console.error('Error updating new items count:', error);
    }
  };

  useEffect(() => {
    updateNewItemsCount();
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const responseWaiting = await axios.get('http://localhost:8081/getSalesWaiting');
        const responseApproved = await axios.get('http://localhost:8081/getSalesApproved');
        const responseCancelled = await axios.get('http://localhost:8081/getSalesCancelled');
        const responseCompleted = await axios.get('http://localhost:8081/getSalesCompleted');

        // Sort sales based on date in descending order
        responseWaiting.data.sort((a, b) => new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase));
        responseApproved.data.sort((a, b) => new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase));
        responseCancelled.data.sort((a, b) => new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase));
        responseCompleted.data.sort((a, b) => new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase));

        // Update the counts and sales data
        setNewItemsCount((prevCounts) => ({
          'Needs Approval': {
            count: responseWaiting.data.length,
            checked: prevCounts['Needs Approval'].checked,
          },
          'Approved': {
            count: responseApproved.data.length,
            checked: prevCounts['Approved'].checked,
          },
          'Cancelled': {
            count: responseCancelled.data.length,
            checked: prevCounts['Cancelled'].checked,
          },
          'Completed': {
            count: responseCompleted.data.length,
            checked: prevCounts['Completed'].checked,
          },
        }));

        setWaitingApprovalSales(responseWaiting.data);
        setApprovedSales(responseApproved.data);
        setCancelledSales(responseCancelled.data);
        setCompletedSales(responseCompleted.data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    };

    fetchSales();
  }, []);


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


      <div className="clickable-sections">
        {sections.map((section) => (
          <h6
            key={section}
            className={`clickable-section ${activeSection === section ? 'active-section' : ''}`}
            onClick={() => handleSectionClick(section)}
          >
            {section}
            {newItemsCount[section].checked && <span>({newItemsCount[section].count})</span>}
          </h6>
        ))}
      </div>
      {activeSection === 'Needs Approval' && (
        <div>
          <h6>number</h6>
          <h6 className="clickable-section">Needs Approval</h6>
          {waitingApprovalSales.map((sale) => (
            <div key={sale.id}>
              {/* Display details for each sale needing approval */}
              <p>Product Name: {sale.productName}</p>
              <p>Product Stock: {sale.productStock}</p>
              <p>Product Quantity: {sale.productQuantity}</p>
              <p>Total Price {sale.totalPrice}</p>
              <p>Buyer First Name {sale.firstname}</p>
              <p>Buyer Last Name {sale.lastname}</p>
              <p>Buyer Email {sale.buyer}</p>
              {/* Additional info shown when the sale is selected */}
              {selectedSale && selectedSale.id === sale.id && (
                <div>
                  <p>Date of Purchase {sale.dateOfPurchase}</p>
                  <p>Time of Purchase {sale.timeOfPurchase}</p>
                  <p>Selected Location {sale.selectedlocation}</p>
                  <p>Product Price {sale.productPrice}</p>
                  <p>+</p>
                  <p>Shipping Fee {sale.shippingFee}</p>
                  <p>= {sale.totalPrice}</p>
                  <p>Cellphone Number {sale.cellphoneNumber}</p>
                  <p>MeetUp Place {sale.meetUpPlace}</p>
                  <button onClick={() => handleMoreInfoClick(sale)}>Hide Info</button>
                </div>
              )}

              {/* "More Info" button */}
              {!selectedSale && (
                <button onClick={() => handleMoreInfoClick(sale)}>More Info</button>
              )}
              <button onClick={() => handleApproveClick(sale.productName)}>√</button>
              <button onClick={() => handleDeclineClick(sale.productName)}>X</button>
              <br />


            </div>
          ))}


        </div>
      )}

      {activeSection === 'Approved' && (
        <div>
          <h6 className="clickable-section">Approved</h6>
          {/* Map over the sales that are already approved */}
          {approvedSales.map((sale) => (
            <div key={sale.id}>
              {/* Display details for each approved sale */}
              <p>Product Name: {sale.productName}</p>
              <p>Product Stock: {sale.productStock}</p>
              <p>Product Quantity: {sale.productQuantity}</p>
              <p>Total Price {sale.totalPrice}</p>
              <p>Buyer First Name {sale.firstname}</p>
              <p>Buyer Last Name {sale.lastname}</p>
              <p>Buyer Email {sale.buyer}</p>
              {/* Additional info shown when the sale is selected */}
              {selectedSale && selectedSale.id === sale.id && (
                <div>
                  <p>Date of Purchase {sale.dateOfPurchase}</p>
                  <p>Time of Purchase {sale.timeOfPurchase}</p>
                  <p>Selected Location {sale.selectedlocation}</p>
                  <p>Product Price {sale.productPrice}</p>
                  <p>+</p>
                  <p>Shipping Fee {sale.shippingFee}</p>
                  <p>= {sale.totalPrice}</p>
                  <p>Cellphone Number {sale.cellphoneNumber}</p>
                  <p>MeetUp Place {sale.meetUpPlace}</p>
                  <button onClick={() => handleMoreInfoClick(sale)}>Hide Info</button>
                </div>
              )}

              {/* "More Info" button */}
              {!selectedSale && (
                <button onClick={() => handleMoreInfoClick(sale)}>More Info</button>
              )}
              {/* "On Delivery" button */}
              <button
                disabled={onDeliveryClicked.includes(sale.id)}
                onClick={() => handleOnDeliveryClick(sale.id, sale.productName, sale.buyer)}

              >
                On Delivery
              </button>

              {/* "Delivered" button */}
              <button
                disabled={!onDeliveryClicked.includes(sale.id)}
                onClick={() => handleCompletedClick(sale.productName)}
              >
                Delivered
              </button>

              <br />
            </div>
          ))}
        </div>
      )}

      {activeSection === 'Cancelled' && (
        <div>
          <h6 className="clickable-section">Cancelled</h6>
          {/* Map over the sales that are already cancelled */}
          {cancelledSales.map((sale) => (
            <div key={sale.id}>
              {/* Display details for each cancelled sale */}
              <p>Product Name: {sale.productName}</p>
              <p>Product Stock: {sale.productStock}</p>
              <p>Product Quantity: {sale.productQuantity}</p>
              <p>Total Price {sale.totalPrice}</p>
              <p>Buyer First Name {sale.firstname}</p>
              <p>Buyer Last Name {sale.lastname}</p>
              <p>Buyer Email {sale.buyer}</p>
              {/* Additional info shown when the sale is selected */}
              {selectedSale && selectedSale.id === sale.id && (
                <div>
                  <p>Date of Purchase {sale.dateOfPurchase}</p>
                  <p>Time of Purchase {sale.timeOfPurchase}</p>
                  <p>Selected Location {sale.selectedlocation}</p>
                  <p>Product Price {sale.productPrice}</p>
                  <p>+</p>
                  <p>Shipping Fee {sale.shippingFee}</p>
                  <p>= {sale.totalPrice}</p>
                  <p>Cellphone Number {sale.cellphoneNumber}</p>
                  <p>MeetUp Place {sale.meetUpPlace}</p>
                  <button onClick={() => handleMoreInfoClick(sale)}>Hide Info</button>
                </div>
              )}

              {/* "More Info" button */}
              {!selectedSale && (
                <button onClick={() => handleMoreInfoClick(sale)}>More Info</button>
              )}

              <br />
            </div>
          ))}
        </div>
      )}

      {activeSection === 'Completed' && (
        <div>
          <h6 className="clickable-section">Completed</h6>

          {/* Map over the sales that are already cancelled */}
          {completedSales.map((sale) => (
            <div key={sale.id}>
              {/* Display details for each cancelled sale */}
              <p>Product Name: {sale.productName}</p>
              <p>Product Stock: {sale.productStock}</p>
              <p>Product Quantity: {sale.productQuantity}</p>
              <p>Total Price {sale.totalPrice}</p>
              <p>Buyer First Name {sale.firstname}</p>
              <p>Buyer Last Name {sale.lastname}</p>
              <p>Buyer Email {sale.buyer}</p>
              {/* Additional info shown when the sale is selected */}
              {selectedSale && selectedSale.id === sale.id && (
                <div>
                  <p>Date of Purchase {sale.dateOfPurchase}</p>
                  <p>Time of Purchase {sale.timeOfPurchase}</p>
                  <p>Selected Location {sale.selectedlocation}</p>
                  <p>Product Price {sale.productPrice}</p>
                  <p>+</p>
                  <p>Shipping Fee {sale.shippingFee}</p>
                  <p>= {sale.totalPrice}</p>
                  <p>Cellphone Number {sale.cellphoneNumber}</p>
                  <p>MeetUp Place {sale.meetUpPlace}</p>
                  <p>Date Of Delivery {sale.dateOfDelivery}</p>
                  <button onClick={() => handleMoreInfoClick(sale)}>Hide Info</button>
                </div>
              )}

              {/* "More Info" button */}
              {!selectedSale && (
                <button onClick={() => handleMoreInfoClick(sale)}>More Info</button>
              )}
              <br />
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default HomeAdmin