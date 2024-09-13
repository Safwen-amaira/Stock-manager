import React, { Component, useState,useEffect } from 'react'
import axios from 'axios'


const Credits = ()=>{

  const [credits,setCredits]= useState([]);
  
  
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/api/credits/getall');
        console.log(response.data); // Check what data is being returned
        setCredits(response.data);

      } catch (error) {
        console.error('Failed to fetch sells:', error);
      }
    };
    fetchCredits()
  },[]);
    return (
      <div>
            <h1>Testing API </h1>
      </div>
    )
  
}

export default Credits