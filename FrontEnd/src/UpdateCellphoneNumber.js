import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // Assuming you are using Bootstrap for styling

function UpdateCellphoneNumber({ show, onClose, onUpdateCellphoneNumber }) {
  const [newCellphoneNumber, setNewCellphoneNumber] = useState('');

  const handleCellphoneNumberChange = (e) => {
    // Clean the input to allow only numeric values
    const cleanedNumber = e.target.value.replace(/[^0-9]/g, '');
    setNewCellphoneNumber(cleanedNumber);
    onClose()
    window.location.reload()
  };

  const handleCellphoneNumberUpdate = async () => {
    try {
      // Perform any validation or additional logic as needed
      // Ensure that newCellphoneNumber has a valid value

      // Assuming you have an API endpoint for updating cellphone number
      const response = await fetch('http://localhost:8081/newCellphoneNumber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: window.localStorage.getItem('email'),
          newCellphoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // If the cellphone number is updated successfully on the server,
        // you can trigger any additional logic if needed
        alert('Cellphone Number updated successfully.');
        // Call the onUpdateCellphoneNumber function with the new cellphone number
        onUpdateCellphoneNumber(newCellphoneNumber);
        // Close the modal
        onClose();
      } else {
        // Handle the case where the server update was not successful
        console.error('Error updating cellphone number:', data.message);
        // You might want to provide user feedback about the error
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error updating cellphone number:', error);
      // You might want to provide user feedback about the error
    }
  };

  return (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Update Cellphone Number</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNewCellphoneNumber">
            <Form.Label>New Cellphone Number</Form.Label>
            <Form.Control
              type="tel"  // Use type="tel" for telephone numbers
              pattern="[0-9]*"  // Allow only numeric input
              placeholder="Enter new cellphone number"
              value={newCellphoneNumber}
              onChange={handleCellphoneNumberChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCellphoneNumberUpdate}>
          Update Cellphone Number
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateCellphoneNumber;
