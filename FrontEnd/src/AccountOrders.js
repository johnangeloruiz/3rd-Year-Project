import React, { useState, useEffect } from 'react'
import axios from 'axios';
import CancelOrder from './CancelOrder'
function AccountOrders() {
    const sections = ['Needs Approval', 'Approved', 'Cancelled', 'Completed'];
    const [activeSection, setActiveSection] = useState(null);
    const [orders, setOrders] = useState([]);

    const [orderStatus, setOrderStatus] = useState({});
    const [cancelledSales, setCancelledSales] = useState([]);
    const [completedSales, setCompletedSales] = useState([]);
    const [approvedSales, setApprovedSales] = useState([]);
    const [waitingApprovalSales, setWaitingApprovalSales] = useState([]);
    const [accountData, setAccountData] = useState(null);
    const email = window.localStorage.getItem('email')
    const [newItemsCount, setNewItemsCount] = useState({
        'Needs Approval': { count: 0, checked: false },
        'Approved': { count: 0, checked: false },
        'Cancelled': { count: 0, checked: false },
        'Completed': { count: 0, checked: false },
    });
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [selectedSaleId, setSelectedSaleId] = useState(null);
    const [isCancelOrderModalOpen, setIsCancelOrderModalOpen] = useState(false);

    const handleCancelOrderOpen = (saleId) => {
        setSelectedSaleId(saleId);
        setIsCancelOrderModalOpen(true);
    };

    const handleCancelOrderClose = () => {
        setIsCancelOrderModalOpen(false);
    };

    const handleCancelOrderConfirm = () => {
        // Handle confirmation logic (e.g., close modal)
        setIsCancelOrderModalOpen(false);
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
                response = await axios.get('http://localhost:8081/getOrdersApproved', {
                    params: { email: email },
                });
                setApprovedSales(response.data);
            } else if (activeSection === 'Cancelled') {
                response = await axios.get('http://localhost:8081/getOrdersCancelled', {
                    params: { email: email },
                });
                setCancelledSales(response.data);
            } else if (activeSection === 'Completed') {
                response = await axios.get('http://localhost:8081/getOrdersCompleted', {
                    params: { email: email },
                });
                setCompletedSales(response.data);
            }

            // Sort sales based on date in descending order
            response.data.sort((a, b) => new Date(b.dateOfPurchase) - new Date(a.dateOfPurchase));

        } catch (error) {
            console.error(`Error fetching ${activeSection} items:`, error);
        }
    };
    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    useEffect(() => {
        // Fetch account data when the component mounts
        fetchAccountData();
        // Fetch sales data when the component mounts
        fetchSalesData();
    }, []);


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



    // Function to open the CancelOrder modal
    const handleCancelOrderClick = (saleId) => {
        setIsCancelOrderModalOpen(true);
        setSelectedSaleId(saleId);
    };
    
    const handleCloseCancelOrderModal = () => {
        setIsCancelOrderModalOpen(false);
        setSelectedSaleId(null);
    };
    
    const fetchAccountData = async () => {
        try {
            const response = await fetch(`http://localhost:8081/getDataAccount?email=${email}`);
            const data = await response.json();
            setAccountData(data.account);
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    };
    useEffect(() => {
        fetchSalesData();
    }, [activeSection]);
    return (
        <div>
            <h1>Orders</h1>
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

            {/* Display sales based on the active section */}
            {activeSection === 'Needs Approval' && (
                <div>
                    <h6 className="clickable-section">Needs Approval</h6>
                    {waitingApprovalSales.map((sale) => (
                        <div key={sale.id}>
                            <p>Buyer's First Name: {sale.firstname}</p>
                            <p>Buyer's Last Name: {sale.lastname}</p>
                            <p>Product Name: {sale.productName}</p>
                            <p>Product Stock: {sale.productStock}</p>
                            <p>Product Quantity {sale.productQuantity}</p>
                            <p>Product Price: {sale.productPrice}</p>
                            <p>Shipping Fee: {sale.shippingFee}</p>
                            <p>Total Price: {sale.totalPrice}</p>
                            <p>Meet Up Place : {sale.meetUpPlace}</p>
                            <p>Time Of Purchase: {sale.timeOfPurchase}</p>
                            <p>Date Of Purchase: {sale.dateOfPurchase}</p>

                            <button onClick={() => handleCancelOrderClick(sale.id)}>Cancel Order</button>

                            <hr></hr>

                        </div>

                    ))}
                </div>

            )}
            <CancelOrder
                saleId={selectedSaleId}
                isOpen={isCancelOrderModalOpen}
                onCancel={handleCancelOrderClose}
                onConfirm={handleCancelOrderConfirm}
            />
            {activeSection === 'Approved' && (
                <div>
                    <h6 className="clickable-section">Approved</h6>
                    {/* Map over the sales that are already approved */}
                    {approvedSales.map((sale) => (
                        <div key={sale.id}>
                            <p>Product Name: {sale.productName}</p>
                            <p>Product Stock: {sale.productStock}</p>
                            <p>Product Quantity {sale.productQuantity}</p>
                            <p>Product Price: {sale.productPrice}</p>
                            <p>Shipping Fee: {sale.shippingFee}</p>
                            <p>Total Price: {sale.totalPrice}</p>
                            <p>Buyer's First Name: {sale.firstname}</p>
                            <p>Buyer's Last Name: {sale.lastname}</p>
                            <p>Meet Up Place : {sale.meetUpPlace}</p>
                            <p>Time Of Purchase: {sale.timeOfPurchase}</p>
                            <p>Date Of Purchase: {sale.dateOfPurchase}</p>
                            <hr></hr>
                        </div>
                    ))}
                </div>
            )}
            {activeSection === 'Cancelled' && (
                <div>
                    <h6 className="clickable-section">Cancelled</h6>
                    {/* Map over the sales that are already approved */}
                    {cancelledSales.map((sale) => (
                        <div key={sale.id}>
                            <p>Product Name: {sale.productName}</p>
                            <p>Product Stock: {sale.productStock}</p>
                            <p>Product Quantity {sale.productQuantity}</p>
                            <p>Product Price: {sale.productPrice}</p>
                            <p>Shipping Fee: {sale.shippingFee}</p>
                            <p>Total Price: {sale.totalPrice}</p>
                            <p>Buyer's First Name: {sale.firstname}</p>
                            <p>Buyer's Last Name: {sale.lastname}</p>
                            <p>Meet Up Place : {sale.meetUpPlace}</p>
                            <p>Time Of Purchase: {sale.timeOfPurchase}</p>
                            <p>Date Of Purchase: {sale.dateOfPurchase}</p>
                            <hr></hr>
                        </div>
                    ))}
                </div>
            )}
            {activeSection === 'Completed' && (
                <div>
                    <h6 className="clickable-section">Completed</h6>
                    {/* Map over the sales that are already approved */}
                    {completedSales.map((sale) => (
                        <div key={sale.id}>
                            <p>Product Name: {sale.productName}</p>
                            <p>Product Stock: {sale.productStock}</p>
                            <p>Product Quantity {sale.productQuantity}</p>
                            <p>Product Price: {sale.productPrice}</p>
                            <p>Shipping Fee: {sale.shippingFee}</p>
                            <p>Total Price: {sale.totalPrice}</p>
                            <p>Buyer's First Name: {sale.firstname}</p>
                            <p>Buyer's Last Name: {sale.lastname}</p>
                            <p>Meet Up Place : {sale.meetUpPlace}</p>
                            <p>Time Of Purchase: {sale.timeOfPurchase}</p>
                            <p>Date Of Purchase: {sale.dateOfPurchase}</p>
                            <hr></hr>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AccountOrders