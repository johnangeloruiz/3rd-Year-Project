import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import aieslogo from './Images/AIEs Logo.jpg'
import shoppingcart from './Images/Shopping Cart.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from './Logout'
import { Container, Row, Col } from 'react-bootstrap';
import './Contacts.css';
import axios from 'axios';
function Contacts() {

    window.localStorage.setItem('isCheckOut', false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [cellphoneNumber, setCellphoneNumber] = useState('');
    const [subject, setSubject] = useState('About Food');
    const [message, setMessage] = useState('');
    const UserLogin = window.localStorage.getItem("isLogin");
    
    const [formError, setFormError] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        // Check if the refresh flag is present in localStorage
        const hasRefreshed = localStorage.getItem('hasRefreshed');
    
        if (hasRefreshed === 'false') {
          // Set the flag in localStorage to prevent continuous refreshes
          localStorage.setItem('hasRefreshed', true);
          // Refresh the entire browser window when the component mounts
          window.location.reload();
        }
      }, []);
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
        };
// Inside your handleSubmit function
const handleSubmit = async (event) => {
  event.preventDefault();

  // Check if any required fields are empty
  if (!firstName || !lastName || !email || !cellphoneNumber || !subject || !message) {
    setFormError('Please fill in all required fields.');
    return;
  }
  console.log('Form data:', { firstName, lastName, email, cellphoneNumber, subject, message });

  try {
    // Send the form data to the server using axios POST request
    await axios.post('http://localhost:8081/sendMessage', {
      firstName,
      lastName,
      email,
      cellphoneNumber,
      subject,
      message,
    });
    
    // Clear the form inputs after successful submission
    setFirstName('');
    setLastName('');
    setEmail('');
    setCellphoneNumber('');
    setSubject('About Food'); // Set back to default value
    setMessage('');
    setFormError('');

    alert('Thanks for contacting us. Your Message has been sent to the owner.');
    navigate('/')
    // Optionally, you can add logic to show a success message to the user
  } catch (error) {
    console.error('Error sending message:', error);
    // Optionally, you can add logic to show an error message to the user
  }
};

// In your JSX, display the error message conditionally
{formError && <p className="error-message">{formError}</p>}
  return (
    <div>
          <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/">
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
                            <Link className='nav-link' to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className='nav-link' to="/#products">Products</Link>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/About">
                                About
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/Contacts">
                                Contacts
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
                    {UserLogin ? (
                        <li className="nav-item logout">
                             <button onClick={openLogoutModal}>Log Out</button>
      
      <Logout
          isOpen={showLogoutModal}
          onCancel={closeLogoutModal}
          onConfirm={confirmLogout}
      />
                        </li>
                    ) : (
                        <li className="nav-item  logout">
                            <NavLink className="btn btn-outline-primary" to="/login">
                                Login
                            </NavLink>
                        </li>
                    )}
                </div>
            </nav>
        </div>
        <div>
        <h1>Contact Us</h1>
        {/* Form starts here */}
        <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

            <label>Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Cellphone Number</label>
            <input type="tel" value={cellphoneNumber} onChange={(e) => setCellphoneNumber(e.target.value)} required />

            <label>Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
 
            <option value="About Food">About Food</option>
            <option value="About Waiting Time">About Waiting Time</option>
            <option value="About Variations">About Variations</option>
            {/* Add more options as needed */}
          </select>

          <label>Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />

          <button type="submit">Send Message</button>
        </form>
        {/* Form ends here */}
      </div>
    </div>
  )
}

export default Contacts