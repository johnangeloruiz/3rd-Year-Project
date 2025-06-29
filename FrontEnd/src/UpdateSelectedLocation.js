import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // Assuming you are using Bootstrap for styling

function UpdateSelectedLocation({ show, onClose, onUpdateSelectedLocation }) {
  const [newSelectedLocation, setNewSelectedLocation] = useState('');
  const [newMeetUpPlace, setNewMeetUpPlace] = useState('');

  const handleSelectedLocationChange = async () => {
    try {
      // Ensure that newSelectedLocation has a valid value

      // Assuming you have an API endpoint for updating selected location
      const response = await fetch('http://localhost:8081/newSelectedLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: window.localStorage.getItem('email'),
          newSelectedLocation,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // If the selected location is updated successfully on the server,
        // you can trigger any additional logic if needed
        alert('Selected Location updated successfully.');
        // Call the onUpdateSelectedLocation function with the new selected location
        onUpdateSelectedLocation(newSelectedLocation);
        // Close the modal
        onClose();
      } else {
        // Handle the case where the server update was not successful
        console.error('Error updating selected location:', data.message);
        // You might want to provide user feedback about the error
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error updating selected location:', error);
      // You might want to provide user feedback about the error
    }
  };

  
  return (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Update Selected Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
          <Form.Group controlId="formNewSelectedLocation">
            <Form.Label>New Selected Location</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="Silang"
                name="selectedLocationOptions"
                value="Silang"
                onChange={(e) => setNewSelectedLocation(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Alfonso"
                name="selectedLocationOptions"
                value="Alfonso"
                onChange={(e) => setNewSelectedLocation(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Tagaytay"
                name="selectedLocationOptions"
                value="Tagaytay"
                onChange={(e) => setNewSelectedLocation(e.target.value)}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSelectedLocationChange}>
          Update Selected Location
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateSelectedLocation;
