import React, {useEffect, useState} from 'react'
import aieslogo from './Images/AIEs Logo.jpg'
import shoppingcart from './Images/Shopping Cart.jpg'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
function InquiriesAdmin() {
    const UserLogin = window.localStorage.getItem("isLogin");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate()

    const handleLogout = (event) => {
        event.preventDefault();
        window.localStorage.removeItem("email")
        window.localStorage.removeItem("isLogin")
        navigate('/');
             
        
        
    }
    useEffect(() => {
        const fetchMessages = async () => {
          try {
            const response = await axios.get('http://localhost:8081/getContactUs');
            setMessages(response.data);
          } catch (error) {
            console.error('Error fetching messages:', error);
          }
        };
    
        fetchMessages();
      }, []);
  return (
    <div>
        <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand" to="/HomeAdmin">
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
                            <Link className='nav-link' to="/HomeAdmin">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className='nav-link' to="/ProductsAdmin">Products</Link>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/InquiriesAdmin">
                                Inquiries
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
                    
                    <li className="nav-item logout">
                        <button className="btn btn-outline-danger" onClick={handleLogout}>
                            Log Out
                        </button>
                    </li>
                    
                </div>
            </nav>
            <div className="message-container">
        <h2>Contact Us Messages</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Subject</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                <td>{message.email}</td>
                <td>{message.firstname}</td>
                <td>{message.lastname}</td>
                <td>{message.subject}</td>
                <td>{message.message}</td>
                {/* Add more details as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
    </div>
  )
}

export default InquiriesAdmin