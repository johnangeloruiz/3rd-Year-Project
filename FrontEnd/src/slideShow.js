import React, { useState, useEffect } from 'react';
import './slideShow.css';

const images = [
  {
    image: './Images/Long Churros.jpg',
  },
  {
    image: './Images/Condensed Milk Cheese Balls.jpg',
  },
  {
    image: './Images/Chocolate Chip Cookies.jpg',
  },
  {
    image: './Images/Brownie Bites.jpg',
  }
  
];
const descriptions = [
  'Long Churros',
  'Condensed Milk Cheese Balls',
  'Chocolate Chip Cookies',
  'Brownie Bites',

];

const Slideshow = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + images.length) % images.length);
  };
  useEffect(() => {
    const intervalId = setInterval(nextSlide, 3000);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="slideshow-container position-relative" >
      {images.map((image, index) => (
        <div key={index} className={`slide ${index === currentSlide ? 'active' : ''}`}>
          <div className="position-relative">
            <img src={image} alt={`Slide ${index + 1}`} className="img-fluid" />
            <div className="position-absolute top-50 start-50 translate-middle text-center">
              <h1 className="text-white display-3">AIE's treat sweet & Affordable Desserts</h1>
              <p className="text-highlight lead text-left " style={{ maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                {descriptions[index]}
              </p>
            </div>
          </div>
        </div>
      ))}
      <button className="prev" onClick={prevSlide}>&#10094;</button>
      <button className="next" onClick={nextSlide}>&#10095;</button>
    </div>
  );
};


export default Slideshow;
