import React, { useState, useEffect } from 'react';
import Validation from './RegisterValidation';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function Register({ showModal, onClose }) {
  
  window.localStorage.setItem('isCheckOut', false);
  const navigate = useNavigate();
  const passwordMessages = [
    'Password should have a capital letter.',
    'Password should have a lowercase letter.',
    'Password should have a number.',
    'Password should be greater than 8 characters.',
  ];
  const [isPasswordClicked, setIsPasswordClicked] = useState(false);

  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClose = () => {
    onClose(); 
  };
  const handleOutsideClick = (event) => {
    // Close the modal if the click is outside of it
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };
  const handlePasswordClick = () => {
    setIsPasswordClicked(true);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors((prevErrors) => {
      const newErrors = Validation(values);
      return newErrors;
    });

    if (Object.values(errors).every((error) => error === '')) {
      try {
        const response = await axios.post('http://localhost:8081/register', values)
          alert('Register Complete');
          navigate('/');
          handleClose(); // Close the modal
          window.location.reload();
         
      } catch (error) {
        alert('The Email is Already Taken.');
        navigate('/');
        handleClose(); // Close the modal
        window.location.reload();
        
      }
    }
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                    id="firstName"
                                    name="firstName"
                                    onChange={handleInput}
                                    placeholder="Enter First Name"
                                />
                                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                    id="lastName"
                                    name="lastName"
                                    onChange={handleInput}
                                    placeholder="Enter Last Name"
                                />
                                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    name="email"
                                    onChange={handleInput}
                                    placeholder="Enter Email"
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="form-group mb-3">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          id="password"
          name="password"
          onChange={handleInput}
          onClick={handlePasswordClick}
          placeholder="Enter Password"
        />
        {isPasswordClicked && (
          <div className="password-messages">
            {passwordMessages.map((message, index) => (
              <small key={index} className="text-danger">{message}</small>
            ))}
          </div>
        )}
        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
      </div>
                            <div className="form-group">
                                <button type="submit" className="">Submit</button>
                            </div>
                        </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Register;
