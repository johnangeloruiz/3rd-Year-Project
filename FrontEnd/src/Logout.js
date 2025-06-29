// Logout.js
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Logout.css';

const Logout = ({ isOpen, onCancel, onConfirm }) => {

  // Handle modal closing
  const handleClose = () => {
    onCancel();
  };

  // Handle logout confirmation
  const handleConfirm = () => {
    onConfirm();
  };

  // Close the modal if the click is outside of it
  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  // Add event listeners for keyboard and outside click
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal show={isOpen} onHide={handleClose} animation={false}>
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to log out?</p>
        <button onClick={handleClose}>Cancel</button>
        <button className="confirmButton" onClick={handleConfirm}>Log Out</button>
      </Modal.Body>
    </Modal>
  );
};

export default Logout;
