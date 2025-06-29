import React, { useState } from 'react';
import Validation from './NumberValidation'
function SetupAccount() {
  const email = window.localStorage.getItem('email');

  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState('');
  const [errors, setErrors] = useState({ cellphone_number: '' });
  const handleRadioChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleLocationInputChange = (e) => {
    // Update the location input only if no radio button is selected
    if (!selectedLocation) {
      setLocationInput(e.target.value);
    } else {
      setLocationInput(e.target.value); // Clear the location input if a radio button is selected
    }
  };
  const handleCellphoneChange = (e) => {
    const cleanedNumber = e.target.value.replace(/[^0-9]/g, '');
    setCellphoneNumber(cleanedNumber);
  
  };
  const updateUserDetails = async () => {
    if (!selectedLocation) {
      // Show an error message, and prevent further processing
      alert('Please select a location');
      return;
    }

    // Validate if the cellphone number is set and is exactly 12 digits long
    const validationErrors = Validation({ cellphone_number: cellphoneNumber });
    setErrors(validationErrors);
    if (Object.values(validationErrors).some((error) => error !== '')) {
        alert("hasdfasdfaghasdf")
      return;
    }

    const userDetails = {
      email: email,
      location: locationInput,
      cellphoneNumber: cellphoneNumber,
      selectedLocation: selectedLocation
    };

    try {
      const response = await fetch('http://localhost:8081/updateUserDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error updating user details:', error);
      console.error('Full error object:', error);
      alert('Failed to update user details. Please try again later.');
    }
  };

  return (
    <div>
      <div>
        <input
          type='radio'
          name='location'
          value='Alfonso'
          onChange={handleRadioChange}
          required
        />
        <span>Alfonso</span>
      </div>
      <div>
        <input
          type='radio'
          name='location'
          value='Silang'
          onChange={handleRadioChange}
        />
        <span>Silang</span>
      </div>
      <div>
        <input
          type='radio'
          name='location'
          value='Tagaytay'
          onChange={handleRadioChange}
        />
        <span>Tagaytay</span>
      </div>
      <div>
        <label>
          Location:
          <input
            type='text'
            placeholder='Enter your location'
            value={locationInput}
            onChange={handleLocationInputChange}
          />
        </label>
      </div>
      <div>
        <label>
          Cellphone Number:
          <input
            type='text'
            placeholder='Enter your Cellphone Number (e.g., +639xxxxxxxxx)'
            value={cellphoneNumber}
            onChange={handleCellphoneChange}
          />
        </label>
        {errors.cellphone_number && (
          <div className='error-message'>{errors.cellphone_number}</div>
        )}
      </div>
      <button onClick={updateUserDetails}>Input Details</button>
    </div>
  );
}

export default SetupAccount;
