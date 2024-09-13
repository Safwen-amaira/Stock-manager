import React, { Component, useState } from 'react'
import None from './None';
import axios from 'axios'

const Credits = ()=>{

  const [credits,setCredits]= useState([]);
  const fetchCredits = () =>{
     try {
      
      const response = axios.get('http://localhost:8000/')
      setCredits(response.data)
      }
     catch (Exception ) {
      console.log ("error = > " + Exception)
     }
  }

    return (
      <div>

      </div>
    )
  
}

export default Credits