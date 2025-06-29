import React, { useEffect, useState, useNavigate } from 'react'
import { Link, NavLink } from 'react-router-dom'
import aieslogo from './Images/AIEs Logo.jpg'
import shoppingcart from './Images/Shopping Cart.jpg'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col } from 'react-bootstrap'
import './About.css'
import axios from 'axios';
function About() {
    window.localStorage.setItem('HomehasRefreshed', false)
    window.localStorage.setItem('isCheckOut', false);
    const UserLogin = window.localStorage.getItem("isLogin");
    const handleLogout = (event) => {
        event.preventDefault();
        window.localStorage.removeItem("email")
        window.localStorage.removeItem("isLogin")
        window.location.reload()
    }
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
                            <button className="btn btn-outline-danger" onClick={handleLogout}>
                                Log Out
                            </button>
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
        <Container className="mt-5">
      <header className="text-center">
        <h1 className="text-primary">About Us</h1>
      </header>
      <article  className="p-4">
        <Row>
          <Col>
            <div>
              <h2 className="text-primary">Owner's Inspiration</h2>
              
            </div>
            <div>
            <p>
                I was inspired by what I saw on social media about their businesses. So, I decided
                to search on YouTube for things I could also sell online. I can bake, and I've
                learned how to do it. Then, I thought of starting a small business because I also
                wanted to earn my own money, even if it's just a small amount.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>
              <h2 className="text-primary">Company's History</h2>
            </div>
            <div>
            <p>
                My business started in April 2022. I began with things I could easily make, like
                graham balls, brazo de mercedes, brownies, and cookies. I thought of selling because
                we were only having online classes during my first year, so it was relatively easier.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
            <Col>
            <div>
                
                <p>During my first attempt at selling, to be honest, only people from my town and acquaintances ordered. The bestseller was the Brazo de Mercedes. That was what they often ordered.</p>
            </div>
            </Col>
        </Row>
        <Row>
            <Col>
            <div>
                
                <p>Then, I had to stop the business when school got busier around September 2022. We had a lot of tasks and were doing on-the-job training (OJT).</p>
            </div>
            </Col>
        </Row>
        <Row>
            <Col>
            <div>
                
                <p>I tried opening the business again and started accepting orders in September 2023. So, I stopped the business for almost a year to focus on studies. When I tried posting and accepting orders again, at first, there were only a few orders. But around the second or third week, it started to increase, not a lot, just a bit. Enough for some income. And my classmates started ordering from me every Saturday.</p>
            </div>
            </Col>
        </Row>
        <Row>
            <Col>
            <div>
                <h2 className="text-primary">Shop's Availability</h2>
                </div>
                <div>
                <p>I only collect orders from Sunday to Thursday. Then I deliver on Fridays for the Alfonso area and on Saturdays for the Silang area.</p>
            
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
            <div>
                <h2>Shop's Owner</h2>
                
            </div>
            <div>
                <p>Annie Villamor</p>
            </div>
            </Col>
        </Row>
      </article>
      <Container className="mt-5">
            <Row>
                <Col>
                <div className="contact-section">
                    <div>
                    <h2>Contact Information</h2>
                    </div>
                    <div>
                    <h5>Purok 2 Taywanak -Ilaya Alfonso, Cavite, 4123</h5>
                    <p>Address</p>
                    </div>
                    <div>
                    <h5>0905-358-2092</h5>
                    <p>Mobile Number</p>
                    </div>
                    <div>
                    <h5>
                        Tagaytay City, Philippines * Indang, Philippines * Alfonso, Philippines * Silang,
                        Philippines * Dasmariñas, Philippines
                    </h5>
                    <p>Service Area</p>
                    </div>
                    <div>
                        <h5>Annie Villamor</h5>
                        <p>Owners Name</p>
                    </div>
                </div>
                </Col>
            </Row>
            </Container>
    </Container>
    </div>
  )
}

export default About