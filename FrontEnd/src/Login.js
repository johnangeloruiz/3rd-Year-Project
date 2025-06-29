import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Validation from './LoginValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ showModal, onClose }) {
  const navigate = useNavigate();

  window.localStorage.setItem('isCheckOut', false);
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordRequirementsMet, setPasswordRequirementsMet] = useState(false);

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const validatePasswordRequirements = (password) => {
    // Add your password requirements logic here
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLengthValid = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && isLengthValid;
  };

  const handlePasswordInput = (event) => {
    const newPassword = event.target.value;
    setValues((prev) => ({ ...prev, password: newPassword }));
    setPasswordRequirementsMet(validatePasswordRequirements(newPassword));
  };

  useEffect(() => {
    // Run the axios.post request when the component mounts
    const fetchData = async () => {
      try {
        await axios.post('http://localhost:8081/turnfalse');
      } catch (error) {
        console.error('Error turning false:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    window.localStorage.setItem('email', values.email);
  
    if (errors.email === '' && errors.password === '' && passwordRequirementsMet) {
      axios.post('http://localhost:8081/login', values)
        .then((res) => {
          console.log('Login Response:', res); // Log the entire response for inspection
  
          if (res.data && res.data.status === "Success") {
            window.localStorage.setItem('isLogin', true);
            alert("Login Successful.")
            navigate('/');
            window.location.reload();
          } else if (values.email === 'admin@example.com' && values.password === 'ADMInpass123') {
            window.localStorage.setItem('isLogin', true);
            navigate('/HomeAdmin');
            window.location.reload();
          } else {
            alert("Account does not exist or password mismatch.");
            console.log(values);
          }
        })
        .catch((err) => console.log('Login Error:', err));
    }
  };
  

  const handleClose = () => {
    setValues({ email: '', password: '' });
    setErrors({});
    setPasswordRequirementsMet(false);
    onClose();
  };

  const handleOutsideClick = (event) => {
    // Close the modal if the click is outside of it
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

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
  }, [onClose]);

  return (
    <Modal show={showModal} onHide={handleClose} animation={false}>
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              onChange={handleInput}
            />
            {errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={handlePasswordInput}
            />
            {errors.password && (
              <Form.Text className="text-danger">{errors.password}</Form.Text>
            )}
            {passwordRequirementsMet && (
              <Form.Text className="text-success">
                Password meets the requirements.
              </Form.Text>
            )}
            {!passwordRequirementsMet && (
              <Form.Text className="text-danger">
                Password must have at least one uppercase letter, one lowercase letter,
                one number, and be at least 8 characters long.
              </Form.Text>
            )}
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Login;
