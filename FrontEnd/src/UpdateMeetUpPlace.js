import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UpdateMeetUpPlace({ show, onClose, onUpdateMeetUpPlace }) {
  const [newMeetUpPlace, setNewMeetUpPlace] = useState('');

  const handleMeetUpPlaceChange = async () => {
    try {
      // Perform any validation or additional logic as needed
      // Ensure that newMeetUpPlace has a valid value
  
      // Assuming you have an API endpoint for updating meet-up place
      const response = await fetch('http://localhost:8081/newMeetUpPlace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: window.localStorage.getItem('email'),
          newMeetUpPlace,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // If the meet-up place is updated successfully on the server,
        // you can trigger any additional logic if needed
        alert('Meet Up Place updated successfully.');
        // Call the onUpdateMeetUpPlace function with the new meet-up place
        onUpdateMeetUpPlace(newMeetUpPlace);
        // Close the modal
        onClose();
      } else {
        // Handle the case where the server update was not successful
        console.error('Error updating meet-up place:', data.message);
        // You might want to provide user feedback about the error
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error updating meet-up place:', error);
      // You might want to provide user feedback about the error
    }
  };
  
  return (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Update Meet-Up Place</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formNewMeetUpPlace">
            <Form.Label>New Meet-Up Place</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter new meet-up place"
              value={newMeetUpPlace}
              onChange={(e) => setNewMeetUpPlace(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleMeetUpPlaceChange}>
          Update Meet-Up Place
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateMeetUpPlace;
