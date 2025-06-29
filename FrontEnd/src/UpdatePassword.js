import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function UpdatePassword({ show, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const userEmail = window.localStorage.getItem('email');

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLengthValid = password.length >= 8;

    // Update the password strength state
    if (password === '') {
      setPasswordStrength(null); // No feedback if the field is empty
    } else if (hasUpperCase && hasLowerCase && hasNumber && isLengthValid) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('weak');
    }
  };

  // Function to check if passwords match
  const checkPasswordMatch = (confirmPassword) => {
    // Update the state for password match
    const isMatch = newPassword === confirmPassword;
    setPasswordMatch(isMatch);
  };

  const [passwordMatch, setPasswordMatch] = useState(null);

  const handlePasswordChange = async () => {
    // Validate that new password and confirmation match
    if (!passwordMatch) {
      alert("New password and confirmation don't match.");
      return;
    }

    // Check password strength
    const isPasswordStrong = passwordStrength === 'strong';

    if (!isPasswordStrong) {
      alert("Password must have at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/UpdatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Password updated successfully
        alert(data.message);
        onClose();
      } else {
        alert(data.error);
        console.error('Error updating password:', data.error);
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Update Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formOldPassword">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
            />
            {passwordStrength && (
              <Form.Text className={passwordStrength === 'strong' ? 'text-success' : 'text-danger'}>
                Password strength: {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                checkPasswordMatch(e.target.value);
              }}
            />
            {passwordMatch !== null && (
              <Form.Text className={passwordMatch ? 'text-success' : 'text-danger'}>
                {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handlePasswordChange}>
          Update Password
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdatePassword;
