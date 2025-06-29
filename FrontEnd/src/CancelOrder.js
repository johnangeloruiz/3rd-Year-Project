import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function CancelOrder({ saleId, isOpen, onCancel, onConfirm }) {
  const handleClose = () => {
    onCancel();
  };

  const handleConfirm = async () => {
    try {
      // Make a POST request to cancel the order
      const response = await axios.post('http://localhost:8081/cancelOrderCustomer', {
        saleId: saleId,
      });

      if (response.status === 200) {
        // Order cancelled successfully
        console.log('Order cancelled successfully');
        onConfirm(); // You might want to close the modal or perform other actions here
        window.location.reload()
      } else {
        // Handle other status codes or error responses
        console.error('Error cancelling order:', response.data.error);
      }
    } catch (error) {
      console.error('Error cancelling order:', error.message);
    }
  };

  return (
    <Modal show={isOpen} onHide={handleClose} animation={false}>
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Cancel Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to cancel this order?</p>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="danger" className="confirmButton" onClick={handleConfirm}>
          Yes, Cancel Order
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default CancelOrder;
