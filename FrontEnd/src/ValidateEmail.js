import React, { useState, useEffect } from 'react'
import axios from 'axios'
function ValidateEmail() {
    const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8081/getEmailForRegister');
      setData(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  return (
    <div>ValidateEmail</div>
  )
}

export default ValidateEmail