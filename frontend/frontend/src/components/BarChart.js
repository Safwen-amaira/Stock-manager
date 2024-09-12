import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const BarChartComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/sells/')
      .then(response => {
        const transformedData = response.data.map(item => ({
          name: new Date(item.sell_date).toLocaleString('default', { month: 'short' }), // Get month name
          sales: item.quantity_selled * item.product.price_sell, // Calculate sales amount
        }));
        setData(transformedData);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
